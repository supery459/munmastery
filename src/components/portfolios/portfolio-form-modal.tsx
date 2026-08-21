"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FolderKanban, X } from "lucide-react";
import { COMMITTEES } from "@/components/simulator/data";
import { CountrySelect } from "@/components/common/country-select";
import type { Portfolio, PortfolioInput } from "@/lib/portfolio-store";

export function PortfolioFormModal({
  open,
  portfolio,
  onClose,
  onSubmit,
}: {
  open: boolean;
  /** Present when editing an existing portfolio; absent when creating a new one. */
  portfolio?: Portfolio;
  onClose: () => void;
  onSubmit: (input: PortfolioInput) => void;
}) {
  // Initialized once from `portfolio` — callers remount this component (via a
  // changing `key`) each time it opens, so these lazy initializers pick up
  // fresh values without needing an effect to resynchronize them.
  const [conferenceName, setConferenceName] = useState(portfolio?.conferenceName ?? "");
  const [committee, setCommittee] = useState(portfolio?.committee ?? "");
  const [country, setCountry] = useState(portfolio?.country ?? "");
  const [agendaTopicsText, setAgendaTopicsText] = useState(portfolio?.agendaTopics.join("\n") ?? "");
  const [startDate, setStartDate] = useState(portfolio?.startDate ?? "");
  const [endDate, setEndDate] = useState(portfolio?.endDate ?? "");
  const [deadline, setDeadline] = useState(portfolio?.positionPaperDeadline ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!conferenceName.trim()) {
      setError("Enter a conference name.");
      return;
    }
    if (!committee.trim()) {
      setError("Enter or select an assigned committee.");
      return;
    }
    if (!country.trim()) {
      setError("Enter or select a country delegation.");
      return;
    }

    onSubmit({
      conferenceName: conferenceName.trim(),
      committee: committee.trim(),
      country: country.trim(),
      agendaTopics: agendaTopicsText
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
      startDate: startDate || null,
      endDate: endDate || null,
      positionPaperDeadline: deadline || null,
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-form-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-panel glow-cyan relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted hover:bg-white/[0.06] hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
              <FolderKanban className="h-5 w-5 text-accent-cyan" strokeWidth={1.75} />
            </span>
            <h2 id="portfolio-form-title" className="mt-4 text-xl font-semibold text-foreground">
              {portfolio ? "Edit portfolio" : "New conference portfolio"}
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              Save your assignment once — practice tools can tailor themselves to it automatically.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3.5">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground-muted">Conference name</span>
                <input
                  value={conferenceName}
                  onChange={(e) => setConferenceName(e.target.value)}
                  type="text"
                  placeholder="e.g. Ivy League Model UN 2026"
                  className="w-full rounded-xl border border-panel-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent-cyan/40 focus:outline-none"
                />
              </label>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-foreground-muted">Assigned committee</span>
                  <input
                    value={committee}
                    onChange={(e) => setCommittee(e.target.value)}
                    type="text"
                    list="portfolio-committee-options"
                    placeholder="e.g. UNSC"
                    className="w-full rounded-xl border border-panel-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent-cyan/40 focus:outline-none"
                  />
                  <datalist id="portfolio-committee-options">
                    {COMMITTEES.map((c) => (
                      <option key={c.id} value={c.name} />
                    ))}
                  </datalist>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-foreground-muted">Country delegation</span>
                  <CountrySelect value={country} onChange={setCountry} placeholder="e.g. France" />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-foreground-muted">Agenda topics (one per line)</span>
                <textarea
                  value={agendaTopicsText}
                  onChange={(e) => setAgendaTopicsText(e.target.value)}
                  rows={3}
                  placeholder={"Maritime security in the Indo-Pacific\nSovereign debt relief"}
                  className="w-full resize-none rounded-xl border border-panel-border bg-background px-3.5 py-2.5 text-sm leading-relaxed text-foreground placeholder:text-foreground-muted focus:border-accent-cyan/40 focus:outline-none"
                />
              </label>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-foreground-muted">Start date</span>
                  <input
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    type="date"
                    className="w-full rounded-xl border border-panel-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-accent-cyan/40 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-foreground-muted">End date</span>
                  <input
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    type="date"
                    className="w-full rounded-xl border border-panel-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-accent-cyan/40 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-foreground-muted">Paper deadline</span>
                  <input
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    type="date"
                    className="w-full rounded-xl border border-panel-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-accent-cyan/40 focus:outline-none"
                  />
                </label>
              </div>

              {error && (
                <p role="alert" className="text-xs text-accent-rose">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="glow-cyan glass-hover mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-cyan/90 to-accent-indigo/90 px-5 py-3 text-sm font-medium text-[#05070d]"
              >
                {portfolio ? "Save changes" : "Create portfolio"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
