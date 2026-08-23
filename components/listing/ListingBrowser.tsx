"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { FunnelSimple, X, ArrowClockwise } from "@phosphor-icons/react/dist/ssr";

import { Listbox } from "../ui/Listbox";
import { PriceInput } from "../ui/PriceInput";
import { Reveal } from "../ui/Reveal";
import { ListingCard } from "./ListingCard";
import { WhatsAppLink } from "../WhatsAppLink";
import { useOverlay } from "../providers/OverlayProvider";
import {
  emptyFilters,
  filterListings,
  filtersToQuery,
  activeFilterCount,
  LISTING_STATUSES,
  PROPERTY_TYPES,
  TENURES,
  ZONINGS,
  type Filters,
  type SortKey,
} from "@/lib/listings";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Listing } from "@/content/listings";

/**
 * Search and filtering run in the browser over a list the server already sent.
 *
 * The server does the first pass from the query string, so a shared filtered
 * link opens already filtered instead of flashing the full set and then
 * narrowing. From then on it is all local: results update as you type, and the
 * URL is kept in step with history.replaceState rather than a router push, so
 * changing a filter never triggers a page transition.
 */
export function ListingBrowser({
  listings,
  initialFilters,
  areas,
  locale,
  dict,
  pageUrl,
}: {
  listings: Listing[];
  initialFilters: Filters;
  areas: string[];
  locale: Locale;
  dict: Dictionary;
  pageUrl: string;
}) {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [panelOpen, setPanelOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const panelTriggerRef = useRef<HTMLButtonElement>(null);
  const resultsId = useId();

  useOverlay("filter-panel", panelOpen);

  const results = useMemo(
    () => filterListings(listings, filters, locale),
    [listings, filters, locale]
  );

  // Keep the address bar in step so the current view is always shareable.
  useEffect(() => {
    const query = filtersToQuery(filters);
    const next = window.location.pathname + query;
    if (next !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", next);
    }
  }, [filters]);

  const set = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => setFilters(emptyFilters), []);

  // Panel: Escape closes, focus stays inside, focus returns to the trigger.
  useEffect(() => {
    if (!panelOpen) return;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("button, input, [tabindex]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Let an open listbox inside the panel take the first Escape.
        if ((event.target as HTMLElement)?.closest('[role="listbox"]')) return;
        event.preventDefault();
        setPanelOpen(false);
        panelTriggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [panelOpen]);

  const typeOptions = [
    { value: "", label: dict.listings.anyType },
    ...PROPERTY_TYPES.map((t) => ({ value: t, label: dict.type[t] })),
  ];
  const statusOptions = [
    { value: "", label: dict.listings.anyStatus },
    ...LISTING_STATUSES.map((s) => ({ value: s, label: dict.status[s] })),
  ];
  const areaOptions = [
    { value: "", label: dict.listings.anyLocation },
    ...areas.map((a) => ({ value: a, label: a })),
  ];
  // Tenure and zoning come from the brief: a buyer screens the legal status of a
  // plot before anyone starts drawing on it.
  const tenureOptions = [
    { value: "", label: dict.listings.anyTenure },
    ...TENURES.map((t) => ({ value: t, label: dict.tenure[t] })),
  ];
  const zoningOptions = [
    { value: "", label: dict.listings.anyZoning },
    ...ZONINGS.map((z) => ({ value: z, label: dict.zoning[z] })),
  ];
  const sortOptions: { value: SortKey; label: string }[] = [
    { value: "newest", label: dict.listings.sortNewest },
    { value: "price-asc", label: dict.listings.sortPriceAsc },
    { value: "price-desc", label: dict.listings.sortPriceDesc },
  ];

  const activeCount = activeFilterCount(filters);

  const controls = (
    <div className="space-y-5">
      <div>
        <label htmlFor={`${resultsId}-q`} className="field-label">
          {dict.listings.search}
        </label>
        <input
          id={`${resultsId}-q`}
          type="search"
          value={filters.q}
          onChange={(event) => set("q", event.target.value)}
          placeholder={dict.listings.searchPlaceholder}
          className="field"
          autoComplete="off"
        />
      </div>

      <Listbox
        label={dict.listings.type}
        value={filters.type}
        options={typeOptions}
        onChange={(value) => set("type", value as Filters["type"])}
        placeholder={dict.listings.anyType}
      />

      <Listbox
        label={dict.listings.status}
        value={filters.status}
        options={statusOptions}
        onChange={(value) => set("status", value as Filters["status"])}
        placeholder={dict.listings.anyStatus}
      />

      <Listbox
        label={dict.listings.location}
        value={filters.area}
        options={areaOptions}
        onChange={(value) => set("area", value)}
        placeholder={dict.listings.anyLocation}
      />

      <Listbox
        label={dict.listings.tenure}
        value={filters.tenure}
        options={tenureOptions}
        onChange={(value) => set("tenure", value as Filters["tenure"])}
        placeholder={dict.listings.anyTenure}
      />

      <Listbox
        label={dict.listings.zoning}
        value={filters.zoning}
        options={zoningOptions}
        onChange={(value) => set("zoning", value as Filters["zoning"])}
        placeholder={dict.listings.anyZoning}
      />

      <fieldset>
        <legend className="field-label">{dict.listings.priceRange}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <PriceInput
            label={dict.listings.priceMin}
            value={filters.priceMin}
            onChange={(value) => set("priceMin", value)}
            locale={locale}
            placeholder="0"
          />
          <PriceInput
            label={dict.listings.priceMax}
            value={filters.priceMax}
            onChange={(value) => set("priceMax", value)}
            locale={locale}
            placeholder="0"
            hint={dict.listings.priceHint}
          />
        </div>
      </fieldset>

      <button type="button" onClick={reset} className="btn w-full" data-variant="secondary">
        <ArrowClockwise weight="regular" aria-hidden="true" className="btn__icon" />
        <span>{dict.listings.resetFilters}</span>
      </button>
    </div>
  );

  const countLabel =
    results.length === 1
      ? dict.listings.resultsOne
      : dict.listings.resultsMany.replace("{n}", String(results.length));

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
      {/* Desktop filters. On small screens the same controls live in the panel. */}
      <aside className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+1.5rem)]">
          <h2 className="text-[0.75rem] font-medium uppercase tracking-[0.09em] text-ink-muted">
            {dict.listings.filters}
          </h2>
          <div className="mt-5">{controls}</div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-[0.9375rem] text-ink-muted">
            <span className="numeric">{countLabel}</span>
          </p>

          <div className="flex items-center gap-2">
            <div className="w-[10.5rem]">
              <Listbox
                label={dict.listings.sort}
                hideLabel
                value={filters.sort}
                options={sortOptions}
                onChange={(value) => set("sort", value as SortKey)}
                triggerClassName="min-h-[2.5rem] py-1.5 text-[0.875rem]"
              />
            </div>

            <button
              ref={panelTriggerRef}
              type="button"
              onClick={() => setPanelOpen(true)}
              aria-expanded={panelOpen}
              aria-controls="filter-panel"
              className="btn lg:hidden"
              data-variant="secondary"
            >
              <FunnelSimple weight="regular" aria-hidden="true" className="btn__icon" />
              <span>
                {dict.listings.filters}
                {activeCount ? ` (${activeCount})` : ""}
              </span>
            </button>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-white p-8 text-center">
            <h3 className="text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
              {dict.listings.emptyHeadline}
            </h3>
            <p className="mx-auto mt-2 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-muted">
              {dict.listings.emptyBody}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={reset} className="btn" data-variant="secondary">
                {dict.listings.emptyCta}
              </button>
              <WhatsAppLink
                locale={locale}
                pageUrl={pageUrl}
                buttonLabel={dict.common.askWhatsApp}
                placement="listings-no-results"
                division="pro"
                variant="primary"
              />
            </div>
          </div>
        ) : (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((listing, index) => (
              <li key={listing.slug}>
                <Reveal delay={Math.min(index, 5) * 70}>
                  <ListingCard listing={listing} locale={locale} dict={dict} priority={index < 2} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mobile filter panel. Above the header, below the menu, scroll locked. */}
      {panelOpen ? (
        <div
          id="filter-panel"
          role="dialog"
          aria-modal="true"
          aria-label={dict.listings.filterPanelLabel}
          className="fixed inset-0 z-[var(--z-filter)] bg-paper lg:hidden"
        >
          <div ref={panelRef} className="flex h-[100svh] flex-col">
            <div className="container flex h-[var(--header-h)] flex-none items-center justify-between border-b border-line">
              <h2 className="text-[1.0625rem] font-medium text-ink">{dict.listings.filters}</h2>
              <button
                type="button"
                onClick={() => {
                  setPanelOpen(false);
                  panelTriggerRef.current?.focus();
                }}
                className="btn"
                data-variant="secondary"
              >
                <X weight="regular" aria-hidden="true" className="btn__icon" />
                <span>{dict.listings.closeFilters}</span>
              </button>
            </div>

            <div className="container flex-1 overflow-y-auto py-6">{controls}</div>

            <div className="container flex-none border-t border-line py-4">
              <button
                type="button"
                onClick={() => {
                  setPanelOpen(false);
                  panelTriggerRef.current?.focus();
                }}
                className="btn w-full"
                data-variant="primary"
              >
                {dict.listings.applyFilters} <span className="numeric">({results.length})</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
