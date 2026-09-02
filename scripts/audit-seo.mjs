/**
 * Assets and search signals.
 *
 *   node scripts/audit-seo.mjs [baseUrl]
 *
 * While the agency's old domain was down, every signal Google held about them
 * resolved to an error. This checks that what replaces it is actually complete:
 * every asset resolves, every listing has its own title and its own preview
 * card, every page declares a canonical and both languages, the sitemap holds
 * every route, and the structured data is present and parses.
 */

import { listings } from "../content/listings.ts";
import { readFileSync } from "node:fs";
import { projects } from "../content/projects.ts";
import { locales, path, routes } from "../lib/i18n.ts";

const BASE = process.argv[2] || "http://localhost:4311";

const results = [];
let failed = 0;

function check(name, ok, detail = "") {
  if (ok) results.push(`pass  ${name}${detail ? "  " + detail : ""}`);
  else {
    failed++;
    results.push(`FAIL  ${name}${detail ? "  " + detail : ""}`);
  }
}

async function status(url) {
  try {
    const res = await fetch(url, { redirect: "follow" });
    return res.status;
  } catch (error) {
    return `error: ${error.message}`;
  }
}

async function text(url) {
  const res = await fetch(url, { redirect: "follow" });
  return { status: res.status, body: await res.text() };
}

/* --- Every asset the pages reference ------------------------------------- */
{
  const assets = new Set();
  // Ask the manifest which widths exist rather than assuming 1200 does: a
  // source narrower than that never gets one, and the audit would chase a file
  // the pipeline was right not to write.
  const manifests = new Map();
  for (const listing of listings) {
    for (const i of listing.images) {
      if (!manifests.has(i.album)) {
        manifests.set(
          i.album,
          JSON.parse(readFileSync(`public/photos/${i.album}/manifest.json`, "utf8"))
        );
      }
      const entry = manifests.get(i.album).find((p) => p.slug === i.slug);
      const widths = entry ? entry.widths : [];
      const best = widths.filter((w) => w <= 1200).pop() ?? widths[0];
      assets.add(`/photos/${i.album}/${i.slug}-${best}.jpg`);
    }
  }
  for (const project of projects) {
    assets.add(project.before);
    assets.add(project.after);
  }
  assets.add("/icon.svg");
  assets.add("/apple-icon.png");
  assets.add("/og/default.png");
  for (const listing of listings) assets.add(`/og/${listing.slug}.png`);
  for (const face of ["Regular", "Medium", "Bold"]) assets.add(`/fonts/NeueMontreal-${face}.woff2`);

  const bad = [];
  for (const asset of assets) {
    const code = await status(BASE + asset);
    if (code !== 200) bad.push(`${asset} -> ${code}`);
  }
  check(`every referenced asset resolves`, bad.length === 0, `${assets.size} assets, ${bad.length} bad ${bad.slice(0, 5).join(", ")}`);
}

/* --- Every route responds ------------------------------------------------ */
{
  const urls = [];
  for (const locale of locales) {
    for (const key of Object.keys(routes)) urls.push(path(locale, key));
    for (const listing of listings) urls.push(path(locale, "listings", listing.slug));
  }
  const bad = [];
  for (const url of urls) {
    const code = await status(BASE + url);
    if (code !== 200) bad.push(`${url} -> ${code}`);
  }
  check("every route returns 200", bad.length === 0, `${urls.length} routes, ${bad.length} bad ${bad.slice(0, 5).join(", ")}`);
}

