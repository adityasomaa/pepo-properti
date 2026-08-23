"use client";

/**
 * LetterCascade, from the componentry.dev registry
 * (`shadcn add @componentry/letter-cascade`), adapted for this project:
 *
 *  1. The registry ships an import from `@workspace/ui/lib/utils`, which is its
 *     own authoring workspace. Swapped for this project's `cn`.
 *  2. It imports from `framer-motion`; this project is on Motion 13, so the
 *     imports come from `motion/react`.
 *  3. Accessibility fix. The original puts `aria-label` on the wrapper but
 *     leaves both the front letter and its echo readable, so a screen reader
 *     announces the whole wordmark twice over on top of the label. Every letter
 *     is now `aria-hidden`, leaving the single label as the accessible name.
 *  4. Reduced motion is honoured: the cascade simply does not run.
 */

import { type AnimationOptions, motion, stagger, useAnimate } from "motion/react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/cn";

interface LetterCascadeProps {
  /** The text to animate */
  text: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** CSS classes applied to each individual letter */
  letterClassName?: string;
  /** Stagger delay between each letter in seconds */
  staggerDuration?: number;
  /** Where the stagger wave originates */
  staggerFrom?: "first" | "last" | "center" | number;
  /** Spring stiffness, higher is snappier */
  stiffness?: number;
  /** Spring damping, lower is bouncier */
  damping?: number;
  /** Trigger the animation on click instead of hover */
  triggerOnClick?: boolean;
  /** Callback when the full animation cycle completes */
  onComplete?: () => void;
}

export function LetterCascade({
  text,
  className,
  letterClassName,
  staggerDuration = 0.04,
  staggerFrom = "first",
  stiffness = 220,
  damping = 16,
  triggerOnClick = false,
  onComplete,
}: LetterCascadeProps) {
  const [scope, animate] = useAnimate();
  const [blocked, setBlocked] = useState(false);

  const trigger = useCallback(() => {
    if (blocked) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    setBlocked(true);

    const merge = (base: AnimationOptions): AnimationOptions => ({
      ...base,
      delay: stagger(staggerDuration, { from: staggerFrom }),
    });

    const spring: AnimationOptions = { type: "spring", stiffness, damping };

    // Phase 1: the front face tilts back as the echo flips in from below.
    animate(
      ".cascade-front",
      { rotateX: 90, opacity: 0, y: -6, filter: "blur(4px)" },
      merge(spring)
    ).then(() => {
      animate(
        ".cascade-front",
        { rotateX: 0, opacity: 1, y: 0, filter: "blur(0px)" },
        { duration: 0 }
      ).then(() => {
        setBlocked(false);
        onComplete?.();
      });
    });

    animate(
      ".cascade-echo",
      { rotateX: 0, opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
      merge(spring)
    ).then(() => {
      animate(
        ".cascade-echo",
        { rotateX: -90, opacity: 0, y: 6, scale: 0.8, filter: "blur(4px)" },
        { duration: 0 }
      );
    });
  }, [blocked, animate, staggerDuration, staggerFrom, stiffness, damping, onComplete]);

  return (
    <span
      ref={scope}
      className={cn("inline-flex select-none items-center justify-center", className)}
      {...(triggerOnClick ? { onClick: trigger } : { onMouseEnter: trigger })}
      aria-label={text}
    >
      {text.split("").map((letter, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="relative inline-flex whitespace-pre"
          style={{ perspective: "500px" }}
        >
          <motion.span
            className={cn("cascade-front inline-block", letterClassName)}
            style={{
              rotateX: 0,
              y: 0,
              transformOrigin: "bottom center",
              backfaceVisibility: "hidden",
            }}
          >
            {letter}
          </motion.span>

          <motion.span
            className={cn("cascade-echo absolute inset-0 inline-block", letterClassName)}
            style={{
              rotateX: -90,
              opacity: 0,
              y: 6,
              scale: 0.8,
              filter: "blur(4px)",
              transformOrigin: "top center",
              backfaceVisibility: "hidden",
            }}
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
