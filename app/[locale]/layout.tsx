import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";

import { OverlayProvider } from "@/components/providers/OverlayProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { OrganizationSchema } from "@/components/StructuredData";
import { getDict, isLocale, locales, path, type Locale } from "@/lib/i18n";
import { site } from "@/content/site";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#12261d",
  colorScheme: "light",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDict(locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} | ${dict.home.metaTitle}`,
      template: `%s | ${site.name}`,
    },
    description: dict.home.metaDescription,
    applicationName: site.name,
    alternates: {
      canonical: path(locale, "home"),
      languages: {
        id: "/id",
        en: "/en",
        "x-default": "/id",
      },
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: locale === "id" ? "id_ID" : "en_US",
      url: path(locale, "home"),
      images: [{ url: "/og/default.png", width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDict(locale);

  return (
    <html lang={dict.meta.htmlLang}>
      <head>
        {/* Without script, the transition curtain would never lift. */}
        <noscript>
          <style>{`.curtain{display:none !important}`}</style>
        </noscript>
      </head>
      <body>
        <OverlayProvider>
          <TransitionProvider homePath={path(locale, "home")}>
            <SmoothScroll />
            <Header locale={locale} dict={dict} />
            <main id="main" tabIndex={-1}>
              {/* Watched by the floating enquiry button: while this marker is
                  still on screen the reader is at the top of the page, where
                  the hero already offers the same routes. */}
              <div id="top-sentinel" aria-hidden="true" className="h-px w-full" />
              {children}
            </main>
            <Footer locale={locale} dict={dict} />
            <CookieBanner locale={locale} dict={dict} />
            <FloatingWhatsApp locale={locale} dict={dict} />
          </TransitionProvider>
        </OverlayProvider>
        <OrganizationSchema locale={locale} />
      </body>
    </html>
  );
}
