import { LetterCascade } from "../ui/letter-cascade";

/**
 * The brand mark. Authored rather than taken from an icon library, because it
 * is a logo and not an icon: the same geometry ships as the site icon and the
 * Open Graph card, so the three never drift apart.
 */
export function Mark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5 3h11a8.5 8.5 0 0 1 0 17h-6v9H5V3Zm5 4.4v8.2h5.6a4.1 4.1 0 0 0 0-8.2H10Z"
      />
    </svg>
  );
}

export function Wordmark({
  className = "",
  cascade = false,
}: {
  className?: string;
  /**
   * Runs the letter cascade on hover. Used on the header mark and nowhere else:
   * one authored moment, on the one element that is on every page.
   */
  cascade?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Mark className="h-[1.35em] w-[1.35em] flex-none" />
      {cascade ? (
        <LetterCascade
          text="Pepo Properti"
          className="font-medium tracking-[-0.025em]"
          staggerDuration={0.028}
        />
      ) : (
        <span className="font-medium tracking-[-0.025em]">Pepo Properti</span>
      )}
    </span>
  );
}
