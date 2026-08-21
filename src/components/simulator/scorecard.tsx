"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, ChevronDown, Radio, RotateCcw, Target, TrendingDown, TrendingUp, WifiOff } from "lucide-react";
import { scoreSession, DIMENSION_LABELS } from "@/components/simulator/scoring";
import { fetchScorecard } from "@/components/simulator/ai-client";
import { RadarChart } from "@/components/simulator/radar-chart";
import { TranscriptFeed } from "@/components/simulator/transcript-feed";
import { recordActivity } from "@/lib/activity-store";
import { getActivePortfolio } from "@/lib/portfolio-store";
import { BackLink } from "@/components/nav/back-link";
import type { ScoreDimension, ScoreResult, SessionResult } from "@/components/simulator/types";

export function Scorecard({ result, onRestart }: { result: SessionResult; onRestart: () => void }) {
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [source, setSource] = useState<"live" | "local" | null>(null);
  const [savedTo, setSavedTo] = useState<string | null>(null);
  const recordedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    function logActivity(finalScore: ScoreResult) {
      if (recordedRef.current) return;
      recordedRef.current = true;
      const dims = Object.keys(finalScore.dimensions) as ScoreDimension[];
      const title = `${result.config.country.name} in ${result.config.committee.shortName}`;

      // Only ever renders inside <AuthGate>, so reading portfolio-store directly is safe.
      const activePortfolio = getActivePortfolio();
      recordActivity({
        type: "simulation",
        title,
        subtitle: result.config.topic.title,
        score: finalScore.composite,
        dimensions: Object.fromEntries(dims.map((d) => [d, finalScore.dimensions[d].score])),
        href: "/simulator",
        portfolioId: activePortfolio?.id ?? null,
      });
      if (activePortfolio) setSavedTo(activePortfolio.conferenceName);
    }

    (async () => {
      try {
        const live = await fetchScorecard(result.config, result.speeches);
        if (!cancelled) {
          setScore(live);
          setSource("live");
          logActivity(live);
        }
      } catch {
        if (!cancelled) {
          const local = scoreSession(result.speeches, result.config);
          setScore(local);
          setSource("local");
          logActivity(local);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result]);

  const { config } = result;

  if (!score) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex items-center gap-2 self-start">
          <BackLink href="/dashboard" label="Dashboard" />
        </div>
        <div className="glass-panel glow-cyan rounded-2xl px-8 py-10">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent-cyan border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-foreground">Compiling your executive debrief…</p>
          <p className="mt-1 text-xs text-foreground-muted">Gemini is grading your session transcript.</p>
        </div>
      </div>
    );
  }

  const dims = Object.keys(score.dimensions) as ScoreDimension[];

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center gap-2">
        <BackLink href="/dashboard" label="Dashboard" />
      </div>

      {savedTo && (
        <p className="mb-3 flex items-center gap-1.5 text-xs text-accent-emerald">
          <Target className="h-3.5 w-3.5" />
          Saved to your &ldquo;{savedTo}&rdquo; portfolio.
        </p>
      )}

      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Award className="h-3.5 w-3.5 text-accent-gold" />
          Executive debrief
        </div>
        {source && (
          <span
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              source === "live"
                ? "border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald"
                : "border-panel-border text-foreground-muted"
            }`}
            title={source === "live" ? "Graded live by Gemini" : "Live AI unavailable — graded by the local scorer"}
          >
            {source === "live" ? <Radio className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {source === "live" ? "Live AI" : "Local scoring"}
          </span>
        )}
      </div>
      <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
        {config.country.name} in {config.committee.shortName}
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">{config.topic.title}</p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel glow-cyan mt-6 grid grid-cols-1 gap-8 rounded-3xl p-6 sm:p-8 lg:grid-cols-2"
      >
        <div className="flex flex-col justify-center">
          <div className="text-xs text-foreground-muted">Composite readiness score</div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-5xl font-semibold text-foreground">{score.composite}</span>
            <span className="rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-2.5 py-1 text-xs font-medium text-accent-cyan">
              {score.grade}
            </span>
          </div>
          <p className="mt-2 text-xs text-foreground-muted">
            Better than <span style={{ fontVariantNumeric: "tabular-nums" }}>{score.percentile}%</span> of simulated
            delegates in this committee
          </p>
          <p className="mt-5 text-sm leading-relaxed text-foreground-muted">{score.summary}</p>
        </div>

        <RadarChart values={Object.fromEntries(dims.map((d) => [d, score.dimensions[d].score])) as Record<ScoreDimension, number>} />
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="panel rounded-2xl p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <TrendingUp className="h-4 w-4 text-accent-emerald" />
            Strengths
          </div>
          <ul className="flex flex-col gap-2">
            {score.strengths.map((d) => (
              <li key={d} className="text-xs text-foreground-muted">
                <span className="font-medium text-foreground">{DIMENSION_LABELS[d]}</span>
                {score.dimensions[d].notes[0] ? ` — ${score.dimensions[d].notes[0]}` : ""}
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
            {score.growthAreas.map((d) => (
              <li key={d} className="text-xs text-foreground-muted">
                <span className="font-medium text-foreground">{DIMENSION_LABELS[d]}</span>
                {score.dimensions[d].notes[0] ? ` — ${score.dimensions[d].notes[0]}` : ""}
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
                  {score.dimensions[d].score}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06]">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-indigo"
                  style={{ width: `${score.dimensions[d].score}%` }}
                />
              </div>
              {score.dimensions[d].notes.map((note, i) => (
                <p key={i} className="mt-1.5 text-xs leading-relaxed text-foreground-muted">
                  {note}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="panel mt-4 overflow-hidden rounded-2xl">
        <button
          onClick={() => setTranscriptOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <span className="text-sm font-semibold text-foreground">Full session transcript</span>
          <motion.span animate={{ rotate: transcriptOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4 text-foreground-muted" />
          </motion.span>
        </button>
        {transcriptOpen && (
          <div className="max-h-[420px] overflow-y-auto border-t border-panel-border px-5 py-5">
            <TranscriptFeed entries={result.transcript} />
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={onRestart}
          className="glow-cyan glass-hover flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan/90 to-accent-indigo/90 px-6 py-3 text-sm font-medium text-[#05070d]"
        >
          <RotateCcw className="h-4 w-4" />
          Run another simulation
        </button>
        <Link
          href="/dashboard"
          className="glass glass-hover flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-foreground"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
