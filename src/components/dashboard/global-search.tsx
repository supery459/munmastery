"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { search, searchShortcuts, type SearchResult } from "@/lib/search-index";

function groupResults(results: SearchResult[]): [string, SearchResult[]][] {
  const groups = new Map<string, SearchResult[]>();
  for (const r of results) {
    const list = groups.get(r.group) ?? [];
    list.push(r);
    groups.set(r.group, list);
  }
  return Array.from(groups.entries());
}

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => (query.trim() ? search(query) : searchShortcuts()), [query]);
  const grouped = useMemo(() => groupResults(results), [results]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter" && results.length > 0) {
      go(results[0].href);
    }
  }

  return (
    <div ref={containerRef} className="relative ml-1 hidden max-w-xs flex-1 sm:block lg:ml-6">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-muted" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search modules, topics, conferences…"
        className="panel-hover w-full rounded-lg border border-panel-border bg-panel py-2 pl-9 pr-8 text-xs text-foreground placeholder:text-foreground-muted focus:border-accent-cyan/40 focus:outline-none"
      />
      {query && (
        <button
          onClick={() => {
            setQuery("");
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="panel absolute left-0 top-full z-50 mt-2 max-h-[70vh] w-[22rem] overflow-y-auto rounded-2xl p-2 shadow-2xl"
          >
            {results.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-foreground-muted">
                No matches for &ldquo;{query}&rdquo;.
              </p>
            ) : (
              grouped.map(([group, items]) => (
                <div key={group} className="mb-1 last:mb-0">
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground-muted/70">
                    {group}
                  </div>
                  <ul className="flex flex-col gap-0.5">
                    {items.map((r) => (
                      <li key={r.id}>
                        <button
                          onClick={() => go(r.href)}
                          className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.06]">
                            <r.icon className="h-3.5 w-3.5 text-accent-cyan" strokeWidth={1.75} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <div className="truncate text-xs font-medium text-foreground">{r.title}</div>
                            <div className="truncate text-[11px] text-foreground-muted">{r.subtitle}</div>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
