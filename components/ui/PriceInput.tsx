"use client";

import { useEffect, useId, useState } from "react";
import { groupDigits, parseDigits } from "@/lib/format";
import type { Locale } from "@/lib/i18n";

/**
 * Reads as money, computes as a number.
 *
 * The visible value is grouped the way the reader's language groups digits;
 * what leaves this component is always the raw integer, so nothing downstream
 * ever has to strip separators back out.
 */
export function PriceInput({
  label,
  value,
  onChange,
  locale,
  placeholder,
  hint,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  locale: Locale;
  placeholder?: string;
  hint?: string;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const [display, setDisplay] = useState(() => (value === null ? "" : groupDigits(String(value), locale)));

  // Reset and shared-link cases push a new value in from outside.
  useEffect(() => {
    setDisplay(value === null ? "" : groupDigits(String(value), locale));
  }, [value, locale]);

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={display}
        placeholder={placeholder}
        aria-describedby={hint ? hintId : undefined}
        onChange={(event) => {
          const grouped = groupDigits(event.target.value, locale);
          setDisplay(grouped);
          onChange(parseDigits(grouped));
        }}
        className="field numeric"
      />
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
