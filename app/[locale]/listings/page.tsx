import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ListingBrowser } from "@/components/listing/ListingBrowser";
import { SampleNotice } from "@/components/listing/SampleNotice";
import { BreadcrumbSchema, ItemListSchema } from "@/components/StructuredData";
import { getDict, isLocale, path, type Locale } from "@/lib/i18n";
import { allAreas, allListings, filtersFromParams, filterListings } from "@/lib/listings";
import { site } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);
  const url = path(locale, "listings");

  return {
    title: dict.listings.metaTitle,
    description: dict.listings.metaDescription,
    alternates: {
      canonical: url,
      languages: { id: "/id/listings", en: "/en/listings", "x-default": "/id/listings" },
    },
    openGraph: {
      title: `${dict.listings.metaTitle} | ${site.name}`,
      description: dict.listings.metaDescription,
      url,
      images: [{ url: "/og/default.png", width: 1200, height: 630, alt: site.name }],
    },
  };
}

export default async function ListingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDict(locale);

  // The first result set is worked out on the server from the query string, so
  // a shared filtered link arrives already filtered.
  const query = await searchParams;
  const filters = filtersFromParams(query);
  const listings = allListings();
  const initialResults = filterListings(listings, filters, locale);

  return (
    <div className="container pt-12 md:pt-20">
      <Reveal>
        <SectionHeader
          as="h1"
          label={dict.listings.label}
          headline={dict.listings.headline}
          description={dict.listings.description}
          cta={{ href: path(locale, "submit"), label: dict.listings.cta }}
        />
      </Reveal>

      <div className="mt-8">
        <SampleNotice text={dict.common.sampleNoteShort} badge={dict.common.sampleBadge} />
      </div>

      <ListingBrowser
        listings={listings}
        initialFilters={filters}
        areas={allAreas()}
        locale={locale}
        dict={dict}
        pageUrl={site.url + path(locale, "listings")}
      />

      <ItemListSchema listings={initialResults} locale={locale} />
      <BreadcrumbSchema
        items={[
          { name: dict.nav.home, url: site.url + path(locale, "home") },
          { name: dict.nav.listings, url: site.url + path(locale, "listings") },
        ]}
      />
    </div>
  );
}
