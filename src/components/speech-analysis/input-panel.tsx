"use client";

import { useState } from "react";
import { ClipboardPaste, Mic, Sparkles, Square } from "lucide-react";
import { useSpeechRecorder } from "@/components/speech-analysis/use-speech-recorder";
import type { AnalyzeInput } from "@/components/speech-analysis/types";

type Tab = "paste" | "record";

export function InputPanel({ onAnalyze }: { onAnalyze: (input: AnalyzeInput) => void }) {
  const [tab, setTab] = useState<Tab>("paste");
  const [pastedText, setPastedText] = useState("");
  const [minutesInput, setMinutesInput] = useState("");
  const [secondsInput, setSecondsInput] = useState("");

  const recorder = useSpeechRecorder();

  const pastedWordCount = pastedText.trim().length === 0 ? 0 : pastedText.trim().split(/\s+/).length;
  const recordedWordCount = recorder.transcript.trim().length === 0 ? 0 : recorder.transcript.trim().split(/\s+/).length;

  function handleAnalyzePasted() {
    const minutes = Number(minutesInput) || 0;
    const seconds = Number(secondsInput) || 0;
    const total = minutes * 60 + seconds;
    onAnalyze({ text: pastedText, durationSeconds: total > 0 ? total : null });
  }

  function handleAnalyzeRecorded() {
    onAnalyze({ text: recorder.transcript, durationSeconds: recorder.elapsedSeconds || null });
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-5 flex gap-1 rounded-lg border border-panel-border p-1">
        <button
          onClick={() => setTab("paste")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
            tab === "paste" ? "bg-white/[0.08] text-foreground" : "text-foreground-muted hover:text-foreground"
          }`}
        >
          <ClipboardPaste className="h-3.5 w-3.5" />
          Paste speech
        </button>
        <button
          onClick={() => setTab("record")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
            tab === "record" ? "bg-white/[0.08] text-foreground" : "text-foreground-muted hover:text-foreground"
          }`}
        >
          <Mic className="h-3.5 w-3.5" />
          Record speech
        </button>
      </div>

      {tab === "paste" ? (
        <div className="panel rounded-2xl p-5">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your speech, opening statement, or rebuttal here…"
            rows={10}
            className="w-full resize-none rounded-xl border border-panel-border bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-foreground-muted focus:border-accent-cyan/40 focus:outline-none"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-foreground-muted" style={{ fontVariantNumeric: "tabular-nums" }}>
              {pastedWordCount} words
            </span>
            <div className="flex items-center gap-2">
              <label className="text-xs text-foreground-muted">Delivery time (optional)</label>
              <input
                type="number"
                min={0}
                value={minutesInput}
                onChange={(e) => setMinutesInput(e.target.value)}
                placeholder="min"
                className="w-14 rounded-lg border border-panel-border bg-background px-2 py-1.5 text-xs text-foreground focus:border-accent-cyan/40 focus:outline-none"
              />
              <span className="text-xs text-foreground-muted">:</span>
              <input
                type="number"
                min={0}
                max={59}
                value={secondsInput}
                onChange={(e) => setSecondsInput(e.target.value)}
                placeholder="sec"
                className="w-14 rounded-lg border border-panel-border bg-background px-2 py-1.5 text-xs text-foreground focus:border-accent-cyan/40 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleAnalyzePasted}
            disabled={pastedWordCount === 0}
            className="glow-cyan glass-hover mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-cyan/90 to-accent-indigo/90 px-6 py-3 text-sm font-medium text-[#05070d] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Sparkles className="h-4 w-4" />
            Analyze speech
          </button>
        </div>
      ) : (
        <div className="panel rounded-2xl p-5">
          {!recorder.supported ? (
            <div className="rounded-xl border border-panel-border bg-white/[0.02] p-5 text-center text-sm text-foreground-muted">
              Voice recording isn&rsquo;t supported in this browser. Switch to the Paste tab instead.
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-3 py-4">
                <button
                  onClick={recorder.recording ? recorder.stop : recorder.start}
                  className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                    recorder.recording
                      ? "bg-accent-rose/20 text-accent-rose"
                      : "bg-gradient-to-br from-accent-cyan/90 to-accent-indigo/90 text-[#05070d]"
                  }`}
                  aria-label={recorder.recording ? "Stop recording" : "Start recording"}
                >
                  {recorder.recording ? <Square className="h-5 w-5" /> : <Mic className="h-6 w-6" />}
                </button>
                <div className="flex items-center gap-2 text-xs text-foreground-muted">
                  {recorder.recording && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-rose" />}
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>
                    {Math.floor(recorder.elapsedSeconds / 60)}:{(recorder.elapsedSeconds % 60).toString().padStart(2, "0")}
                  </span>
                  {recorder.recording ? "recording…" : recorder.transcript ? "recording stopped" : "tap to start"}
                </div>
              </div>

              {recorder.error && (
                <p className="mb-3 rounded-lg border border-accent-rose/30 bg-accent-rose/10 px-3 py-2 text-xs text-accent-rose">
                  {recorder.error}
                </p>
              )}

              <div className="min-h-[100px] rounded-xl border border-panel-border bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground">
                {recorder.transcript || (
                  <span className="text-foreground-muted">Your live transcript will appear here as you speak…</span>
                )}
                {recorder.interim && <span className="text-foreground-muted"> {recorder.interim}</span>}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-foreground-muted" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {recordedWordCount} words
                </span>
              </div>

              <button
                onClick={handleAnalyzeRecorded}
                disabled={recorder.recording || recordedWordCount === 0}
                className="glow-cyan glass-hover mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-cyan/90 to-accent-indigo/90 px-6 py-3 text-sm font-medium text-[#05070d] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Sparkles className="h-4 w-4" />
                Analyze speech
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
