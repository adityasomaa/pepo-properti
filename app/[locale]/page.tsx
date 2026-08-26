import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Buildings, Compass } from "@phosphor-icons/react/dist/ssr";

import { AppLink } from "@/components/AppLink";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { HeroSearch } from "@/components/home/HeroSearch";
import { Ticker } from "@/components/home/Ticker";
import { ListingCard } from "@/components/listing/ListingCard";
import { SampleNotice } from "@/components/listing/SampleNotice";
import { BeforeAfter } from "@/components/portfolio/BeforeAfter";
import { ItemListSchema } from "@/components/StructuredData";
import { getDict, isLocale, path, type Locale } from "@/lib/i18n";
import { latestListings } from "@/lib/listings";
import { studioServices } from "@/content/build";
import { projects, SAMPLE_PROJECTS } from "@/content/projects";
import { site } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);

  return {
    title: { absolute: `${site.name} | ${dict.home.metaTitle}` },
    description: dict.home.metaDescription,
    alternates: {
      canonical: path(locale, "home"),
      languages: { id: "/id", en: "/en", "x-default": "/id" },
    },
    openGraph: {
      title: `${site.name} | ${dict.home.metaTitle}`,
      description: dict.home.metaDescription,
      url: path(locale, "home"),
      images: [{ url: "/og/default.png", width: 1200, height: 630, alt: site.name }],
    },
  };
}

