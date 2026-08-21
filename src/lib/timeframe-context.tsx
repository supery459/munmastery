"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type TimeframeDays = 7 | 30 | null;

export const TIMEFRAME_OPTIONS: { days: TimeframeDays; label: string }[] = [
  { days: 7, label: "Last 7 days" },
  { days: 30, label: "Last 30 days" },
  { days: null, label: "All time" },
];

type TimeframeContextValue = {
  days: TimeframeDays;
  label: string;
  setDays: (days: TimeframeDays) => void;
};

const TimeframeContext = createContext<TimeframeContextValue | null>(null);

export function TimeframeProvider({ children }: { children: ReactNode }) {
  const [days, setDays] = useState<TimeframeDays>(30);
  const label = TIMEFRAME_OPTIONS.find((o) => o.days === days)?.label ?? "Last 30 days";

  return <TimeframeContext.Provider value={{ days, label, setDays }}>{children}</TimeframeContext.Provider>;
}

/** The dashboard's shared time-range filter (7 / 30 days / all time). Only valid inside <TimeframeProvider>. */
export function useTimeframe(): TimeframeContextValue {
  const ctx = useContext(TimeframeContext);
  if (!ctx) {
    throw new Error("useTimeframe must be used within a TimeframeProvider");
  }
  return ctx;
}
