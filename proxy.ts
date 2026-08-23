import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, locales, LOCALE_COOKIE } from "@/lib/i18n";

/**
 * "/" has no content of its own. It forwards to a language, preferring the one
 * the visitor chose on a previous visit (only present if they accepted
 * cookies), then the browser's own Accept-Language, then Indonesian.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const remembered = request.cookies.get(LOCALE_COOKIE)?.value;
  const accepts = request.headers.get("accept-language") ?? "";
  const preferred = accepts.toLowerCase().startsWith("id") ? "id" : "en";

  const locale = isLocale(remembered) ? remembered : accepts ? preferred : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|graphics|og|fonts|photos|favicon.ico|icon.svg|apple-icon.png|robots.txt|sitemap.xml).*)"],
};
