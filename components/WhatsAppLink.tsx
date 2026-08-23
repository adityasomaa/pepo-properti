"use client";

import { useEffect, useRef, useState } from "react";
import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { inquiryMessage, whatsappUrl, type InquiryListing } from "@/lib/whatsapp";
import type { Locale } from "@/lib/i18n";

type Variant = "primary" | "secondary" | "ghost" | "bare";

/**
 * The single way this site opens WhatsApp.
 *
 * It stamps two things into every message without the caller thinking about
 * it: the URL of the page the visitor was on, and the label of the button they
 * pressed. Two buttons on the same page therefore produce distinguishable
 * enquiries, which is the point.
 *
 * `pageUrl` is the canonical URL worked out on the server, so the href is
 * already correct in the initial HTML. Once mounted, and again at click time,
 * it is replaced with the exact current URL, which picks up any filters the
 * visitor had applied.
 */
export function WhatsAppLink({
  locale,
  pageUrl,
  buttonLabel,
  placement,
  listing,
  variant = "primary",
  className = "",
  children,
  showIcon = true,
}: {
  locale: Locale;
  pageUrl: string;
  buttonLabel: string;
  /** Where this button sits on the page, for enquiry tracing. */
  placement: string;
  listing?: InquiryListing;
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [href, setHref] = useState(() =>
    whatsappUrl(inquiryMessage(locale, { pageUrl, buttonLabel, placement }, listing))
  );

  const build = (url: string) =>
    whatsappUrl(inquiryMessage(locale, { pageUrl: url, buttonLabel, placement }, listing));

  useEffect(() => {
    setHref(build(window.location.href));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, pageUrl, buttonLabel, placement, listing?.code]);

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-variant={variant}
      className={`btn ${className}`}
      onPointerDown={() => {
        // Re-stamp at the last possible moment so client-side filter changes,
        // which never touch the router, are still reflected in the message.
        if (ref.current) ref.current.href = build(window.location.href);
      }}
    >
      {showIcon ? <WhatsappLogo weight="regular" aria-hidden="true" className="btn__icon" /> : null}
      <span>{children ?? buttonLabel}</span>
    </a>
  );
}
