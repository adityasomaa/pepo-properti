import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { SubmitForm } from "@/components/SubmitForm";
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
  const url = path(locale, "submit");

  return {
    title: dict.submit.metaTitle,
    description: dict.submit.metaDescription,
    alternates: {
      canonical: url,
      languages: {
        id: "/id/submit-property",
        en: "/en/submit-property",
        "x-default": "/id/submit-property",
      },
    },
    openGraph: {
      title: `${dict.submit.metaTitle} | ${site.name}`,
      description: dict.submit.metaDescription,
      url,
      images: [{ url: "/og/default.png", width: 1200, height: 630, alt: site.name }],
    },
  };
}

export default async function SubmitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDict(locale);
  const pageUrl = site.url + path(locale, "submit");

  return (
    <div className="container pt-12 md:pt-20">
      <Reveal>
        <SectionHeader
          as="h1"
          label={dict.submit.label}
          headline={dict.submit.headline}
          description={dict.submit.description}
          cta={{ href: path(locale, "listings"), label: dict.submit.cta }}
        />
      </Reveal>

      <div className="mt-10 max-w-[46rem]">
        <SubmitForm locale={locale} dict={dict} pageUrl={pageUrl} />
      </div>

      <BreadcrumbSchema
        items={[
          { name: dict.nav.home, url: site.url + path(locale, "home") },
          { name: dict.nav.submit, url: pageUrl },
        ]}
      />
    </div>
  );
}
