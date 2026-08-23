"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { AppLink } from "../AppLink";
import { WhatsAppLink } from "../WhatsAppLink";
import { Wordmark } from "./Wordmark";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useOverlay } from "../providers/OverlayProvider";
import { path, type Dictionary, type Locale, type RouteKey } from "@/lib/i18n";
import { site } from "@/content/site";

const NAV: { key: RouteKey; label: (d: Dictionary) => string }[] = [
  { key: "home", label: (d) => d.nav.home },
  { key: "listings", label: (d) => d.nav.listings },
  { key: "submit", label: (d) => d.nav.submit },
  { key: "contact", label: (d) => d.nav.contact },
];

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useOverlay("mobile-menu", menuOpen);

  // The menu closes itself on arrival, so a link press never leaves it open
  // over the page it just opened.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Escape closes, and focus is kept inside the panel while it is open.
  useEffect(() => {
    if (!menuOpen) return;

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const isCurrent = (key: RouteKey) => {
    const href = path(locale, key);
    return key === "home" ? pathname === href : pathname.startsWith(href);
  };

  const pageUrl = site.url + pathname;

  return (
    <>
      <a href="#main" className="skip-link">
        {dict.nav.skip}
      </a>

      <header className="sticky top-0 z-[var(--z-header)] border-b border-line bg-paper/92 backdrop-blur-[10px]">
        <div className="container flex h-[var(--header-h)] items-center justify-between gap-4">
          <AppLink
            href={path(locale, "home")}
            className="flex items-center text-[1.0625rem] text-ink"
            aria-label={site.legalName}
          >
            <Wordmark />
          </AppLink>

          <nav aria-label={dict.nav.menuLabel} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.key}>
                  <AppLink
                    href={path(locale, item.key)}
                    aria-current={isCurrent(item.key) ? "page" : undefined}
                    className="inline-flex min-h-9 items-center rounded-full px-3 py-1.5 text-[0.9375rem] text-ink-muted transition-colors duration-200 hover:text-ink aria-[current=page]:font-medium aria-[current=page]:text-ink"
                  >
                    {item.label(dict)}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher locale={locale} compact />
            </div>

            <div className="hidden lg:block">
              <WhatsAppLink
                locale={locale}
                pageUrl={pageUrl}
                buttonLabel={dict.common.askWhatsApp}
                variant="primary"
                className="text-[0.875rem]"
              />
            </div>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="btn lg:hidden"
              data-variant="secondary"
            >
              <List weight="regular" aria-hidden="true" className="btn__icon" />
              <span>{dict.nav.openMenu}</span>
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.menuLabel}
          className="fixed inset-0 z-[var(--z-menu)] bg-paper lg:hidden"
        >
          <div ref={panelRef} className="flex h-[100svh] flex-col overflow-y-auto">
            <div className="container flex h-[var(--header-h)] flex-none items-center justify-between border-b border-line">
              <span className="flex items-center text-[1.0625rem] text-ink">
                <Wordmark />
              </span>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  triggerRef.current?.focus();
                }}
                className="btn"
                data-variant="secondary"
              >
                <X weight="regular" aria-hidden="true" className="btn__icon" />
                <span>{dict.nav.closeMenu}</span>
              </button>
            </div>

            <nav aria-label={dict.nav.menuLabel} className="container flex-1 py-8">
              <ul className="flex flex-col">
                {NAV.map((item) => (
                  <li key={item.key} className="border-b border-line last:border-b-0">
                    <AppLink
                      href={path(locale, item.key)}
                      aria-current={isCurrent(item.key) ? "page" : undefined}
                      className="block py-4 text-[1.5rem] leading-tight tracking-[-0.02em] text-ink-muted aria-[current=page]:font-medium aria-[current=page]:text-ink"
                    >
                      {item.label(dict)}
                    </AppLink>
                  </li>
                ))}
              </ul>

              <div className="mt-8 max-w-[16rem]">
                <LanguageSwitcher locale={locale} />
              </div>
            </nav>

            <div className="container flex-none border-t border-line py-5">
              <WhatsAppLink
                locale={locale}
                pageUrl={pageUrl}
                buttonLabel={dict.common.askWhatsApp}
                variant="primary"
                className="w-full"
              />
              <p className="mt-3 text-[0.875rem] text-ink-muted">
                {site.address.street}, {site.address.locality}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
