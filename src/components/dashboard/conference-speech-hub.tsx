"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Mic } from "lucide-react";
import { getActivity } from "@/lib/activity-store";
import { getPortfolios, daysUntil } from "@/lib/portfolio-store";
import { useTimeframe } from "@/lib/timeframe-context";

const TABS = ["Upcoming conferences", "Recent speeches"] as const;

type SpeechRow = {
  id: string;
  date: string;
  subtitle: string;
  score: number | null;
  delta: number | null;
};

function computeSpeechRows(days: number | null): SpeechRow[] {
  const events = getActivity().filter((e) => e.type === "speech" && !e.draft && (days === null || e.timestamp >= Date.now() - days * 86400000));
  return events.map((e, i) => {
    const older = events[i + 1];
    const delta =
      older && typeof older.score === "number" && typeof e.score === "number" ? e.score - older.score : null;
    return {
      id: e.id,
      date: new Date(e.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      subtitle: e.subtitle ?? "Speech diagnostic",
      score: e.score ?? null,
      delta,
    };
  });
}

export function ConferenceSpeechHub() {
  const [tab, setTab] = useState<(typeof TABS)[number]>(TABS[0]);
  const { days } = useTimeframe();
  const speeches = computeSpeechRows(days);
  const conferences = getPortfolios().filter((p) => !p.endDate || daysUntil(p.endDate) >= 0).sort((a, b) => (a.startDate ?? "9999").localeCompare(b.startDate ?? "9999"));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Conference & speech hub</h2>
          <p className="mt-0.5 text-xs text-foreground-muted">Where you&rsquo;re headed and how you&rsquo;ve performed</p>
        </div>
        <div className="flex rounded-lg border border-panel-border p-0.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === t
                  ? "bg-white/[0.08] text-foreground"
                  : "text-foreground-muted hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        {tab === "Upcoming conferences" && conferences.length > 0 ? (
          <ul className="divide-y divide-panel-border">{conferences.map((p) => <li key={p.id}>
            <Link href={`/portfolios/${p.id}`} className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm">
              <span><span className="block font-medium text-accent-cyan">{p.conferenceName}</span><span className="text-xs text-foreground-muted">{p.committee} - {p.country}</span></span>
              <span className="text-xs text-foreground-muted">{p.startDate ? new Date(`${p.startDate}T00:00:00`).toLocaleDateString() : "Dates not set"}{p.positionPaperDeadline ? ` | Paper due ${p.positionPaperDeadline}` : ""}</span>
            </Link>
          </li>)}</ul>
        ) : tab === "Upcoming conferences" ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-panel-border bg-white/[0.02] px-6 py-14 text-center">
            <Calendar className="h-6 w-6 text-foreground-muted" />
            <div>
              <p className="text-sm font-medium text-foreground">No conferences on your calendar yet</p>
              <p className="mt-1 max-w-sm text-xs text-foreground-muted">
                Add a conference portfolio to track your assignment and deadlines.
              </p>
            </div>
            <Link
              href="/portfolios"
              className="glass-hover mt-1 flex items-center gap-1.5 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-3.5 py-2 text-xs font-medium text-foreground"
            >
              Add a conference
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : speeches.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-panel-border bg-white/[0.02] px-6 py-14 text-center">
            <Mic className="h-6 w-6 text-foreground-muted" />
            <div>
              <p className="text-sm font-medium text-foreground">No speeches checked yet</p>
              <p className="mt-1 max-w-sm text-xs text-foreground-muted">
                Run a speech through Speech Analysis and it&rsquo;ll show up here with your score and trend.
              </p>
            </div>
            <Link
              href="/speech-lab"
              className="glass-hover mt-1 flex items-center gap-1.5 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-3.5 py-2 text-xs font-medium text-foreground"
            >
              Check a speech
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-panel-border">
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead>
                <tr className="border-b border-panel-border text-[11px] text-foreground-muted">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                  <th className="px-4 py-3 text-right font-medium">Score</th>
                  <th className="px-4 py-3 text-right font-medium">Δ</th>
                </tr>
              </thead>
              <tbody>
                {speeches.map((s) => (
                  <tr key={s.id} className="border-b border-panel-border last:border-0 hover:bg-white/[0.03]">
                    <td className="px-4 py-3 text-foreground-muted" style={{ fontVariantNumeric: "tabular-nums" }}>
                      {s.date}
                    </td>
                    <td className="px-4 py-3 text-foreground-muted"><Link href={`/history?entry=${encodeURIComponent(s.id)}`} className="text-accent-cyan">{s.subtitle}</Link></td>
                    <td
                      className="px-4 py-3 text-right font-medium text-foreground"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {s.score ?? "—"}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        s.delta === null ? "text-foreground-muted" : s.delta >= 0 ? "text-accent-emerald" : "text-accent-rose"
                      }`}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {s.delta === null ? "—" : `${s.delta >= 0 ? "+" : ""}${s.delta}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
