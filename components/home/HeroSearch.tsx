"use client";

import { useId, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Listbox } from "../ui/Listbox";
import { useTransition } from "../transition/TransitionProvider";
import { LISTING_STATUSES, PROPERTY_TYPES } from "@/lib/listings";
import { path, type Dictionary, type Locale } from "@/lib/i18n";

/**
 * The hero is a search, not a picture with a headline on it. This is the first
 * thing in the viewport after the headline, and it hands straight off to the
 * listing page with the filters already applied.
 */
export function HeroSearch({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { navigate } = useTransition();
  const inputId = useId();

  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const typeOptions = [
    { value: "", label: dict.listings.anyType },
    ...PROPERTY_TYPES.map((t) => ({ value: t, label: dict.type[t] })),
  ];

  const statusOptions = [
    { value: "", label: dict.listings.anyStatus },
    ...LISTING_STATUSES.map((s) => ({ value: s, label: dict.status[s] })),
  ];

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    const query = params.toString();
    navigate(path(locale, "listings") + (query ? `?${query}` : ""));
  };

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label={dict.home.searchLabel}
      className="rounded-[var(--radius-card)] border border-line bg-white p-3.5 sm:p-5"
    >
      {/*
        Status and type are hidden on the narrowest screens. The hero has to
        stay one screen tall with the cookie banner up, and on a phone the
        search box is the thing that has to survive that squeeze. Both filters
        are the first controls on the listing page the search lands on.
      */}
      <div className="hidden grid-cols-2 gap-2.5 sm:grid sm:gap-3">
        <Listbox
          label={dict.listings.status}
          value={status}
          options={statusOptions}
          onChange={setStatus}
          placeholder={dict.listings.anyStatus}
        />
        <Listbox
          label={dict.listings.type}
          value={type}
          options={typeOptions}
          onChange={setType}
          placeholder={dict.listings.anyType}
        />
      </div>

      <div className="sm:mt-3">
        <label htmlFor={inputId} className="field-label">
          {dict.listings.search}
        </label>
        <input
          id={inputId}
          type="search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder={dict.home.searchPlaceholder}
          className="field"
          autoComplete="off"
        />
      </div>

      <button type="submit" className="btn mt-3 w-full sm:mt-4" data-variant="primary">
        <MagnifyingGlass weight="regular" aria-hidden="true" className="btn__icon" />
        <span>{dict.home.searchSubmit}</span>
      </button>
    </form>
  );
}
