import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./ui/Reveal";
import { AppLink } from "./AppLink";
import { path, type Locale } from "@/lib/i18n";

/**
 * Shared shell for the two legal pages. Both are plain descriptions of how this
 * site behaves; neither carries a figure, a date, or a claim that has not been
 * supplied by the business.
 */
export function LegalPage({
  locale,
  label,
  headline,
  description,
  ctaLabel,
  sections,
}: {
  locale: Locale;
  label: string;
  headline: string;
  description: string;
  ctaLabel: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <div className="container pt-12 md:pt-20">
      <Reveal>
        <SectionHeader
          as="h1"
          label={label}
          headline={headline}
          description={description}
          cta={{ href: path(locale, "contact"), label: ctaLabel }}
        />
      </Reveal>

      <div className="mt-12 max-w-[68ch]">
        {sections.map((section, index) => (
          <section key={section.heading} className={index ? "mt-10" : ""}>
            <h2 className="text-[1.125rem] font-medium tracking-[-0.02em] text-ink">{section.heading}</h2>
            <p className="mt-2.5 text-[1.0625rem] leading-[1.7] text-ink-muted">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
