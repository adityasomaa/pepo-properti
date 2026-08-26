/**
 * Behaviour audit.
 *
 *   node scripts/audit-behaviour.mjs [baseUrl]
 *
 * Drives the things a visitor actually does and asserts the result, rather than
 * asserting that the markup exists. Covers the hamburger, the filters, the
 * language picker and whether the choice survives a page change, the WhatsApp
 * messages, the gallery lightbox, the scroll lock, and server-side validation
 * of the submission form.
 */

import puppeteer from "puppeteer-core";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.argv[2] || "http://localhost:4311";

const CHROME = [
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
].find((p) => p && existsSync(p));

const results = [];
let failed = 0;

function check(name, condition, detail = "") {
  if (condition) {
    results.push(`pass  ${name}${detail ? "  " + detail : ""}`);
  } else {
    failed++;
    results.push(`FAIL  ${name}${detail ? "  " + detail : ""}`);
  }
}

const settle = (ms) => new Promise((r) => setTimeout(r, ms));

async function launchChrome(attempts = 4) {
  let last;
  for (let i = 1; i <= attempts; i += 1) {
    try {
      return await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--hide-scrollbars"],
  // A unique profile per run. Puppeteer's shared default profile stays locked
  // by any Chrome that crashed or was orphaned, which made the next audit die
  // on launch rather than report anything.
  userDataDir: mkdtempSync(join(tmpdir(), "korva-audit-")),
});
    } catch (error) {
      last = error;
      console.error(`Chrome launch attempt ${i} of ${attempts} failed: ${error.message}`);
      await new Promise((r) => setTimeout(r, 1500 * i));
    }
  }
  throw last;
}

const browser = await launchChrome();

async function freshPage(width = 1440, height = 900) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width, height, isMobile: width < 768, hasTouch: width < 768 });
  return { page, context };
}

/* --- 1. Mobile menu ------------------------------------------------------ */
{
  const { page, context } = await freshPage(375, 760);
  await page.goto(`${BASE}/id`, { waitUntil: "networkidle2" });
  await settle(2000);

  await page.click('button[aria-controls="mobile-menu"]');
  await settle(500);

  const open = await page.evaluate(() => {
    const dialog = document.getElementById("mobile-menu");
    return {
      present: !!dialog,
      modal: dialog?.getAttribute("aria-modal") === "true",
      locked: document.documentElement.classList.contains("scroll-locked"),
      bodyFixed: getComputedStyle(document.body).position === "fixed",
      links: dialog ? dialog.querySelectorAll("nav a").length : 0,
      cookieBannerVisible: !!document.querySelector('[role="region"]'),
    };
  });
  check("mobile menu opens", open.present && open.modal);
  check("mobile menu locks page scroll", open.locked && open.bodyFixed);
  check("mobile menu lists every page", open.links === 6, `${open.links} links`);
  check("cookie banner steps aside for the menu", open.cookieBannerVisible === false);

  await page.keyboard.press("Escape");
  await settle(500);
  const closed = await page.evaluate(() => ({
    gone: !document.getElementById("mobile-menu"),
    unlocked: !document.documentElement.classList.contains("scroll-locked"),
    bodyReset: getComputedStyle(document.body).position !== "fixed",
    focusOnTrigger: document.activeElement?.getAttribute("aria-controls") === "mobile-menu",
  }));
  check("Escape closes the mobile menu", closed.gone);
  check("scroll lock is released on close", closed.unlocked && closed.bodyReset);
  check("focus returns to the menu trigger", closed.focusOnTrigger);

  await context.close();
}

