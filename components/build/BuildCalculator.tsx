"use client";

import { useId, useMemo, useState } from "react";
import { WarningCircle, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

import { Listbox } from "../ui/Listbox";
import { formatPrice, groupDigits, parseDigits } from "@/lib/format";
import { estimateMessage, whatsappUrl } from "@/lib/whatsapp";
import { buildPackages, BUILD_AREA_LIMITS, RATES_CONFIRMED } from "@/content/build";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * Build cost estimate.
 *
 * Area times the rate of the chosen package. Deliberately that simple: anything
 * more elaborate would imply a precision the inputs cannot support.
 *
 * While RATES_CONFIRMED is false the rates in content/build.ts are placeholders,
 * and the calculator says so on screen and again inside the WhatsApp message it
 * produces. A number that looks like a quote but is not one is worse than no
 * number at all, so it is never allowed to travel without that caveat.
 */
export function BuildCalculator({
  locale,
  dict,
  pageUrl,
}: {
  locale: Locale;
  dict: Dictionary;
  pageUrl: string;
}) {
  const id = useId();
  const [packageKey, setPackageKey] = useState(buildPackages[1].key as string);
  const [areaText, setAreaText] = useState(String(BUILD_AREA_LIMITS.default));

  const chosen = buildPackages.find((p) => p.key === packageKey) ?? buildPackages[0];

  const area = useMemo(() => {
    const parsed = parseDigits(areaText);
    if (parsed === null) return null;
    return Math.min(BUILD_AREA_LIMITS.max, Math.max(BUILD_AREA_LIMITS.min, parsed));
  }, [areaText]);

  const total = area === null ? null : area * chosen.pricePerSqm;

  const rateText = formatPrice(chosen.pricePerSqm, locale);
  const totalText = total === null ? null : formatPrice(total, locale);

  const waHref =
    area === null || totalText === null
      ? null
      : whatsappUrl(
          estimateMessage(
            locale,
            {
              area,
              packageName: chosen.name[locale],
              rate: rateText,
              total: totalText,
              provisional: !RATES_CONFIRMED,
            },
            { pageUrl, buttonLabel: dict.build.calculator.cta, placement: "build-calculator" }
          ),
          "studio"
        );

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 sm:p-8">
      {!RATES_CONFIRMED ? (
        <p className="mb-6 flex items-start gap-3 rounded-[var(--radius-field)] border border-accent/30 bg-accent/[0.06] p-4 text-[0.875rem] leading-relaxed text-ink">
          <WarningCircle weight="regular" aria-hidden="true" className="mt-0.5 h-[1.125rem] w-[1.125rem] flex-none text-accent-ink" />
          <span>{dict.build.calculator.unconfirmed}</span>
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-area`} className="field-label">
            {dict.build.calculator.areaLabel}
          </label>
          <div className="relative">
            <input
              id={`${id}-area`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={areaText}
              onChange={(event) => setAreaText(groupDigits(event.target.value, locale))}
              aria-describedby={`${id}-area-hint`}
              className="field numeric pr-12"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[0.875rem] text-ink-muted"
            >
              m2
            </span>
          </div>
          <p id={`${id}-area-hint`} className="field-hint">
            {dict.build.calculator.areaHint}
          </p>
        </div>

        <Listbox
          label={dict.build.calculator.packageLabel}
          value={packageKey}
          options={buildPackages.map((p) => ({ value: p.key, label: p.name[locale] }))}
          onChange={setPackageKey}
        />
      </div>

      <dl className="mt-7 border-t border-line pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-[0.9375rem] text-ink-muted">{dict.build.calculator.rateLabel}</dt>
          <dd className="numeric text-[0.9375rem] text-ink">{rateText}</dd>
        </div>

        <div className="mt-5">
          <dt className="text-[0.75rem] font-medium uppercase tracking-[0.08em] text-ink-muted">
            {dict.build.calculator.resultLabel}
          </dt>
          <dd
            aria-live="polite"
            className="numeric mt-1.5 text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] font-medium leading-tight tracking-[-0.025em] text-ink"
          >
            {totalText ?? "-"}
          </dd>
          {area !== null ? (
            <p className="mt-1.5 text-[0.8125rem] text-ink-muted">
              {dict.build.calculator.formula
                .replace("{area}", new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-GB").format(area))
                .replace("{rate}", rateText)}
            </p>
          ) : null}
        </div>
      </dl>

      <p className="mt-5 text-[0.8125rem] leading-relaxed text-ink-muted">{dict.build.calculator.disclaimer}</p>

      {waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn mt-6 w-full sm:w-auto"
          data-variant="primary"
        >
          <WhatsappLogo weight="regular" aria-hidden="true" className="btn__icon" />
          <span>{dict.build.calculator.cta}</span>
        </a>
      ) : null}
    </div>
  );
}
