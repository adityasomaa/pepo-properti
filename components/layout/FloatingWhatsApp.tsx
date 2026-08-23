"use client";

import { usePathname } from "next/navigation";
import { WhatsAppLink } from "../WhatsAppLink";
import { useOverlayRegistry } from "../providers/OverlayProvider";
import { site } from "@/content/site";
import type { Dictionary, Locale } from "@/lib/i18n";

/**
 * Small screens do not keep the header CTA in view, so the enquiry route rides
 * along. It sits above whatever height the cookie banner currently reports, so
 * the banner can never take a press meant for this button, and it steps aside
 * entirely while an overlay owns the screen.
 */
export function FloatingWhatsApp({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const { anyOpen } = useOverlayRegistry();

  if (anyOpen) return null;

  return (
    <div
      className="fixed right-4 z-[var(--z-raised)] lg:hidden"
      style={{ bottom: "calc(1rem + var(--cookie-h, 0px) + env(safe-area-inset-bottom, 0px))" }}
    >
      <WhatsAppLink
        locale={locale}
        pageUrl={site.url + pathname}
        buttonLabel={dict.common.askWhatsApp}
        placement="floating"
        variant="primary"
        className="shadow-[0_14px_30px_-14px_rgba(18,38,29,0.7)]"
      />
    </div>
  );
}
