/**
 * Deterministic placeholder graphics for KORVA.
 *
 *   node scripts/generate-graphics.mjs
 *
 * Every tile is pure geometry: flat planes, hairlines, one circle. Nothing here
 * imitates a photograph, a building elevation, or a person. The point is a
 * calm, consistent surface that reads as "image goes here" without pretending
 * to be a property that exists.
 *
 * The output is a function of the listing code alone, so regenerating produces
 * byte-identical files, and a new listing gets a new but same-family tile.
 *
 * Each property type gets a different composition so the four categories are
 * distinguishable at a glance:
 *
 *   villa  horizon: wide stacked planes, a low sun, one water band
 *   rumah  module: a grid of squares, some solid, some outlined
 *   tanah  plot:   an outlined parcel over ruled contour hairlines
 *   ruko   stack:  full-height vertical columns cut by floor lines
 */

import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GRAPHICS = join(ROOT, "public", "graphics");
const OG = join(ROOT, "public", "og");
const FONT = join(ROOT, "..", "..", "..", "Users", "User", "Downloads", "NEUE MONTREAL", "NeueMontreal-Medium.ttf");
const FONT_FALLBACK = join(ROOT, "scripts", "NeueMontreal-Medium.ttf");

mkdirSync(GRAPHICS, { recursive: true });
mkdirSync(OG, { recursive: true });

/* -------------------------------------------------------------------------
   Deterministic randomness
   ------------------------------------------------------------------------- */

