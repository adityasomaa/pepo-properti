"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll reveal.
 *
 * Two safeguards worth stating. The observed node is always the outer wrapper,
 * never something nested inside a clipped container: an IntersectionObserver on
 * an element whose ancestor has overflow hidden reports a ratio of 0 forever,
 * and the content silently never appears. And there is a fallback timer, so
 * even if a future layout change does clip an ancestor, the worst outcome is a
 * missing animation rather than missing content.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);

    // Content is never allowed to depend on the observer firing.
    const failsafe = setTimeout(() => setVisible(true), 1600);

    return () => {
      observer.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-visible={visible}
      className={`reveal ${className}`}
      style={delay ? ({ ["--reveal-delay" as string]: `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
