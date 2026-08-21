"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, GraduationCap, Mic, Swords } from "lucide-react";
import { getRecentActivity } from "@/lib/activity-store";
import { useTimeframe } from "@/lib/timeframe-context";
import { PortfolioAssignSelect } from "@/components/common/portfolio-assign-select";
import type { ActivityType } from "@/lib/activity-store";

const TYPE_META: Record<ActivityType, { icon: typeof Mic; label: string; color: string }> = {
  simulation: { icon: Swords, label: "Debate Simulator", color: "#4cc9f0" },
  speech: { icon: Mic, label: "Speech Analysis", color: "#6366f1" },
  learn: { icon: GraduationCap, label: "Learn MUN", color: "#d4af6a" },
  positionPaper: { icon: FileText, label: "Position Paper Grader", color: "#34d399" },
};

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// Only ever renders inside <AuthGate>, so reading activity-store directly
// (rather than through useClientValue) is safe and lets this re-derive
// whenever the timeframe dropdown changes.
export function RecentActivity() {
  const { days, label } = useTimeframe();
  const [refreshKey, setRefreshKey] = useState(0);
  const events = getRecentActivity(6, days);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>
        <p className="mt-0.5 text-xs text-foreground-muted">
          Live from your sessions — simulations, speech checks, position papers, and Learn modules (
          {label.toLowerCase()})
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-panel-border bg-white/[0.02] p-5 text-center text-xs text-foreground-muted">
          Nothing logged in this window. Finish a simulation, a speech check, or a Learn module and it&apos;ll show
          up here — and shape your AI Coach directives below.
        </div>
      ) : (
        <ul key={refreshKey} className="flex flex-col gap-2">
          {events.map((e) => {
            const meta = TYPE_META[e.type];
            return (
              <li
                key={e.id}
                className="panel-hover flex items-center gap-3 rounded-xl border border-panel-border px-3.5 py-2.5"
              >
                <Link href={e.href ?? "#"} className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${meta.color}1f` }}
                  >
                    <meta.icon className="h-4 w-4" style={{ color: meta.color }} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-medium text-foreground">{e.title}</div>
                    <div className="truncate text-[11px] text-foreground-muted">
                      {meta.label}
                      {e.subtitle ? ` · ${e.subtitle}` : ""}
                    </div>
                  </div>
                  {typeof e.score === "number" && (
                    <span
                      className="shrink-0 rounded-full border border-panel-border px-2 py-0.5 text-[11px] font-medium text-foreground"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {e.score}
                    </span>
                  )}
                </Link>
                <span className="shrink-0 text-[11px] text-foreground-muted">{timeAgo(e.timestamp)}</span>
                <PortfolioAssignSelect
                  eventId={e.id}
                  portfolioId={e.portfolioId}
                  onChanged={() => setRefreshKey((k) => k + 1)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
