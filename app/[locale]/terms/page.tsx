import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/LegalPage";
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
  return {
    title: dict.terms.metaTitle,
    description: dict.terms.metaDescription,
    alternates: {
      canonical: path(locale, "terms"),
      languages: { id: "/id/terms", en: "/en/terms", "x-default": "/id/terms" },
    },
    openGraph: {
      title: `${dict.terms.metaTitle} | ${site.name}`,
      description: dict.terms.metaDescription,
      url: path(locale, "terms"),
      images: [{ url: "/og/default.png", width: 1200, height: 630, alt: site.name }],
    },
  };
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDict(locale);

  return (
    <LegalPage
      locale={locale}
      label={dict.terms.label}
      headline={dict.terms.headline}
      description={dict.terms.description}
      ctaLabel={dict.terms.cta}
      sections={dict.terms.sections}
    />
  );
}
