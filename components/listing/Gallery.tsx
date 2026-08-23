"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X, ArrowsOut } from "@phosphor-icons/react/dist/ssr";
import { useOverlay } from "../providers/OverlayProvider";
import type { Dictionary } from "@/lib/i18n";

/**
 * Gallery with a lightbox.
 *
 * The lightbox is one of the three layers on this site that take over the
 * screen, so it registers with the overlay registry: page scroll locks while it
 * is open, Lenis stops, and the cookie banner steps aside rather than stacking
 * on top of it. Arrow keys move, Escape closes, focus is trapped while open and
 * handed back to the thumbnail that opened it.
 */
export function Gallery({
  images,
  alt,
  dict,
}: {
  images: string[];
  alt: string;
  dict: Dictionary;
}) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useOverlay("gallery-lightbox", open);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (i + delta + images.length) % images.length);
    },
    [images.length]
  );

  const close = useCallback(() => {
    setOpen(false);
    openerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          event.preventDefault();
          close();
          return;
        case "ArrowRight":
          event.preventDefault();
          go(1);
          return;
        case "ArrowLeft":
          event.preventDefault();
          go(-1);
          return;
        case "Tab": {
          if (!dialog) return;
          const focusable = dialog.querySelectorAll<HTMLElement>("button");
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
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close, go]);

  const counter = `${index + 1} ${dict.common.of} ${images.length}`;

  return (
    <>
      <div>
        <button
          ref={openerRef}
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface"
        >
          <span className="sr-only-focusable">{dict.listing.openGallery}</span>
          <img
            src={images[index]}
            alt={`${alt}. ${dict.common.image} ${counter}.`}
            width={1600}
            height={1200}
            fetchPriority="high"
            decoding="async"
            className="block aspect-[4/3] w-full object-cover"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-forest/85 px-3 py-1.5 text-[0.8125rem] font-medium text-on-forest"
          >
            <ArrowsOut weight="regular" className="h-4 w-4" />
            <span className="numeric">{counter}</span>
          </span>
        </button>

        {images.length > 1 ? (
          <ul className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <li key={src} className="w-24 flex-none snap-start sm:w-28">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-current={i === index ? "true" : undefined}
                  className={`block w-full overflow-hidden rounded-[10px] border transition-colors duration-200 ${
                    i === index ? "border-ink" : "border-line hover:border-ink/40"
                  }`}
                >
                  <span className="sr-only-focusable">{`${dict.common.image} ${i + 1}`}</span>
                  <img
                    src={src}
                    alt=""
                    width={1600}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    className="block aspect-[4/3] w-full object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={dict.listing.gallery}
          // Fully opaque. At 97% the page ghosted through behind the image, which
          // reads as a rendering fault rather than as depth.
          className="fixed inset-0 z-[var(--z-overlay)] bg-forest"
        >
          <div ref={dialogRef} className="on-dark flex h-[100svh] flex-col">
            <div className="container flex h-[var(--header-h)] flex-none items-center justify-between">
              <p className="numeric text-[0.9375rem] text-on-forest-muted">{counter}</p>
              <button type="button" onClick={close} className="btn" data-variant="secondary">
                <X weight="regular" aria-hidden="true" className="btn__icon" />
                <span>{dict.common.close}</span>
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
              <img
                src={images[index]}
                alt={`${alt}. ${dict.common.image} ${counter}.`}
                width={1600}
                height={1200}
                decoding="async"
                className="max-h-full max-w-full rounded-[var(--radius-card)] object-contain"
              />
            </div>

            {images.length > 1 ? (
              <div className="container flex flex-none items-center justify-center gap-3 pb-6">
                <button type="button" onClick={() => go(-1)} className="btn" data-variant="secondary">
                  <ArrowLeft weight="regular" aria-hidden="true" className="btn__icon" />
                  <span>{dict.common.previous}</span>
                </button>
                <button type="button" onClick={() => go(1)} className="btn" data-variant="secondary">
                  <span>{dict.common.next}</span>
                  <ArrowRight weight="regular" aria-hidden="true" className="btn__icon" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
