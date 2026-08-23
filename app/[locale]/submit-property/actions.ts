"use server";

import { submissionMessage, whatsappUrl } from "@/lib/whatsapp";
import { getDict, isLocale, type Locale } from "@/lib/i18n";
import { LISTING_STATUSES, PROPERTY_TYPES } from "@/lib/listings";
import { formatPrice } from "@/lib/format";
import type { SubmitState } from "@/lib/submit-state";

/**
 * Server-side validation.
 *
 * The browser checks the same fields for immediate feedback, but nothing is
 * trusted until it has been through here: field presence, length ceilings, the
 * phone number's character set, and membership of the two closed vocabularies.
 * The outgoing message is assembled here as well, from the values that passed,
 * so nothing the visitor typed reaches WhatsApp unchecked.
 */

const MAX = { name: 80, location: 80, notes: 1200, phone: 25 };
const PHONE = /^[0-9+\-\s()]{6,25}$/;

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

export async function submitProperty(
  _previous: SubmitState,
  form: FormData
): Promise<SubmitState> {
  const rawLocale = text(form, "locale");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "id";
  const dict = getDict(locale);

  // Honeypot. A real visitor never sees this field, so anything in it is a bot.
  if (text(form, "company")) {
    return { status: "error", errors: { form: "generic" } };
  }

  const name = text(form, "name");
  const phone = text(form, "phone");
  const type = text(form, "type");
  const status = text(form, "status");
  const location = text(form, "location");
  const price = text(form, "price").replace(/\D/g, "");
  const notes = (form.get("notes") as string | null)?.trim() ?? "";

  const errors: SubmitState["errors"] = {};

  if (!name) errors.name = "name";
  else if (name.length > MAX.name) errors.name = "nameLong";

  if (!phone) errors.phone = "phone";
  else if (phone.length > MAX.phone || !PHONE.test(phone)) errors.phone = "phoneFormat";

  if (!(PROPERTY_TYPES as string[]).includes(type)) errors.type = "type";
  if (!(LISTING_STATUSES as string[]).includes(status)) errors.status = "status";

  if (!location) errors.location = "location";
  else if (location.length > MAX.location) errors.location = "location";

  if (notes.length > MAX.notes) errors.notes = "notesLong";

  if (Object.keys(errors).length) {
    return { status: "error", errors };
  }

  const pageUrl = text(form, "pageUrl");
  const buttonLabel = text(form, "buttonLabel") || dict.submit.submit;
  const placement = text(form, "placement") || "submit-form";

  const message = submissionMessage(
    locale,
    {
      name,
      phone,
      type: dict.type[type as keyof typeof dict.type],
      status: dict.status[status as keyof typeof dict.status],
      location,
      price: price ? formatPrice(Number(price), locale) : "",
      notes,
    },
    { pageUrl, buttonLabel, placement }
  );

  return { status: "ready", errors: {}, waUrl: whatsappUrl(message) };
}
