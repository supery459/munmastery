"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { TIMEFRAME_OPTIONS, useTimeframe } from "@/lib/timeframe-context";

export function TimeframeDropdown() {
  const { days, label, setDays } = useTimeframe();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="panel-hover hidden items-center gap-1.5 rounded-lg border border-panel-border px-3 py-2 text-xs font-medium text-foreground sm:flex"
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5 text-foreground-muted" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="panel absolute right-0 top-full z-50 mt-2 w-44 rounded-xl p-1.5 shadow-2xl"
          >
            {TIMEFRAME_OPTIONS.map((opt) => {
              const active = opt.days === days;
              return (
                <button
                  key={opt.label}
                  onClick={() => {
                    setDays(opt.days);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                    active ? "bg-white/[0.06] text-foreground" : "text-foreground-muted hover:bg-white/[0.04] hover:text-foreground"
                  }`}
                >
                  {opt.label}
                  {active && <Check className="h-3.5 w-3.5 text-accent-cyan" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