/* --- 2. Listing search and filters --------------------------------------- */
{
  const { page, context } = await freshPage(1440, 900);
  await page.goto(`${BASE}/id/listings`, { waitUntil: "networkidle2" });
  await settle(2000);

  const countCards = () => page.evaluate(() => document.querySelectorAll("main ul li article").length);

  const all = await countCards();
  check("listing page renders every property", all === 16, `${all} cards`);

  // Keyword
  await page.type("aside input[type=search]", "ubud");
  await settle(900);
  const ubud = await page.evaluate(() =>
    [...document.querySelectorAll("main ul li article")].map((a) => a.textContent)
  );
  check(
    "keyword search narrows to matching areas",
    ubud.length === 2 && ubud.every((t) => t.includes("Ubud")),
    `${ubud.length} results`
  );

  // Reset, then filter by type through the custom listbox using the keyboard only.
  await page.click("aside button[data-variant=secondary]");
  await settle(700);
  const afterReset = await countCards();
  check("reset restores the full list", afterReset === 16, `${afterReset} cards`);

  const typeTrigger = await page.$$('aside button[aria-haspopup="listbox"]');
  await typeTrigger[0].focus();
  await page.keyboard.press("Enter");
  await settle(400);
  const listboxOpen = await page.evaluate(() => {
    const list = document.querySelector('[role="listbox"]');
    return {
      open: !!list,
      focused: document.activeElement === list,
      activeDescendant: list?.getAttribute("aria-activedescendant") ?? null,
      options: list ? list.querySelectorAll('[role="option"]').length : 0,
      locked: document.documentElement.classList.contains("scroll-locked"),
    };
  });
  check("listbox opens on Enter and takes focus", listboxOpen.open && listboxOpen.focused);
  check("listbox tracks the active option", !!listboxOpen.activeDescendant);
  check("listbox offers every type plus the any option", listboxOpen.options === 5, `${listboxOpen.options}`);
  check("listbox locks page scroll while open", listboxOpen.locked);

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await settle(900);
  const villaOnly = await page.evaluate(() => ({
    cards: document.querySelectorAll("main ul li article").length,
    allVilla: [...document.querySelectorAll("main ul li article")].every((a) => a.textContent.includes("Villa")),
    url: location.search,
    focusBack: document.activeElement?.getAttribute("aria-haspopup") === "listbox",
    unlocked: !document.documentElement.classList.contains("scroll-locked"),
  }));
  check("arrow plus Enter selects a type", villaOnly.cards === 8 && villaOnly.allVilla, `${villaOnly.cards} villas`);
  check("filter is written to the URL", villaOnly.url.includes("type=villa"), villaOnly.url);
  check("focus returns to the listbox trigger", villaOnly.focusBack);
  check("scroll unlocks when the listbox closes", villaOnly.unlocked);

  // Type-ahead
  await typeTrigger[0].focus();
  await page.keyboard.press("Enter");
  await settle(300);
  await page.keyboard.press("t");
  await settle(300);
  const typeahead = await page.evaluate(() => {
    const list = document.querySelector('[role="listbox"]');
    const id = list?.getAttribute("aria-activedescendant");
    return id ? document.getElementById(id)?.textContent?.trim() : null;
  });
  check("type-ahead jumps to a matching option", /tanah/i.test(typeahead || ""), String(typeahead));
  await page.keyboard.press("Escape");
  await settle(300);

  // Price range formatting, and that the raw number reaches the filter.
  const priceInputs = await page.$$("aside input[inputmode=numeric]");
  await priceInputs[0].click();
  await page.keyboard.type("5000000000");
  await settle(900);
  const priced = await page.evaluate(() => ({
    display: document.querySelectorAll("aside input[inputmode=numeric]")[0].value,
    cards: document.querySelectorAll("main ul li article").length,
    url: location.search,
  }));
  check("price input groups thousands as you type", priced.display === "5.000.000.000", priced.display);
  check("price filter uses the raw number", priced.url.includes("min=5000000000"), priced.url);
  check(
    "price filter narrows the result set",
    priced.cards === 3,
    `${priced.cards} villas at or above 5,000,000,000`
  );

  // Empty state
  await priceInputs[0].click({ clickCount: 3 });
  await page.keyboard.type("99000000000");
  await settle(900);
  const empty = await page.evaluate(() => ({
    cards: document.querySelectorAll("main ul li article").length,
    hasEmptyState: document.body.textContent.includes("Tidak ada properti yang cocok"),
  }));
  check("no matches shows the empty state", empty.cards === 0 && empty.hasEmptyState);

  await context.close();
}

/* --- 3. Language switch, and whether the choice is remembered ------------- */
{
  const { page, context } = await freshPage(1440, 900);
  await page.goto(`${BASE}/id/listings/villa-empat-kamar-ubud`, { waitUntil: "networkidle2" });
  await settle(2000);

  // Accept cookies so the choice is allowed to persist beyond the tab.
  const acceptButton = await page.$('[role="region"] button[data-variant="primary"]');
  if (acceptButton) await acceptButton.click();
  await settle(400);

  const langTrigger = await page.$('header button[aria-haspopup="listbox"]');
  await langTrigger.click();
  await settle(400);
  await page.evaluate(() => {
    const options = [...document.querySelectorAll('[role="option"]')];
    options.find((o) => /English/i.test(o.textContent)).click();
  });
  await settle(2600);

  const switched = await page.evaluate(() => ({
    url: location.pathname,
    lang: document.documentElement.lang,
    heading: document.querySelector("h1")?.textContent?.trim(),
    nav: [...document.querySelectorAll("header nav a")].map((a) => a.textContent.trim()),
  }));
  check("language switch keeps the same property", switched.url === "/en/listings/villa-empat-kamar-ubud", switched.url);
  check("document language follows the choice", switched.lang === "en", switched.lang);
  check("content is translated", /Four-Bedroom Villa/i.test(switched.heading || ""), switched.heading);
  check("navigation is translated", switched.nav.includes("Properties"), switched.nav.join(", "));

  // Move to another page: the choice has to survive.
  await page.evaluate(() => {
    document.querySelector('header nav a[href="/en/listings"]').click();
  });
  await settle(2800);
  const kept = await page.evaluate(() => ({ path: location.pathname, lang: document.documentElement.lang }));
  check("language survives a page change", kept.path.startsWith("/en") && kept.lang === "en", kept.path);

  const cookie = await page.evaluate(() => document.cookie);
  check("accepted consent stores the language", /korva_lang=en/.test(cookie), cookie);

  // A fresh visit to the root should now land in English.
  await page.goto(`${BASE}/`, { waitUntil: "networkidle2" });
  await settle(1200);
  const rooted = await page.evaluate(() => location.pathname);
  check("root redirects to the remembered language", rooted.startsWith("/en"), rooted);

  await context.close();
}

