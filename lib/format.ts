import type { Locale } from "./i18n";
import type { PriceUnit } from "@/content/listings";

const NUMBER_LOCALE: Record<Locale, string> = { id: "id-ID", en: "en-GB" };

/** Rupiah, grouped the way the reader's language groups digits. */
export function formatPrice(value: number, locale: Locale): string {
  return "Rp " + new Intl.NumberFormat(NUMBER_LOCALE[locale]).format(value);
}

/** Digit grouping only. Used by the price inputs, which keep the raw number
 *  separately and only ever display this. */
export function groupDigits(raw: string, locale: Locale): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return new Intl.NumberFormat(NUMBER_LOCALE[locale]).format(Number(digits));
}

/** The inverse of groupDigits: what the maths actually runs on. */
export function parseDigits(display: string): number | null {
  const digits = display.replace(/\D/g, "");
  return digits ? Number(digits) : null;
}

export function formatArea(value: number, locale: Locale): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[locale]).format(value) + " m2";
}

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(NUMBER_LOCALE[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso + "T00:00:00Z"));
}

export function priceUnitSuffix(unit: PriceUnit, locale: Locale): string {
  const map: Record<Locale, Record<PriceUnit, string>> = {
    id: { total: "", per_tahun: "per tahun", per_bulan: "per bulan" },
    en: { total: "", per_tahun: "per year", per_bulan: "per month" },
  };
  return map[locale][unit];
}
