"use client";

import { usePathname } from "next/navigation";
import { ArrowRight, MapPin, Phone, Clock } from "@phosphor-icons/react/dist/ssr";
import { AppLink } from "../AppLink";
import { WhatsAppLink } from "../WhatsAppLink";
import { SectionHeader } from "../SectionHeader";
import { Wordmark } from "./Wordmark";
import { path, type Dictionary, type Locale, type RouteKey } from "@/lib/i18n";
import { site } from "@/content/site";

/**
 * Every page ends on a call to action.
 *
 * The secondary target moves out of the way: standing on the submission page,
 * the footer offers the listings instead, and so on. A footer that invites you
 * to the page you are already reading is noise.
 */
export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const pageUrl = site.url + pathname;

  const isCurrent = (key: RouteKey) => {
    const href = path(locale, key);
    return key === "home" ? pathname === href : pathname.startsWith(href);
  };

  const secondaryOrder: RouteKey[] = ["submit", "listings", "contact"];
  const secondaryKey = secondaryOrder.find((key) => !isCurrent(key)) ?? "listings";
  const secondaryLabel: Record<string, string> = {
    submit: dict.footer.ctaSubmit,
    listings: dict.footer.ctaListings,
    contact: dict.footer.ctaContact,
  };

  const navKeys: RouteKey[] = ["home", "listings", "submit", "contact"];
  const navLabel: Record<string, string> = {
    home: dict.nav.home,
    listings: dict.nav.listings,
    submit: dict.nav.submit,
    contact: dict.nav.contact,
  };

  const dayName = (day: string) => dict.contact.days[day as keyof typeof dict.contact.days] ?? day;
  const openDays = site.hours[0];
  const hoursLine = `${dayName(openDays.days[0])} - ${dayName(openDays.days[openDays.days.length - 1])}, ${openDays.opens} - ${openDays.closes}`;
  const closedLine = `${site.closedDays.map(dayName).join(", ")}: ${dict.contact.closed}`;

  return (
    <footer className="on-dark mt-24 bg-forest text-on-forest md:mt-32">
      <div className="container py-16 md:py-24">
        <SectionHeader
          tone="dark"
          label={dict.footer.ctaLabel}
          headline={dict.footer.ctaHeadline}
          description={dict.footer.ctaDescription}
          cta={
            <>
              <WhatsAppLink
                locale={locale}
                pageUrl={pageUrl}
                buttonLabel={dict.footer.ctaWhatsApp}
                variant="primary"
              />
              <AppLink href={path(locale, secondaryKey)} className="btn" data-variant="secondary">
                <span>{secondaryLabel[secondaryKey]}</span>
                <ArrowRight weight="regular" aria-hidden="true" className="btn__icon" />
              </AppLink>
            </>
          }
        />

        <div className="mt-16 grid gap-10 border-t border-on-forest/15 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="flex items-center text-[1.0625rem] text-on-forest">
              <Wordmark />
            </span>
            <p className="mt-3 max-w-[26ch] text-[0.875rem] leading-relaxed text-on-forest-muted">
              {site.legalName}
            </p>
          </div>

          <nav aria-label={dict.footer.navHeading}>
            <h2 className="text-[0.75rem] font-medium uppercase tracking-[0.09em] text-on-forest-muted">
              {dict.footer.navHeading}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {navKeys.map((key) => (
                <li key={key}>
                  <AppLink
                    href={path(locale, key)}
                    aria-current={isCurrent(key) ? "page" : undefined}
                    className="text-[0.9375rem] text-on-forest-muted transition-colors duration-200 hover:text-on-forest aria-[current=page]:text-on-forest"
                  >
                    {navLabel[key]}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.75rem] font-medium uppercase tracking-[0.09em] text-on-forest-muted">
              {dict.footer.contactHeading}
            </h2>
            <ul className="mt-4 space-y-3 text-[0.9375rem] text-on-forest-muted">
              <li className="flex gap-2.5">
                <MapPin weight="regular" aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none" />
                <span>
                  {site.address.street}, {site.address.locality}, {site.address.region} {site.address.postalCode}
                </span>
              </li>
              <li className="flex gap-2.5">
                <Clock weight="regular" aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none" />
                <span>
                  {hoursLine}
                  <br />
                  {closedLine}
                </span>
              </li>
              <li className="flex gap-2.5">
                <Phone weight="regular" aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none" />
                <a href={site.phoneHref} className="transition-colors duration-200 hover:text-on-forest">
                  {site.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-[0.75rem] font-medium uppercase tracking-[0.09em] text-on-forest-muted">
              {dict.footer.legalHeading}
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <AppLink
                  href={path(locale, "privacy")}
                  className="text-[0.9375rem] text-on-forest-muted transition-colors duration-200 hover:text-on-forest"
                >
                  {dict.footer.privacy}
                </AppLink>
              </li>
              <li>
                <AppLink
                  href={path(locale, "terms")}
                  className="text-[0.9375rem] text-on-forest-muted transition-colors duration-200 hover:text-on-forest"
                >
                  {dict.footer.terms}
                </AppLink>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-on-forest/15 pt-6 text-[0.8125rem] text-on-forest-muted">
          {site.legalName}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
