"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gavel, Mic, Play, Sparkles } from "lucide-react";
import { useSignUpModal } from "@/components/marketing/signup-modal-context";

const VALUE_POINTS = [
  { icon: Mic, label: "Practice speeches with AI" },
  { icon: Gavel, label: "Drill parliamentary procedure" },
  { icon: Sparkles, label: "Get feedback in real time" },
];

const STATS = [
  { value: "38,000+", label: "Delegates trained" },
  { value: "150+", label: "MUN programs" },
  { value: "4.9/5", label: "Average rating" },
  { value: "2.3x", label: "Avg. score improvement" },
];

export function Hero() {
  const { openSignUp } = useSignUpModal();

  return (
    <section className="relative px-4 pt-16 pb-16 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass mx-auto mb-8 flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs text-foreground-muted"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
          New: First Conference Mode for total beginners
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-3xl text-center text-4xl font-semibold leading-tight tracking-tight sm:text-6xl"
        >
          <span className="text-gradient-diplomatic">
            Train for Model UN with AI.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-xl text-center text-base text-foreground-muted sm:text-lg"
        >
          Practice speeches, drill parliamentary procedure, and get instant
          feedback from an AI chair — so you walk into committee ready to
          lead, not guess.
        </motion.p>

        {/* Three-glance value scan: the whole pitch, readable in under 5 seconds */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mx-auto mt-7 flex max-w-2xl flex-wrap items-center justify-center gap-3"
        >
          {VALUE_POINTS.map((point) => (
            <span
              key={point.label}
              className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground"
            >
              <point.icon className="h-4 w-4 text-accent-cyan" strokeWidth={1.75} />
              {point.label}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.36 }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            onClick={openSignUp}
            className="glow-cyan glass-hover group flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan/90 to-accent-indigo/90 px-6 py-3 text-sm font-medium text-[#05070d] transition-transform"
          >
            Start training free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <a
            href="#preview"
            className="glass glass-hover flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-foreground"
          >
            <Play className="h-4 w-4 text-accent-gold" />
            Watch 2-min demo
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-4 text-center text-xs text-foreground-muted"
        >
          No credit card required · Cancel anytime · Built with real MUN chairs
        </motion.p>

        {/* Hero visual: a live-feeling preview of the AI feedback product */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="glass-panel glow-indigo relative mx-auto mt-16 max-w-4xl overflow-hidden rounded-3xl p-5 sm:p-8"
        >
          <SpeechPreview />

          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border-glass pt-8 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-semibold text-foreground sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-foreground-muted sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SpeechPreview() {
  return (
    <div className="rounded-2xl border border-border-glass bg-background-elevated/60 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-emerald" />
          <span className="text-xs font-medium text-foreground-muted">
            AI Chair &middot; Live Feedback
          </span>
        </div>
        <span className="glass rounded-full px-3 py-1 text-xs font-medium text-accent-emerald">
          92 · Clarity Score
        </span>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-foreground sm:text-base">
        &ldquo;The delegation of{" "}
        <span className="rounded bg-accent-cyan/15 px-1 text-accent-cyan">
          France
        </span>{" "}
        firmly believes that this council must act decisively on the issue of
        maritime security,{" "}
        <span className="rounded bg-accent-gold/20 px-1 text-accent-gold underline decoration-dotted underline-offset-4">
          um
        </span>{" "}
        and calls on all member states to co-sponsor the working paper
        currently on the floor.&rdquo;
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="glass rounded-full px-3 py-1.5 text-xs text-foreground">
          <span className="mr-1 text-accent-cyan">●</span> Strong, confident opening
        </span>
        <span className="glass rounded-full px-3 py-1.5 text-xs text-foreground">
          <span className="mr-1 text-accent-gold">●</span> 1 filler word detected
        </span>
        <span className="glass rounded-full px-3 py-1.5 text-xs text-foreground">
          <span className="mr-1 text-accent-emerald">●</span> Clear call to action
        </span>
      </div>
    </div>
  );
}