function hash(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function rng(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n) => Math.round(n * 100) / 100;

/* -------------------------------------------------------------------------
   Palette. Drawn from the site tokens so the tiles sit inside the same world.
   These values are decorative only: no text is ever placed on a tile, so they
   carry no contrast obligation of their own.
   ------------------------------------------------------------------------- */

const C = {
  deep: "#0d1f17",
  forest: "#12261d",
  moss: "#1d3a2c",
  fern: "#2e5442",
  sage: "#4d7360",
  haze: "#6e8c7a",
  mist: "#9db0a3",
  pale: "#c2cdc2",
  surface: "#e7e9e1",
  paper: "#f2f3ef",
  clay: "#9c3517",
  clayLight: "#b8562f",
};

/** Four background ramps. One is chosen per tile so the set breathes without
 *  ever leaving the family. */
const RAMPS = [
  { top: C.pale, bottom: C.fern, ink: C.forest, soft: C.haze },
  { top: C.surface, bottom: C.sage, ink: C.moss, soft: C.mist },
  { top: C.mist, bottom: C.moss, ink: C.deep, soft: C.sage },
  { top: C.paper, bottom: C.haze, ink: C.forest, soft: C.pale },
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* -------------------------------------------------------------------------
   Compositions
   ------------------------------------------------------------------------- */

/* Each type has three structural variants, picked from the seed. Without them
   a grid of villas reads as one image repeated, which is exactly what a real
   listing grid must not look like. */

function villa(rand, W, H, ramp, variant) {
  const out = [];
  const tones = [ramp.soft, C.sage, C.fern, C.moss, C.forest];

  // 0 low horizon with a sun, 1 terraced with no sun, 2 high horizon over water
  const horizon =
    variant === 1
      ? H * (0.34 + rand() * 0.1)
      : variant === 2
        ? H * (0.3 + rand() * 0.08)
        : H * (0.55 + rand() * 0.14);

  if (variant !== 1) {
    const sunR = W * (0.045 + rand() * 0.075);
    const sunX = W * (rand() < 0.5 ? 0.16 + rand() * 0.16 : 0.62 + rand() * 0.2);
    const sunY =
      variant === 2 ? horizon - sunR * (1.4 + rand() * 1.6) : horizon - sunR * (0.5 + rand() * 1.1);
    out.push(
      `<circle cx="${r2(sunX)}" cy="${r2(sunY)}" r="${r2(sunR)}" fill="${ramp.top}" opacity="${r2(0.4 + rand() * 0.25)}"/>`
    );
  }

  const hazeH = H * (0.04 + rand() * 0.09);
  out.push(
    `<rect x="0" y="${r2(horizon - hazeH)}" width="${W}" height="${r2(hazeH)}" fill="${ramp.top}" opacity="0.22"/>`
  );

  out.push(`<rect x="0" y="${r2(horizon)}" width="${W}" height="${r2(H - horizon)}" fill="${ramp.ink}"/>`);

  const bands = variant === 1 ? 5 + Math.floor(rand() * 4) : 3 + Math.floor(rand() * 3);
  let y = horizon;
  for (let i = 0; i < bands; i++) {
    const h = (H - horizon) * (variant === 1 ? 0.07 + rand() * 0.1 : 0.12 + rand() * 0.22);
    const inset = W * rand() * (variant === 1 ? 0.3 : 0.14);
    const fromLeft = rand() < 0.62;
    out.push(
      `<rect x="${r2(fromLeft ? inset : 0)}" y="${r2(y)}" width="${r2(W - inset)}" height="${r2(h)}" fill="${tones[(i + variant) % tones.length]}" opacity="${r2(0.45 + rand() * 0.42)}"/>`
    );
    y += h * (0.62 + rand() * 0.6);
  }

  // A still plane. On variant 2 it dominates the foreground.
  const waterH = (H - horizon) * (variant === 2 ? 0.3 + rand() * 0.16 : 0.08 + rand() * 0.1);
  const waterY =
    variant === 2 ? H - waterH * (1.05 + rand() * 0.25) : horizon + (H - horizon) * (0.42 + rand() * 0.24);
  const waterInset = variant === 2 ? W * 0.03 : W * (0.05 + rand() * 0.08);
  out.push(
    `<rect x="${r2(waterInset)}" y="${r2(waterY)}" width="${r2(W - waterInset * 2)}" height="${r2(waterH)}" fill="${ramp.top}" opacity="${r2(0.26 + rand() * 0.16)}"/>`
  );

  // One accent mark, seated on the ground plane.
  const accW = W * (0.005 + rand() * 0.004);
  const accH = (H - horizon) * (0.16 + rand() * 0.26);
  out.push(
    `<rect x="${r2(W * (0.08 + rand() * 0.68))}" y="${r2(horizon - accH * 0.1)}" width="${r2(accW)}" height="${r2(accH)}" fill="${C.clay}" opacity="0.9"/>`
  );

  return out.join("");
}

function rumah(rand, W, H, ramp, variant) {
  const out = [];
  const grids = [
    { cols: 4, rows: 3 },
    { cols: 3, rows: 3 },
    { cols: 5, rows: 4 },
  ];
  const { cols, rows } = grids[variant];

  const pad = W * (0.06 + rand() * 0.05);
  const gap = W * (0.018 + rand() * 0.016);
  const cw = (W - pad * 2 - gap * (cols - 1)) / cols;
  const ch = (H - pad * 2 - gap * (rows - 1)) / rows;
  const accentIndex = Math.floor(rand() * cols * rows);

  for (let rIdx = 0; rIdx < rows; rIdx++) {
    for (let cIdx = 0; cIdx < cols; cIdx++) {
      const i = rIdx * cols + cIdx;
      const x = pad + cIdx * (cw + gap);
      const y = pad + rIdx * (ch + gap);
      const roll = rand();
      if (i === accentIndex) {
        out.push(`<rect x="${r2(x)}" y="${r2(y)}" width="${r2(cw)}" height="${r2(ch)}" fill="${C.clay}" opacity="0.9"/>`);
      } else if (roll < 0.4) {
        out.push(
          `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(cw)}" height="${r2(ch)}" fill="${ramp.ink}" opacity="${r2(0.5 + rand() * 0.45)}"/>`
        );
      } else if (roll < 0.7) {
        const sw = Math.max(1.5, W * 0.0035);
        out.push(
          `<rect x="${r2(x + sw)}" y="${r2(y + sw)}" width="${r2(cw - sw * 2)}" height="${r2(ch - sw * 2)}" fill="none" stroke="${ramp.ink}" stroke-width="${r2(sw)}" opacity="0.75"/>`
        );
      } else {
        const half = rand() < 0.5;
        const vertical = rand() < 0.4;
        out.push(`<rect x="${r2(x)}" y="${r2(y)}" width="${r2(cw)}" height="${r2(ch)}" fill="${ramp.soft}" opacity="0.5"/>`);
        out.push(
          vertical
            ? `<rect x="${r2(half ? x : x + cw / 2)}" y="${r2(y)}" width="${r2(cw / 2)}" height="${r2(ch)}" fill="${ramp.ink}" opacity="0.7"/>`
            : `<rect x="${r2(x)}" y="${r2(half ? y : y + ch / 2)}" width="${r2(cw)}" height="${r2(ch / 2)}" fill="${ramp.ink}" opacity="0.7"/>`
        );
      }
    }
  }
  return out.join("");
}

function tanah(rand, W, H, ramp, variant) {
  const out = [];

  const lines = 8 + Math.floor(rand() * 8);
  const skew = (rand() - 0.5) * H * (0.1 + rand() * 0.25);
  for (let i = 0; i < lines; i++) {
    const y = (H / (lines + 1)) * (i + 1);
    out.push(
      `<line x1="0" y1="${r2(y)}" x2="${W}" y2="${r2(y + skew)}" stroke="${ramp.ink}" stroke-width="${r2(Math.max(1, W * 0.0022))}" opacity="0.42"/>`
    );
  }

  const parcels = variant === 1 ? 2 : 1;
  for (let k = 0; k < parcels; k++) {
    const m = W * (0.1 + rand() * 0.08);
    const top = parcels === 2 ? (k === 0 ? m : H * 0.54) : m;
    const bottom = parcels === 2 ? (k === 0 ? H * 0.46 : H - m) : H - m;
    const jitter = () => (rand() - 0.5) * W * 0.08;

    const pts = [
      [m + jitter(), top + jitter()],
      [W - m + jitter(), top + jitter()],
      [W - m * 1.1 + jitter(), bottom + jitter()],
      [m * 1.15 + jitter(), bottom + jitter()],
    ];
    const d = pts.map(([x, y]) => `${r2(x)},${r2(y)}`).join(" ");

    if (k === 0) {
      out.push(
        `<path d="M0,0 H${W} V${H} H0 Z M ${d.replace(/ /g, " L ").replace(/,/g, " ")} Z" fill="${C.deep}" fill-rule="evenodd" opacity="0.16"/>`
      );
    }
    out.push(`<polygon points="${d}" fill="${ramp.top}" opacity="${r2(0.22 + rand() * 0.16)}"/>`);
    out.push(
      `<polygon points="${d}" fill="none" stroke="${ramp.ink}" stroke-width="${r2(Math.max(1.5, W * 0.005))}" stroke-linejoin="round" opacity="0.9"/>`
    );

    const accCorner = Math.floor(rand() * 4);
    pts.forEach(([x, y], i) => {
      const sz = W * 0.016;
      out.push(
        `<rect x="${r2(x - sz / 2)}" y="${r2(y - sz / 2)}" width="${r2(sz)}" height="${r2(sz)}" fill="${i === accCorner && k === 0 ? C.clay : ramp.ink}"/>`
      );
    });
  }

  // Variant 2 adds an access line running in to the boundary.
  if (variant === 2) {
    const yAcc = H * (0.3 + rand() * 0.4);
    out.push(
      `<line x1="0" y1="${r2(yAcc)}" x2="${r2(W * (0.42 + rand() * 0.3))}" y2="${r2(yAcc + (rand() - 0.5) * H * 0.1)}" stroke="${C.clay}" stroke-width="${r2(Math.max(2, W * 0.006))}" opacity="0.85"/>`
    );
  }

  return out.join("");
}

function ruko(rand, W, H, ramp, variant) {
  const out = [];

  const count =
    variant === 1 ? 3 + Math.floor(rand() * 2) : variant === 2 ? 7 + Math.floor(rand() * 3) : 5 + Math.floor(rand() * 2);
  const weights = Array.from({ length: count }, () => 0.6 + rand() * 1.5);
  const accentCol = Math.floor(rand() * count);
  weights[accentCol] = variant === 1 ? 0.7 : 0.45;
  const total = weights.reduce((a, b) => a + b, 0);

  const tones = [ramp.ink, ramp.soft, C.fern, C.sage, C.moss];
  let x = 0;
  for (let i = 0; i < count; i++) {
    const w = (weights[i] / total) * W;
    const fill = i === accentCol ? C.clay : tones[(i + variant) % tones.length];
    const op = i === accentCol ? 0.9 : r2(0.42 + rand() * 0.48);
    out.push(`<rect x="${r2(x)}" y="0" width="${r2(w) + 0.6}" height="${H}" fill="${fill}" opacity="${op}"/>`);
    x += w;
  }

  const floors = variant === 2 ? 3 + Math.floor(rand() * 2) : 1 + Math.floor(rand() * 2);
  for (let i = 1; i <= floors; i++) {
    const y = (H / (floors + 1)) * i;
    out.push(
      `<rect x="0" y="${r2(y)}" width="${W}" height="${r2(Math.max(1.5, H * 0.007))}" fill="${ramp.top}" opacity="0.26"/>`
    );
    out.push(
      `<rect x="0" y="${r2(y + H * 0.007)}" width="${W}" height="${r2(Math.max(1, H * 0.004))}" fill="${C.deep}" opacity="0.22"/>`
    );
  }

  // Variant 1 sets a recessed block into the upper storeys.
  if (variant === 1) {
    const bw = W * (0.24 + rand() * 0.2);
    const bx = W * (0.12 + rand() * 0.5);
    out.push(
      `<rect x="${r2(bx)}" y="${r2(H * 0.12)}" width="${r2(bw)}" height="${r2(H * (0.2 + rand() * 0.16))}" fill="${C.deep}" opacity="0.42"/>`
    );
  }

  const groundH = H * (0.1 + rand() * 0.1);
  out.push(`<rect x="0" y="${r2(H - groundH)}" width="${W}" height="${r2(groundH)}" fill="${C.deep}" opacity="0.5"/>`);

  return out.join("");
}

const COMPOSERS = { villa, rumah, tanah, ruko };

/* -------------------------------------------------------------------------
   Tile assembly
   ------------------------------------------------------------------------- */

function tile({ seed, type, width = 1600, height = 1200 }) {
  const h = hash(seed);
  const rand = rng(h);
  const ramp = RAMPS[h % RAMPS.length];
  const variant = h % 3;
  const body = COMPOSERS[type](rand, width, height, ramp, variant);
  const gid = `g${(h % 99991).toString(36)}`;
  // A slight tilt on the ramp, so two tiles sharing a palette still differ.
  const gx = r2((h % 7) / 24);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="presentation">
<defs><linearGradient id="${gid}" x1="${gx}" y1="0" x2="${r2(1 - gx)}" y2="1">
<stop offset="0" stop-color="${ramp.top}"/><stop offset="1" stop-color="${ramp.bottom}"/>
</linearGradient></defs>
<rect width="${width}" height="${height}" fill="url(#${gid})"/>
${body}
</svg>
`;
}

/* -------------------------------------------------------------------------
   Brand marks
   ------------------------------------------------------------------------- */

/** The site icon. Transparent background, one filled path, legible at 16px. */
function mark(color = "#12261d") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
<path fill="${color}" d="M4 3h6v26H4V3Zm8 13L22.5 3H30L19.4 16 30 29h-7.5L12 16Z"/>
</svg>
`;
}

function wordmarkSvg(color = "#eff1ea") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 40" width="320" height="40">
<g transform="translate(4,4)"><path fill="${color}" d="M4 3h6v26H4V3Zm8 13L22.5 3H30L19.4 16 30 29h-7.5L12 16Z"/></g>
<text x="44" y="28" font-family="Neue Montreal" font-size="24" letter-spacing="1.4" fill="${color}">KORVA</text>
</svg>
`;
}

/* -------------------------------------------------------------------------
   Open Graph cards
   ------------------------------------------------------------------------- */

function ogSvg({ seed, type, lines }) {
  const W = 1200;
  const H = 630;
  const h = hash(seed);
  const rand = rng(h);
  const ramp = RAMPS[h % RAMPS.length];
  const body = COMPOSERS[type](rand, W, H, ramp, h % 3);
  const gid = `og${(h % 99991).toString(36)}`;
  const panelY = H - 210;

  const text = lines
    .map((l, i) => {
      const y = panelY + 74 + i * 46;
      const size = i === 0 ? 34 : 27;
      const fill = i === 0 ? "#eff1ea" : "#afbcb2";
      return `<text x="72" y="${y}" font-family="Neue Montreal" font-size="${size}" fill="${fill}">${esc(l)}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ramp.top}"/><stop offset="1" stop-color="${ramp.bottom}"/></linearGradient>
<linearGradient id="${gid}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#12261d" stop-opacity="0"/><stop offset="0.35" stop-color="#12261d" stop-opacity="0.92"/><stop offset="1" stop-color="#12261d" stop-opacity="1"/></linearGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#${gid})"/>
${body}
<rect x="0" y="${panelY - 90}" width="${W}" height="${H - panelY + 90}" fill="url(#${gid}s)"/>
<g transform="translate(72, ${panelY - 18}) scale(0.95)">
  <path fill="#eff1ea" d="M4 3h6v26H4V3Zm8 13L22.5 3H30L19.4 16 30 29h-7.5L12 16Z"/>
  <text x="44" y="26" font-family="Neue Montreal" font-size="25" fill="#eff1ea" letter-spacing="1.8">KORVA</text>
</g>
${text}
</svg>
`;
}

function fontFiles() {
  for (const p of [FONT, FONT_FALLBACK]) {
    try {
      readFileSync(p);
      return [p];
    } catch {
      /* try the next one */
    }
  }
  return [];
}

function renderPng(svg, outPath) {
  const resvg = new Resvg(svg, {
    font: { fontFiles: fontFiles(), loadSystemFonts: true, defaultFontFamily: "Neue Montreal" },
    fitTo: { mode: "original" },
  });
  writeFileSync(outPath, resvg.render().asPng());
}

/* -------------------------------------------------------------------------
   Run
   ------------------------------------------------------------------------- */

const { listings } = await import("../content/listings.ts");

const TYPE_LABEL = { villa: "Villa", rumah: "Rumah", tanah: "Tanah", ruko: "Ruko" };
const STATUS_LABEL = { dijual: "Dijual", disewa: "Disewakan" };

let tiles = 0;

// One tile per listing image slot.
for (const l of listings) {
  l.images.forEach((path, i) => {
    const file = path.replace("/graphics/", "");
    writeFileSync(join(GRAPHICS, file), tile({ seed: `${l.code}#${i}`, type: l.type }));
    tiles++;
  });
}

