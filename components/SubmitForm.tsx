"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { WarningCircle, WhatsappLogo, ArrowClockwise } from "@phosphor-icons/react/dist/ssr";

import { Listbox } from "./ui/Listbox";
import { PriceInput } from "./ui/PriceInput";
import { submitProperty } from "@/app/[locale]/submit-property/actions";
import { initialSubmitState } from "@/lib/submit-state";
import { LISTING_STATUSES, PROPERTY_TYPES } from "@/lib/listings";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * The form checks itself as you go, but the server checks everything again and
 * builds the outgoing message from what it accepted. What the browser reports
 * here is a courtesy; the action is the authority.
 */
export function SubmitForm({
  locale,
  dict,
  pageUrl,
}: {
  locale: Locale;
  dict: Dictionary;
  pageUrl: string;
}) {
  const [state, formAction, pending] = useActionState(submitProperty, initialSubmitState);

  const formId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);

  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [price, setPrice] = useState<number | null>(null);

  const buttonLabel = dict.submit.submit;

  // Once the server accepts it, hand off to WhatsApp. If the browser blocks the
  // handoff, the button below is the visitor's way through.
  useEffect(() => {
    if (state.status === "ready" && state.waUrl) {
      window.open(state.waUrl, "_blank", "noopener,noreferrer");
    }
  }, [state.status, state.waUrl]);

  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
  }, [state]);

  const err = (key: keyof typeof state.errors) => {
    const code = state.errors[key];
    if (!code) return null;
    return dict.submit.errors[code as keyof typeof dict.submit.errors] ?? dict.submit.errors.generic;
  };

  if (state.status === "ready") {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 sm:p-8">
        <h2 className="text-[1.375rem] font-medium tracking-[-0.02em] text-ink">
          {dict.submit.successHeadline}
        </h2>
        <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-muted">
          {dict.submit.successBody}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={state.waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            data-variant="primary"
          >
            <WhatsappLogo weight="regular" aria-hidden="true" className="btn__icon" />
            <span>{dict.submit.successOpen}</span>
          </a>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn"
            data-variant="secondary"
          >
            <ArrowClockwise weight="regular" aria-hidden="true" className="btn__icon" />
            <span>{dict.submit.successAgain}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      aria-label={dict.submit.formLabel}
      className="rounded-[var(--radius-card)] border border-line bg-white p-6 sm:p-8"
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="pageUrl" value={pageUrl} />
      <input type="hidden" name="buttonLabel" value={buttonLabel} />

      {/*
        Honeypot. Hidden with the clip technique, not a negative absolute
        offset: an absolutely positioned element at left:-9999px with no
        positioned ancestor escapes to the document and drags a horizontal
        scrollbar onto every page it appears on.
      */}
      <div className="honeypot" aria-hidden="true">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input id={`${formId}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-[var(--radius-field)] border border-accent/35 bg-accent/[0.06] p-4"
        >
          <WarningCircle weight="regular" aria-hidden="true" className="mt-0.5 h-5 w-5 flex-none text-accent-ink" />
          <div>
            <p className="text-[0.9375rem] font-medium text-accent-ink">{dict.submit.errorTitle}</p>
            {state.errors.form ? (
              <p className="mt-1 text-[0.875rem] text-ink">{dict.submit.errors.generic}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-name`} className="field-label">
            {dict.submit.name}
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            required
            maxLength={80}
            autoComplete="name"
            placeholder={dict.submit.namePlaceholder}
            aria-invalid={err("name") ? true : undefined}
            aria-describedby={err("name") ? `${formId}-name-error` : undefined}
            className="field"
          />
          {err("name") ? (
            <p id={`${formId}-name-error`} className="field-error">
              {err("name")}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-phone`} className="field-label">
            {dict.submit.phone}
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            required
            maxLength={25}
            autoComplete="tel"
            placeholder={dict.submit.phonePlaceholder}
            aria-invalid={err("phone") ? true : undefined}
            aria-describedby={err("phone") ? `${formId}-phone-error` : undefined}
            className="field"
          />
          {err("phone") ? (
            <p id={`${formId}-phone-error`} className="field-error">
              {err("phone")}
            </p>
          ) : null}
        </div>

        <div>
          <Listbox
            label={dict.submit.type}
            name="type"
            value={type}
            options={PROPERTY_TYPES.map((t) => ({ value: t, label: dict.type[t] }))}
            onChange={setType}
            placeholder={dict.submit.selectType}
          />
          {err("type") ? <p className="field-error">{err("type")}</p> : null}
        </div>

        <div>
          <Listbox
            label={dict.submit.status}
            name="status"
            value={status}
            options={LISTING_STATUSES.map((s) => ({ value: s, label: dict.status[s] }))}
            onChange={setStatus}
            placeholder={dict.submit.selectStatus}
          />
          {err("status") ? <p className="field-error">{err("status")}</p> : null}
        </div>

        <div>
          <label htmlFor={`${formId}-location`} className="field-label">
            {dict.submit.location}
          </label>
          <input
            id={`${formId}-location`}
            name="location"
            type="text"
            required
            maxLength={80}
            placeholder={dict.submit.locationPlaceholder}
            aria-invalid={err("location") ? true : undefined}
            aria-describedby={err("location") ? `${formId}-location-error` : undefined}
            className="field"
          />
          {err("location") ? (
            <p id={`${formId}-location-error`} className="field-error">
              {err("location")}
            </p>
          ) : null}
        </div>

        <div>
          <PriceInput
            label={dict.submit.price}
            value={price}
            onChange={setPrice}
            locale={locale}
            placeholder={dict.submit.pricePlaceholder}
          />
          <input type="hidden" name="price" value={price ?? ""} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor={`${formId}-notes`} className="field-label">
          {dict.submit.notes}
        </label>
        <textarea
          id={`${formId}-notes`}
          name="notes"
          maxLength={1200}
          rows={5}
          placeholder={dict.submit.notesPlaceholder}
          aria-invalid={err("notes") ? true : undefined}
          aria-describedby={err("notes") ? `${formId}-notes-error` : undefined}
          className="field"
        />
        {err("notes") ? (
          <p id={`${formId}-notes-error`} className="field-error">
            {err("notes")}
          </p>
        ) : null}
      </div>

      <button type="submit" disabled={pending} className="btn mt-6 w-full sm:w-auto" data-variant="primary">
        <WhatsappLogo weight="regular" aria-hidden="true" className="btn__icon" />
        <span>{pending ? dict.submit.submitting : buttonLabel}</span>
      </button>
    </form>
  );
}
