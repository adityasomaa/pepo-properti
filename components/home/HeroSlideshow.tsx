"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Photo } from "@/components/media/Photo";
import type { PhotoRef } from "@/content/listings";

/**
 * The hero photograph, as a slideshow.
 *
 * Every frame is stacked in the same box and only opacity changes, so the
 * layout never moves between slides — which matters here more than anywhere
 * else on the site, because the hero has to stay one screen with the search
 * inside it.
 *
 * It advances on its own, but stops for anyone who has a reason to want it
 * still: a pointer over it, keyboard focus inside it, a hidden tab, or
 * prefers-reduced-motion, where it never starts and the dots become the only
 * way through. The dots are real buttons, so the slideshow is operable without
 * a mouse and announces which frame is current.
 *
 * Only the first frame loads eagerly. The rest are lazy, so a visitor who
 * leaves before the second slide pays for one photograph.
 */
export function HeroSlideshow({
  photos,
  alt,
  label,
  slideLabelTemplate,
  className = "",
  interval = 5000,
}: {
  photos: readonly PhotoRef[];
  alt: string;
  label: string;
  /* A template rather than a function: a Server Component cannot hand a
     function to a Client Component. "{n}" and "{total}" are substituted here. */
  slideLabelTemplate: string;
  className?: string;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const count = photos.length;
  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    // A hidden tab throttles timers, which would otherwise leave a backlog of
    // advances to fire the moment the tab comes back.
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count, paused, interval]);

  if (count === 0) return null;

  return (
    <div
      ref={rootRef}
      className={`hero-slideshow relative ${className}`}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) setPaused(false);
      }}
    >
      {photos.map((photo, i) => (
        <div
          key={`${photo.album}/${photo.slug}`}
          aria-hidden={i !== index}
          className={
            i === 0
              ? "hero-slideshow__frame"
              : "hero-slideshow__frame hero-slideshow__frame--stacked"
          }
          data-current={i === index ? "true" : undefined}
        >
          <Photo
            album={photo.album}
            slug={photo.slug}
            alt={i === index ? alt : ""}
            priority={i === 0}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="block aspect-[16/9] w-full object-cover"
          />
        </div>
      ))}

      {count > 1 ? (
        <div className="hero-slideshow__dots">
          {photos.map((photo, i) => (
            <button
              key={`${photo.album}/${photo.slug}`}
              type="button"
              onClick={() => go(i)}
              aria-current={i === index ? "true" : undefined}
              aria-label={slideLabelTemplate.replace("{n}", String(i + 1)).replace("{total}", String(count))}
              className="hero-slideshow__dot"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
