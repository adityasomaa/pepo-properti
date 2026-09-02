import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "@phosphor-icons/react/dist/ssr";

import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { SampleNotice } from "@/components/listing/SampleNotice";
import { AppLink } from "@/components/AppLink";
import { BreadcrumbSchema, ServiceSchema } from "@/components/StructuredData";
import { getDict, isLocale, path, type Locale } from "@/lib/i18n";
import { studioServices } from "@/content/build";
import { site } from "@/content/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);
  const url = path(locale, "build");

  return {
    title: dict.build.metaTitle,
    description: dict.build.metaDescription,
    alternates: {
      canonical: url,
      languages: { id: "/id/build", en: "/en/build", "x-default": "/id/build" },
    },
    openGraph: {
      title: `${dict.build.metaTitle} | ${site.name}`,
      description: dict.build.metaDescription,
      url,
      images: [{ url: "/og/default.png", width: 1200, height: 630, alt: site.name }],
    },
  };
}

export default async function BuildPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDict(locale);
  const pageUrl = site.url + path(locale, "build");

  return (
    <div className="container pt-12 md:pt-20">
      <Reveal>
        <SectionHeader
          as="h1"
          label={dict.build.label}
          headline={dict.build.headline}
          description={dict.build.description}
          cta={
            <WhatsAppLink
              locale={locale}
              pageUrl={pageUrl}
              buttonLabel={dict.build.cta}
              placement="build-header"
              division="studio"
              variant="primary"
            />
          }
        />
      </Reveal>

      {/* Scope, as a ruled list. */}
      <section aria-labelledby="scope-heading" className="mt-14">
        <h2 id="scope-heading" className="text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
          {dict.build.servicesHeading}
        </h2>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {studioServices.map((service, index) => (
            <li key={service.key}>
              <Reveal delay={index * 60}>
                <div className="grid gap-2 py-6 md:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] md:gap-10">
                  <h3 className="text-[1.0625rem] font-medium tracking-[-0.015em] text-ink">
                    {service.name[locale]}
                  </h3>
                  <p className="max-w-[62ch] text-[0.9375rem] leading-relaxed text-ink-muted">
                    {service.description[locale]}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Packages. Each states what is in it; none of them rates itself. */}
      <section aria-labelledby="permits-heading" className="mt-24 md:mt-32">
        <Reveal>
          <SectionHeader
            id="permits-heading"
            label={dict.build.permitsLabel}
            headline={dict.build.permitsHeadline}
            description={dict.build.permitsDescription}
            cta={
              <>
                <WhatsAppLink
                  locale={locale}
                  pageUrl={pageUrl}
                  buttonLabel={dict.build.permitsCta}
                  placement="build-permits"
                  division="studio"
                  variant="primary"
                />
                <AppLink href={path(locale, "listings")} className="btn" data-variant="secondary">
                  {dict.division.proCta}
                </AppLink>
              </>
            }
          />
        </Reveal>
      </section>

      <ServiceSchema locale={locale} names={studioServices.map((s) => s.name[locale])} />
      <BreadcrumbSchema
        items={[
          { name: dict.nav.home, url: site.url + path(locale, "home") },
          { name: dict.nav.build, url: pageUrl },
        ]}
      />
    </div>
  );
}