// Category tiles for the home page, wider crop.
for (const type of ["villa", "rumah", "tanah", "ruko"]) {
  writeFileSync(
    join(GRAPHICS, `category-${type}.svg`),
    tile({ seed: `category:${type}`, type, width: 1200, height: 900 })
  );
  tiles++;
}

// The hero plane. Wide, quiet, and deliberately the calmest tile in the set.
// Authored at the aspect the hero slot actually uses. A source in the wrong
// orientation loses its horizon to object-cover, which is the whole picture.
writeFileSync(
  join(GRAPHICS, "hero.svg"),
  tile({ seed: "korva:hero:v2", type: "villa", width: 1400, height: 1000 })
);
tiles++;

const { projects } = await import("../content/projects.ts");
const PROJECT_FAMILY = { villa: "villa", rumah: "rumah", komersial: "ruko" };

for (const project of projects) {
  writeFileSync(
    join(GRAPHICS, `project-${project.slug}-before.svg`),
    tile({ seed: `plan:${project.slug}`, type: "tanah" })
  );
  writeFileSync(
    join(GRAPHICS, `project-${project.slug}-after.svg`),
    tile({ seed: `built:${project.slug}`, type: PROJECT_FAMILY[project.type] })
  );
  tiles += 2;
}

// Brand marks.
writeFileSync(join(ROOT, "public", "icon.svg"), mark("#12261d"));
writeFileSync(join(GRAPHICS, "mark-light.svg"), mark("#eff1ea"));
writeFileSync(join(GRAPHICS, "wordmark.svg"), wordmarkSvg());

