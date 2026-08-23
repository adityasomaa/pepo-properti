"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useTransition } from "./transition/TransitionProvider";

type Props = ComponentProps<typeof NextLink>;

/**
 * Every in-site link goes through here so the curtain owns the navigation.
 * Modified clicks, middle clicks, and new-tab targets fall through to the
 * browser untouched, and the underlying anchor keeps a real href so the link
 * still works if the script never runs.
 */
export function AppLink({ href, onClick, ...rest }: Props) {
  const { navigate } = useTransition();

  return (
    <NextLink
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const target = (rest as { target?: string }).target;
        if (target && target !== "_self") return;

        event.preventDefault();
        navigate(typeof href === "string" ? href : String(href));
      }}
      {...rest}
    />
  );
}
