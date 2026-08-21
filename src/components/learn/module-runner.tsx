"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Circle,
  Lightbulb,
  RotateCcw,
  X,
} from "lucide-react";
import { CATEGORY_META } from "@/components/learn/data";
import { recordActivity } from "@/lib/activity-store";
import type { LearnModule } from "@/components/learn/types";

export function ModuleRunner({ module: learnModule }: { module: LearnModule }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const recordedRef = useRef(false);

  const meta = CATEGORY_META[learnModule.category];
  const step = learnModule.steps[stepIndex];
  const isLast = stepIndex === learnModule.steps.length - 1;
  const quizCount = learnModule.steps.filter((s) => s.type === "quiz").length;

  function handleContinue() {
    if (step.type === "quiz" && selected === step.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
    if (isLast) {
      finish();
      return;
    }
    setStepIndex((i) => i + 1);
    setSelected(null);
  }

  function finish() {
    setDone(true);
    if (recordedRef.current) return;
    recordedRef.current = true;
    recordActivity({
      type: "learn",
      title: learnModule.title,
      subtitle: `${meta.label}${quizCount > 0 ? ` · ${correctCount + (step.type === "quiz" && selected === step.correctIndex ? 1 : 0)}/${quizCount} correct` : ""}`,
      href: `/learn/${learnModule.id}`,
    });
  }

  function retake() {
    setStepIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setDone(false);
    recordedRef.current = false;
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel glow-cyan rounded-3xl p-8 sm:p-10"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-emerald/15">
            <BadgeCheck className="h-7 w-7 text-accent-emerald" />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-foreground sm:text-2xl">Module complete</h1>
          <p className="mt-1 text-sm text-foreground-muted">{learnModule.title}</p>
          {quizCount > 0 && (
            <p className="mt-4 text-sm text-foreground-muted">
              You answered{" "}
              <span className="font-medium text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
                {correctCount}/{quizCount}
              </span>{" "}
              check questions correctly.
            </p>
          )}
          <p className="mt-2 text-xs text-foreground-muted">
            Logged to your activity — this updates your dashboard heatmap and AI Coach.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/learn"
              className="glass-hover flex items-center gap-2 rounded-full border border-panel-border px-5 py-2.5 text-sm font-medium text-foreground"
            >
              Back to Learn hub
            </Link>
            {learnModule.relatedHref && (
              <Link
                href={learnModule.relatedHref}
                className="glow-cyan glass-hover flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan/90 to-accent-indigo/90 px-5 py-2.5 text-sm font-medium text-[#05070d]"
              >
                {learnModule.relatedLabel ?? "Practice this"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
            <button
              onClick={retake}
              className="flex items-center gap-1.5 text-xs font-medium text-foreground-muted hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retake
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-1.5">
        {learnModule.steps.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= stepIndex ? "bg-accent-cyan" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="panel rounded-2xl p-6 sm:p-8"
      >
        {step.type === "content" ? (
          <>
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium"
              style={{ backgroundColor: `${meta.color}1f`, color: meta.color }}
            >
              {meta.label}
            </span>
            <h2 className="mt-3 text-lg font-semibold text-foreground sm:text-xl">{step.heading}</h2>
            <div className="mt-4 flex flex-col gap-3">
              {step.body.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-foreground-muted">
                  {p}
                </p>
              ))}
            </div>
            {step.keyPoints && (
              <ul className="mt-5 flex flex-col gap-2 rounded-xl border border-panel-border bg-white/[0.02] p-4">
                {step.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-foreground-muted">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-gold" />
                    {kp}
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <>
            <span className="inline-block rounded-full bg-accent-indigo/15 px-2.5 py-0.5 text-[10px] font-medium text-accent-indigo">
              Check your understanding
            </span>
            <h2 className="mt-3 text-base font-semibold leading-relaxed text-foreground sm:text-lg">
              {step.question}
            </h2>
            <div className="mt-4 flex flex-col gap-2">
              {step.options.map((option, i) => {
                const isSelected = selected === i;
                const isCorrect = i === step.correctIndex;
                const revealed = selected !== null;
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(i)}
                    disabled={revealed}
                    className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      revealed && isCorrect
                        ? "border-accent-emerald/40 bg-accent-emerald/10 text-foreground"
                        : revealed && isSelected && !isCorrect
                          ? "border-accent-rose/40 bg-accent-rose/10 text-foreground"
                          : "border-panel-border text-foreground-muted hover:border-white/20"
                    }`}
                  >
                    {revealed ? (
                      isCorrect ? (
                        <Check className="h-4 w-4 shrink-0 text-accent-emerald" />
                      ) : isSelected ? (
                        <X className="h-4 w-4 shrink-0 text-accent-rose" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 opacity-30" />
                      )
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 opacity-40" />
                    )}
                    {option}
                  </button>
                );
              })}
            </div>
            {selected !== null && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-panel-border bg-white/[0.02] p-4 text-xs leading-relaxed text-foreground-muted"
              >
                {step.explanation}
              </motion.p>
            )}
          </>
        )}
      </motion.div>

      <div className="mt-6 flex items-center justify-between">
        <Link
          href="/learn"
          className="flex items-center gap-1.5 text-xs font-medium text-foreground-muted hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Exit module
        </Link>
        <button
          onClick={handleContinue}
          disabled={step.type === "quiz" && selected === null}
          className="glow-cyan glass-hover flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan/90 to-accent-indigo/90 px-5 py-2.5 text-sm font-medium text-[#05070d] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLast ? "Finish" : "Continue"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
