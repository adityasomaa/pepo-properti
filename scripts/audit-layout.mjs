/**
 * Layout audit.
 *
 *   node scripts/audit-layout.mjs [baseUrl]
 *
 * Walks every route at 375, 768, and 1440 and reports, per breakpoint:
 *   - horizontal overflow, plus the exact elements sticking out
 *   - images that failed to load
 *   - reveal elements still hidden after settling, which would mean an
 *     IntersectionObserver is trapped inside a clipped ancestor
 *   - whether the hero is exactly one screen and whether the cookie banner is
 *     covering the search button
 *
 * Long titles are the usual cause of overflow on a property site, so the
 * listing with the longest bilingual title is always in the route list.
 *
 * Zero offenders is the pass condition.
 */

import puppeteer from "puppeteer-core";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const BASE = process.argv[2] || "http://localhost:4311";

const CHROME = [
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].find((p) => p && existsSync(p));

if (!CHROME) {
  console.error("No Chrome binary found.");
  process.exit(1);
}

const ROUTES = [
  "/id",
  "/en",
  "/id/listings",
  "/id/listings?type=villa&status=dijual",
  "/en/listings",
  "/id/build",
  "/en/build",
  // The longest title in the data set, in both languages.
  "/id/listings/villa-lima-kamar-kolam-renang-taman-uluwatu",
  "/en/listings/villa-lima-kamar-kolam-renang-taman-uluwatu",
  "/id/listings/tanah-lima-are-kuta-utara",
  "/id/submit-property",
  "/en/submit-property",
  "/id/contact",
  "/id/privacy",
  "/id/terms",
  "/id/this-route-does-not-exist",
];

const BREAKPOINTS = [
  { name: "375", width: 375, height: 760, mobile: true },
  // A short phone and two short laptops. Height matters as much as width: a
  // full-height hero with centred content pushes its own top out of view when
  // the viewport is shorter than the content, and only a short viewport shows it.
  { name: "375-short", width: 375, height: 667, mobile: true },
  { name: "768", width: 768, height: 1024, mobile: true },
  { name: "1280-short", width: 1280, height: 600, mobile: false },
  { name: "1366-short", width: 1366, height: 660, mobile: false },
  { name: "1440", width: 1440, height: 900, mobile: false },
];

