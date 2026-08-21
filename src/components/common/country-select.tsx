"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Flag } from "lucide-react";
import { WORLD_COUNTRIES } from "@/lib/world-countries";

/**
 * Searchable delegation picker covering all 193 UN member states plus the
 * Holy See and Palestine. Free text still flows through `onChange` on every
 * keystroke (so a name that doesn't match the list is still usable), but
 * picking a result from the dropdown is the primary path — that commit is
 * reported separately via `onSelect`.
 */
export function CountrySelect({
  value,
  onChange,
  onSelect,
  placeholder = "e.g. France",
  inputClassName = "w-full rounded-xl border border-panel-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent-cyan/40 focus:outline-none",
}: {
  value: string;
  onChange: (name: string) => void;
  /** Fires only on a committed pick (click or Enter) — not on every keystroke — for callers that want to react to an explicit selection. */
  onSelect?: (name: string) => void;
  placeholder?: string;
  inputClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const results = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return WORLD_COUNTRIES.slice(0, 12);
    return WORLD_COUNTRIES.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 12);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  function pick(name: string) {
    onChange(name);
    onSelect?.(name);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          else if (e.key === "Enter" && results.length > 0) {
            e.preventDefault();
            pick(results[0].name);
          }
        }}
        type="text"
        placeholder={placeholder}
        className={inputClassName}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls={listboxId}
      />

      {open && results.length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          className="panel absolute left-0 top-full z-50 mt-1.5 max-h-56 w-full overflow-y-auto rounded-xl p-1 shadow-2xl"
        >
          <ul className="flex flex-col gap-0.5">
            {results.map((c) => (
              <li key={c.code} role="option" aria-selected={c.name === value}>
                <button
                  type="button"
                  onClick={() => pick(c.name)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-white/[0.06]"
                >
                  <Flag className="h-3 w-3 shrink-0 text-foreground-muted" />
                  <span className="truncate">{c.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
