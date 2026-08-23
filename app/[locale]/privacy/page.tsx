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
    title: dict.privacy.metaTitle,
    description: dict.privacy.metaDescription,
    alternates: {
      canonical: path(locale, "privacy"),
      languages: { id: "/id/privacy", en: "/en/privacy", "x-default": "/id/privacy" },
    },
    openGraph: {
      title: `${dict.privacy.metaTitle} | ${site.name}`,
      description: dict.privacy.metaDescription,
      url: path(locale, "privacy"),
      images: [{ url: "/og/default.png", width: 1200, height: 630, alt: site.name }],
    },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDict(locale);

  return (
    <LegalPage
      locale={locale}
      label={dict.privacy.label}
      headline={dict.privacy.headline}
      description={dict.privacy.description}
      ctaLabel={dict.privacy.cta}
      sections={dict.privacy.sections}
    />
  );
}
