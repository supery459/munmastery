"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Target } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { BackLink } from "@/components/nav/back-link";
import { InputPanel } from "@/components/position-paper/input-panel";
import { Report } from "@/components/position-paper/report";
import { analyzePositionPaper, CRITERION_LABELS } from "@/components/position-paper/analysis";
import { fetchReview } from "@/components/position-paper/ai-client";
import { recordActivity } from "@/lib/activity-store";
import { getActivePortfolio } from "@/lib/portfolio-store";
import type { GradeInput, PositionPaperCriterion, PositionPaperReview } from "@/components/position-paper/types";

type Phase = "input" | "grading" | "report";

function PositionPaperGrader() {
  const [phase, setPhase] = useState<Phase>("input");
  const [review, setReview] = useState<PositionPaperReview | null>(null);
  const [source, setSource] = useState<"live" | "local" | null>(null);
  const [savedTo, setSavedTo] = useState<string | null>(null);

  // Only ever renders inside <AuthGate>, so reading portfolio-store directly is safe.
  const activePortfolio = getActivePortfolio();

  // Always recorded — with or without an active portfolio — so a graded
  // draft is never lost; it's just global history when no portfolio is set.
  function logActivity(finalReview: PositionPaperReview) {
    const dims = Object.keys(finalReview.criteria) as PositionPaperCriterion[];
    recordActivity({
      type: "positionPaper",
      title: "Position paper review",
      subtitle: `${finalReview.wordCount} words · strongest in ${CRITERION_LABELS[finalReview.strengths[0]].toLowerCase()}`,
      score: finalReview.composite,
      dimensions: Object.fromEntries(dims.map((d) => [d, finalReview.criteria[d].score])),
      href: "/position-paper-grader",
      portfolioId: activePortfolio?.id ?? null,
    });
    if (activePortfolio) setSavedTo(activePortfolio.conferenceName);
  }

  async function handleGrade(input: GradeInput) {
    setPhase("grading");
    try {
      const live = await fetchReview(input);
      setReview(live);
      setSource("live");
      logActivity(live);
    } catch {
      const local = analyzePositionPaper(input);
      setReview(local);
      setSource("local");
      logActivity(local);
    }
    setPhase("report");
  }

  function handleReset() {
    setReview(null);
    setSource(null);
    setSavedTo(null);
    setPhase("input");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-panel-border bg-panel px-4 py-3 sm:px-6">
        <BackLink href="/dashboard" label="Dashboard" />
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
          <FileText className="h-4 w-4 text-accent-cyan" />
        </span>
        <div>
          <div className="text-sm font-medium text-foreground">Position Paper Grader</div>
          <div className="text-xs text-foreground-muted">AI feedback on your draft position paper</div>
        </div>
      </header>

      <div className="px-4 py-10 sm:px-6">
        {phase === "report" && review ? (
          <>
            {savedTo && (
              <p className="mx-auto mb-4 flex max-w-4xl items-center gap-1.5 text-xs text-accent-emerald">
                <Target className="h-3.5 w-3.5" />
                Saved to your &ldquo;{savedTo}&rdquo; portfolio.
              </p>
            )}
            <Report review={review} source={source} onReset={handleReset} />
          </>
        ) : phase === "grading" ? (
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center py-16 text-center">
            <div className="glass-panel glow-cyan rounded-2xl px-8 py-10">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent-cyan border-t-transparent" />
              <p className="mt-4 text-sm font-medium text-foreground">Reading your draft…</p>
              <p className="mt-1 text-xs text-foreground-muted">Gemini is grading your position paper.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-8 max-w-3xl text-center">
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                Grade your position paper in seconds
              </h1>
              <p className="mt-2 text-sm text-foreground-muted">
                Paste or upload a draft to get a score out of 100 across country policy alignment, topic analysis,
                proposed solutions, and formatting — with specific notes on what to fix next.
              </p>
              {activePortfolio && (
                <p className="mx-auto mt-4 flex w-fit items-center gap-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3.5 py-1.5 text-xs font-medium text-foreground">
                  <Target className="h-3.5 w-3.5 text-accent-cyan" />
                  Targeted for {activePortfolio.conferenceName} — {activePortfolio.committee} · {activePortfolio.country}
                  <Link href="/portfolios" className="ml-1 text-accent-cyan hover:underline">
                    Change
                  </Link>
                </p>
              )}
            </div>
            <InputPanel
              onGrade={handleGrade}
              initialCountry={activePortfolio?.country ?? ""}
              initialTopic={activePortfolio?.agendaTopics[0] ?? ""}
            />
          </>
        )}
      </div>
    </div>
  );
}

export function PositionPaperGraderRoot() {
  return (
    <AuthGate>
      <PositionPaperGrader />
    </AuthGate>
  );
}
