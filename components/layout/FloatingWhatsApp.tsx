"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { WhatsappLogo, X, Buildings, Compass } from "@phosphor-icons/react/dist/ssr";
import { WhatsAppLink } from "../WhatsAppLink";
import { useOverlayRegistry } from "../providers/OverlayProvider";
import { site } from "@/content/site";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * The floating enquiry button, with the two-way split the brief calls for.
 *
 * A single WhatsApp button would land every message on one number, and half of
 * them would be about a build rather than a listing. Pressing this opens a
 * short choice first, so the message arrives at the division that can answer it.
 *
 * It sits above whatever height the cookie banner currently reports, so the
 * banner can never take a press meant for this button, and it steps aside
 * entirely while an overlay owns the screen.
 */
export function FloatingWhatsApp({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const { anyOpen } = useOverlayRegistry();
  const [open, setOpen] = useState(false);
  const [pastTop, setPastTop] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Arriving on a new page closes the chooser and puts the reader back at the top.
  useEffect(() => {
    setOpen(false);
    setPastTop(false);
  }, [pathname]);

  // Hold the button back until the reader has left the top of the page. At the
  // top it would sit on the hero's own buttons, two of the same offer stacked
  // on each other.
  useEffect(() => {
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) {
      setPastTop(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setPastTop(!entry.isIntersecting),
      // Positive, so the observed box grows upward past the top of the screen
      // and the marker still counts as visible for the first 70% of a screen of
      // scrolling. A negative margin shrinks the box instead, which reports the
      // marker as gone immediately and shows the button straight away.
      { rootMargin: "70% 0px 0px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (wrapRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open]);

  if (anyOpen || !pastTop) return null;

  const pageUrl = site.url + pathname;

  return (
    <div
      ref={wrapRef}
      className="fixed right-4 z-[var(--z-raised)] flex flex-col items-end gap-2 lg:hidden"
      style={{ bottom: "calc(1rem + var(--cookie-h, 0px) + env(safe-area-inset-bottom, 0px))" }}
    >
      {open ? (
        <div
          role="group"
          aria-label={dict.division.chooseHeadline}
          className="w-[17.5rem] max-w-[calc(100vw-2rem)] rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-[0_18px_40px_-22px_rgba(18,38,29,0.6)]"
        >
          <p className="text-[0.9375rem] font-medium text-ink">{dict.division.chooseHeadline}</p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-muted">{dict.division.chooseBody}</p>

          <div className="mt-3.5 flex flex-col gap-2">
            <WhatsAppLink
              locale={locale}
              pageUrl={pageUrl}
              buttonLabel={dict.division.proWhatsApp}
              placement="floating-pro"
              division="pro"
              variant="primary"
              className="w-full justify-start text-left"
              showIcon={false}
            >
              <span className="flex items-center gap-2">
                <Buildings weight="regular" aria-hidden="true" className="h-4 w-4 flex-none" />
                <span className="min-w-0">
                  <span className="block leading-tight">{dict.division.proWhatsApp}</span>
                  <span className="block text-[0.75rem] font-normal opacity-80">{site.divisions.pro.name}</span>
                </span>
              </span>
            </WhatsAppLink>

            <WhatsAppLink
              locale={locale}
              pageUrl={pageUrl}
              buttonLabel={dict.division.studioWhatsApp}
              placement="floating-studio"
              division="studio"
              variant="secondary"
              className="w-full justify-start text-left"
              showIcon={false}
            >
              <span className="flex items-center gap-2">
                <Compass weight="regular" aria-hidden="true" className="h-4 w-4 flex-none" />
                <span className="min-w-0">
                  <span className="block leading-tight">{dict.division.studioWhatsApp}</span>
                  <span className="block text-[0.75rem] font-normal text-ink-muted">{site.divisions.studio.name}</span>
                </span>
              </span>
            </WhatsAppLink>
          </div>
        </div>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="btn shadow-[0_14px_30px_-14px_rgba(18,38,29,0.7)]"
        data-variant="primary"
      >
        {open ? (
          <X weight="regular" aria-hidden="true" className="btn__icon" />
        ) : (
          <WhatsappLogo weight="regular" aria-hidden="true" className="btn__icon" />
        )}
        <span>{open ? dict.common.close : dict.common.askWhatsApp}</span>
      </button>
    </div>
  );
}
