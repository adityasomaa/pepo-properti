/**
 * Turns photographs into something a phone can afford to download.
 *
 *   node scripts/optimize-photos.mjs <sourceDir> <slug> [--limit N]
 *
 * The Vercel image optimizer is off on this account — its quota is exhausted,
 * and with it enabled every image 402s and production renders blank. So nothing
 * resizes images at request time. Whatever is committed is what a visitor
 * downloads, byte for byte. The photographs from the client are 10–16 MB each;
 * served raw, one of them costs a phone more than the entire site.
 *
 * This does the optimizer's job ahead of time: each source photo becomes a set
 * of widths in AVIF, WebP, and JPEG, so the browser picks the smallest format
 * it understands at the size it actually needs.
 *
 * Output lands in public/photos/<slug>/ and a manifest is written next to it so
 * the site knows each photo's dimensions without reading the files.
 */

import sharp from "sharp";
import { readdir, mkdir, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, basename } from "node:path";

const [, , SOURCE, SLUG, ...rest] = process.argv;

if (!SOURCE || !SLUG) {
  console.error("usage: node scripts/optimize-photos.mjs <sourceDir> <slug> [--limit N]");
  process.exit(1);
}

const limitFlag = rest.indexOf("--limit");
const LIMIT = limitFlag === -1 ? Infinity : Number(rest[limitFlag + 1]);

// The widths a layout actually asks for: a phone at 2x, a tablet, a laptop,
// and a desktop hero. Anything wider than the source is skipped rather than
// upscaled, which would add bytes and no detail.
const WIDTHS = [480, 768, 1200, 1800, 2400];

// AVIF first because it is much smaller, WebP for anything that cannot read it,
// JPEG last as the floor that every browser handles.
const FORMATS = [
  { ext: "avif", encode: (p) => p.avif({ quality: 58, effort: 5 }) },
  { ext: "webp", encode: (p) => p.webp({ quality: 74 }) },
  { ext: "jpg", encode: (p) => p.jpeg({ quality: 78, mozjpeg: true, progressive: true }) },
];

const OUT = join("public", "photos", SLUG);

const slugify = (name) =>
  basename(name, extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

if (!existsSync(SOURCE)) {
  console.error(`Source not found: ${SOURCE}`);
  process.exit(1);
}

await mkdir(OUT, { recursive: true });

const files = (await readdir(SOURCE))
  .filter((f) => /\.(jpe?g|png|tiff?|webp)$/i.test(f))
  .sort()
  .slice(0, LIMIT);

if (!files.length) {
  console.error(`No images in ${SOURCE}`);
  process.exit(1);
}

console.log(`${files.length} photo(s) -> ${OUT}`);

const manifest = [];
let sourceBytes = 0;
let outputBytes = 0;

for (const [i, file] of files.entries()) {
  const src = join(SOURCE, file);
  const slug = slugify(file);
  sourceBytes += (await stat(src)).size;

  const image = sharp(src, { failOn: "none" }).rotate(); // honour EXIF orientation
  const meta = await image.metadata();
  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (!widths.length) widths.push(meta.width);

  const sizes = [];
  for (const w of widths) {
    for (const fmt of FORMATS) {
      const name = `${slug}-${w}.${fmt.ext}`;
      const buf = await fmt
        .encode(sharp(src, { failOn: "none" }).rotate().resize({ width: w, withoutEnlargement: true }))
        .toBuffer();
      await writeFile(join(OUT, name), buf);
      outputBytes += buf.length;
      sizes.push({ w, ext: fmt.ext, bytes: buf.length });
    }
  }

  // A tiny blurred placeholder, inlined as a data URI so the layout has
  // something to show while the real photo arrives. 20px wide keeps it under
  // roughly a kilobyte.
  const blur = await sharp(src, { failOn: "none" })
    .rotate()
    .resize({ width: 20 })
    .webp({ quality: 40 })
    .toBuffer();

  const widest = Math.max(...widths);
  manifest.push({
    slug,
    source: file,
    width: widest,
    height: Math.round((meta.height / meta.width) * widest),
    widths,
    blur: `data:image/webp;base64,${blur.toString("base64")}`,
  });

  const jpgFull = sizes.filter((s) => s.ext === "jpg").pop();
  console.log(
    `  ${String(i + 1).padStart(3)}. ${slug}  ${meta.width}x${meta.height}  ` +
      `-> ${widths.length} widths, largest jpg ${Math.round(jpgFull.bytes / 1024)} KB`
  );
}

await writeFile(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

const mb = (b) => (b / 1048576).toFixed(1);
console.log(
  `\nSource ${mb(sourceBytes)} MB -> ${mb(outputBytes)} MB across every size and format.`
);
console.log(
  `A phone loads one 480px AVIF, not the original: ` +
    `${Math.round(
      manifest.length
        ? (await stat(join(OUT, `${manifest[0].slug}-480.avif`))).size / 1024
        : 0
    )} KB for the first photo.`
);
console.log(`Manifest: ${join(OUT, "manifest.json")}`);
