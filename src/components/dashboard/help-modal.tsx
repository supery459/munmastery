"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle, X } from "lucide-react";

const HELP_TOPICS = [
  {
    question: "How do I start a targeted practice session for my conference?",
    answer:
      "Create a portfolio under Portfolios for your upcoming conference (committee, country, and topic), then mark it Active. The Debate Simulator, Speech Analysis, and Position Paper Grader will automatically prefill and tailor themselves to that conference whenever it's active.",
  },
  {
    question: "What's the difference between the Debate Simulator and Crisis Engine?",
    answer:
      "The Debate Simulator runs a full committee session — opening speeches, caucuses, motions, and a scored debrief — against AI delegates. The Crisis Engine is a faster, live situation room with breaking updates and confidential directives, built for crisis-committee practice.",
  },
  {
    question: "How is my speech or position paper actually scored?",
    answer:
      "Every tool sends your draft to Gemini for a live-scored review against specific, named criteria (e.g. confidence, evidence density, or country policy alignment). If live AI is ever unavailable, a local heuristic scorer takes over automatically so you always get a result — the report tells you which one graded you.",
  },
  {
    question: "Where does my activity and progress get saved?",
    answer:
      "Everything is stored locally in your browser under your account — no separate server. That's also why each account only sees its own history, and why clearing your browser data or using a different device starts fresh. You can review or wipe it any time from Settings.",
  },
  {
    question: "Can I practice for more than one conference at a time?",
    answer:
      "Yes — create a separate portfolio per conference. Only one can be Active at a time (that's the one tools tailor to), but you can switch the active portfolio from the Portfolios page whenever you need to.",
  },
];

export function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

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
            aria-labelledby="help-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="glass-panel glow-cyan relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl p-6 sm:p-8"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-foreground-muted hover:bg-white/[0.06] hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
              <HelpCircle className="h-5 w-5 text-accent-cyan" strokeWidth={1.75} />
            </span>
            <h2 id="help-modal-title" className="mt-4 text-xl font-semibold text-foreground">
              Help &amp; docs
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">Quick answers to the most common questions.</p>

            <div className="mt-6 flex flex-col gap-2.5">
              {HELP_TOPICS.map((topic, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={topic.question}
                    className={`overflow-hidden rounded-xl border transition-colors ${
                      isOpen ? "border-accent-cyan/30 bg-white/[0.03]" : "border-panel-border"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-medium text-foreground">{topic.question}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0"
                      >
                        <ChevronDown className="h-4 w-4 text-foreground-muted" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-3.5 text-xs leading-relaxed text-foreground-muted">{topic.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
