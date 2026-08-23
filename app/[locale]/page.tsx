import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { AppLink } from "@/components/AppLink";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { HeroSearch } from "@/components/home/HeroSearch";
import { ListingCard } from "@/components/listing/ListingCard";
import { SampleNotice } from "@/components/listing/SampleNotice";
import { ItemListSchema } from "@/components/StructuredData";
import { getDict, isLocale, path, type Locale } from "@/lib/i18n";
import { latestVillas } from "@/lib/listings";
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

  const villas = latestVillas(3);

  return (
    <>
      {/*
        The hero is exactly one screen tall, and the search is inside it.

        The height subtracts the sticky header, so the first screen is the
        header plus the hero and nothing of the section below it. It also
        subtracts whatever height the cookie banner currently reports, so on a
        first visit the banner cannot sit on top of the search button.

        100svh, not 100vh: the small viewport unit is fixed at the size the
        viewport has while the browser chrome is showing, so the hero does not
        resize under the reader's thumb when the address bar retracts on scroll.

        The graphic is a static plane with no scroll-linked transform, so it
        never zooms as the page moves.
      */}
      <section
        className="relative overflow-hidden"
        style={{ height: "calc(100svh - var(--header-h))", minHeight: "30rem" }}
      >
        <div
          className="container grid h-full items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-14"
          style={{ paddingTop: "1.5rem", paddingBottom: "calc(1.5rem + var(--cookie-h, 0px))" }}
        >
          <div className="flex min-w-0 flex-col justify-center">
            <h1 className="max-w-[16ch] text-[clamp(1.875rem,1.1rem+3.2vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ink">
              {dict.home.heroHeadline}
            </h1>
            <p className="mt-4 max-w-[44ch] text-[clamp(0.9375rem,0.9rem+0.2vw,1.0625rem)] leading-[1.55] text-ink-muted">
              {dict.home.heroDescription}
            </p>
            <div className="mt-6 max-w-[34rem]">
              <HeroSearch locale={locale} dict={dict} />
            </div>
          </div>

          <div className="relative hidden min-w-0 lg:block">
            <div className="absolute inset-0 overflow-hidden rounded-[var(--radius-card)] border border-line">
              <img
                src="/graphics/hero.svg"
                alt=""
                width={2000}
                height={1250}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Villas lead, because that is what this agency is known for. */}
      <section aria-labelledby="villas-heading" className="container pt-4 md:pt-8">
        <Reveal>
          <SectionHeader
            id="villas-heading"
            label={dict.home.latest.label}
            headline={dict.home.latest.headline}
            description={dict.home.latest.description}
            cta={{ href: path(locale, "listings") + "?type=villa", label: dict.home.latest.cta }}
          />
        </Reveal>

        <div className="mt-8">
          <SampleNotice text={dict.common.sampleNoteShort} badge={dict.common.sampleBadge} />
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {villas.map((listing, index) => (
            <li key={listing.slug}>
              <Reveal delay={index * 90}>
                <ListingCard listing={listing} locale={locale} dict={dict} priority={index === 0} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/*
        A different layout family from the grid above: one lead tile with a wide
        plane, two supporting tiles. Exactly three cells for three categories.
      */}
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
            const lead = index === 0;
            return (
              <li key={type} className={lead ? "md:row-span-2" : ""}>
                <Reveal delay={index * 90} className="h-full">
                  <AppLink
                    href={path(locale, "listings") + `?type=${type}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-colors duration-300 hover:border-ink/35"
                  >
                    <span className={`block w-full overflow-hidden bg-surface ${lead ? "aspect-[4/3] md:aspect-auto md:flex-1" : "aspect-[16/7]"}`}>
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

      <ItemListSchema listings={villas} locale={locale} />
    </>
  );
}
