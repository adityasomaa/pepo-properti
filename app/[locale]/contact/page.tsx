import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Phone, Clock, Buildings, Compass } from "@phosphor-icons/react/dist/ssr";

import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { getDict, isLocale, path, type Locale } from "@/lib/i18n";
import { site, divisionList } from "@/content/site";

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
const DIVISION_ICON = { pro: Buildings, studio: Compass } as const;

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDict(locale);
  const pageUrl = site.url + path(locale, "contact");

  const openSlot = site.hours[0];
  const isOpenDay = (day: string) => (openSlot.days as readonly string[]).includes(day);
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;

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
              placement="contact-header"
              division="pro"
              variant="primary"
            />
          }
        />
      </Reveal>

      {/* One card per division, each with its own number, so nobody has to be
          forwarded on arrival. */}
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {divisionList.map((division, index) => {
          const Icon = DIVISION_ICON[division.key];
          return (
            <Reveal key={division.key} delay={index * 80} className="h-full">
              <section
                aria-labelledby={`division-${division.key}`}
                className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 sm:p-8"
              >
                <p className="flex items-center gap-2.5 text-[0.75rem] font-medium uppercase tracking-[0.09em] text-ink-muted">
                  <Icon weight="regular" aria-hidden="true" className="h-4 w-4 flex-none" />
                  {division.key === "pro" ? dict.division.proLabel : dict.division.studioLabel}
                </p>

                <h2
                  id={`division-${division.key}`}
                  className="mt-3 text-[1.5rem] font-medium tracking-[-0.025em] text-ink"
                >
                  {division.name}
                </h2>
                <p className="mt-1.5 text-[0.8125rem] text-ink-muted">{division.legalName}</p>
                <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {division.role[locale]}
                </p>

                <p className="mt-6 flex items-center gap-2.5 text-[0.9375rem]">
                  <Phone weight="regular" aria-hidden="true" className="h-4 w-4 flex-none text-ink-muted" />
                  <a href={division.phoneHref} className="numeric text-accent-ink underline">
                    {division.phoneDisplay}
                  </a>
                </p>

                <div className="mt-5">
                  <WhatsAppLink
                    locale={locale}
                    pageUrl={pageUrl}
                    buttonLabel={
                      division.key === "pro" ? dict.division.proWhatsApp : dict.division.studioWhatsApp
                    }
                    placement={`contact-${division.key}`}
                    division={division.key}
                    variant={division.key === "pro" ? "primary" : "secondary"}
                    className="w-full"
                  />
                </div>
              </section>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Reveal className="h-full">
          <section aria-labelledby="address-heading" className="h-full rounded-[var(--radius-card)] border border-line bg-white p-6">
            <h2 id="address-heading" className="flex items-center gap-2.5 text-[1.0625rem] font-medium text-ink">
              <MapPin weight="regular" aria-hidden="true" className="h-5 w-5 flex-none text-ink-muted" />
              {dict.contact.address}
            </h2>
            <address className="mt-3 not-italic text-[0.9375rem] leading-relaxed text-ink-muted">
              {site.address.street}
              <br />
              {site.address.locality}
              <br />
              {site.address.regency}, {site.address.region} {site.address.postalCode}
              <br />
              {site.address.countryName[locale]}
            </address>
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-5"
              data-variant="secondary"
            >
              <MapPin weight="regular" aria-hidden="true" className="btn__icon" />
              <span>{dict.contact.openMaps}</span>
            </a>
          </section>
        </Reveal>

        <Reveal delay={80} className="h-full">
          <section aria-labelledby="hours-heading" className="h-full rounded-[var(--radius-card)] border border-line bg-white p-6">
            <h2 id="hours-heading" className="flex items-center gap-2.5 text-[1.0625rem] font-medium text-ink">
              <Clock weight="regular" aria-hidden="true" className="h-5 w-5 flex-none text-ink-muted" />
              {dict.contact.hours}
            </h2>
            <dl className="mt-3 space-y-1.5 text-[0.9375rem]">
              {WEEK.map((day) => (
                <div
                  key={day}
                  className="flex items-baseline justify-between gap-4 border-b border-line pb-1.5 last:border-b-0"
                >
                  <dt className="text-ink-muted">{dict.contact.days[day]}</dt>
                  <dd className={isOpenDay(day) ? "numeric text-ink" : "text-ink-muted"}>
                    {isOpenDay(day) ? `${openSlot.opens} - ${openSlot.closes}` : dict.contact.closed}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </Reveal>
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