/* --- 4. WhatsApp messages ------------------------------------------------ */
{
  const { page, context } = await freshPage(1440, 900);
  const slug = "villa-lima-kamar-kolam-renang-taman-uluwatu";
  await page.goto(`${BASE}/id/listings/${slug}`, { waitUntil: "networkidle2" });
  await settle(2200);

  const links = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="https://wa.me/"]')].map((a) => ({
      label: a.textContent.trim(),
      message: decodeURIComponent(new URL(a.href).searchParams.get("text") || ""),
      number: new URL(a.href).pathname.slice(1),
    }))
  );

  check("every page offers a WhatsApp route", links.length >= 2, `${links.length} links`);
  // Two divisions, two numbers. Every link must reach one of them, and the
  // listing enquiry specifically must reach Korva Pro.
  const NUMBERS = ["6281236447099", "62881037652019"];
  check("all links reach one of the two divisions", links.every((l) => NUMBERS.includes(l.number)),
    [...new Set(links.map((l) => l.number))].join(", "));

  const listingLink = links.find((l) => l.message.includes("KP-V-006"));
  check("the listing button carries the listing code", !!listingLink);
  check(
    "the listing button carries the full title",
    !!listingLink && listingLink.message.includes("Villa Lima Kamar Tidur dengan Kolam Renang Pribadi"),
    listingLink ? listingLink.message.split("\n")[3] : ""
  );
  check(
    "every message carries the page URL",
    links.every((l) => l.message.includes(`/id/listings/${slug}`)),
    links[0]?.message.split("\n").find((x) => x.startsWith("Halaman")) || ""
  );
  check(
    "each message names the button it came from",
    new Set(links.map((l) => l.message.split("\n").pop())).size === links.length,
    links.map((l) => l.message.split("\n").pop()).join(" | ")
  );

  // Filters applied on the listing page must reach the message too.
  await page.goto(`${BASE}/id/listings?type=tanah`, { waitUntil: "networkidle2" });
  await settle(2200);
  const filtered = await page.evaluate(() => {
    const a = document.querySelector('a[href^="https://wa.me/"]');
    a.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
    return decodeURIComponent(new URL(a.href).searchParams.get("text"));
  });
  check("the message reflects the filtered URL", filtered.includes("type=tanah"), filtered.split("\n").find((x) => x.startsWith("Halaman")));

  await context.close();
}

/* --- 4b. The floating button waits for the hero to pass ------------------- */
{
  const { page, context } = await freshPage(375, 760);
  await page.goto(`${BASE}/id`, { waitUntil: "networkidle2" });
  await settle(2500);

  const atTop = await page.evaluate(
    () => !!document.querySelector('[class*="fixed right-4"] button[aria-expanded]')
  );
  check("floating button stays out of the hero", atTop === false);

  await page.evaluate(() => window.scrollTo(0, 1200));
  await settle(1200);
  const afterScroll = await page.evaluate(
    () => !!document.querySelector('[class*="fixed right-4"] button[aria-expanded]')
  );
  check("floating button appears once past the hero", afterScroll === true);

  if (afterScroll) {
    await page.evaluate(() =>
      document.querySelector('[class*="fixed right-4"] button[aria-expanded]').click()
    );
    await settle(500);
    const chooser = await page.evaluate(() => {
      const links = [...document.querySelectorAll('[role="group"] a[href^="https://wa.me/"]')];
      return links.map((a) => new URL(a.href).pathname.slice(1));
    });
    check(
      "the floating chooser offers both divisions",
      chooser.length === 2 && new Set(chooser).size === 2,
      chooser.join(", ")
    );
  }

  await context.close();
}

