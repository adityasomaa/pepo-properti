import type { MetadataRoute } from "next";
import { locales, path, routes, type RouteKey } from "@/lib/i18n";
import { allListings } from "@/lib/listings";
import { site } from "@/content/site";

/**
 * Every page in both languages, including one entry per listing.
 *
 * While the old domain has been down, none of these URLs existed as far as a
 * crawler was concerned. Listing pages are the ones that matter most here, so
 * they carry the later change frequency and are never omitted.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticKeys: RouteKey[] = ["home", "listings", "submit", "contact", "privacy", "terms"];
  const listings = allListings();
  const now = new Date();

  const pages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticKeys.map((key) => ({
      url: site.url + path(locale, key),
      lastModified: now,
      changeFrequency: key === "listings" ? ("daily" as const) : ("monthly" as const),
      priority: key === "home" ? 1 : key === "listings" ? 0.9 : 0.5,
      alternates: {
        languages: Object.fromEntries(
          locales.map((other) => [other, site.url + path(other, key)])
        ),
      },
    }))
  );

  const details: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    listings.map((listing) => ({
      url: site.url + path(locale, "listings", listing.slug),
      lastModified: new Date(listing.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((other) => [other, site.url + path(other, "listings", listing.slug)])
        ),
      },
    }))
  );

  // Referenced so the route list and the segment map stay in step.
  void routes;

  return [...pages, ...details];
}
