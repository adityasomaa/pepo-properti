import { site, type Division } from "@/content/site";
import type { Locale } from "./i18n";

/**
 * Every WhatsApp message this site produces.
 *
 * Two things run through all of them. Each message names the page it came from
 * and the button that was pressed, so an enquiry can be traced back precisely.
 * And each is addressed to one of the two divisions: Korva Pro takes property
 * questions, Korva Studio takes design, build, and permit questions, so nobody
 * has to be forwarded on arrival.
 */

export type InquirySource = {
  /** Absolute URL of the page the visitor pressed the button on. */
  pageUrl: string;
  /** The button's own label, as the visitor read it. */
  buttonLabel: string;
  /**
   * Where on the page that button sits: header, footer, floating, listing, and
   * so on. Several buttons deliberately share one label, because one intent
   * should have one wording, so the label alone cannot identify which one was
   * pressed. This can.
   */
  placement: string;
};

export type InquiryListing = {
  code: string;
  title: string;
};

export type BuildEstimate = {
  /** Building area in square metres. */
  area: number;
  packageName: string;
  /** Already formatted for reading, e.g. "Rp 9.500.000". */
  rate: string;
  /** Already formatted for reading. */
  total: string;
  /** True while the rates are still placeholders. Says so in the message. */
  provisional: boolean;
};

function strings(locale: Locale) {
  return locale === "id"
    ? {
        hello: "Halo KORVA,",
        aboutListing: "Saya ingin bertanya tentang properti ini:",
        aboutGeneral: "Saya ingin bertanya tentang properti yang tersedia.",
        aboutBuild: "Saya ingin berkonsultasi soal desain dan pembangunan.",
        estimateIntro: "Saya mencoba kalkulator estimasi bangun dengan hasil berikut:",
        area: "Luas bangunan",
        pkg: "Paket",
        rate: "Tarif per m2",
        total: "Perkiraan biaya",
        provisional: "Catatan: tarif di situs masih angka contoh, mohon dikonfirmasi.",
        code: "Kode listing",
        page: "Halaman",
        from: "Dikirim dari tombol",
      }
    : {
        hello: "Hello KORVA,",
        aboutListing: "I would like to ask about this property:",
        aboutGeneral: "I would like to ask about the properties you have available.",
        aboutBuild: "I would like to talk about design and construction.",
        estimateIntro: "I used the build cost calculator and got the following:",
        area: "Building area",
        pkg: "Package",
        rate: "Rate per m2",
        total: "Estimated cost",
        provisional: "Note: the rates on the site are still placeholder figures, please confirm.",
        code: "Listing code",
        page: "Page",
        from: "Sent from button",
      };
}

function trace(t: ReturnType<typeof strings>, source: InquirySource): string[] {
  return ["", `${t.page}: ${source.pageUrl}`, `${t.from}: ${source.buttonLabel} (${source.placement})`];
}

export function inquiryMessage(
  locale: Locale,
  source: InquirySource,
  listing?: InquiryListing,
  division: Division = "pro"
): string {
  const t = strings(locale);
  const lines: string[] = [t.hello, ""];

  if (listing) {
    lines.push(t.aboutListing, listing.title, `${t.code}: ${listing.code}`);
  } else if (division === "studio") {
    lines.push(t.aboutBuild);
  } else {
    lines.push(t.aboutGeneral);
  }

  lines.push(...trace(t, source));
  return lines.join("\n");
}

/** Message from the build cost calculator, always to Korva Studio. */
export function estimateMessage(
  locale: Locale,
  estimate: BuildEstimate,
  source: InquirySource
): string {
  const t = strings(locale);
  const lines = [
    t.hello,
    "",
    t.estimateIntro,
    "",
    `${t.area}: ${estimate.area} m2`,
    `${t.pkg}: ${estimate.packageName}`,
    `${t.rate}: ${estimate.rate}`,
    `${t.total}: ${estimate.total}`,
  ];

  if (estimate.provisional) lines.push("", t.provisional);
  lines.push(...trace(t, source));
  return lines.join("\n");
}

/** Message used by the property submission form, always to Korva Pro. */
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
          hello: "Halo Korva Pro,",
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
          hello: "Hello Korva Pro,",
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

  const lines = [
    t.hello,
    "",
    t.intro,
    "",
    `${t.name}: ${data.name}`,
    `${t.phone}: ${data.phone}`,
    `${t.type}: ${data.type}`,
    `${t.status}: ${data.status}`,
    `${t.location}: ${data.location}`,
  ];

  if (data.price) lines.push(`${t.price}: ${data.price}`);
  if (data.notes) lines.push("", `${t.notes}:`, data.notes);

  lines.push(
    "",
    `${t.page}: ${source.pageUrl}`,
    `${t.from}: ${source.buttonLabel} (${source.placement})`
  );
  return lines.join("\n");
}

/** Builds the deep link, addressed to the division that should answer. */
export function whatsappUrl(message: string, division: Division = "pro"): string {
  return `https://wa.me/${site.divisions[division].whatsapp}?text=${encodeURIComponent(message)}`;
}
