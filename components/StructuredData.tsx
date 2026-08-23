import { site } from "@/content/site";
import { formatPrice } from "@/lib/format";
import { path, type Dictionary, type Locale } from "@/lib/i18n";
import type { Listing } from "@/content/listings";

/**
 * While jualvillamurah.co.id has been down, every structured signal Google held
 * about this business has been resolving to an error page. These blocks put the
 * agency and its listings back into a machine readable form: address, opening
 * hours, and one RealEstateListing per property.
 *
 * Nothing here is invented. The address, hours, phone number, and map link come
 * from the agency's own business profile; no rating, review count, or
 * transaction history is asserted, because none has been supplied.
 */

function Json({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built here from typed values, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema({ locale }: { locale: Locale }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${site.url}/#organization`,
    name: site.legalName,
    alternateName: site.name,
    url: site.url + path(locale, "home"),
    telephone: site.phoneDisplay,
    image: `${site.url}/og/default.png`,
    logo: `${site.url}/icon.svg`,
    areaServed: { "@type": "AdministrativeArea", name: "Bali, Indonesia" },
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    hasMap: site.mapsUrl,
    openingHoursSpecification: site.hours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days.map((d) => `https://schema.org/${d}`),
      opens: slot.opens,
      closes: slot.closes,
    })),
  };

  return <Json data={data} />;
}

export function ListingSchema({
  listing,
  locale,
  dict,
}: {
  listing: Listing;
  locale: Locale;
  dict: Dictionary;
}) {
  const url = site.url + path(locale, "listings", listing.slug);

  const data = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${url}#listing`,
    url,
    name: listing.title[locale],
    description: listing.description[locale],
    identifier: listing.code,
    datePosted: listing.publishedAt,
    inLanguage: dict.meta.htmlLang,
    image: [site.url + listing.images[0], `${site.url}/og/${listing.slug}.png`],
    provider: { "@id": `${site.url}/#organization` },
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      businessFunction:
        listing.status === "dijual"
          ? "https://schema.org/Sell"
          : "https://schema.org/LeaseOut",
    },
    about: {
      "@type": listing.type === "tanah" ? "LandForm" : "Accommodation",
      name: dict.type[listing.type],
      ...(listing.bedrooms !== null ? { numberOfBedrooms: listing.bedrooms } : {}),
      ...(listing.bathrooms !== null ? { numberOfBathroomsTotal: listing.bathrooms } : {}),
      floorSize: { "@type": "QuantitativeValue", value: listing.buildingSize ?? listing.landSize, unitCode: "MTK" },
      address: {
        "@type": "PostalAddress",
        addressLocality: listing.area,
        addressRegion: `${listing.regency}, ${site.address.region}`,
        addressCountry: site.address.country,
      },
    },
  };

  return <Json data={data} />;
}

export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <Json data={data} />;
}

export function ItemListSchema({
  listings,
  locale,
}: {
  listings: Listing[];
  locale: Locale;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: listings.length,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: site.url + path(locale, "listings", listing.slug),
      name: listing.title[locale],
    })),
  };
  return <Json data={data} />;
}

/** Kept alongside the schema helpers so price formatting stays in one place. */
export function priceText(listing: Listing, locale: Locale): string {
  return formatPrice(listing.price, locale);
}
