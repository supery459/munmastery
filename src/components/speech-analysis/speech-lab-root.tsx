"use client";

import { useState } from "react";
import Link from "next/link";
import { Mic, Target } from "lucide-react";
import { AuthGate } from "@/components/auth/auth-gate";
import { InputPanel } from "@/components/speech-analysis/input-panel";
import { Report } from "@/components/speech-analysis/report";
import { analyzeSpeech, DIMENSION_LABELS } from "@/components/speech-analysis/analysis";
import { fetchDiagnostic } from "@/components/speech-analysis/ai-client";
import { recordActivity } from "@/lib/activity-store";
import { getActivePortfolio } from "@/lib/portfolio-store";
import { BackLink } from "@/components/nav/back-link";
import type { AnalyzeInput, SpeechDiagnostic, SpeechDimension } from "@/components/speech-analysis/types";

type Phase = "input" | "analyzing" | "report";

function SpeechLab() {
  const [phase, setPhase] = useState<Phase>("input");
  const [diagnostic, setDiagnostic] = useState<SpeechDiagnostic | null>(null);
  const [source, setSource] = useState<"live" | "local" | null>(null);
  const [savedTo, setSavedTo] = useState<string | null>(null);

  // Only ever renders inside <AuthGate>, so reading portfolio-store directly is safe.
  const activePortfolio = getActivePortfolio();

  function logActivity(result: SpeechDiagnostic) {
    const dims = Object.keys(result.dimensions) as SpeechDimension[];
    recordActivity({
      type: "speech",
      title: "Speech diagnostic",
      subtitle: `${result.wordCount} words · strongest in ${DIMENSION_LABELS[result.strengths[0]].toLowerCase()}`,
      score: result.composite,
      dimensions: Object.fromEntries(dims.map((d) => [d, result.dimensions[d].score])),
      href: "/speech-lab",
      portfolioId: activePortfolio?.id ?? null,
    });
    if (activePortfolio) setSavedTo(activePortfolio.conferenceName);
  }

  async function handleAnalyze(input: AnalyzeInput) {
    setPhase("analyzing");
    const tailoredInput: AnalyzeInput = activePortfolio
      ? { ...input, context: { country: activePortfolio.country, committee: activePortfolio.committee, topic: activePortfolio.agendaTopics[0] } }
      : input;
    try {
      const live = await fetchDiagnostic(tailoredInput);
      setDiagnostic(live);
      setSource("live");
      logActivity(live);
    } catch {
      const local = analyzeSpeech(input);
      setDiagnostic(local);
      setSource("local");
      logActivity(local);
    }
    setPhase("report");
  }

  function handleReset() {
    setDiagnostic(null);
    setSource(null);
    setSavedTo(null);
    setPhase("input");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-panel-border bg-panel px-4 py-3 sm:px-6">
        <BackLink href="/dashboard" label="Dashboard" />
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
          <Mic className="h-4 w-4 text-accent-cyan" />
        </span>
        <div>
          <div className="text-sm font-medium text-foreground">Speech Analysis</div>
          <div className="text-xs text-foreground-muted">Instant diagnostic feedback on delivery</div>
        </div>
      </header>

      <div className="px-4 py-10 sm:px-6">
        {phase === "report" && diagnostic ? (
          <>
            {savedTo && (
              <p className="mx-auto mb-4 flex max-w-4xl items-center gap-1.5 text-xs text-accent-emerald">
                <Target className="h-3.5 w-3.5" />
                Saved to your &ldquo;{savedTo}&rdquo; portfolio.
              </p>
            )}
            <Report diagnostic={diagnostic} source={source} onReset={handleReset} />
          </>
        ) : phase === "analyzing" ? (
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center py-16 text-center">
            <div className="glass-panel glow-cyan rounded-2xl px-8 py-10">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-accent-cyan border-t-transparent" />
              <p className="mt-4 text-sm font-medium text-foreground">Analyzing your delivery…</p>
              <p className="mt-1 text-xs text-foreground-muted">Gemini is reading through your speech.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-8 max-w-3xl text-center">
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                Diagnose your delivery in seconds
              </h1>
              <p className="mt-2 text-sm text-foreground-muted">
                Paste a speech or record it live to get feedback on confidence, diplomatic tone, evidence density,
                structure, and pacing.
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
            <InputPanel onAnalyze={handleAnalyze} />
          </>
        )}
      </div>
    </div>
  );
}

export function SpeechLabRoot() {
  return (
    <AuthGate>
      <SpeechLab />
    </AuthGate>
  );
}
