import { site, divisionList } from "@/content/site";
import { photoUrl } from "@/lib/photos";
import { path, type Dictionary, type Locale } from "@/lib/i18n";
import type { Listing } from "@/content/listings";

/**
 * Machine readable identity for a business that is actually two businesses.
 *
 * Korva Pro is declared as a RealEstateAgent and Korva Studio as a
 * GeneralContractor, both at the same address, tied together by an Organization
 * that names them as departments. Search engines then have the same picture a
 * reader gets from the page rather than a single blurred entity.
 *
 * Nothing here is invented. Address, phone numbers, and legal entity names come
 * from the client's brief; no rating, review count, or transaction history is
 * asserted, because none has been supplied.
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

function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: `${site.address.regency}, ${site.address.region}`,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  };
}

function openingHours() {
  return site.hours.map((slot) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: slot.days.map((d) => `https://schema.org/${d}`),
    opens: slot.opens,
    closes: slot.closes,
  }));
}

export function OrganizationSchema({ locale }: { locale: Locale }) {
  const home = site.url + path(locale, "home");

  const departments = [
    {
      "@type": "RealEstateAgent",
      "@id": `${site.url}/#korva-pro`,
      name: site.divisions.pro.name,
      legalName: site.divisions.pro.legalName,
      description: site.divisions.pro.role[locale],
      telephone: site.divisions.pro.phoneDisplay,
      url: site.url + path(locale, "listings"),
      address: postalAddress(),
      openingHoursSpecification: openingHours(),
      areaServed: site.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    },
    {
      "@type": "GeneralContractor",
      "@id": `${site.url}/#korva-studio`,
      name: site.divisions.studio.name,
      legalName: site.divisions.studio.legalName,
      description: site.divisions.studio.role[locale],
      telephone: site.divisions.studio.phoneDisplay,
      url: site.url + path(locale, "build"),
      address: postalAddress(),
      openingHoursSpecification: openingHours(),
      areaServed: site.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    },
  ];

  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: home,
    image: `${site.url}/og/default.png`,
    logo: `${site.url}/icon.svg`,
    telephone: divisionList.map((d) => d.phoneDisplay),
    address: postalAddress(),
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: openingHours(),
    areaServed: site.serviceAreas.map((name) => ({ "@type": "AdministrativeArea", name })),
    department: departments,
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
    image: [site.url + photoUrl(listing.images[0]), `${site.url}/og/${listing.slug}.png`],
    provider: { "@id": `${site.url}/#korva-pro` },
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      businessFunction:
        listing.status === "dijual" ? "https://schema.org/Sell" : "https://schema.org/LeaseOut",
    },
    about: {
      "@type": listing.type === "tanah" ? "LandForm" : "Accommodation",
      name: dict.type[listing.type],
      ...(listing.bedrooms !== null ? { numberOfBedrooms: listing.bedrooms } : {}),
      ...(listing.bathrooms !== null ? { numberOfBathroomsTotal: listing.bathrooms } : {}),
      floorSize: {
        "@type": "QuantitativeValue",
        value: listing.buildingSize ?? listing.landSize,
        unitCode: "MTK",
      },
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

/** The services Korva Studio offers, so a build enquiry can surface on its own. */
export function ServiceSchema({ locale, names }: { locale: Locale; names: string[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: site.divisions.studio.name,
    itemListElement: names.map((name, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name,
        provider: { "@id": `${site.url}/#korva-studio` },
        areaServed: site.serviceAreas.map((area) => ({ "@type": "AdministrativeArea", name: area })),
        url: site.url + path(locale, "build"),
      },
    })),
  };
  return <Json data={data} />;
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
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

export function ItemListSchema({ listings, locale }: { listings: Listing[]; locale: Locale }) {
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