const probe = () => {
  const body = document.body;
  // The content width, not window.innerWidth: under device emulation the window
  // is the content width plus the scrollbar gutter, and comparing against that
  // reports a phantom overflow on every page.
  const contentWidth = body.clientWidth;

  const scrollsHorizontally = (el) => {
    for (let node = el.parentElement; node && node !== body; node = node.parentElement) {
      const ox = getComputedStyle(node).overflowX;
      if (ox === "auto" || ox === "scroll") return true;
    }
    return false;
  };

  const offenders = [];
  body.querySelectorAll("*").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    // Fixed layers are sized to the viewport by definition and cannot widen the
    // document. Children of a deliberate horizontal scroller are supposed to sit
    // outside it: that is what makes it scroll.
    if (getComputedStyle(el).position === "fixed") return;
    if (scrollsHorizontally(el)) return;
    if (r.right > contentWidth + 1 || r.left < -1) {
      offenders.push(
        `${el.tagName.toLowerCase()}${el.id ? "#" + el.id : ""}.${String(el.className).slice(0, 60)} [${Math.round(r.left)}..${Math.round(r.right)}]`
      );
    }
  });

  // An image only counts as broken once the browser has finished with it.
  // A lazy image that has not been reached yet is not a failure.
  const broken = [...document.images]
    .filter((i) => i.complete && i.naturalWidth === 0)
    .map((i) => i.getAttribute("src"));

  // Nothing on the page may be drawn artwork. The client asked for photographs
  // only, with the mark as the single exception, so a generated placeholder
  // creeping back in should fail here rather than be noticed on the live site.
  const drawn = [...document.images]
    .map((i) => i.currentSrc || i.src)
    .filter((src) => /\.svg(\?|$)/i.test(src))
    .filter((src) => !/(wordmark|mark-light|icon)\.svg/i.test(src));

  const reveals = [...document.querySelectorAll(".reveal")];
  const hiddenReveals = reveals.filter((e) => e.dataset.visible !== "true").length;

  const hero = document.querySelector("main section");
  const heroRect = hero ? hero.getBoundingClientRect() : null;
  const header = document.querySelector("header");
  const headerH = header ? header.getBoundingClientRect().height : 0;

  // The brief asks for a hero that is one screen and holds the search. Height
  // alone was reported but never asserted, which is how a taller hero slipped
  // through. Measure where the hero's own search actually ends.
  const heroSearch = hero ? hero.querySelector("form") : null;
  const heroSearchBottom = heroSearch
    ? Math.round(
        Math.max(
          ...[...heroSearch.querySelectorAll("input, button, select")].map(
            (el) => el.getBoundingClientRect().bottom
          )
        )
      )
    : null;

  const submit = document.querySelector('form[role="search"] button[type="submit"]');
  const banner = document.querySelector('[role="region"]');
  const bannerRect = banner ? banner.getBoundingClientRect() : null;

  // No button label may wrap.
  //
  // getClientRects() counts lines only for inline elements. A button is an
  // inline-flex box, so its label span is a flex item and reports a single rect
  // however many lines it occupies. Measuring the rendered height against one
  // line-height is what actually detects it.
  const wrappedButtons = [];
  document.querySelectorAll(".btn").forEach((btn) => {
    const br = btn.getBoundingClientRect();
    if (br.width === 0 && br.height === 0) return;
    btn.querySelectorAll("span").forEach((span) => {
      const ownText = [...span.childNodes]
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent.trim())
        .join("");
      if (!ownText) return;

      const cs = getComputedStyle(span);
      const lineHeight =
        cs.lineHeight === "normal" ? parseFloat(cs.fontSize) * 1.2 : parseFloat(cs.lineHeight);
      const lines = Math.round(span.getBoundingClientRect().height / lineHeight);
      if (lines > 1) {
        wrappedButtons.push(`"${ownText.slice(0, 34)}" on ${lines} lines`);
      }
    });
  });

  // Nothing in main may start above the bottom of the sticky header while the
  // page sits at the top. If it does, the header is covering it and the reader
  // never sees it.
  const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
  const underHeader = [];
  if (window.scrollY <= 1) {
    document.querySelectorAll("main h1, main h2, main h3, main p, main img").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.height === 0) return;
      if (r.top < headerBottom - 1 && r.bottom > 0) {
        underHeader.push(`${el.tagName.toLowerCase()} "${(el.textContent || "").trim().slice(0, 28)}" top=${Math.round(r.top)} headerBottom=${Math.round(headerBottom)}`);
      }
    });
  }

  return {
    contentWidth,
    scrollWidth: body.scrollWidth,
    overflow: body.scrollWidth > contentWidth + 1,
    offenders: offenders.slice(0, 10),
    offenderCount: offenders.length,
    brokenImages: broken,
    drawnArtwork: [...new Set(drawn)].slice(0, 4),
    hiddenReveals,
    revealCount: reveals.length,
    underHeader: underHeader.slice(0, 4),
    wrappedButtons: wrappedButtons.slice(0, 5),
    heroHeight: heroRect ? Math.round(heroRect.height) : null,
    heroSearchBottom,
    headerHeight: Math.round(headerH),
    viewportHeight: document.documentElement.clientHeight,
    searchClearOfBanner:
      submit && bannerRect ? submit.getBoundingClientRect().bottom <= bannerRect.top + 1 : null,
  };
};

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

let failures = 0;
const summary = [];

