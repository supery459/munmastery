"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQS = [
  {
    question: "Do I need any Model UN experience to start?",
    answer:
      "No. First Conference Mode is built specifically for delegates who have never sat in a committee before — it teaches procedure, speech structure, and negotiation basics from zero before you practice anything live.",
  },
  {
    question: "How does the AI feedback actually work?",
    answer:
      "You practice speeches, motions, and negotiations against an AI chair and AI delegates. Every session is scored on clarity, confidence, procedure accuracy, and persuasiveness, with specific notes tied to what you said — not generic tips.",
  },
  {
    question: "Which committees and formats are supported?",
    answer:
      "General Assembly committees, UNSC, ECOSOC, specialized agencies, and crisis committees are all supported, along with custom topics your school or conference provides. You can practice any assigned country and topic.",
  },
  {
    question: "Is MUN Mastery free to use?",
    answer:
      "Yes. Every tool — the Debate Simulator, Speech Analysis, Crisis Engine, and Learn MUN, including full access to First Conference Mode — is free to use, with no credit card required.",
  },
  {
    question: "Can teachers or advisors use this with a whole team?",
    answer:
      "Yes — advisors can track every delegate's readiness score, assign practice sessions by committee, and review position papers before a conference, all from one shared view.",
  },
  {
    question: "Will this work for online and in-person conferences?",
    answer:
      "Both. The skills you build — speech delivery, procedure, negotiation, and drafting — transfer directly, and the committee simulation mirrors both virtual and in-room dynamics.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto max-w-xl text-center">
          <span className="glass mx-auto flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs text-foreground-muted">
            <HelpCircle className="h-3.5 w-3.5 text-accent-cyan" />
            Frequently asked
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions,{" "}
            <span className="text-gradient-diplomatic">answered</span>
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
                className={`glass overflow-hidden rounded-2xl border transition-colors ${
                  isOpen ? "border-accent-cyan/30" : "border-border-glass"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-foreground sm:text-base">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
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
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm leading-relaxed text-foreground-muted">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
