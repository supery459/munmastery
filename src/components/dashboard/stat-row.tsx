"use client";

import { Mic, Target, Trophy, Zap } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { getAverageComposite, getCompositeSeries, getPercentile, getStats } from "@/lib/activity-store";
import { useTimeframe } from "@/lib/timeframe-context";

type StatDisplay = {
  icon: typeof Mic;
  label: string;
  value: string;
  sparkline: number[];
  accent: string;
};

// StatRow only ever renders inside <AuthGate>, which never renders its
// children during SSR — so reading activity-store directly here (instead of
// through useClientValue) is safe, and lets the stats re-derive whenever the
// timeframe dropdown changes `days`, which a mount-once cache couldn't do.
function computeStats(days: number | null): StatDisplay[] {
  const readiness = getAverageComposite("simulation", days);
  const speeches = getStats(days).totalSpeeches;
  const overall = getAverageComposite(null, days);
  const percentile = getPercentile(days);

  return [
    {
      icon: Target,
      label: "Readiness score",
      value: readiness === null ? "0" : String(readiness),
      sparkline: getCompositeSeries("simulation", 8, days),
      accent: "#4cc9f0",
    },
    {
      icon: Mic,
      label: "Speeches practiced",
      value: String(speeches),
      sparkline: getCompositeSeries("speech", 8, days),
      accent: "#6366f1",
    },
    {
      icon: Zap,
      label: "Average score",
      value: overall === null ? "0" : String(overall),
      sparkline: getCompositeSeries(null, 8, days),
      accent: "#d4af6a",
    },
    {
      icon: Trophy,
      label: "Global delegate rank",
      value: percentile === null ? "Unranked" : `Top ${Math.max(1, 100 - percentile)}%`,
      sparkline: getCompositeSeries(null, 8, days),
      accent: "#34d399",
    },
  ];
}

export function StatRow() {
  const { days } = useTimeframe();
  const stats = computeStats(days);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
