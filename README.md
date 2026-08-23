# Pepo Properti

Website for **Agency Pepo Properti Indonesia**, a property agency in Panjer, South
Denpasar, Bali. Villas lead; houses, land, and shophouses follow.

The agency's previous domain stopped resolving while it was still linked from
their Google Maps profile, so this site is built to be a working replacement:
findable listings, one shareable URL per property with its own preview card, and
a WhatsApp route to the agent from every page.

## Stack

Next.js 16 (App Router) - React 19 - TypeScript - Tailwind v4 - Motion - Lenis.
Self-hosted Neue Montreal. No image CDN: `images.unoptimized` is on, and every
graphic is generated as SVG at build time.

## Editing the site

| What                            | Where                                        |
| ------------------------------- | -------------------------------------------- |
| Properties                      | `content/listings.ts` (commented, plain text) |
| Office address, hours, WhatsApp | `content/site.ts`                             |
| Every piece of visible text     | `lib/i18n.ts` (Indonesian and English)        |

`content/listings.ts` currently holds **sample data**. While `SAMPLE_DATA` is
`true`, the site says so on screen wherever properties appear. Set it to `false`
once real listings replace the examples and the notice disappears everywhere.

## Scripts

```
npm run dev        development server
npm run build      production build
npm run graphics   regenerate every SVG tile and Open Graph card
npm run contrast   audit every colour pair against WCAG AA
```

`scripts/convert-fonts.py` regenerates the self-hosted WOFF2 faces from the
licensed Neue Montreal TTFs.

## Graphics

Placeholder imagery is generated, never stock. `scripts/generate-graphics.mjs`
draws each tile deterministically from its listing code, so regenerating is
byte-identical and a new listing gets a new tile in the same visual family. The
four property types use four different geometric compositions so a villa, a
house, a land plot, and a shophouse are distinguishable at a glance. Nothing
imitates a photograph.

To swap in real photography, put files in `public/photos` and point the
`images` array of a listing at them.
