/**
 * Deterministic placeholder graphics for Pepo Properti.
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

function villa(rand, W, H, ramp) {
  const out = [];
  const horizon = H * (0.58 + rand() * 0.07);

  // Sun. Small, placed on a third, and always partly taken by the horizon.
  const sunR = W * (0.055 + rand() * 0.035);
  const sunX = W * (rand() < 0.5 ? 0.22 + rand() * 0.08 : 0.68 + rand() * 0.1);
  const sunY = horizon - sunR * (0.7 + rand() * 0.9);
  out.push(`<circle cx="${r2(sunX)}" cy="${r2(sunY)}" r="${r2(sunR)}" fill="${ramp.top}" opacity="0.5"/>`);

  // Atmospheric band gathering just above the horizon.
  const hazeH = H * (0.06 + rand() * 0.05);
  out.push(
    `<rect x="0" y="${r2(horizon - hazeH)}" width="${W}" height="${r2(hazeH)}" fill="${ramp.top}" opacity="0.22"/>`
  );

  // Ground plane.
  out.push(`<rect x="0" y="${r2(horizon)}" width="${W}" height="${r2(H - horizon)}" fill="${ramp.ink}"/>`);

  // Stacked planes below the horizon, each a little darker than the last.
  const bands = 3 + Math.floor(rand() * 2);
  let y = horizon;
  const tones = [ramp.soft, C.sage, C.fern, C.moss, C.forest];
  for (let i = 0; i < bands; i++) {
    const h = (H - horizon) * (0.16 + rand() * 0.2);
    const inset = W * rand() * 0.12;
    out.push(
      `<rect x="${r2(inset)}" y="${r2(y)}" width="${r2(W - inset)}" height="${r2(h)}" fill="${tones[(i + 1) % tones.length]}" opacity="${r2(0.5 + rand() * 0.35)}"/>`
    );
    y += h * (0.7 + rand() * 0.5);
  }

  // One still water band, the flattest element in the frame.
  const waterY = horizon + (H - horizon) * (0.44 + rand() * 0.2);
  const waterH = (H - horizon) * (0.1 + rand() * 0.08);
  out.push(
    `<rect x="${r2(W * 0.06)}" y="${r2(waterY)}" width="${r2(W * 0.88)}" height="${r2(waterH)}" fill="${ramp.top}" opacity="0.32"/>`
  );

  // A single accent mark, seated on the ground plane rather than floating in
  // the sky, where it read as a stray artefact.
  const accW = W * (0.006 + rand() * 0.003);
  const accH = (H - horizon) * (0.3 + rand() * 0.22);
  out.push(
    `<rect x="${r2(W * (0.1 + rand() * 0.62))}" y="${r2(horizon - accH * 0.12)}" width="${r2(accW)}" height="${r2(accH)}" fill="${C.clay}" opacity="0.9"/>`
  );

  return out.join("");
}

function rumah(rand, W, H, ramp) {
  const out = [];
  const cols = 4;
  const rows = 3;
  const pad = W * 0.09;
  const gap = W * 0.028;
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
      } else if (roll < 0.42) {
        out.push(`<rect x="${r2(x)}" y="${r2(y)}" width="${r2(cw)}" height="${r2(ch)}" fill="${ramp.ink}" opacity="${r2(0.55 + rand() * 0.4)}"/>`);
      } else if (roll < 0.72) {
        out.push(
          `<rect x="${r2(x + 3)}" y="${r2(y + 3)}" width="${r2(cw - 6)}" height="${r2(ch - 6)}" fill="none" stroke="${ramp.ink}" stroke-width="${r2(W * 0.0035)}" opacity="0.75"/>`
        );
      } else {
        // Half module: the block is split, one half solid.
        const half = rand() < 0.5;
        out.push(`<rect x="${r2(x)}" y="${r2(y)}" width="${r2(cw)}" height="${r2(ch)}" fill="${ramp.soft}" opacity="0.5"/>`);
        out.push(
          `<rect x="${r2(x)}" y="${r2(half ? y : y + ch / 2)}" width="${r2(cw)}" height="${r2(ch / 2)}" fill="${ramp.ink}" opacity="0.7"/>`
        );
      }
    }
  }
  return out.join("");
}

function tanah(rand, W, H, ramp) {
  const out = [];

  // Ruled contour hairlines running the full width at a shallow angle.
  const lines = 9 + Math.floor(rand() * 5);
  const skew = (rand() - 0.5) * H * 0.16;
  for (let i = 0; i < lines; i++) {
    const y = (H / (lines + 1)) * (i + 1);
    out.push(
      `<line x1="0" y1="${r2(y)}" x2="${W}" y2="${r2(y + skew)}" stroke="${ramp.ink}" stroke-width="${r2(W * 0.0022)}" opacity="0.42"/>`
    );
  }

  // The parcel: an irregular quadrilateral, outlined, barely filled.
  const m = W * 0.14;
  const jitter = () => (rand() - 0.5) * W * 0.09;
  const pts = [
    [m + jitter(), m + jitter()],
    [W - m + jitter(), m * 1.2 + jitter()],
    [W - m * 1.1 + jitter(), H - m + jitter()],
    [m * 1.2 + jitter(), H - m * 0.9 + jitter()],
  ];
  const d = pts.map(([x, y]) => `${r2(x)},${r2(y)}`).join(" ");
  // Darken everything outside the parcel so the plot reads as the subject.
  out.push(
    `<path d="M0,0 H${W} V${H} H0 Z M ${d.replace(/ /g, " L ").replace(/,/g, " ")} Z" fill="${C.deep}" fill-rule="evenodd" opacity="0.16"/>`
  );
  out.push(`<polygon points="${d}" fill="${ramp.top}" opacity="0.3"/>`);
  out.push(
    `<polygon points="${d}" fill="none" stroke="${ramp.ink}" stroke-width="${r2(W * 0.005)}" stroke-linejoin="round" opacity="0.9"/>`
  );

  // Corner markers on two vertices, plus one accent marker.
  const accCorner = Math.floor(rand() * 4);
  pts.forEach(([x, y], i) => {
    const s = W * 0.018;
    const fill = i === accCorner ? C.clay : ramp.ink;
    out.push(`<rect x="${r2(x - s / 2)}" y="${r2(y - s / 2)}" width="${r2(s)}" height="${r2(s)}" fill="${fill}"/>`);
  });

  return out.join("");
}

function ruko(rand, W, H, ramp) {
  const out = [];

  // Full-height columns of unequal width.
  const count = 5 + Math.floor(rand() * 3);
  const weights = Array.from({ length: count }, () => 0.6 + rand() * 1.4);
  const accentCol = Math.floor(rand() * count);
  weights[accentCol] = 0.45;
  const total = weights.reduce((a, b) => a + b, 0);
  let x = 0;
  const tones = [ramp.ink, ramp.soft, C.fern, C.sage, C.moss];
  for (let i = 0; i < count; i++) {
    const w = (weights[i] / total) * W;
    const fill = i === accentCol ? C.clay : tones[i % tones.length];
    const op = i === accentCol ? 0.9 : r2(0.45 + rand() * 0.45);
    out.push(`<rect x="${r2(x)}" y="0" width="${r2(w) + 0.5}" height="${H}" fill="${fill}" opacity="${op}"/>`);
    x += w;
  }

  // Floor lines cutting straight across the stack.
  const floors = 2 + Math.floor(rand() * 2);
  for (let i = 1; i <= floors; i++) {
    const y = (H / (floors + 1)) * i;
    out.push(`<rect x="0" y="${r2(y)}" width="${W}" height="${r2(H * 0.008)}" fill="${ramp.top}" opacity="0.26"/>`);
    out.push(`<rect x="0" y="${r2(y + H * 0.008)}" width="${W}" height="${r2(H * 0.004)}" fill="${C.deep}" opacity="0.22"/>`);
  }

  // A recessed ground band, the shopfront line.
  out.push(`<rect x="0" y="${r2(H * 0.86)}" width="${W}" height="${r2(H * 0.14)}" fill="${C.deep}" opacity="0.5"/>`);

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
  const body = COMPOSERS[type](rand, width, height, ramp);
  const gid = `g${(h % 99991).toString(36)}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="presentation">
<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
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
<path fill="${color}" fill-rule="evenodd" d="M5 3h11a8.5 8.5 0 0 1 0 17h-6v9H5V3Zm5 4.4v8.2h5.6a4.1 4.1 0 0 0 0-8.2H10Z"/>
</svg>
`;
}

function wordmarkSvg(color = "#eff1ea") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 40" width="320" height="40">
<g fill="${color}"><path fill-rule="evenodd" d="M4 6h10.5a7.5 7.5 0 0 1 0 15H9.5v9H4V6Zm5.5 3.9v7.2h4.9a3.6 3.6 0 0 0 0-7.2H9.5Z"/></g>
<text x="30" y="27" font-family="Neue Montreal" font-size="24" fill="${color}">Pepo Properti</text>
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
  const body = COMPOSERS[type](rand, W, H, ramp);
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
<g transform="translate(72, ${panelY - 6}) scale(1.05)">
  <path fill="#eff1ea" fill-rule="evenodd" d="M0 0h10.5a7.5 7.5 0 0 1 0 15H5.5v9H0V0Zm5.5 3.9v7.2h4.9a3.6 3.6 0 0 0 0-7.2H5.5Z"/>
  <text x="27" y="20" font-family="Neue Montreal" font-size="23" fill="#eff1ea" letter-spacing="0.2">Pepo Properti</text>
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
writeFileSync(join(GRAPHICS, "hero.svg"), tile({ seed: "hero:pepo-properti:v1", type: "villa", width: 2000, height: 1250 }));
tiles++;

// Brand marks.
writeFileSync(join(ROOT, "public", "icon.svg"), mark("#12261d"));
writeFileSync(join(GRAPHICS, "mark-light.svg"), mark("#eff1ea"));
writeFileSync(join(GRAPHICS, "wordmark.svg"), wordmarkSvg());

// Open Graph: one default card plus one per listing, in both languages.
renderPng(
  ogSvg({
    seed: "og:default",
    type: "villa",
    lines: ["Villa, rumah, tanah, dan ruko di Bali", "Panjer, Denpasar Selatan"],
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
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180"><rect width="180" height="180" rx="38" fill="#12261d"/><g transform="translate(48,40) scale(3.1)"><path fill="#eff1ea" fill-rule="evenodd" d="M0 0h10.5a7.5 7.5 0 0 1 0 15H5.5v9H0V0Zm5.5 3.9v7.2h4.9a3.6 3.6 0 0 0 0-7.2H5.5Z"/></g></svg>`,
  join(ROOT, "public", "apple-icon.png")
);

console.log(`graphics: ${tiles} svg tiles`);
console.log(`og:       ${listings.length + 1} png cards`);
console.log(`marks:    icon.svg, mark-light.svg, wordmark.svg, apple-icon.png`);
