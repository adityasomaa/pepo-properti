import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Ruler } from "@phosphor-icons/react/dist/ssr";

import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppLink } from "@/components/WhatsAppLink";
import { BeforeAfter } from "@/components/portfolio/BeforeAfter";
import { SampleNotice } from "@/components/listing/SampleNotice";
import { BreadcrumbSchema, ProjectSchema } from "@/components/StructuredData";
import { formatArea } from "@/lib/format";
import { getDict, isLocale, path, type Locale } from "@/lib/i18n";
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
  const url = path(locale, "portfolio");

  return {
    title: dict.portfolio.metaTitle,
    description: dict.portfolio.metaDescription,
    alternates: {
      canonical: url,
      languages: { id: "/id/portfolio", en: "/en/portfolio", "x-default": "/id/portfolio" },
    },
    openGraph: {
      title: `${dict.portfolio.metaTitle} | ${site.name}`,
      description: dict.portfolio.metaDescription,
      url,
      images: [{ url: "/og/default.png", width: 1200, height: 630, alt: site.name }],
    },
  };
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDict(locale);
  const pageUrl = site.url + path(locale, "portfolio");

  return (
    <div className="container pt-12 md:pt-20">
      <Reveal>
        <SectionHeader
          as="h1"
          label={dict.portfolio.label}
          headline={dict.portfolio.headline}
          description={dict.portfolio.description}
          cta={
            <WhatsAppLink
              locale={locale}
              pageUrl={pageUrl}
              buttonLabel={dict.portfolio.cta}
              placement="portfolio-header"
              division="studio"
              variant="primary"
            />
          }
        />
      </Reveal>

      {SAMPLE_PROJECTS ? (
        <div className="mt-8">
          <SampleNotice text={dict.common.sampleNoteProjects} badge={dict.common.sampleBadge} />
        </div>
      ) : null}

      {projects.length === 0 ? (
        <p className="mt-12 text-[1.0625rem] text-ink-muted">{dict.portfolio.empty}</p>
      ) : (
        <ul className="mt-12 space-y-20 md:space-y-28">
          {projects.map((project, index) => (
            <li key={project.slug}>
              <Reveal>
                <article className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-12">
                  <BeforeAfter
                    before={project.before}
                    after={project.after}
                    beforeAlt={`${dict.portfolio.beforeLabel}. ${project.title[locale]}.`}
                    afterAlt={`${dict.portfolio.afterLabel}. ${project.title[locale]}.`}
                    beforeLabel={dict.portfolio.beforeLabel}
                    afterLabel={dict.portfolio.afterLabel}
                    sliderLabel={dict.portfolio.sliderLabel}
                    priority={index === 0}
                  />

                  <div className="min-w-0">
                    <span className="tag" data-tone="rent">
                      {dict.projectType[project.type]}
                    </span>

                    <h2 className="mt-3.5 text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] font-medium leading-[1.15] tracking-[-0.025em] text-ink">
                      {project.title[locale]}
                    </h2>

                    <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.9375rem] text-ink-muted">
                      <span className="flex items-center gap-2">
                        <MapPin weight="regular" aria-hidden="true" className="h-4 w-4 flex-none" />
                        {project.area}, {project.regency}
                      </span>
                      <span className="flex items-center gap-2">
                        <Ruler weight="regular" aria-hidden="true" className="h-4 w-4 flex-none" />
                        <span className="sr-only-focusable">{dict.portfolio.buildingSize}</span>
                        <span className="numeric">{formatArea(project.buildingSize, locale)}</span>
                      </span>
                    </p>

                    <p className="mt-5 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
                      {project.description[locale]}
                    </p>

                    <h3 className="mt-7 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-ink-muted">
                      {dict.portfolio.scope}
                    </h3>
                    <ul className="mt-2.5 flex flex-wrap gap-2">
                      {project.scope[locale].map((item) => (
                        <li key={item} className="tag" data-tone="rent">
                          {item}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-6 text-[0.875rem] text-ink-muted">{dict.portfolio.sliderInstruction}</p>
                  </div>
                </article>
              </Reveal>

              <ProjectSchema project={project} locale={locale} dict={dict} />
            </li>
          ))}
        </ul>
      )}

      <BreadcrumbSchema
        items={[
          { name: dict.nav.home, url: site.url + path(locale, "home") },
          { name: dict.nav.portfolio, url: pageUrl },
        ]}
      />
    </div>
  );
}
