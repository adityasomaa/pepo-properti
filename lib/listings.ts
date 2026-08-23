import {
  listings,
  type Listing,
  type PropertyType,
  type ListingStatus,
  type Tenure,
  type Zoning,
} from "@/content/listings";
import type { Locale } from "./i18n";

export type SortKey = "newest" | "price-asc" | "price-desc";

export type Filters = {
  q: string;
  type: PropertyType | "";
  status: ListingStatus | "";
  area: string;
  /** Freehold or leasehold, from the client's brief on land tenure. */
  tenure: Tenure | "";
  /** ITR land designation, so a buyer can screen a plot before planning a build. */
  zoning: Zoning | "";
  priceMin: number | null;
  priceMax: number | null;
  sort: SortKey;
};

export const emptyFilters: Filters = {
  q: "",
  type: "",
  status: "",
  area: "",
  tenure: "",
  zoning: "",
  priceMin: null,
  priceMax: null,
  sort: "newest",
};

export const PROPERTY_TYPES: PropertyType[] = ["villa", "rumah", "tanah", "ruko"];
export const LISTING_STATUSES: ListingStatus[] = ["dijual", "disewa"];
export const TENURES: Tenure[] = ["freehold", "leasehold"];
export const ZONINGS: Zoning[] = ["perumahan", "komersial", "pariwisata"];

/** Areas actually present in the data, so the filter can never offer a dead end. */
export function allAreas(): string[] {
  return [...new Set(listings.map((l) => l.area))].sort((a, b) => a.localeCompare(b));
}

export function allListings(): Listing[] {
  return listings;
}

export function getListing(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}

function haystack(l: Listing, locale: Locale): string {
  return [
    l.title[locale],
    l.title[locale === "id" ? "en" : "id"],
    l.area,
    l.regency,
    l.code,
    l.type,
    l.status,
    l.certificate,
    l.tenure,
    l.zoning ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

export function filterListings(source: Listing[], f: Filters, locale: Locale): Listing[] {
  const q = f.q.trim().toLowerCase();
  const terms = q ? q.split(/\s+/) : [];

  const out = source.filter((l) => {
    if (f.type && l.type !== f.type) return false;
    if (f.status && l.status !== f.status) return false;
    if (f.area && l.area !== f.area) return false;
    if (f.tenure && l.tenure !== f.tenure) return false;
    if (f.zoning && l.zoning !== f.zoning) return false;
    if (f.priceMin !== null && l.price < f.priceMin) return false;
    if (f.priceMax !== null && l.price > f.priceMax) return false;
    if (terms.length) {
      const hay = haystack(l, locale);
      if (!terms.every((t) => hay.includes(t))) return false;
    }
    return true;
  });

  return sortListings(out, f.sort);
}

export function sortListings(source: Listing[], sort: SortKey): Listing[] {
  const out = [...source];
  switch (sort) {
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    default:
      return out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }
}

export function latestVillas(count: number): Listing[] {
  return sortListings(
    listings.filter((l) => l.type === "villa"),
    "newest"
  ).slice(0, count);
}

export function latestListings(count: number): Listing[] {
  return sortListings(listings, "newest").slice(0, count);
}

export function relatedListings(current: Listing, count: number): Listing[] {
  const sameType = listings.filter((l) => l.slug !== current.slug && l.type === current.type);
  const sameArea = listings.filter(
    (l) => l.slug !== current.slug && l.type !== current.type && l.area === current.area
  );
  return [...sortListings(sameType, "newest"), ...sameArea].slice(0, count);
}

export function countByType(): Record<PropertyType, number> {
  const out = { villa: 0, rumah: 0, tanah: 0, ruko: 0 } as Record<PropertyType, number>;
  for (const l of listings) out[l.type]++;
  return out;
}

/* ---------------------------------------------------------------------------
   URL <-> filter state.
   The listing page renders its first result set on the server from these, so a
   filtered link opens already filtered instead of flashing the full list.
   --------------------------------------------------------------------------- */

const SORTS: SortKey[] = ["newest", "price-asc", "price-desc"];

function one(v: string | string[] | undefined): string {
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export function filtersFromParams(params: Record<string, string | string[] | undefined>): Filters {
  const type = one(params.type);
  const status = one(params.status);
  const area = one(params.area);
  const tenure = one(params.tenure);
  const zoning = one(params.zoning);
  const sort = one(params.sort);
  const min = Number(one(params.min).replace(/\D/g, ""));
  const max = Number(one(params.max).replace(/\D/g, ""));

  return {
    q: one(params.q).slice(0, 120),
    type: (PROPERTY_TYPES as string[]).includes(type) ? (type as PropertyType) : "",
    status: (LISTING_STATUSES as string[]).includes(status) ? (status as ListingStatus) : "",
    area: allAreas().includes(area) ? area : "",
    tenure: (TENURES as string[]).includes(tenure) ? (tenure as Tenure) : "",
    zoning: (ZONINGS as string[]).includes(zoning) ? (zoning as Zoning) : "",
    priceMin: Number.isFinite(min) && min > 0 ? min : null,
    priceMax: Number.isFinite(max) && max > 0 ? max : null,
    sort: SORTS.includes(sort as SortKey) ? (sort as SortKey) : "newest",
  };
}

export function filtersToQuery(f: Filters): string {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.type) p.set("type", f.type);
  if (f.status) p.set("status", f.status);
  if (f.area) p.set("area", f.area);
  if (f.tenure) p.set("tenure", f.tenure);
  if (f.zoning) p.set("zoning", f.zoning);
  if (f.priceMin !== null) p.set("min", String(f.priceMin));
  if (f.priceMax !== null) p.set("max", String(f.priceMax));
  if (f.sort !== "newest") p.set("sort", f.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function activeFilterCount(f: Filters): number {
  let n = 0;
  if (f.q.trim()) n++;
  if (f.type) n++;
  if (f.status) n++;
  if (f.area) n++;
  if (f.tenure) n++;
  if (f.zoning) n++;
  if (f.priceMin !== null || f.priceMax !== null) n++;
  return n;
}
