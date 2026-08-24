"use client";

import { useEffect, useRef, useState } from "react";
import { AppLink } from "../AppLink";
import { useOverlayRegistry } from "../providers/OverlayProvider";
import { getConsent, setConsent } from "@/lib/consent";
import { path, type Dictionary, type Locale } from "@/lib/i18n";

/**
 * A bottom bar, not a blocking overlay.
 *
 * Two rules it has to obey on a small screen. It never stacks on top of the
 * mobile menu, the filter panel, or the lightbox, so it hides itself whenever
 * one of those owns the screen. And it never swallows a press meant for the
 * floating WhatsApp button: it publishes its own height as --cookie-h, and the
 * floating button sits above that, so the two never overlap.
 */
export function CookieBanner({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { anyOpen } = useOverlayRegistry();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (getConsent() === null) setVisible(true);
  }, []);

  const showing = visible && !anyOpen;

  useEffect(() => {
    const root = document.documentElement;
    if (!showing) {
      root.style.setProperty("--cookie-h", "0px");
      return;
    }

    const measure = () => {
      const h = ref.current?.offsetHeight ?? 0;
      root.style.setProperty("--cookie-h", `${h}px`);
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [showing]);

  useEffect(() => {
    return () => document.documentElement.style.setProperty("--cookie-h", "0px");
  }, []);

  if (!showing) return null;

  const decide = (value: "granted" | "denied") => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div
      ref={ref}
      role="region"
      aria-label={dict.cookies.label}
      className="fixed inset-x-0 bottom-0 z-[var(--z-cookie)] max-h-[45svh] overflow-y-auto border-t border-line bg-paper"
    >
      <div className="container flex flex-col gap-2.5 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-3.5">
        <div className="min-w-0">
          <h2 className="text-[0.875rem] font-medium text-ink">{dict.cookies.title}</h2>
          <p className="mt-0.5 max-w-[78ch] text-[0.8125rem] leading-[1.45] text-ink-muted">
            {dict.cookies.body}{" "}
            <AppLink href={path(locale, "privacy")} className="text-accent-ink underline">
              {dict.cookies.more}
            </AppLink>
          </p>
        </div>

        <div className="flex flex-none flex-wrap gap-2 [&_.btn]:min-h-[2.5rem] [&_.btn]:py-2">
          <button type="button" onClick={() => decide("granted")} className="btn" data-variant="primary">
            {dict.cookies.accept}
          </button>
          <button type="button" onClick={() => decide("denied")} className="btn" data-variant="secondary">
            {dict.cookies.decline}
          </button>
        </div>
      </div>
    </div>
  );
}
