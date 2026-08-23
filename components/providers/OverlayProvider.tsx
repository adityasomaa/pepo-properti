"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * One registry for every layer that takes over the screen: the mobile menu,
 * the filter panel, the language picker, and the gallery lightbox.
 *
 * Three things read from it:
 *   - the scroll lock, so the page behind an overlay cannot move
 *   - Lenis, which must stop while an overlay owns the wheel
 *   - the cookie banner, which hides rather than stacking on top of a menu
 *
 * Overlays register by id, so two overlays closing out of order cannot leave
 * the page locked.
 */

type OverlayContextValue = {
  setOverlay: (id: string, open: boolean) => void;
  openIds: readonly string[];
  anyOpen: boolean;
};

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const scrollYRef = useRef(0);

  const setOverlay = useCallback((id: string, open: boolean) => {
    setOpenIds((prev) => {
      const has = prev.includes(id);
      if (open === has) return prev;
      return open ? [...prev, id] : prev.filter((x) => x !== id);
    });
  }, []);

  const anyOpen = openIds.length > 0;

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (anyOpen) {
      // Position-fixed rather than overflow-hidden: iOS Safari happily scrolls
      // a body that only has overflow hidden on it.
      scrollYRef.current = window.scrollY;
      html.classList.add("scroll-locked");
      body.style.position = "fixed";
      body.style.top = `-${scrollYRef.current}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      return;
    }

    if (!html.classList.contains("scroll-locked")) return;

    html.classList.remove("scroll-locked");
    body.style.position = "";
    body.style.top = "";
    body.style.left = "";
    body.style.right = "";
    body.style.width = "";
    window.scrollTo(0, scrollYRef.current);
  }, [anyOpen]);

  // A route change must never strand the lock, however the overlay unmounted.
  useEffect(() => {
    return () => {
      const html = document.documentElement;
      html.classList.remove("scroll-locked");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, []);

  const value = useMemo(() => ({ setOverlay, openIds, anyOpen }), [setOverlay, openIds, anyOpen]);

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
}

export function useOverlayRegistry(): OverlayContextValue {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlayRegistry must be used inside OverlayProvider");
  return ctx;
}

/** Register an overlay for as long as `open` is true. */
export function useOverlay(id: string, open: boolean) {
  const { setOverlay } = useOverlayRegistry();

  useEffect(() => {
    setOverlay(id, open);
    return () => setOverlay(id, false);
  }, [id, open, setOverlay]);
}
