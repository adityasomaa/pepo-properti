"use client";

import { useCallback, useId, useRef, useState } from "react";
import { ArrowsLeftRight } from "@phosphor-icons/react/dist/ssr";

/**
 * Plan-versus-result comparison.
 *
 * Built on a range input rather than a bare div, so it is keyboard operable and
 * announced correctly without reimplementing a slider role by hand: arrow keys,
 * Home and End, and a real value all come from the platform. The visible handle
 * is decoration drawn over that input.
 *
 * Both images are always in the DOM and both carry alt text, so the comparison
 * is still readable when the pointer never moves.
 */
export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
  sliderLabel,
  className = "",
  priority = false,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel: string;
  afterLabel: string;
  sliderLabel: string;
  className?: string;
  priority?: boolean;
}) {
  const [value, setValue] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Dragging anywhere on the frame moves the divider, which is what people try
  // first. The range input stays the source of truth.
  const pointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return;
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const next = ((event.clientX - rect.left) / rect.width) * 100;
    setValue(Math.min(100, Math.max(0, next)));
  }, []);

  return (
    <div className={className}>
      <div
        ref={frameRef}
        onPointerMove={pointerMove}
        className="relative select-none overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface"
      >
        <img
          src={after}
          alt={afterAlt}
          width={1600}
          height={1200}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="block aspect-[4/3] w-full object-cover"
        />

        {/* The plan stage, clipped to the divider position. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        >
          <img
            src={before}
            alt={beforeAlt}
            width={1600}
            height={1200}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="block aspect-[4/3] w-full object-cover"
          />
        </div>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-px bg-paper"
          style={{ left: `${value}%` }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-[0_6px_16px_-6px_rgba(18,38,29,0.8)]"
          style={{ left: `${value}%` }}
        >
          <ArrowsLeftRight weight="bold" className="h-4 w-4" />
        </span>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-3 rounded-full bg-forest/85 px-2.5 py-1 text-[0.75rem] font-medium text-on-forest"
        >
          {beforeLabel}
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-3 rounded-full bg-forest/85 px-2.5 py-1 text-[0.75rem] font-medium text-on-forest"
        >
          {afterLabel}
        </span>

        <label htmlFor={id} className="sr-only-focusable">
          {sliderLabel}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(value)}
          onChange={(event) => setValue(Number(event.target.value))}
          aria-label={sliderLabel}
          aria-valuetext={`${Math.round(value)}% ${beforeLabel}`}
          className="compare-range absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent"
        />
      </div>
    </div>
  );
}
