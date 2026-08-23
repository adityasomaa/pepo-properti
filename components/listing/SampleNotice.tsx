import { Info } from "@phosphor-icons/react/dist/ssr";
import { SAMPLE_DATA } from "@/content/listings";

/**
 * States on screen that the properties are examples.
 *
 * Driven by the SAMPLE_DATA flag in content/listings.ts, so the day real
 * listings replace the placeholders, flipping that one value removes this
 * notice from every page at once.
 */
export function SampleNotice({ text, badge }: { text: string; badge: string }) {
  if (!SAMPLE_DATA) return null;

  return (
    <p className="flex items-start gap-3 rounded-[var(--radius-card)] border border-accent/25 bg-accent/[0.06] p-4 text-[0.875rem] leading-relaxed text-ink">
      <Info weight="regular" aria-hidden="true" className="mt-0.5 h-[1.125rem] w-[1.125rem] flex-none text-accent-ink" />
      <span>
        <span className="font-medium text-accent-ink">{badge}. </span>
        {text}
      </span>
    </p>
  );
}
