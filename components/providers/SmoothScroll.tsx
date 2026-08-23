"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useOverlayRegistry } from "./OverlayProvider";

/**
 * Lenis, but only where it is an improvement.
 *
 * It stays off for touch and tablet widths, where the platform's own inertia is
 * better than anything we can synthesise, and off while any overlay owns the
 * screen, because a smooth-scrolled page underneath a locked body is how you
 * get a lightbox that scrolls the wrong element.
 */
export function SmoothScroll() {
  const { anyOpen } = useOverlayRegistry();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;

    const destroy = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };

    const build = () => {
      if (lenisRef.current) return;
      if (!media.matches || reduced.matches) return;

      const lenis = new Lenis({
        duration: 1.05,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 0,
      });
      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    };

    const sync = () => {
      if (media.matches && !reduced.matches) build();
      else destroy();
    };

    sync();
    media.addEventListener("change", sync);
    reduced.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      destroy();
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (anyOpen) lenis.stop();
    else lenis.start();
  }, [anyOpen]);

  return null;
}
