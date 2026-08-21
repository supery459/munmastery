"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Siren, X } from "lucide-react";
import { CATEGORY_META } from "@/components/crisis/data";
import type { CrisisEvent } from "@/components/crisis/types";

export function BreakingOverlay({ event, onDismiss }: { event: CrisisEvent | null; onDismiss: () => void }) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -120, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="fixed inset-x-0 top-0 z-[60] overflow-hidden border-b border-accent-rose/40 bg-gradient-to-r from-[#2a0a10] via-[#1a0810] to-[#2a0a10] shadow-2xl"
        >
          <div className="animate-flash-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent-rose/15 to-transparent" />

          <div className="relative mx-auto flex max-w-6xl items-center gap-4 px-4 py-3.5 sm:px-6">
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent-rose px-3 py-1 text-xs font-bold tracking-wider text-white">
              <Siren className="h-3.5 w-3.5 animate-pulse" />
              BREAKING
            </span>
            <span className="hidden shrink-0 rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-medium text-white/80 sm:inline">
              {CATEGORY_META[event.category].label}
            </span>
            <p className="min-w-0 flex-1 truncate text-sm font-medium text-white sm:text-base">
              {event.headline}
            </p>
            <button
              onClick={onDismiss}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
