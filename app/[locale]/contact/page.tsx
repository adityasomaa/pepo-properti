import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Phone, Clock } from "@phosphor-icons/react/dist/ssr";

import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { getDict, isLocale, path, type Locale } from "@/lib/i18n";
import { site } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);
  const url = path(locale, "contact");

  return {
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
    alternates: {
      canonical: url,
      languages: { id: "/id/contact", en: "/en/contact", "x-default": "/id/contact" },
    },
    openGraph: {
      title: `${dict.contact.metaTitle} | ${site.name}`,
      description: dict.contact.metaDescription,
      url,
      images: [{ url: "/og/default.png", width: 1200, height: 630, alt: site.name }],
    },
  };
}

const WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDict(locale);
  const pageUrl = site.url + path(locale, "contact");

  const openSlot = site.hours[0];
  const isOpenDay = (day: string) => (openSlot.days as readonly string[]).includes(day);

  return (
    <div className="container pt-12 md:pt-20">
      <Reveal>
        <SectionHeader
          as="h1"
          label={dict.contact.label}
          headline={dict.contact.headline}
          description={dict.contact.description}
          cta={
            <WhatsAppLink
              locale={locale}
              pageUrl={pageUrl}
              buttonLabel={dict.contact.cta}
              variant="primary"
            />
          }
        />
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:gap-8">
        <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
          <h2 className="flex items-center gap-2.5 text-[1.0625rem] font-medium text-ink">
            <MapPin weight="regular" aria-hidden="true" className="h-5 w-5 flex-none text-ink-muted" />
            {dict.contact.address}
          </h2>
          <address className="mt-3 not-italic text-[0.9375rem] leading-relaxed text-ink-muted">
            {site.legalName}
            <br />
            {site.address.street}
            <br />
            {site.address.locality}
            <br />
            {site.address.region} {site.address.postalCode}, {site.address.countryName[locale]}
          </address>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mt-5"
            data-variant="secondary"
          >
            <MapPin weight="regular" aria-hidden="true" className="btn__icon" />
            <span>{dict.contact.openMaps}</span>
          </a>
        </div>

        <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
          <h2 className="flex items-center gap-2.5 text-[1.0625rem] font-medium text-ink">
            <Clock weight="regular" aria-hidden="true" className="h-5 w-5 flex-none text-ink-muted" />
            {dict.contact.hours}
          </h2>
          <dl className="mt-3 space-y-1.5 text-[0.9375rem]">
            {WEEK.map((day) => (
              <div key={day} className="flex items-baseline justify-between gap-4 border-b border-line pb-1.5 last:border-b-0">
                <dt className="text-ink-muted">{dict.contact.days[day]}</dt>
                <dd className={isOpenDay(day) ? "numeric text-ink" : "text-ink-muted"}>
                  {isOpenDay(day) ? `${openSlot.opens} - ${openSlot.closes}` : dict.contact.closed}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 md:col-span-2">
          <h2 className="flex items-center gap-2.5 text-[1.0625rem] font-medium text-ink">
            <Phone weight="regular" aria-hidden="true" className="h-5 w-5 flex-none text-ink-muted" />
            {dict.contact.phone}
          </h2>
          <p className="mt-3 text-[0.9375rem] text-ink-muted">
            <a href={site.phoneHref} className="numeric text-accent-ink underline">
              {site.phoneDisplay}
            </a>
          </p>
          <div className="mt-5">
            <WhatsAppLink
              locale={locale}
              pageUrl={pageUrl}
              buttonLabel={dict.contact.whatsapp}
              variant="secondary"
            >
              {dict.contact.whatsapp}
            </WhatsAppLink>
          </div>
        </div>
      </div>

      <BreadcrumbSchema
        items={[
          { name: dict.nav.home, url: site.url + path(locale, "home") },
          { name: dict.nav.contact, url: pageUrl },
        ]}
      />
    </div>
  );
}
