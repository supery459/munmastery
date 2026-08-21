"use client";

import { useMemo } from "react";
import { Flame } from "lucide-react";
import { getDailyCounts, getLongestStreak, getStats, getStreakDays } from "@/lib/activity-store";
import { useClientValue } from "@/lib/use-client-value";

const WEEKS = 20;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const LEVEL_CLASSES = [
  "bg-white/[0.05]",
  "bg-accent-cyan/20",
  "bg-accent-cyan/40",
  "bg-accent-cyan/65",
  "bg-accent-cyan/90",
];
const LEVEL_LABELS = ["No practice", "Light", "Moderate", "Focused", "Deep work"];

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

type Cell = { date: Date; weekday: number };

function buildColumns(): Cell[][] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysBack = WEEKS * 7;

  const days: Cell[] = [];
  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({ date: d, weekday: (d.getDay() + 6) % 7 });
  }

  const columns: Cell[][] = [];
  let current: Cell[] = [];
  for (const day of days) {
    if (day.weekday === 0 && current.length > 0) {
      columns.push(current);
      current = [];
    }
    current.push(day);
  }
  if (current.length) columns.push(current);
  return columns;
}

function levelForCount(count: number): number {
  if (count <= 0) return 0;
  return Math.min(4, count + 1);
}

export function ConsistencyHeatmap() {
  const columns = useMemo(() => buildColumns(), []);

  const monthLabels = useMemo(
    () =>
      columns.map((col, i) => {
        const month = col[0].date.getMonth();
        const prevMonth = i > 0 ? columns[i - 1][0].date.getMonth() : -1;
        return month !== prevMonth ? MONTH_NAMES[month] : "";
      }),
    [columns],
  );

  const counts = useClientValue(() => getDailyCounts(WEEKS * 7 + 1), null as Map<string, number> | null);
  const streak = useClientValue(getStreakDays, 0);
  const longestStreak = useClientValue(getLongestStreak, 0);
  const totalSessions = useClientValue(
    () => getStats().totalSimulations + getStats().totalSpeeches + getStats().totalLearnModules,
    0,
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Training consistency</h2>
          <p className="mt-0.5 text-xs text-foreground-muted">Daily practice activity, last 20 weeks</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-foreground">
            <Flame className="h-3.5 w-3.5 text-accent-gold" />
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{streak}-day</span> streak
          </span>
          <span className="hidden text-foreground-muted sm:inline">
            Longest: <span style={{ fontVariantNumeric: "tabular-nums" }}>{longestStreak}</span> days
          </span>
          <span className="hidden text-foreground-muted sm:inline">
            Total: <span style={{ fontVariantNumeric: "tabular-nums" }}>{totalSessions}</span> sessions
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex min-w-full gap-2">
          <div className="flex flex-col gap-[3px] pt-4">
            {DAY_LABELS.map((d, i) => (
              <span key={d} className="flex h-2.5 items-center text-[9px] text-foreground-muted">
                {i % 2 === 1 ? d : ""}
              </span>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {columns.map((column, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-[3px]">
                <span className="block h-3 text-[9px] leading-3 text-foreground-muted">
                  {monthLabels[colIndex]}
                </span>
                {Array.from({ length: 7 }, (_, row) => {
                  const cell = column.find((c) => c.weekday === row);
                  if (!cell) return <div key={row} className="h-2.5 w-2.5" />;
                  const count = counts?.get(dayKey(cell.date)) ?? 0;
                  const level = levelForCount(count);
                  const dateLabel = cell.date.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  });
                  return (
                    <div
                      key={row}
                      role="img"
                      aria-label={`${DAY_LABELS[row]}, ${dateLabel}: ${LEVEL_LABELS[level]}`}
                      title={
                        count > 0
                          ? `${dateLabel} — ${count} activit${count === 1 ? "y" : "ies"} logged`
                          : `${dateLabel} — no activity logged`
                      }
                      className={`h-2.5 w-2.5 rounded-[2px] ${LEVEL_CLASSES[level]}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[10px] text-foreground-muted">
        Less
        {LEVEL_CLASSES.map((cls, i) => (
          <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${cls}`} />
        ))}
        More
      </div>
    </div>
  );
}
