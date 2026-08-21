"use client";

import { useCurrentUser } from "@/lib/auth-context";
import { getStats, getStreakDays } from "@/lib/activity-store";
import { useClientValue } from "@/lib/use-client-value";

function computeGreeting() {
  const stats = getStats();
  const streak = getStreakDays();
  const totalActivity = stats.totalSimulations + stats.totalSpeeches + stats.totalLearnModules;

  let subheading: string;
  if (totalActivity === 0) {
    subheading =
      "Nothing logged yet. Complete your first simulation, speech check, or Learn module to start building your readiness score.";
  } else if (streak > 1) {
    subheading = `You're on a ${streak}-day streak — keep it going.`;
  } else {
    subheading = `${totalActivity} session${totalActivity === 1 ? "" : "s"} logged so far. Pick up where you left off.`;
  }

  return { subheading };
}

export function DashboardHeader() {
  const user = useCurrentUser();
  const { subheading } = useClientValue(computeGreeting, {
    subheading: "Loading your activity…",
  });
  const firstName = user.name.trim().split(/\s+/)[0];

  return (
    <div>
      <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Welcome, {firstName}</h1>
      <p className="mt-1 text-sm text-foreground-muted">{subheading}</p>
    </div>
  );
}
