import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "@phosphor-icons/react/dist/ssr";

import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { BuildCalculator } from "@/components/build/BuildCalculator";
import { BeforeAfter } from "@/components/portfolio/BeforeAfter";
import { SampleNotice } from "@/components/listing/SampleNotice";
import { AppLink } from "@/components/AppLink";
import { BreadcrumbSchema, ServiceSchema } from "@/components/StructuredData";
import { formatPrice } from "@/lib/format";
import { getDict, isLocale, path, type Locale } from "@/lib/i18n";
import { buildPackages, studioServices } from "@/content/build";
import { projects, SAMPLE_PROJECTS } from "@/content/projects";
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
  const lead = projects[0];

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
      <section aria-labelledby="packages-heading" className="mt-24 md:mt-32">
        <Reveal>
          <SectionHeader
            id="packages-heading"
            label={dict.build.packagesLabel}
            headline={dict.build.packagesHeadline}
            description={dict.build.packagesDescription}
          />
        </Reveal>

        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {buildPackages.map((pkg, index) => (
            <li key={pkg.key}>
              <Reveal delay={index * 80} className="h-full">
                <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6">
                  <h3 className="text-[1.25rem] font-medium tracking-[-0.02em] text-ink">
                    {pkg.name[locale]}
                  </h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">
                    {pkg.description[locale]}
                  </p>

                  <p className="mt-5 border-t border-line pt-5">
                    <span className="numeric text-[1.375rem] font-medium tracking-[-0.02em] text-ink">
                      {formatPrice(pkg.pricePerSqm, locale)}
                    </span>
                    <span className="ml-1.5 text-[0.875rem] text-ink-muted">{dict.build.perSqm}</span>
                  </p>

                  <p className="mt-5 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-ink-muted">
                    {dict.build.includes}
                  </p>
                  <ul className="mt-2.5 flex-1 space-y-2">
                    {pkg.includes[locale].map((item) => (
                      <li key={item} className="flex gap-2.5 text-[0.9375rem] leading-snug text-ink-muted">
                        <Check
                          weight="bold"
                          aria-hidden="true"
                          className="mt-1 h-3.5 w-3.5 flex-none text-accent-ink"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Calculator. */}
      <section aria-labelledby="calculator-heading" className="mt-24 md:mt-32">
        <Reveal>
          <SectionHeader
            id="calculator-heading"
            label={dict.build.calculator.label}
            headline={dict.build.calculator.headline}
            description={dict.build.calculator.description}
          />
        </Reveal>
        <Reveal className="mt-8 max-w-[46rem]">
          <BuildCalculator locale={locale} dict={dict} pageUrl={pageUrl} />
        </Reveal>
      </section>

      {/* One comparison, then the route to the rest. */}
      {lead ? (
        <section aria-labelledby="build-portfolio-heading" className="mt-24 md:mt-32">
          <Reveal>
            <SectionHeader
              id="build-portfolio-heading"
              label={dict.home.portfolio.label}
              headline={dict.home.portfolio.headline}
              description={dict.home.portfolio.description}
              cta={{ href: path(locale, "portfolio"), label: dict.home.portfolio.cta }}
            />
          </Reveal>

          {SAMPLE_PROJECTS ? (
            <div className="mt-8">
              <SampleNotice text={dict.common.sampleNoteProjects} badge={dict.common.sampleBadge} />
            </div>
          ) : null}

          <Reveal className="mt-8">
            <BeforeAfter
              before={lead.before}
              after={lead.after}
              beforeAlt={`${dict.portfolio.beforeLabel}. ${lead.title[locale]}.`}
              afterAlt={`${dict.portfolio.afterLabel}. ${lead.title[locale]}.`}
              beforeLabel={dict.portfolio.beforeLabel}
              afterLabel={dict.portfolio.afterLabel}
              sliderLabel={dict.portfolio.sliderLabel}
            />
            <p className="mt-3 text-[0.875rem] text-ink-muted">
              {lead.title[locale]}. {dict.portfolio.sliderInstruction}
            </p>
          </Reveal>
        </section>
      ) : null}

      {/* Permits get their own moment: it is the part buyers worry about. */}
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
