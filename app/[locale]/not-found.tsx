import { AppLink } from "@/components/AppLink";
import { dictionaries, defaultLocale, path } from "@/lib/i18n";

/**
 * Rendered inside the locale layout. The locale segment is not available to a
 * not-found boundary, so this falls back to the primary language and offers the
 * listing index, which is what someone who followed a dead property link wants.
 */
export default function NotFound() {
  const dict = dictionaries[defaultLocale];

  return (
    <div className="container flex min-h-[60svh] flex-col justify-center py-20">
      <p className="flex items-center gap-3 text-[0.75rem] font-medium uppercase tracking-[0.09em] text-ink-muted">
        <span aria-hidden="true" className="block h-px w-6 flex-none bg-accent" />
        404
      </p>
      <h1 className="mt-4 max-w-[18ch] text-[clamp(1.75rem,1.1rem+2.6vw,3rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink">
        {dict.notFound.headline}
      </h1>
      <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.6] text-ink-muted">
        {dict.notFound.body}
      </p>
      <div className="mt-7">
        <AppLink href={path(defaultLocale, "listings")} className="btn" data-variant="primary">
          {dict.notFound.cta}
        </AppLink>
      </div>
    </div>
  );
}