// Open Graph: one default card plus one per listing, in both languages.
renderPng(
  ogSvg({
    seed: "og:default",
    type: "villa",
    lines: [
      "Properti, arsitektur, dan konstruksi di Bali",
      "Korva Pro dan Korva Studio",
      "Jimbaran, Kuta Selatan",
    ],
  }),
  join(OG, "default.png")
);

for (const l of listings) {
  renderPng(
    ogSvg({
      seed: `og:${l.code}`,
      type: l.type,
      lines: [`${TYPE_LABEL[l.type]} ${STATUS_LABEL[l.status]}`, `${l.area}, ${l.regency}`, l.code],
    }),
    join(OG, `${l.slug}.png`)
  );
}

// Apple touch icon needs a filled background; the site icon stays transparent.
renderPng(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180"><rect width="180" height="180" rx="38" fill="#12261d"/><g transform="translate(23,26) scale(4.2)"><path fill="#eff1ea" d="M4 3h6v26H4V3Zm8 13L22.5 3H30L19.4 16 30 29h-7.5L12 16Z"/></g></svg>`,
  join(ROOT, "public", "apple-icon.png")
);

console.log(`graphics: ${tiles} svg tiles`);
console.log(`og:       ${listings.length + 1} png cards`);
console.log(`marks:    icon.svg, mark-light.svg, wordmark.svg, apple-icon.png`);
