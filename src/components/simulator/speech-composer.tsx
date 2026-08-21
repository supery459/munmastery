"use client";

import { useEffect, useRef, useState } from "react";
import { Send, SkipForward } from "lucide-react";

type SpeechComposerProps = {
  role: "opening" | "caucus" | "point";
  timeLimit: number;
  countryName: string;
  prompt?: string;
  onSubmit: (text: string, timedOut: boolean) => void;
};

const ROLE_LABEL = {
  opening: "You have the floor — opening statement",
  caucus: "You have the floor — moderated caucus",
  point: "You are recognized to respond",
};

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function SpeechComposer({ role, timeLimit, countryName, prompt, onSubmit }: SpeechComposerProps) {
  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const textRef = useRef(text);
  const submittedRef = useRef(false);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && !submittedRef.current) {
      submittedRef.current = true;
      onSubmit(textRef.current, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  function handleSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    onSubmit(text, false);
  }

  const pct = timeLeft / timeLimit;
  const urgent = pct <= 0.25;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

  return (
    <div className="glass-panel glow-cyan rounded-2xl border border-accent-cyan/30 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-accent-cyan">{ROLE_LABEL[role]}</div>
          <div className="mt-0.5 text-xs text-foreground-muted">Representing {countryName}</div>
        </div>

        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
            <circle cx="28" cy="28" r={RADIUS} fill="none" stroke="var(--chart-grid)" strokeWidth={4} />
            <circle
              cx="28"
              cy="28"
              r={RADIUS}
              fill="none"
              stroke={urgent ? "#fb7185" : "#4cc9f0"}
              strokeWidth={4}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - pct)}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <span
            className="absolute text-[11px] font-semibold text-foreground"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      {prompt && (
        <p className="mt-3 rounded-lg border border-panel-border bg-white/[0.03] px-3 py-2 text-xs text-foreground-muted">
          &ldquo;{prompt}&rdquo;
        </p>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={
          role === "point"
            ? "Respond to the point of inquiry…"
            : "Deliver your remarks to the committee…"
        }
        rows={role === "point" ? 2 : 4}
        className="mt-3 w-full resize-none rounded-xl border border-panel-border bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-foreground-muted focus:border-accent-cyan/40 focus:outline-none"
      />

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-foreground-muted" style={{ fontVariantNumeric: "tabular-nums" }}>
          {words} word{words === 1 ? "" : "s"}
        </span>
        <div className="flex items-center gap-2">
          {role === "point" && (
            <button
              onClick={() => {
                if (submittedRef.current) return;
                submittedRef.current = true;
                onSubmit("", false);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-panel-border px-3 py-1.5 text-xs font-medium text-foreground-muted hover:text-foreground"
            >
              <SkipForward className="h-3.5 w-3.5" />
              Yield
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="glass-hover flex items-center gap-1.5 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-3.5 py-1.5 text-xs font-medium text-foreground"
          >
            <Send className="h-3.5 w-3.5" />
            {role === "point" ? "Respond" : "Deliver speech"}
          </button>
        </div>
      </div>
    </div>
  );
}
