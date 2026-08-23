"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CaretDown, Check } from "@phosphor-icons/react/dist/ssr";
import { useOverlay } from "../providers/OverlayProvider";

export type ListboxOption = { value: string; label: string };

/**
 * A real ARIA listbox, not a styled native select.
 *
 * Implements the collapsed-listbox pattern in full: Enter, Space, Arrow keys,
 * Home and End, printable-character type-ahead, Escape to dismiss, and focus
 * returned to the trigger on every exit path. The popup registers itself with
 * the overlay registry, so opening it locks the page scroll and stops Lenis,
 * which is what keeps the popup anchored to its trigger.
 */
export function Listbox({
  label,
  value,
  options,
  onChange,
  placeholder,
  className = "",
  triggerClassName = "",
  name,
  hideLabel = false,
  renderValue,
}: {
  label: string;
  value: string;
  options: ListboxOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  name?: string;
  hideLabel?: boolean;
  renderValue?: (option: ListboxOption | undefined) => React.ReactNode;
}) {
  const reactId = useId();
  const listId = `${reactId}-listbox`;
  const labelId = `${reactId}-label`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ buffer: "", timer: 0 as ReturnType<typeof setTimeout> | 0 });

  useOverlay(listId, open);

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  const close = useCallback(
    (returnFocus: boolean) => {
      setOpen(false);
      setActiveIndex(-1);
      if (returnFocus) triggerRef.current?.focus();
    },
    []
  );

  const openList = useCallback(
    (startAt?: number) => {
      setActiveIndex(startAt ?? (selectedIndex >= 0 ? selectedIndex : 0));
      setOpen(true);
    },
    [selectedIndex]
  );

  const commit = useCallback(
    (index: number) => {
      const option = options[index];
      if (option) onChange(option.value);
      close(true);
    },
    [close, onChange, options]
  );

  // Focus the list when it opens, so arrow keys land somewhere sensible.
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  // Keep the active option in view inside a scrolling popup.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  // Dismiss on an outside press, and on the tab losing focus entirely.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      close(false);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open, close]);

  useEffect(() => {
    return () => {
      if (typeahead.current.timer) clearTimeout(typeahead.current.timer);
    };
  }, []);

  const runTypeahead = useCallback(
    (char: string, from: number) => {
      const state = typeahead.current;
      if (state.timer) clearTimeout(state.timer);
      state.buffer += char.toLowerCase();
      state.timer = setTimeout(() => {
        state.buffer = "";
      }, 600);

      const buffer = state.buffer;
      // A repeated single character cycles through matches, per the pattern.
      const repeated = buffer.length > 1 && buffer.split("").every((c) => c === buffer[0]);
      const needle = repeated ? buffer[0] : buffer;
      const start = repeated ? from + 1 : from;

      for (let step = 0; step < options.length; step++) {
        const i = (start + step) % options.length;
        if (options[i].label.toLowerCase().startsWith(needle)) return i;
      }
      return -1;
    },
    [options]
  );

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
      case "Enter":
      case " ":
        event.preventDefault();
        openList();
        break;
      case "Home":
        event.preventDefault();
        openList(0);
        break;
      case "End":
        event.preventDefault();
        openList(options.length - 1);
        break;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          const next = runTypeahead(event.key, Math.max(selectedIndex, 0));
          if (next >= 0) {
            event.preventDefault();
            onChange(options[next].value);
          }
        }
    }
  };

  const onListKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => Math.min(options.length - 1, i + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        close(true);
        break;
      case "Tab":
        close(false);
        break;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          const next = runTypeahead(event.key, activeIndex < 0 ? 0 : activeIndex);
          if (next >= 0) {
            event.preventDefault();
            setActiveIndex(next);
          }
        }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <span id={labelId} className={hideLabel ? "sr-only-focusable" : "field-label"}>
        {label}
      </span>

      {name ? <input type="hidden" name={name} value={value} /> : null}

      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${reactId}-value`}
        onClick={() => (open ? close(false) : openList())}
        onKeyDown={onTriggerKeyDown}
        className={`field flex w-full items-center justify-between gap-2 text-left ${triggerClassName}`}
      >
        <span id={`${reactId}-value`} className={`truncate ${selected ? "text-ink" : "text-ink-muted"}`}>
          {renderValue ? renderValue(selected) : selected ? selected.label : placeholder ?? ""}
        </span>
        <CaretDown
          weight="regular"
          aria-hidden="true"
          className={`h-4 w-4 flex-none text-ink-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={activeIndex >= 0 ? `${reactId}-opt-${activeIndex}` : undefined}
          onKeyDown={onListKeyDown}
          className="absolute left-0 right-0 top-[calc(100%+0.375rem)] z-[var(--z-overlay)] max-h-64 overflow-y-auto rounded-[var(--radius-field)] border border-line bg-white py-1 shadow-[0_18px_40px_-24px_rgba(18,38,29,0.55)] focus-visible:outline-none"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value || `opt-${index}`}
                id={`${reactId}-opt-${index}`}
                role="option"
                data-index={index}
                aria-selected={isSelected}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => commit(index)}
                className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-[0.9375rem] leading-snug ${
                  isActive ? "bg-surface text-ink" : "text-ink"
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {isSelected ? (
                  <Check weight="bold" aria-hidden="true" className="h-4 w-4 flex-none text-accent-ink" />
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