/* --- Per listing: its own title, description, and preview card ----------- */
{
  const problems = [];
  for (const locale of locales) {
    for (const listing of listings) {
      const url = path(locale, "listings", listing.slug);
      const { body } = await text(BASE + url);

      const ogTitle = body.match(/<meta property="og:title" content="([^"]*)"/)?.[1] ?? "";
      const ogImage = body.match(/<meta property="og:image" content="([^"]*)"/)?.[1] ?? "";
      const canonical = body.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? "";
      const title = body.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";

      const expectedTitle = listing.title[locale];
      // Entity-encoded by the renderer, so compare on a distinctive fragment.
      const fragment = expectedTitle.split(" ").slice(0, 4).join(" ");

      if (!ogTitle.includes(fragment)) problems.push(`${url}: og:title is "${ogTitle}"`);
      if (!title.includes(fragment)) problems.push(`${url}: <title> is "${title}"`);
      if (!ogImage.includes(`/og/${listing.slug}.png`)) problems.push(`${url}: og:image is "${ogImage}"`);
      if (!canonical.endsWith(url)) problems.push(`${url}: canonical is "${canonical}"`);
      // React serialises the attribute as hrefLang. HTML attribute names are
      // case insensitive, so this is what a crawler reads as hreflang.
      const alternates = body.toLowerCase();
      if (!alternates.includes('hreflang="en"') || !alternates.includes('hreflang="id"') || !alternates.includes('hreflang="x-default"')) {
        problems.push(`${url}: missing hreflang`);
      }
      if (!body.includes('"@type":"RealEstateListing"')) problems.push(`${url}: no listing structured data`);
      if (!body.includes(`"identifier":"${listing.code}"`)) problems.push(`${url}: structured data missing the code`);
    }
  }
  check(
    "every listing page carries its own title, card, canonical, and schema",
    problems.length === 0,
    problems.length ? problems.slice(0, 6).join(" | ") : `${listings.length * locales.length} pages`
  );
}

/* --- Business structured data on every page ------------------------------ */
{
  const problems = [];
  for (const locale of locales) {
    for (const key of Object.keys(routes)) {
      const url = path(locale, key);
      const { body } = await text(BASE + url);
      if (!body.includes('"@type":"RealEstateAgent"')) problems.push(`${url}: no Korva Pro schema`);
      if (!body.includes('"@type":"GeneralContractor"')) problems.push(`${url}: no Korva Studio schema`);
      if (!body.includes('"openingHoursSpecification"')) problems.push(`${url}: no opening hours`);
      if (!body.includes('"streetAddress"')) problems.push(`${url}: no address`);
      const lang = body.match(/<html lang="([^"]*)"/)?.[1] ?? "";
      if (!lang.startsWith(locale)) problems.push(`${url}: html lang is "${lang}"`);
    }
  }
  check("business schema and language on every page", problems.length === 0, problems.slice(0, 5).join(" | "));
}

/* --- Structured data parses ---------------------------------------------- */
{
  const { body } = await text(`${BASE}/id/listings/${listings[0].slug}`);
  const blocks = [...body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => m[1]);
  let allParse = blocks.length > 0;
  for (const block of blocks) {
    try {
      JSON.parse(block);
    } catch {
      allParse = false;
    }
  }
  check("every JSON-LD block parses", allParse, `${blocks.length} blocks on a listing page`);
}

/* --- Sitemap and robots -------------------------------------------------- */
{
  const { status: code, body } = await text(`${BASE}/sitemap.xml`);
  const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const expected = locales.length * (Object.keys(routes).length + listings.length);

  check("sitemap responds", code === 200);
  check("sitemap lists every page in both languages", urls.length === expected, `${urls.length} of ${expected}`);

  const missing = [];
  for (const locale of locales) {
    for (const listing of listings) {
      if (!urls.some((u) => u.endsWith(path(locale, "listings", listing.slug)))) {
        missing.push(path(locale, "listings", listing.slug));
      }
    }
  }
  check("sitemap includes every listing page", missing.length === 0, missing.slice(0, 4).join(", "));
  check("sitemap declares language alternates", body.includes("xhtml:link") || body.includes("hreflang"));

  const robots = await text(`${BASE}/robots.txt`);
  check("robots responds", robots.status === 200);
  check("robots points at the sitemap", /Sitemap:\s*\S+sitemap\.xml/i.test(robots.body), robots.body.trim().split("\n").slice(-2).join(" "));
  check("robots allows crawling", /Allow:\s*\/\s*$/m.test(robots.body));
}

/* --- The site icon has no background ------------------------------------- */
{
  const { body } = await text(`${BASE}/icon.svg`);
  const hasOpaqueBackdrop = /<rect[^>]*width="32"[^>]*height="32"/.test(body) || /<svg[^>]*style="[^"]*background/.test(body);
  check("site icon is transparent, with no backing plate", !hasOpaqueBackdrop, body.trim().split("\n")[1]?.slice(0, 60));
}

console.log(results.join("\n"));
console.log(failed === 0 ? `\nAll ${results.length} checks pass.` : `\n${failed} of ${results.length} checks failed.`);
process.exit(failed === 0 ? 0 : 1);
