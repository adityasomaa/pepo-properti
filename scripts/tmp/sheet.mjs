import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
const files = [
  ["public/graphics/pp-v-001-1.svg", "villa 1"],
  ["public/graphics/pp-v-003-2.svg", "villa 2"],
  ["public/graphics/pp-r-001-1.svg", "rumah"],
  ["public/graphics/pp-t-001-1.svg", "tanah"],
  ["public/graphics/pp-k-002-1.svg", "ruko"],
  ["public/graphics/hero.svg", "hero"],
];
const CW = 420, CH = 315, COLS = 3;
let cells = "";
files.forEach(([f, label], i) => {
  const x = (i % COLS) * CW, y = Math.floor(i / COLS) * (CH + 26);
  const inner = readFileSync(f, "utf8").replace(/<\?xml[^>]*\?>/, "");
  cells += `<g transform="translate(${x},${y})"><svg width="${CW - 8}" height="${CH - 8}" viewBox="0 0 1600 1200" preserveAspectRatio="xMidYMid slice">${inner.replace(/^<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}</svg>`;
  cells += `<text x="4" y="${CH + 12}" font-family="monospace" font-size="14" fill="#111">${label}</text></g>`;
});
const W = CW * COLS, H = (CH + 26) * Math.ceil(files.length / COLS);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${cells}</svg>`;
writeFileSync("C:/Users/User/AppData/Local/Temp/claude/C--Claude-PEPO-PROPERTY/772592bc-1663-4645-9aef-9d7b09da3193/scratchpad/sheet.png", new Resvg(svg, { fitTo: { mode: "original" } }).render().asPng());
console.log("ok");
