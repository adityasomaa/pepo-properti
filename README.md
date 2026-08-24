# KORVA

Live at **https://korva.onyxcreative.asia** (also reachable at
https://pepo-properti.vercel.app).

Website for the **KORVA** ecosystem in Bali, which is two companies working as
one:

| | |
| --- | --- |
| **Korva Pro** | PT Maha Anugrah Selaras Propertindo. Property marketing, land investment consulting, sale and purchase of villas and land plots. |
| **Korva Studio** | PT Berkah Bali Bersinar. Architectural design, working and structural drawings, 3D rendering, contracting, and PBG and SLF permits. |

Office: Jl. Goa Gong, Pertokoan No. 5, Jimbaran, Kec. Kuta Selatan, Kabupaten
Badung, Bali. Service areas: Badung, Denpasar, Gianyar, Tabanan.

The site is built around the one-stop route the business sells: find land with
Korva Pro, then build on it with Korva Studio. Land listings carry a direct
hand-off into the build side, and the floating enquiry button asks which of the
two teams should receive the message so nothing has to be forwarded on arrival.

## Stack

Next.js 16 (App Router) - React 19 - TypeScript - Tailwind v4 - Motion - Lenis.
Self-hosted Neue Montreal. No image CDN: `images.unoptimized` is on, and every
graphic is generated as SVG at build time.

## Editing the site

| What | Where |
| --- | --- |
| Properties and land | `content/listings.ts` |
| Korva Studio projects | `content/projects.ts` |
| Build packages and calculator rates | `content/build.ts` |
| Office, phone numbers, legal entities | `content/site.ts` |
| Every piece of visible text | `lib/i18n.ts` (Indonesian and English) |

Each of those files is commented in Indonesian for a non-technical editor.

### Three flags to flip when real data arrives

| Flag | File | While it is `true` / `false` |
| --- | --- | --- |
| `SAMPLE_DATA` | `content/listings.ts` | `true`: a "sample data" notice appears wherever properties are shown. |
| `SAMPLE_PROJECTS` | `content/projects.ts` | `true`: the same notice appears on the portfolio. |
| `RATES_CONFIRMED` | `content/build.ts` | `false`: the calculator warns on screen, and inside the WhatsApp message it produces, that the rates are placeholders. |

The per square metre rates in `content/build.ts` have **not** come from Korva
Studio. Replace them and set `RATES_CONFIRMED = true`, and the warnings
disappear on their own.

## Scripts

```
npm run dev              development server
npm run build            production build
npm run graphics         regenerate every SVG tile and Open Graph card

npm run contrast         every colour pair against WCAG AA
npm run audit            layout at six viewports, short laptops included:
                         overflow, broken images, hidden reveals, and content
                         hidden behind the sticky header
npm run audit:behaviour  50 interaction checks: menu, filters, listbox keyboard
                         support, language memory, WhatsApp routing, lightbox,
                         scroll locks, server-side validation
npm run audit:seo        assets, routes, per-listing metadata, structured data,
                         sitemap, robots
```

Each audit takes a base URL, so the same checks run against production:

```
npm run audit -- https://korva.onyxcreative.asia
```

The layout audit self-tests before reporting: it injects an over-wide element
and refuses to report a pass unless its own detector catches it.

Viewport **height** is part of that sweep, not just width. A full-height hero
with centred content pushes its own top out of view when the viewport is
shorter than the content, and only a short viewport reveals it.

Point load-generating scripts at the `vercel.app` alias rather than the custom
domain. A burst of automated traffic against a hostname triggers Vercel's
platform mitigation, which then serves a security checkpoint to every
non-browser client on it.

## Graphics

Placeholder imagery is generated, never stock. `scripts/generate-graphics.mjs`
draws each tile deterministically from its listing code or project slug, so
regenerating is byte-identical and a new entry gets a new tile in the same
visual family. The four property types use four different geometric
compositions, and portfolio pairs deliberately draw the plan stage from the
land family (outline and measurement) and the result from the built family, so
the before and after read as a sequence. Nothing imitates a photograph.

To swap in real photography and renders, put files in `public/photos` and point
the `images`, `before`, and `after` fields at them.

## Third-party components

`components/ui/letter-cascade.tsx` comes from the
[componentry.dev](https://componentry.dev) registry
(`shadcn add @componentry/letter-cascade`), adapted: its authoring-workspace
import is swapped for this project's `cn`, `framer-motion` becomes
`motion/react`, every letter is marked `aria-hidden` behind a single
`aria-label`, and reduced motion skips the animation.