/* --- 5. Gallery lightbox ------------------------------------------------- */
{
  const { page, context } = await freshPage(1440, 900);
  await page.goto(`${BASE}/id/listings/villa-tiga-kamar-kolam-renang-canggu`, { waitUntil: "networkidle2" });
  await settle(2200);

  await page.click("main button.group");
  await settle(600);
  const opened = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
    return {
      open: !!dialog,
      locked: document.documentElement.classList.contains("scroll-locked"),
      counter: dialog?.querySelector("p")?.textContent?.trim(),
    };
  });
  check("lightbox opens", opened.open);
  check("lightbox locks page scroll", opened.locked);
  check("lightbox shows a position counter", /1 dari 4/.test(opened.counter || ""), opened.counter);

  await page.keyboard.press("ArrowRight");
  await settle(400);
  const advanced = await page.evaluate(
    () => document.querySelector('[role="dialog"] p')?.textContent?.trim()
  );
  check("arrow key moves through the gallery", /2 dari 4/.test(advanced || ""), advanced);

  await page.keyboard.press("Escape");
  await settle(500);
  const closedBox = await page.evaluate(() => ({
    gone: !document.querySelector('[role="dialog"][aria-modal="true"]'),
    unlocked: !document.documentElement.classList.contains("scroll-locked"),
  }));
  check("Escape closes the lightbox", closedBox.gone);
  check("lightbox releases the scroll lock", closedBox.unlocked);

  await context.close();
}

/* --- 6. Server-side validation ------------------------------------------- */
{
  const { page, context } = await freshPage(1440, 900);
  await page.goto(`${BASE}/id/submit-property`, { waitUntil: "networkidle2" });
  await settle(2200);

  // Submitting nothing has to come back from the server with field errors.
  await page.evaluate(() => document.querySelector('form button[type="submit"]').click());
  await settle(2500);
  const errors = await page.evaluate(() => ({
    alert: !!document.querySelector('[role="alert"]'),
    messages: [...document.querySelectorAll(".field-error")].map((e) => e.textContent.trim()),
  }));
  check("empty submission is rejected", errors.alert);
  check("every required field reports back", errors.messages.length >= 5, `${errors.messages.length} field errors`);

  // The honeypot must be invisible but present, and must not widen the page.
  const honeypot = await page.evaluate(() => {
    const el = document.querySelector(".honeypot");
    const cs = el ? getComputedStyle(el) : null;
    return el
      ? { present: true, clip: cs.clipPath, width: el.getBoundingClientRect().width, left: el.getBoundingClientRect().left }
      : { present: false };
  });
  check("honeypot is hidden with clip, not an off-canvas offset", honeypot.present && honeypot.clip.includes("inset") && honeypot.left >= 0);

  // A valid submission returns a ready-to-send WhatsApp link built server side.
  await page.type("input[name=name]", "Wayan Sukerta");
  await page.type("input[name=phone]", "0812 3456 7890");
  await page.type("input[name=location]", "Kuta Utara");
  const selects = await page.$$('form button[aria-haspopup="listbox"]');
  await selects[0].click();
  await settle(300);
  await page.evaluate(() => document.querySelectorAll('[role="option"]')[0].click());
  await settle(300);
  await selects[1].click();
  await settle(300);
  await page.evaluate(() => document.querySelectorAll('[role="option"]')[0].click());
  await settle(300);
  await page.evaluate(() => document.querySelector('form button[type="submit"]').click());
  await settle(3000);

  const ok = await page.evaluate(() => {
    // Scope to the success panel. The first wa.me link in the document is the
    // header button, which would make this assertion pass for the wrong reason.
    const panel = [...document.querySelectorAll("main div")].find((d) =>
      d.textContent.includes("Ringkasan siap dikirim")
    );
    const link = panel?.querySelector('a[href^="https://wa.me/"]');
    return {
      success: document.body.textContent.includes("Ringkasan siap dikirim"),
      message: link ? decodeURIComponent(new URL(link.href).searchParams.get("text") || "") : "",
    };
  });
  check("a valid submission is accepted", ok.success);
  check("the submission message carries the typed values", ok.message.includes("Wayan Sukerta") && ok.message.includes("Kuta Utara"));

  await context.close();
}

/* --- 7. Cookie consent actually changes something ------------------------ */
{
  const { page, context } = await freshPage(1440, 900);
  await page.goto(`${BASE}/id`, { waitUntil: "networkidle2" });
  await settle(2000);

  const declineButton = await page.$('[role="region"] button[data-variant="secondary"]');
  await declineButton.click();
  await settle(600);

  const declined = await page.evaluate(() => {
    document.cookie = "korva_lang=en; Path=/";
    return { cookie: document.cookie, bannerGone: !document.querySelector('[role="region"]') };
  });
  check("declining dismisses the banner", declined.bannerGone);
  check("declining is recorded", /korva_consent=denied/.test(declined.cookie));

  await context.close();
}

await browser.close();

console.log(results.join("\n"));
console.log(failed === 0 ? `\nAll ${results.length} behaviour checks pass.` : `\n${failed} of ${results.length} checks failed.`);
process.exit(failed === 0 ? 0 : 1);
