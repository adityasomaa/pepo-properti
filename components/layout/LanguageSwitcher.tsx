"use client";

import { usePathname } from "next/navigation";
import { Translate } from "@phosphor-icons/react/dist/ssr";
import { Listbox } from "../ui/Listbox";
import { useTransition } from "../transition/TransitionProvider";
import { rememberLocale } from "@/lib/consent";
import { dictionaries, locales, type Locale } from "@/lib/i18n";

/**
 * Switching language keeps the visitor exactly where they are: the first path
 * segment is swapped and nothing else, so a filtered listing page or a specific
 * property stays on screen in the other language.
 *
 * The choice lives in the URL, which is what makes it survive moving between
 * pages. It is additionally written to storage so the next visit opens in the
 * same language, and to a cookie only if the visitor accepted cookies.
 */
export function LanguageSwitcher({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const pathname = usePathname();
  const { navigate } = useTransition();
  const dict = dictionaries[locale];

  const options = locales.map((code) => ({
    value: code,
    label: dictionaries[code].meta.localeName,
  }));

  const swap = (next: string) => {
    if (next === locale) return;
    rememberLocale(next as Locale);

    const segments = pathname.split("/");
    segments[1] = next;
    const target = segments.join("/") || `/${next}`;

    const search = typeof window !== "undefined" ? window.location.search : "";
    navigate(target + search);
  };

  return (
    <Listbox
      label={dict.lang.choose}
      hideLabel
      value={locale}
      options={options}
      onChange={swap}
      className={compact ? "w-[7.5rem]" : "w-full"}
      triggerClassName={compact ? "min-h-[2.375rem] py-1.5 px-2.5 text-[0.875rem]" : ""}
      renderValue={(option) => (
        <span className="flex items-center gap-2">
          <Translate weight="regular" aria-hidden="true" className="h-4 w-4 flex-none text-ink-muted" />
          <span className="truncate">{compact ? dictionaries[locale].meta.localeShort : option?.label}</span>
        </span>
      )}
    />
  );
}
