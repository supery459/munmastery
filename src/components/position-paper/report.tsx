"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Radio, RotateCcw, TrendingDown, TrendingUp, WifiOff } from "lucide-react";
import { CRITERION_LABELS } from "@/components/position-paper/analysis";
import { RadarChart } from "@/components/position-paper/radar-chart";
import type { PositionPaperCriterion, PositionPaperReview } from "@/components/position-paper/types";

export function Report({
  review,
  source,
  onReset,
}: {
  review: PositionPaperReview;
  source: "live" | "local" | null;
  onReset: () => void;
}) {
  const criteria = Object.keys(review.criteria) as PositionPaperCriterion[];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col">
      {source && (
        <div className="mb-3 flex justify-end">
          <span
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              source === "live"
                ? "border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald"
                : "border-panel-border text-foreground-muted"
            }`}
            title={source === "live" ? "Graded live by Gemini" : "Live AI unavailable — graded locally"}
          >
            {source === "live" ? <Radio className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {source === "live" ? "Live AI" : "Local grading"}
          </span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel glow-cyan grid grid-cols-1 gap-8 rounded-3xl p-6 sm:p-8 lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center">
          <div className="text-xs text-foreground-muted">Overall score</div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-5xl font-semibold text-foreground">{review.composite}</span>
            <span className="text-lg text-foreground-muted">/ 100</span>
            <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2.5 py-1 text-xs font-medium text-accent-cyan">
              {review.grade}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-foreground-muted">
            <FileText className="h-3.5 w-3.5" />
            {review.wordCount} words
          </p>
          <p className="mt-5 text-sm leading-relaxed text-foreground-muted">{review.summary}</p>
        </div>

        <RadarChart
          values={
            Object.fromEntries(criteria.map((c) => [c, review.criteria[c].score])) as Record<
              PositionPaperCriterion,
              number
            >
          }
        />
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="panel rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <TrendingUp className="h-4 w-4 text-accent-emerald" />
            Strengths
          </div>
          <ul className="flex flex-col gap-2">
            {review.strengths.map((c) => (
              <li key={c} className="text-xs text-foreground-muted">
                <span className="font-medium text-foreground">{CRITERION_LABELS[c]}</span>
                {review.criteria[c].notes[0] ? ` — ${review.criteria[c].notes[0]}` : ""}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <TrendingDown className="h-4 w-4 text-accent-gold" />
            Growth areas
          </div>
          <ul className="flex flex-col gap-2">
            {review.growthAreas.map((c) => (
              <li key={c} className="text-xs text-foreground-muted">
                <span className="font-medium text-foreground">{CRITERION_LABELS[c]}</span>
                {review.criteria[c].notes[0] ? ` — ${review.criteria[c].notes[0]}` : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="panel mt-4 rounded-2xl p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Criterion breakdown</h2>
        <div className="flex flex-col gap-4">
          {criteria.map((c) => (
            <div key={c}>
              <div className="mb-1.5 flex items-baseline justify-between text-xs">
                <span className="text-foreground-muted">{CRITERION_LABELS[c]}</span>
                <span className="font-medium text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {review.criteria[c].score}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06]">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-indigo"
                  style={{ width: `${review.criteria[c].score}%` }}
                />
              </div>
              {review.criteria[c].notes.map((note, i) => (
                <p key={i} className="mt-1.5 text-xs leading-relaxed text-foreground-muted">
                  {note}
                </p>
              ))}
              {review.criteria[c].highlights.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {review.criteria[c].highlights.map((h, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-panel-border px-2 py-0.5 text-[10px] text-foreground-muted"
                    >
                      &ldquo;{h}&rdquo;
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onReset}
          className="glow-cyan glass-hover flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan/90 to-accent-indigo/90 px-6 py-3 text-sm font-medium text-[#05070d]"
        >
          <RotateCcw className="h-4 w-4" />
          Grade another draft
        </button>
        <Link
          href="/learn/clause-structure"
          className="glass glass-hover flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-foreground"
        >
          Review resolution writing
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-foreground-muted hover:text-foreground"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