{
  // Verify the detector works before trusting any pass it reports. A wide
  // element is injected on a real page; if the probe does not flag it, the
  // audit is broken and a clean run would mean nothing.
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 760, isMobile: true, hasTouch: true });
  // The same wait the route sweep uses. On "domcontentloaded" the running band
  // has its full width but not yet the rule that clips it, so the self-test was
  // measuring a page mid-load and calling the detector broken.
  await page.goto(BASE + "/id", { waitUntil: "networkidle2", timeout: 45000 });
  const before = await page.evaluate(probe);
  await page.evaluate(() => {
    const spike = document.createElement("div");
    spike.style.cssText = "width:2000px;height:8px;background:red";
    spike.id = "overflow-selftest";
    document.body.appendChild(spike);
  });
  const after = await page.evaluate(probe);
  await page.close();

  if (before.overflow || !after.overflow) {
    console.error(
      `Self-test failed: clean page overflow=${before.overflow}, spiked page overflow=${after.overflow}. The detector is not trustworthy.`
    );
    await browser.close();
    process.exit(2);
  }
  summary.push("selftest  detector flags a 2000px element and passes a clean page");
}

for (const bp of BREAKPOINTS) {
  const page = await browser.newPage();
  await page.setViewport({
    width: bp.width,
    height: bp.height,
    deviceScaleFactor: 1,
    isMobile: bp.mobile,
    hasTouch: bp.mobile,
  });

  for (const route of ROUTES) {
    const url = BASE + route;
    let result;
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
      // Let the reveal observers and the cookie banner measurement settle.
      await new Promise((r) => setTimeout(r, 2200));
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise((r) => setTimeout(r, 1400));
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise((r) => setTimeout(r, 400));
      result = await page.evaluate(probe);
    } catch (error) {
      failures++;
      summary.push(`FAIL  ${bp.name}  ${route}  ${error.message}`);
      continue;
    }

    const problems = [];
    if (result.overflow) problems.push(`overflow ${result.scrollWidth}>${result.vw}`);
    if (result.brokenImages.length) problems.push(`broken images: ${result.brokenImages.join(", ")}`);
    if (result.drawnArtwork.length) {
      problems.push(`drawn artwork instead of a photograph: ${result.drawnArtwork.join(", ")}`);
    }
    if (result.hiddenReveals) problems.push(`${result.hiddenReveals}/${result.revealCount} reveals still hidden`);
    if (result.wrappedButtons.length) {
      problems.push(`button label wraps: ${result.wrappedButtons.join(" | ")}`);
    }
    if (result.underHeader.length) {
      problems.push(`content hidden behind the sticky header: ${result.underHeader.join(" | ")}`);
    }
    if (result.heroSearchBottom !== null && result.heroSearchBottom > result.viewportHeight) {
      problems.push(
        `hero search falls below the first screen: ends at ${result.heroSearchBottom}, viewport is ${result.viewportHeight}`
      );
    }
    if (result.searchClearOfBanner === false) {
      problems.push("the cookie banner covers the hero search button");
    }

    if (problems.length) {
      failures++;
      summary.push(`FAIL  ${bp.name}  ${route}`);
      problems.forEach((p) => summary.push(`        ${p}`));
      result.offenders.forEach((o) => summary.push(`        offender: ${o}`));
    } else {
      const hero = result.heroHeight
        ? ` hero=${result.heroHeight} header=${result.headerHeight} vh=${result.viewportHeight}` +
          (result.heroSearchBottom === null ? "" : ` searchEnds=${result.heroSearchBottom}`)
        : "";
      summary.push(`pass  ${bp.name}  ${route}${hero}`);
    }
  }

  await page.close();
}

await browser.close();

console.log(summary.join("\n"));
console.log(
  failures === 0
    ? `\nNo offenders across ${BREAKPOINTS.length} breakpoints and ${ROUTES.length} routes.`
    : `\n${failures} route/breakpoint combination(s) failed.`
);
process.exit(failures === 0 ? 0 : 1);
