import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { AppLink } from "./AppLink";

/**
 * Every section on this site opens the same way and in the same order:
 * section label, headline, one short line of description, then the call to
 * action. Sections are told apart by their content and their layout below the
 * header, never by inventing a different header shape.
 *
 * The label is a section index, not decoration: it names where the reader is.
 * It is preceded by a short accent rule so it reads as part of a system rather
 * than as a floating tag.
 */
export function SectionHeader({
  label,
  headline,
  description,
  cta,
  tone = "light",
  as: Heading = "h2",
  id,
}: {
  label: string;
  headline: string;
  description: string;
  cta?: { href: string; label: string } | React.ReactNode;
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  id?: string;
}) {
  const dark = tone === "dark";

  return (
    <header className="max-w-[46rem]">
      <p className={`flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.09em] ${dark ? "text-on-forest-muted" : "text-ink-muted"}`}>
        <span aria-hidden="true" className="block h-px w-6 flex-none bg-accent" />
        {label}
      </p>

      <Heading
        id={id}
        className={`mt-4 text-[clamp(1.75rem,1.1rem+2.6vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em] ${dark ? "text-on-forest" : "text-ink"}`}
      >
        {headline}
      </Heading>

      <p className={`mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.6] ${dark ? "text-on-forest-muted" : "text-ink-muted"}`}>
        {description}
      </p>

      {cta ? (
        <div className="mt-7 flex flex-wrap gap-3">
          {isLinkCta(cta) ? (
            <AppLink href={cta.href} className="btn" data-variant={dark ? "secondary" : "secondary"}>
              <span>{cta.label}</span>
              <ArrowRight weight="regular" aria-hidden="true" className="btn__icon" />
            </AppLink>
          ) : (
            cta
          )}
        </div>
      ) : null}
    </header>
  );
}

function isLinkCta(value: unknown): value is { href: string; label: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "href" in value &&
    "label" in value &&
    typeof (value as { href: unknown }).href === "string"
  );
}
