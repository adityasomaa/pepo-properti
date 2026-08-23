import { site } from "@/content/site";
import type { Locale } from "./i18n";

export type InquirySource = {
  /** Absolute URL of the page the visitor pressed the button on. */
  pageUrl: string;
  /** The button's own label, so two buttons on one page stay distinguishable. */
  buttonLabel: string;
};

export type InquiryListing = {
  code: string;
  title: string;
};

/**
 * Every WhatsApp message carries three things the agent can act on:
 * what the visitor is asking about, the exact page they were on, and which
 * button they pressed. Nothing else is added.
 */
export function inquiryMessage(
  locale: Locale,
  source: InquirySource,
  listing?: InquiryListing
): string {
  const t =
    locale === "id"
      ? {
          hello: "Halo Pepo Properti,",
          aboutListing: "Saya ingin bertanya tentang properti ini:",
          aboutGeneral: "Saya ingin bertanya tentang properti yang tersedia.",
          code: "Kode listing",
          page: "Halaman",
          from: "Dikirim dari tombol",
        }
      : {
          hello: "Hello Pepo Properti,",
          aboutListing: "I would like to ask about this property:",
          aboutGeneral: "I would like to ask about the properties you have available.",
          code: "Listing code",
          page: "Page",
          from: "Sent from button",
        };

  const lines: string[] = [t.hello, ""];

  if (listing) {
    lines.push(t.aboutListing, listing.title, `${t.code}: ${listing.code}`);
  } else {
    lines.push(t.aboutGeneral);
  }

  lines.push("", `${t.page}: ${source.pageUrl}`, `${t.from}: ${source.buttonLabel}`);

  return lines.join("\n");
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Message used by the property submission form. */
export function submissionMessage(
  locale: Locale,
  data: {
    name: string;
    phone: string;
    type: string;
    status: string;
    location: string;
    price: string;
    notes: string;
  },
  source: InquirySource
): string {
  const t =
    locale === "id"
      ? {
          hello: "Halo Pepo Properti,",
          intro: "Saya ingin menitipkan properti berikut:",
          name: "Nama",
          phone: "Nomor WhatsApp",
          type: "Tipe properti",
          status: "Untuk",
          location: "Lokasi",
          price: "Perkiraan harga",
          notes: "Keterangan",
          page: "Halaman",
          from: "Dikirim dari tombol",
        }
      : {
          hello: "Hello Pepo Properti,",
          intro: "I would like to list the following property with you:",
          name: "Name",
          phone: "WhatsApp number",
          type: "Property type",
          status: "Listing as",
          location: "Area",
          price: "Price expectation",
          notes: "Details",
          page: "Page",
          from: "Sent from button",
        };

  const lines = [t.hello, "", t.intro, "", `${t.name}: ${data.name}`, `${t.phone}: ${data.phone}`, `${t.type}: ${data.type}`, `${t.status}: ${data.status}`, `${t.location}: ${data.location}`];

  if (data.price) lines.push(`${t.price}: ${data.price}`);
  if (data.notes) lines.push("", `${t.notes}:`, data.notes);

  lines.push("", `${t.page}: ${source.pageUrl}`, `${t.from}: ${source.buttonLabel}`);
  return lines.join("\n");
}
