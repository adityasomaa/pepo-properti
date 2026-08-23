"use client";

import { LOCALE_COOKIE, type Locale } from "./i18n";

/**
 * The cookie banner on this site changes something real.
 *
 * Accepting lets the language choice persist as a cookie, which the middleware
 * reads on the next visit so "/" opens straight into the right language.
 * Declining keeps the choice in sessionStorage instead, so it survives moving
 * between pages in this tab and nothing more, and actively clears any cookie
 * that was already set.
 */

export const CONSENT_COOKIE = "pepo_consent";
export type Consent = "granted" | "denied";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax${secure}`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export function getConsent(): Consent | null {
  const raw = readCookie(CONSENT_COOKIE);
  return raw === "granted" || raw === "denied" ? raw : null;
}

export function setConsent(value: Consent) {
  writeCookie(CONSENT_COOKIE, value, 365);
  if (value === "denied") {
    // Withdrawing consent has to take effect immediately, not next visit.
    deleteCookie(LOCALE_COOKIE);
  } else {
    const remembered = sessionStorage.getItem(LOCALE_COOKIE);
    if (remembered) writeCookie(LOCALE_COOKIE, remembered, 365);
  }
}

/** Called whenever the visitor picks a language. */
export function rememberLocale(locale: Locale) {
  try {
    sessionStorage.setItem(LOCALE_COOKIE, locale);
  } catch {
    /* private mode, nothing to do */
  }
  if (getConsent() === "granted") writeCookie(LOCALE_COOKIE, locale, 365);
}
