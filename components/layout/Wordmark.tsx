import { LetterCascade } from "../ui/letter-cascade";

/**
 * The brand mark. Authored rather than taken from an icon library, because it
 * is a logo and not an icon: the same geometry ships as the site icon and the
 * Open Graph card, so the three never drift apart.
 *
 * A stem and two straight arms. No curves, which suits a business whose other
 * half draws buildings, and which holds up at 16px in a browser tab.
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
        d="M4 3h6v26H4V3Zm8 13L22.5 3H30L19.4 16 30 29h-7.5L12 16Z"
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
      <Mark className="h-[1.15em] w-[1.15em] flex-none" />
      {cascade ? (
        <LetterCascade
          text="KORVA"
          className="font-medium tracking-[0.04em]"
          staggerDuration={0.035}
        />
      ) : (
        <span className="font-medium tracking-[0.04em]">KORVA</span>
      )}
    </span>
  );
}

/**
 * The mark plus the division it belongs to. Used where a block of content is
 * owned by one side of the business rather than by KORVA as a whole.
 */
export function DivisionMark({
  name,
  role,
  className = "",
}: {
  name: string;
  role: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Mark className="h-5 w-5 flex-none" />
      <span className="min-w-0">
        <span className="block text-[1.0625rem] font-medium leading-tight tracking-[-0.01em]">{name}</span>
        <span className="block text-[0.8125rem] leading-tight opacity-70">{role}</span>
      </span>
    </span>
  );
}
