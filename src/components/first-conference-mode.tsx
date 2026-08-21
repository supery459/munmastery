"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Check,
  Compass,
  Flag,
  GraduationCap,
  MessageSquare,
} from "lucide-react";

const STEPS = [
  {
    icon: Flag,
    title: "Pick your committee & country",
    short: "Choose your assignment",
    detail:
      "Select from real committee topics — UNSC, ECOSOC, crisis, or your school's own conference — and get matched with a country profile, briefed on its priorities in minutes.",
  },
  {
    icon: BookOpen,
    title: "Learn the basics, fast",
    short: "5-minute procedure crash course",
    detail:
      "A bite-sized walkthrough of motions, points, and speakers' lists — built for people who have never sat in a committee room before. No jargon left unexplained.",
  },
  {
    icon: Compass,
    title: "Practice with AI delegates",
    short: "Low-stakes committee simulation",
    detail:
      "Run a mock session against AI delegates who ask follow-up questions, raise points of order, and negotiate — so your first real committee doesn't feel like your first.",
  },
  {
    icon: MessageSquare,
    title: "Get real-time coaching",
    short: "Feedback on every speech",
    detail:
      "Every speech, motion, and negotiation gets scored on clarity, confidence, and diplomacy — with specific, actionable notes instead of a vague grade.",
  },
  {
    icon: GraduationCap,
    title: "Walk in ready",
    short: "Conference-day checklist",
    detail:
      "Arrive with a position paper, opening speech, and a plan for your bloc — plus a final readiness score so you know exactly where you stand before gavel-in.",
  },
];

export function FirstConferenceMode() {
  const [active, setActive] = useState(0);

  return (
    <section id="first-conference" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <span className="glass mx-auto flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs text-foreground-muted">
            <GraduationCap className="h-3.5 w-3.5 text-accent-emerald" />
            Beginner-friendly onboarding
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            Never been to a conference?{" "}
            <span className="text-gradient-diplomatic">Start here.</span>
          </h2>
          <p className="mt-4 text-foreground-muted">
            First Conference Mode is a guided path built for delegates with
            zero MUN experience — from your first motion to your first gavel.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* Step list */}
          <ol className="flex flex-col gap-2">
            {STEPS.map((step, i) => {
              const isActive = i === active;
              return (
                <li key={step.title}>
                  <button
                    onClick={() => setActive(i)}
                    className={`glass-hover flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
                      isActive
                        ? "border-accent-cyan/40 bg-surface-glass-hover"
                        : "border-border-glass bg-surface-glass"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                        isActive
                          ? "bg-gradient-to-br from-accent-cyan to-accent-indigo text-[#05070d]"
                          : "bg-white/5 text-foreground-muted"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-medium ${
                          isActive ? "text-foreground" : "text-foreground-muted"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="block truncate text-xs text-foreground-muted">
                        {step.short}
                      </span>
                    </span>
                    <step.icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? "text-accent-cyan" : "text-foreground-muted"
                      }`}
                    />
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Detail panel */}
          <div className="glass-panel glow-cyan relative overflow-hidden rounded-3xl p-7 sm:p-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
                  {(() => {
                    const Icon = STEPS[active].icon;
                    return <Icon className="h-5 w-5 text-accent-cyan" strokeWidth={1.75} />;
                  })()}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-foreground sm:text-2xl">
                  Step {active + 1}: {STEPS[active].title}
                </h3>
                <p className="mt-3 leading-relaxed text-foreground-muted">
                  {STEPS[active].detail}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {["No prior experience required", "Guided the whole way", "Cancel anytime"].map(
                    (item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-foreground-muted"
                      >
                        <Check className="h-4 w-4 text-accent-emerald" strokeWidth={2} />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= active ? "bg-accent-cyan" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