const CATEGORIES = ["rumah", "tanah", "ruko"] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDict(locale);

  const latest = latestListings(3);
  const lead = projects[0];

  return (
    <>
      {/*
        The hero fills one screen, and the search is inside it.

        min-height, not height. With a fixed height and centred content, a
        viewport shorter than the content pushes the top of that content out of
        the box and under the sticky header, which is exactly what happened on
        laptops around 600 to 760px tall. Growing is the safe failure: the page
        scrolls, and the headline is never cut off.

        The cookie banner deliberately has no say in this height. It is an
        overlay, and an overlay that reflows the page underneath it moves
        content out from under the reader. It covers the bottom strip while it
        is up, which is what a bottom bar does, and the page can scroll.

        100svh, not 100vh: the small viewport unit is fixed at the size the
        viewport has while the browser chrome is showing, so the hero does not
        resize under the reader's thumb when the address bar retracts on scroll.

        The graphic is a static plane with no scroll-linked transform, so it
        never zooms as the page moves.
      */}
      <section className="relative" style={{ minHeight: "calc(100svh - var(--header-h))" }}>
        <div className="container flex min-h-[inherit] flex-col justify-center gap-4 py-5 sm:gap-6 sm:py-8">
          {/* Headline beside the picture. */}
          <div className="grid items-center gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-12">
            <h1 className="max-w-[19ch] text-[clamp(1.5rem,0.95rem+2.6vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ink">
              {dict.home.heroHeadline}
            </h1>

            {/*
              The picture is present at every width. It used to appear only from
              1024px up, so anyone on a phone met a hero with no image at all.
              Swapping in the client's photograph is one edit in content/site.ts.
            */}
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
              <img
                src={site.heroImage.src}
                alt={site.heroImage.alt}
                width={site.heroImage.width}
                height={site.heroImage.height}
                fetchPriority="high"
                decoding="async"
                className="block h-[clamp(6rem,17svh,9rem)] w-full object-cover sm:h-[clamp(8rem,22svh,12rem)] lg:h-[clamp(14rem,34svh,22rem)]"
              />
            </div>
          </div>

          {/* The running band sits directly under the headline, as asked. */}
          <Ticker items={dict.home.ticker} label={dict.home.tickerLabel} />

          <div className="grid items-start gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-12">
            <div className="min-w-0">
              <p className="max-w-[54ch] text-[clamp(0.9375rem,0.9rem+0.2vw,1.0625rem)] leading-[1.5] text-ink-muted">
                {dict.home.heroDescription}
              </p>

              {/* The two routes into the business, exactly as the brief frames
                  them. Stacked on the narrowest screens so each label keeps to
                  one line at every width. */}
              <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
                <AppLink href={path(locale, "listings")} className="btn" data-variant="primary">
                  <Buildings weight="regular" aria-hidden="true" className="btn__icon" />
                  <span>{dict.division.proCta}</span>
                </AppLink>
                <AppLink href={path(locale, "build")} className="btn" data-variant="secondary">
                  <Compass weight="regular" aria-hidden="true" className="btn__icon" />
                  <span>{dict.division.studioCta}</span>
                </AppLink>
              </div>
            </div>

            <div className="min-w-0">
              <HeroSearch locale={locale} dict={dict} />
            </div>
          </div>
        </div>
      </section>

      {/* Two divisions, side by side, so the ecosystem is legible immediately. */}
      <section aria-labelledby="synergy-heading" className="container pt-4 md:pt-8">
        <Reveal>
          <SectionHeader
            id="synergy-heading"
            label={dict.home.synergy.label}
            headline={dict.home.synergy.headline}
            description={dict.home.synergy.description}
            cta={{ href: path(locale, "build"), label: dict.home.synergy.cta }}
          />
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            { division: site.divisions.pro, label: dict.division.proLabel, href: path(locale, "listings"), cta: dict.division.proCta },
            { division: site.divisions.studio, label: dict.division.studioLabel, href: path(locale, "build"), cta: dict.division.studioCta },
          ].map((entry, index) => (
            <Reveal key={entry.division.key} delay={index * 90} className="h-full">
              <AppLink
                href={entry.href}
                className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 transition-colors duration-300 hover:border-ink/35 sm:p-8"
              >
                <p className="text-[0.75rem] font-medium uppercase tracking-[0.09em] text-ink-muted">
                  {entry.label}
                </p>
                <h3 className="mt-3 text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] font-medium tracking-[-0.025em] text-ink">
                  {entry.division.name}
                </h3>
                <p className="mt-1.5 text-[0.8125rem] text-ink-muted">{entry.division.legalName}</p>
                <p className="mt-4 max-w-[46ch] flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {entry.division.role[locale]}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[0.9375rem] text-accent-ink">
                  {entry.cta}
                  <ArrowRight weight="regular" aria-hidden="true" className="h-4 w-4" />
                </span>
              </AppLink>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 max-w-[68ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
            {dict.home.synergy.closing}
          </p>
        </Reveal>
      </section>

      {/* A ruled grid rather than cards: four claims, no containers around them. */}
      <section aria-labelledby="advantages-heading" className="container mt-24 md:mt-32">
        <Reveal>
          <SectionHeader
            id="advantages-heading"
            label={dict.home.advantages.label}
            headline={dict.home.advantages.headline}
            description={dict.home.advantages.description}
          />
        </Reveal>

        <ul className="mt-10 grid gap-x-10 gap-y-8 border-t border-line pt-8 sm:grid-cols-2">
          {dict.home.advantages.items.map((item, index) => (
            <li key={item.title}>
              <Reveal delay={index * 70}>
                <h3 className="text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">{item.title}</h3>
                <p className="mt-2 max-w-[48ch] text-[0.9375rem] leading-relaxed text-ink-muted">{item.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Korva Pro. */}
      <section aria-labelledby="latest-heading" className="container mt-24 md:mt-32">
        <Reveal>
          <SectionHeader
            id="latest-heading"
            label={dict.home.latest.label}
            headline={dict.home.latest.headline}
            description={dict.home.latest.description}
            cta={{ href: path(locale, "listings"), label: dict.home.latest.cta }}
          />
        </Reveal>

        <div className="mt-8">
          <SampleNotice text={dict.common.sampleNoteShort} badge={dict.common.sampleBadge} />
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((listing, index) => (
            <li key={listing.slug}>
              <Reveal delay={index * 90}>
                <ListingCard listing={listing} locale={locale} dict={dict} priority={index === 0} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Korva Studio. A list against a single plane, not another card grid. */}
      <section aria-labelledby="build-heading" className="container mt-24 md:mt-32">
        <Reveal>
          <SectionHeader
            id="build-heading"
            label={dict.home.build.label}
            headline={dict.home.build.headline}
            description={dict.home.build.description}
            cta={{ href: path(locale, "build"), label: dict.home.build.cta }}
          />
        </Reveal>

        <ul className="mt-10 divide-y divide-line border-y border-line">
          {studioServices.map((service, index) => (
            <li key={service.key}>
              <Reveal delay={index * 60}>
                <div className="grid gap-2 py-6 md:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] md:gap-10">
                  <h3 className="text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">
                    {service.name[locale]}
                  </h3>
                  <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                    {service.description[locale]}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* One full-width comparison, the clearest evidence of what Studio does. */}
      {lead ? (
        <section aria-labelledby="portfolio-heading" className="container mt-24 md:mt-32">
          <Reveal>
            <SectionHeader
              id="portfolio-heading"
              label={dict.home.portfolio.label}
              headline={dict.home.portfolio.headline}
              description={dict.home.portfolio.description}
              cta={{ href: path(locale, "portfolio"), label: dict.home.portfolio.cta }}
            />
          </Reveal>

          {SAMPLE_PROJECTS ? (
            <div className="mt-8">
              <SampleNotice text={dict.common.sampleNoteProjects} badge={dict.common.sampleBadge} />
            </div>
          ) : null}

          <Reveal className="mt-8">
            <BeforeAfter
              before={lead.before}
              after={lead.after}
              beforeAlt={`${dict.portfolio.beforeLabel}. ${lead.title[locale]}.`}
              afterAlt={`${dict.portfolio.afterLabel}. ${lead.title[locale]}.`}
              beforeLabel={dict.portfolio.beforeLabel}
              afterLabel={dict.portfolio.afterLabel}
              sliderLabel={dict.portfolio.sliderLabel}
            />
            <p className="mt-3 text-[0.875rem] text-ink-muted">
              {lead.title[locale]}. {dict.portfolio.sliderInstruction}
            </p>
          </Reveal>
        </section>
      ) : null}

      {/* A bento: one lead tile, two supporting. Exactly three cells for three. */}
      <section aria-labelledby="categories-heading" className="container mt-24 md:mt-32">
        <Reveal>
          <SectionHeader
            id="categories-heading"
            label={dict.home.categories.label}
            headline={dict.home.categories.headline}
            description={dict.home.categories.description}
            cta={{ href: path(locale, "listings"), label: dict.home.categories.cta }}
          />
        </Reveal>

        <ul className="mt-10 grid gap-4 md:grid-cols-2 md:grid-rows-2">
          {CATEGORIES.map((type, index) => {
            const isLead = index === 0;
            return (
              <li key={type} className={isLead ? "md:row-span-2" : ""}>
                <Reveal delay={index * 90} className="h-full">
                  <AppLink
                    href={path(locale, "listings") + `?type=${type}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-colors duration-300 hover:border-ink/35"
                  >
                    <span
                      className={`block w-full overflow-hidden bg-surface ${isLead ? "aspect-[4/3] md:aspect-auto md:flex-1" : "aspect-[16/7]"}`}
                    >
                      <img
                        src={`/graphics/category-${type}.svg`}
                        alt=""
                        width={1200}
                        height={900}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="flex items-center justify-between gap-4 p-5">
                      <span className="text-[1.125rem] font-medium tracking-[-0.02em] text-ink">
                        {dict.typePlural[type]}
                      </span>
                      <span className="flex items-center gap-1.5 text-[0.875rem] text-accent-ink">
                        {dict.common.viewDetail}
                        <ArrowRight weight="regular" aria-hidden="true" className="h-4 w-4" />
                      </span>
                    </span>
                  </AppLink>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <ItemListSchema listings={latest} locale={locale} />
    </>
  );
}
