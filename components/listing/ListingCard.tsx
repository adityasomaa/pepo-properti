import { Bed, Shower, Ruler } from "@phosphor-icons/react/dist/ssr";
import { Photo } from "@/components/media/Photo";
import { AppLink } from "../AppLink";
import { formatArea, formatPrice, priceUnitSuffix } from "@/lib/format";
import { path, type Dictionary, type Locale } from "@/lib/i18n";
import type { Listing } from "@/content/listings";

/**
 * Status and price both carry a written label, never colour alone: the tag
 * spells out "for sale" or "for rent", and the figure is introduced by the word
 * "price". Someone who cannot tell the two tag colours apart loses nothing.
 */
export function ListingCard({
  listing,
  locale,
  dict,
  priority = false,
}: {
  listing: Listing;
  locale: Locale;
  dict: Dictionary;
  priority?: boolean;
}) {
  const href = path(locale, "listings", listing.slug);
  const suffix = priceUnitSuffix(listing.priceUnit, locale);
  const forSale = listing.status === "dijual";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-colors duration-300 hover:border-ink/35 focus-within:border-ink/35">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
        <Photo
          album={listing.images[0].album}
          slug={listing.images[0].slug}
          alt={`${dict.type[listing.type]}, ${listing.area}`}
          priority={priority}
          /* Three across on a desktop, two on a tablet, one on a phone. */
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="tag" data-tone={forSale ? "sale" : "rent"}>
            {dict.status[listing.status]}
          </span>
          <span className="tag" data-tone="rent">
            {dict.type[listing.type]}
          </span>
        </div>

        {/* Two lines are reserved whether or not the title needs them, so a one-line
            title and a two-line title still line their specs and prices up. */}
        <h3 className="mt-3.5 min-h-[2.7em] text-[1.0625rem] font-medium leading-[1.35] tracking-[-0.015em] text-ink">
          <AppLink href={href} className="line-clamp-2 after:absolute after:inset-0 after:content-['']">
            {listing.title[locale]}
          </AppLink>
        </h3>

        <p className="mt-1.5 text-[0.875rem] text-ink-muted">
          {listing.area}, {listing.regency}
        </p>

        <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.8125rem] text-ink-muted">
          {listing.bedrooms !== null ? (
            <div className="flex items-center gap-1.5">
              <Bed weight="regular" aria-hidden="true" className="h-4 w-4 flex-none" />
              <dt className="sr-only-focusable">{dict.listing.bedrooms}</dt>
              <dd className="numeric">{listing.bedrooms}</dd>
            </div>
          ) : null}
          {listing.bathrooms !== null ? (
            <div className="flex items-center gap-1.5">
              <Shower weight="regular" aria-hidden="true" className="h-4 w-4 flex-none" />
              <dt className="sr-only-focusable">{dict.listing.bathrooms}</dt>
              <dd className="numeric">{listing.bathrooms}</dd>
            </div>
          ) : null}
          <div className="flex items-center gap-1.5">
            <Ruler weight="regular" aria-hidden="true" className="h-4 w-4 flex-none" />
            <dt className="sr-only-focusable">{dict.listing.landSize}</dt>
            <dd className="numeric">{formatArea(listing.landSize, locale)}</dd>
          </div>
        </dl>

        <div className="mt-auto pt-5">
          <p className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-ink-muted">
            {dict.listing.priceLabel}
          </p>
          <p className="mt-1 text-[1.25rem] font-medium leading-tight tracking-[-0.02em] text-ink">
            <span className="numeric">{formatPrice(listing.price, locale)}</span>
            {suffix ? <span className="ml-1.5 text-[0.875rem] font-normal text-ink-muted">{suffix}</span> : null}
          </p>
        </div>
      </div>
    </article>
  );
}
