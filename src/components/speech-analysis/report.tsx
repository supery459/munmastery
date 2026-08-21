"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Gauge, Radio, RotateCcw, TrendingDown, TrendingUp, WifiOff } from "lucide-react";
import { DIMENSION_LABELS } from "@/components/speech-analysis/analysis";
import { RadarChart } from "@/components/speech-analysis/radar-chart";
import type { SpeechDiagnostic, SpeechDimension } from "@/components/speech-analysis/types";

export function Report({
  diagnostic,
  source,
  onReset,
}: {
  diagnostic: SpeechDiagnostic;
  source: "live" | "local" | null;
  onReset: () => void;
}) {
  const dims = Object.keys(diagnostic.dimensions) as SpeechDimension[];

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
            title={source === "live" ? "Analyzed live by Gemini" : "Live AI unavailable — analyzed locally"}
          >
            {source === "live" ? <Radio className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {source === "live" ? "Live AI" : "Local analysis"}
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
          <div className="text-xs text-foreground-muted">Overall delivery score</div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-5xl font-semibold text-foreground">{diagnostic.composite}</span>
            <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2.5 py-1 text-xs font-medium text-accent-cyan">
              {diagnostic.grade}
            </span>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-foreground-muted">
            <Gauge className="h-3.5 w-3.5" />
            {diagnostic.wordCount} words
            {diagnostic.wpm !== null && (
              <>
                {" "}
                &middot; <span style={{ fontVariantNumeric: "tabular-nums" }}>{diagnostic.wpm}</span> wpm
              </>
            )}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-foreground-muted">
            Strongest dimension:{" "}
            <span className="font-medium text-foreground">{DIMENSION_LABELS[diagnostic.strengths[0]]}</span>. Biggest
            opportunity: <span className="font-medium text-foreground">{DIMENSION_LABELS[diagnostic.growthAreas[0]]}</span>.
          </p>
        </div>

        <RadarChart values={Object.fromEntries(dims.map((d) => [d, diagnostic.dimensions[d].score])) as Record<SpeechDimension, number>} />
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="panel rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <TrendingUp className="h-4 w-4 text-accent-emerald" />
            Strengths
          </div>
          <ul className="flex flex-col gap-2">
            {diagnostic.strengths.map((d) => (
              <li key={d} className="text-xs text-foreground-muted">
                <span className="font-medium text-foreground">{DIMENSION_LABELS[d]}</span>
                {diagnostic.dimensions[d].notes[0] ? ` — ${diagnostic.dimensions[d].notes[0]}` : ""}
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
            {diagnostic.growthAreas.map((d) => (
              <li key={d} className="text-xs text-foreground-muted">
                <span className="font-medium text-foreground">{DIMENSION_LABELS[d]}</span>
                {diagnostic.dimensions[d].notes[0] ? ` — ${diagnostic.dimensions[d].notes[0]}` : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="panel mt-4 rounded-2xl p-5">
        <h2 className="mb-4 text-sm font-semibold text-foreground">Dimension breakdown</h2>
        <div className="flex flex-col gap-4">
          {dims.map((d) => (
            <div key={d}>
              <div className="mb-1.5 flex items-baseline justify-between text-xs">
                <span className="text-foreground-muted">{DIMENSION_LABELS[d]}</span>
                <span className="font-medium text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {diagnostic.dimensions[d].score}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06]">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-indigo"
                  style={{ width: `${diagnostic.dimensions[d].score}%` }}
                />
              </div>
              {diagnostic.dimensions[d].notes.map((note, i) => (
                <p key={i} className="mt-1.5 text-xs leading-relaxed text-foreground-muted">
                  {note}
                </p>
              ))}
              {diagnostic.dimensions[d].highlights.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {diagnostic.dimensions[d].highlights.map((h, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-panel-border px-2 py-0.5 text-[10px] text-foreground-muted"
                    >
                      &ldquo;{h}&rdquo;
                    </span>
                  ))}
                </div>
              )}
              {d === "pacing" && diagnostic.pacingSource !== "recorded" && (
                <p className="mt-1.5 text-[11px] italic text-foreground-muted/80">
                  {diagnostic.pacingSource === "estimated"
                    ? "Estimated from text — record your speech for a precise pacing read."
                    : "Add text to measure pacing."}
                </p>
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
          Analyze another speech
        </button>
        <Link
          href="/simulator"
          className="glass glass-hover flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-foreground"
        >
          Practice in the simulator
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
