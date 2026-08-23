import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "@phosphor-icons/react/dist/ssr";

import { AppLink } from "@/components/AppLink";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { Gallery } from "@/components/listing/Gallery";
import { ListingCard } from "@/components/listing/ListingCard";
import { SampleNotice } from "@/components/listing/SampleNotice";
import { BreadcrumbSchema, ListingSchema } from "@/components/StructuredData";
import { formatArea, formatPrice, priceUnitSuffix } from "@/lib/format";
import { getDict, isLocale, locales, path, type Locale } from "@/lib/i18n";
import { allListings, getListing, relatedListings } from "@/lib/listings";
import { site } from "@/content/site";

/** Every listing is a static page with its own URL, title, and card image. */
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    allListings().map((listing) => ({ locale, slug: listing.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const listing = getListing(slug);
  if (!listing) return { title: getDict(locale).listing.notFound };

  const dict = getDict(locale);
  const url = path(locale, "listings", slug);
  const title = listing.title[locale];
  const description = listing.description[locale];

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        id: `/id/listings/${slug}`,
        en: `/en/listings/${slug}`,
        "x-default": `/id/listings/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      title: `${title} | ${site.name}`,
      description,
      url,
      images: [
        {
          url: `/og/${slug}.png`,
          width: 1200,
          height: 630,
          alt: `${dict.type[listing.type]} ${dict.status[listing.status]}, ${listing.area}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
      images: [`/og/${slug}.png`],
    },
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDict(locale);

  const listing = getListing(slug);
  if (!listing) notFound();

  const related = relatedListings(listing, 3);
  const suffix = priceUnitSuffix(listing.priceUnit, locale);
  const pageUrl = site.url + path(locale, "listings", slug);
  const forSale = listing.status === "dijual";

  const specs: { label: string; value: string }[] = [
    ...(listing.bedrooms !== null ? [{ label: dict.listing.bedrooms, value: String(listing.bedrooms) }] : []),
    ...(listing.bathrooms !== null ? [{ label: dict.listing.bathrooms, value: String(listing.bathrooms) }] : []),
    { label: dict.listing.landSize, value: formatArea(listing.landSize, locale) },
    ...(listing.buildingSize !== null
      ? [{ label: dict.listing.buildingSize, value: formatArea(listing.buildingSize, locale) }]
      : []),
    { label: dict.listing.certificate, value: listing.certificate },
    { label: dict.listing.code, value: listing.code },
  ];

  const mapsQuery = encodeURIComponent(`${listing.area}, ${listing.regency}, ${site.address.region}`);

  return (
    <div className="container pt-8 md:pt-12">
      <AppLink
        href={path(locale, "listings")}
        className="inline-flex items-center gap-2 text-[0.9375rem] text-ink-muted transition-colors duration-200 hover:text-ink"
      >
        <ArrowLeft weight="regular" aria-hidden="true" className="h-4 w-4" />
        {dict.common.backToListings}
      </AppLink>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
        <div className="min-w-0">
          <Gallery images={listing.images} alt={`${dict.type[listing.type]}, ${listing.area}`} dict={dict} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag" data-tone={forSale ? "sale" : "rent"}>
              {dict.status[listing.status]}
            </span>
            <span className="tag" data-tone="rent">
              {dict.type[listing.type]}
            </span>
          </div>

          <h1 className="mt-4 text-[clamp(1.625rem,1.2rem+1.6vw,2.5rem)] font-medium leading-[1.12] tracking-[-0.03em] text-ink">
            {listing.title[locale]}
          </h1>

          <p className="mt-3 flex items-center gap-2 text-[0.9375rem] text-ink-muted">
            <MapPin weight="regular" aria-hidden="true" className="h-4 w-4 flex-none" />
            {listing.area}, {listing.regency}
          </p>

          <div className="mt-7 rounded-[var(--radius-card)] border border-line bg-white p-5">
            <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-ink-muted">
              {dict.listing.priceLabel}
            </p>
            <p className="mt-1.5 text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-medium leading-tight tracking-[-0.025em] text-ink">
              <span className="numeric">{formatPrice(listing.price, locale)}</span>
              {suffix ? (
                <span className="ml-2 text-[0.9375rem] font-normal text-ink-muted">{suffix}</span>
              ) : null}
            </p>

            <p className="mt-4 border-t border-line pt-4 text-[0.875rem] text-ink-muted">
              {dict.listing.statusLabel}: <span className="font-medium text-ink">{dict.status[listing.status]}</span>
            </p>

            <div className="mt-5">
              <WhatsAppLink
                locale={locale}
                pageUrl={pageUrl}
                buttonLabel={dict.common.askAboutThis}
                placement="listing-detail"
                listing={{ code: listing.code, title: listing.title[locale] }}
                variant="primary"
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-5">
            <SampleNotice text={dict.common.sampleNoteListing} badge={dict.common.sampleBadge} />
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
        <div className="min-w-0">
          <h2 className="text-[1.25rem] font-medium tracking-[-0.02em] text-ink">{dict.listing.specs}</h2>
          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-3">
            {specs.map((spec) => (
              <div key={spec.label} className="bg-white p-4">
                <dt className="text-[0.8125rem] text-ink-muted">{spec.label}</dt>
                <dd className="numeric mt-1 text-[1.0625rem] font-medium text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-12 text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
            {dict.listing.description}
          </h2>
          <p className="mt-3 max-w-[68ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
            {listing.description[locale]}
          </p>
        </div>

        <div className="min-w-0">
          <h2 className="text-[1.25rem] font-medium tracking-[-0.02em] text-ink">{dict.listing.location}</h2>
          <div className="mt-4 rounded-[var(--radius-card)] border border-line bg-white p-5">
            <p className="text-[1.0625rem] font-medium text-ink">
              {listing.area}, {listing.regency}
            </p>
            <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-muted">{dict.listing.locationNote}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-4"
              data-variant="secondary"
            >
              <MapPin weight="regular" aria-hidden="true" className="btn__icon" />
              <span>{dict.listing.openMaps}</span>
            </a>
          </div>
        </div>
      </div>

      {related.length ? (
        <section aria-labelledby="related-heading" className="mt-24 md:mt-32">
          <Reveal>
            <SectionHeader
              id="related-heading"
              label={dict.listing.related.label}
              headline={dict.listing.related.headline}
              description={dict.listing.related.description}
              cta={{ href: path(locale, "listings"), label: dict.listing.related.cta }}
            />
          </Reveal>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <li key={item.slug}>
                <Reveal delay={index * 90}>
                  <ListingCard listing={item} locale={locale} dict={dict} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ListingSchema listing={listing} locale={locale} dict={dict} />
      <BreadcrumbSchema
        items={[
          { name: dict.nav.home, url: site.url + path(locale, "home") },
          { name: dict.nav.listings, url: site.url + path(locale, "listings") },
          { name: listing.title[locale], url: pageUrl },
        ]}
      />
    </div>
  );
}
