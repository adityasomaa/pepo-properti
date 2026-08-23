/**
 * WCAG AA contrast audit over the design tokens.
 *
 * Every foreground/background pair that actually ships is declared in PAIRS
 * below. Run `npm run contrast`. Any pair under its minimum fails the build
 * of the design system, not just the linter.
 */
const T = {
  paper:        "#F2F3EF",
  surface:      "#E7E9E1",
  forest:       "#12261D",
  forestSoft:   "#1D3A2C",
  ink:          "#12261D",
  inkMuted:     "#4C5B53",
  line:         "#D2D6CB",
  accent:       "#9C3517",
  accentInk:    "#8A2F14",
  onForest:     "#EFF1EA",
  onForestMute: "#AFBCB2",
  onAccent:     "#FFFFFF",
  focus:        "#9C3517",
};

const srgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
};
const lum = (h) => {
  const [r, g, b] = srgb(h);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

// [foreground, background, minimum, what it is used for]
const PAIRS = [
  ["ink",          "paper",   4.5, "body text on page"],
  ["ink",          "surface", 4.5, "body text on raised surface"],
  ["inkMuted",     "paper",   4.5, "secondary text on page"],
  ["inkMuted",     "surface", 4.5, "secondary text on raised surface"],
  ["accentInk",    "paper",   4.5, "accent text / links on page"],
  ["accentInk",    "surface", 4.5, "accent text on raised surface"],
  ["onAccent",     "accent",  4.5, "button label on accent fill"],
  ["onForest",     "forest",  4.5, "text on dark brand surface"],
  ["onForest",     "forestSoft", 4.5, "text on soft dark surface"],
  ["onForestMute", "forest",  4.5, "secondary text on dark brand surface"],
  ["onForestMute", "forestSoft", 4.5, "secondary text on soft dark surface"],
  ["forest",       "paper",   4.5, "heading on page"],
  ["focus",        "paper",   3.0, "focus ring against page"],
  ["focus",        "surface", 3.0, "focus ring against raised surface"],
  ["line",         "paper",   1.0, "hairline (decorative, no minimum)"],
];

let failed = 0;
console.log("token pair".padEnd(34), "ratio".padStart(7), "min".padStart(6), "  use");
for (const [fg, bg, min, use] of PAIRS) {
  const r = ratio(T[fg], T[bg]);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(
    `${ok ? "PASS" : "FAIL"} ${fg} on ${bg}`.padEnd(34),
    r.toFixed(2).padStart(7),
    String(min).padStart(6),
    "  " + use
  );
}
console.log(failed === 0 ? "\nAll pairs pass." : `\n${failed} pair(s) below minimum.`);
process.exit(failed === 0 ? 0 : 1);
