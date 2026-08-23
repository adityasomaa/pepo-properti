"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Page transitions.
 *
 * The order is fixed and non-negotiable: the page closes, then the content
 * changes, then the scroll resets, then the page opens. Nothing the visitor can
 * see changes while the curtain is up, which is what makes it read as one move
 * rather than a flicker plus an animation.
 *
 * Two curtains, per the brief:
 *   intro  first load, and any navigation that lands on the home page
 *   page   every other navigation
 *
 * TIMING NOTE. Every step is driven by `settle()`, which races a setTimeout
 * against a requestAnimationFrame clock and continues on whichever lands first.
 * requestAnimationFrame stops entirely in a backgrounded tab; a sequence that
 * waited on frames alone would leave the curtain up forever for anyone who
 * switched tabs mid-navigation. setTimeout keeps firing, so the state machine
 * always advances even when nothing is being painted.
 */

type Kind = "intro" | "page";
type Phase = "intro" | "idle" | "closing" | "held" | "opening";

type TransitionContextValue = {
  navigate: (href: string) => void;
  phase: Phase;
  busy: boolean;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

const CLOSE_MS = 620;
const OPEN_MS = 720;
const HOLD_MS = 140;
const INTRO_HOLD_MS = 820;
/** Hard ceiling on waiting for a route to render. The curtain lifts regardless. */
const ROUTE_WAIT_CAP_MS = 2200;

/** Resolves after `ms`, on whichever of setTimeout or the frame clock lands first. */
function settle(ms: number): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    let raf = 0;

    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
      resolve();
    };

    const timer = setTimeout(finish, ms);

    if (typeof requestAnimationFrame === "function") {
      const start = performance.now();
      const tick = (now: number) => {
        if (now - start >= ms) finish();
        else raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
  });
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const WORDMARK = "KORVA";

export function TransitionProvider({
  children,
  homePath,
}: {
  children: React.ReactNode;
  homePath: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<Phase>("intro");
  const [kind, setKind] = useState<Kind>("intro");

  const pathRef = useRef(pathname);
  const busyRef = useRef(false);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  /* --- First load ------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (prefersReducedMotion()) {
        setPhase("idle");
        return;
      }

      // Hold until the webfont has resolved, so the wordmark never swaps face
      // mid-reveal. Capped, because a font that never loads is not a reason to
      // keep the site behind a curtain.
      const fonts =
        typeof document !== "undefined" && "fonts" in document
          ? (document as Document & { fonts: FontFaceSet }).fonts.ready
          : Promise.resolve();

      await Promise.race([fonts, settle(1800)]);
      await settle(INTRO_HOLD_MS);
      if (cancelled) return;

      setPhase("opening");
      await settle(OPEN_MS);
      if (cancelled) return;

      setPhase("idle");
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  /* --- Link navigation -------------------------------------------------- */
  const navigate = useCallback(
    (href: string) => {
      if (busyRef.current) return;

      const target = href.split("#")[0].split("?")[0];
      const current = pathRef.current;
      if (target === current) return;

      busyRef.current = true;

      const run = async () => {
        const nextKind: Kind = target === homePath ? "intro" : "page";
        setKind(nextKind);

        if (prefersReducedMotion()) {
          router.push(href);
          window.scrollTo(0, 0);
          busyRef.current = false;
          return;
        }

        // 1. Page closes.
        setPhase("closing");
        await settle(CLOSE_MS);

        // 2. Content changes, entirely behind the curtain.
        setPhase("held");
        router.push(href);

        // 3. Scroll resets while still covered.
        window.scrollTo(0, 0);

        // Wait for the new route to actually be on screen, but never past the cap.
        const start = performance.now();
        while (pathRef.current !== target && performance.now() - start < ROUTE_WAIT_CAP_MS) {
          await settle(60);
        }
        window.scrollTo(0, 0);
        await settle(nextKind === "intro" ? INTRO_HOLD_MS : HOLD_MS);

        // 4. Page opens.
        setPhase("opening");
        await settle(OPEN_MS);
        setPhase("idle");
        busyRef.current = false;
      };

      void run();
    },
    [homePath, router]
  );

  const value = useMemo<TransitionContextValue>(
    () => ({ navigate, phase, busy: phase !== "idle" }),
    [navigate, phase]
  );

  const covering = phase !== "idle";

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <div
        aria-hidden="true"
        data-phase={phase}
        data-kind={kind}
        className="curtain"
        style={{ pointerEvents: covering ? "auto" : "none" }}
      >
        <div className="curtain__panel curtain__panel--back" />
        <div className="curtain__panel curtain__panel--front">
          <div className="curtain__mark">
            <span className="curtain__word" aria-label={WORDMARK}>
              {WORDMARK.split("").map((ch, i) => (
                <span
                  key={`${ch}-${i}`}
                  aria-hidden="true"
                  className="curtain__letter"
                  style={{ ["--i" as string]: String(i) }}
                >
                  {ch === " " ? " " : ch}
                </span>
              ))}
            </span>
            <span className="curtain__rule" aria-hidden="true" />
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

export function useTransition(): TransitionContextValue {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useTransition must be used inside TransitionProvider");
  return ctx;
}
