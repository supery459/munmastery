"use client";

/**
 * Shared, client-side activity log that interlinks the whole platform.
 *
 * There's no backend/database in this app, so "interlinking" means every
 * surface that produces a result — a finished committee simulation, a speech
 * diagnostic, a graded position paper, a completed Learn module — writes one
 * ActivityEvent here via recordActivity(). The dashboard (heatmap, recent
 * activity feed, AI Coach) reads it back with the getters below. Because
 * these are separate page navigations (not a SPA store), a fresh read on
 * mount is enough to stay in sync — no pub/sub needed. All access is guarded
 * for SSR: every function is safe to call from a server render (returns
 * empty/default), but real data only exists client-side, so consumers should
 * read it inside an effect.
 *
 * Every event optionally carries a `portfolioId`, set at creation time when
 * a conference portfolio is active (see portfolio-store) and reassignable
 * later. This is a single canonical history either way — an event created
 * without an active portfolio simply stays global (portfolioId absent), and
 * getActivityForPortfolio() is what makes a portfolio's page show only its
 * own entries.
 *
 * Every read/write is scoped to the signed-in account (via user-store's
 * session), so each account's progress is stored under its own key and never
 * bleeds into another account's history on a shared browser.
 */

import { getCurrentUserId } from "@/lib/user-store";
import type { GradeInput, PositionPaperReview } from "@/components/position-paper/types";
import type { AnalyzeInput, SpeechDiagnostic } from "@/components/speech-analysis/types";
import type { SessionResult, ScoreResult } from "@/components/simulator/types";

export type ActivityDetails =
  | { kind: "positionPaper"; input: GradeInput; report?: PositionPaperReview; source?: "live" | "local" }
  | { kind: "speech"; input: AnalyzeInput; report?: SpeechDiagnostic; source?: "live" | "local" }
  | { kind: "simulation"; session: SessionResult; report: ScoreResult; source: "live" | "local" };

export type ActivityType = "simulation" | "speech" | "learn" | "positionPaper";

export type ActivityEvent = {
  id: string;
  type: ActivityType;
  timestamp: number;
  title: string;
  subtitle?: string;
  score?: number;
  dimensions?: Record<string, number>;
  href?: string;
  /** The conference portfolio this event is pinned to, or null/absent for global (non-portfolio) history. */
  portfolioId?: string | null;
  details?: ActivityDetails;
  draft?: boolean;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function storageKey(): string | null {
  const userId = getCurrentUserId();
  return userId ? `mun-mastery:activity:v1:${userId}` : null;
}

type LegacyArtifact = { id: string; portfolioId: string; type: ActivityType; createdAt: number; title: string; subtitle?: string; score?: number; review?: PositionPaperReview; diagnostic?: SpeechDiagnostic };

function migrateLegacy(events: ActivityEvent[], key: string): ActivityEvent[] {
  const userId = getCurrentUserId();
  const marker = `mun-mastery:artifacts-migrated:v1:${userId}`;
  if (window.localStorage.getItem(marker)) return events;
  const raw = window.localStorage.getItem(`mun-mastery:portfolio-artifacts:v1:${userId}`);
  if (!raw) return events;
  try {
    const legacy: LegacyArtifact[] = JSON.parse(raw);
    if (!Array.isArray(legacy)) return events;
    const merged = [...events];
    for (const item of legacy) {
      if (!item.id || !["positionPaper", "speech", "simulation"].includes(item.type)) continue;
      const report = item.review ?? item.diagnostic;
      const score = report?.composite ?? item.score;
      const existing = merged.find((e) => e.id === `legacy-${item.id}` || (e.type === item.type && !e.details && e.score === score && Math.abs(e.timestamp - item.createdAt) < 2000));
      const details: ActivityDetails | undefined = item.type === "positionPaper" && item.review
        ? { kind: "positionPaper", input: { text: "", country: "", topic: "" }, report: item.review }
        : item.type === "speech" && item.diagnostic
          ? { kind: "speech", input: { text: "", durationSeconds: null }, report: item.diagnostic } : undefined;
      const dimensions = item.review?.criteria ?? item.diagnostic?.dimensions;
      if (existing) {
        existing.portfolioId = item.portfolioId;
        existing.details = details;
      } else {
        merged.push({ id: `legacy-${item.id}`, type: item.type, timestamp: item.createdAt, title: item.title, subtitle: item.subtitle, score, portfolioId: item.portfolioId, details,
          dimensions: dimensions ? Object.fromEntries(Object.entries(dimensions).map(([name, value]) => [name, value.score])) : undefined });
      }
    }
    merged.sort((a, b) => b.timestamp - a.timestamp);
    // Keep the original artifact key as a backup; commit the marker only after the merged log is saved.
    window.localStorage.setItem(key, JSON.stringify(merged));
    window.localStorage.setItem(marker, "1");
    return merged;
  } catch { return events; }
}

function readRaw(): ActivityEvent[] {
  if (!isBrowser()) return [];
  const key = storageKey();
  if (!key) return [];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return migrateLegacy(Array.isArray(parsed) ? (parsed as ActivityEvent[]) : [], key);
  } catch {
    return [];
  }
}

function writeRaw(events: ActivityEvent[]): void {
  if (!isBrowser()) return;
  const key = storageKey();
  if (!key) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(events));
  } catch {
    throw new Error("Your browser could not save this work. Free up browser storage and try again.");
  }
}

export function recordActivity(event: Omit<ActivityEvent, "id" | "timestamp">, ownerId = getCurrentUserId()): ActivityEvent {
  if (!ownerId || ownerId !== getCurrentUserId()) throw new Error("Your session changed. Sign in again to save this work.");
  const full: ActivityEvent = {
    ...event,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };
  const events = [full, ...readRaw()];
  writeRaw(events);
  return full;
}

export function getActivity(): ActivityEvent[] {
  return readRaw();
}

export function clearActivity(): void {
  writeRaw([]);
  const userId = getCurrentUserId();
  if (userId) {
    window.localStorage.removeItem(`mun-mastery:coach-reviewed:v1:${userId}`);
    window.localStorage.removeItem(`mun-mastery:portfolio-artifacts:v1:${userId}`);
  }
}

export function activityHref(event: ActivityEvent): string {
  return event.type === "learn" ? event.href ?? "/learn" : `/history?entry=${encodeURIComponent(event.id)}`;
}

export function getActivityEntry(id: string): ActivityEvent | null {
  return readRaw().find((event) => event.id === id) ?? null;
}

export function requestedDraft(): ActivityDetails | undefined {
  if (!isBrowser()) return undefined;
  const id = new URLSearchParams(window.location.search).get("draft");
  return id ? getActivityEntry(id)?.details : undefined;
}

export function requestedDraftEntry(): ActivityEvent | null {
  if (!isBrowser()) return null;
  const id = new URLSearchParams(window.location.search).get("draft");
  return id ? getActivityEntry(id) : null;
}

export function deleteActivity(id: string): void {
  writeRaw(readRaw().filter((event) => event.id !== id));
}

/** Every event pinned to one conference portfolio, newest first — the data behind /portfolios/[id]'s position paper, speech, and simulation sections. */
export function getActivityForPortfolio(portfolioId: string): ActivityEvent[] {
  return readRaw()
    .filter((e) => e.portfolioId === portfolioId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

/** Assigns (or, with `null`, unassigns back to global) which portfolio an existing activity event belongs to. */
export function assignActivityPortfolio(eventId: string, portfolioId: string | null): ActivityEvent | null {
  const events = readRaw();
  const index = events.findIndex((e) => e.id === eventId);
  if (index === -1) return null;
  const updated = { ...events[index], portfolioId };
  events[index] = updated;
  writeRaw(events);
  return updated;
}

/** Un-pins every event that referenced a portfolio (e.g. because it was just deleted) without touching the underlying history. */
export function unassignPortfolio(portfolioId: string): void {
  const events = readRaw();
  let changed = false;
  const updated = events.map((e) => {
    if (e.portfolioId !== portfolioId) return e;
    changed = true;
    return { ...e, portfolioId: null };
  });
  if (changed) writeRaw(updated);
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/** Event counts per local calendar day, for the last `days` days (including today). */
export function getDailyCounts(days: number): Map<string, number> {
  const events = readRaw();
  const counts = new Map<string, number>();
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    counts.set(dayKey(d), 0);
  }
  for (const e of events.filter((event) => !event.draft)) {
    const key = dayKey(new Date(e.timestamp));
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/** Consecutive days (including today, or yesterday if nothing logged yet today) with >=1 event. */
export function getStreakDays(): number {
  const events = readRaw().filter((event) => !event.draft);
  if (events.length === 0) return 0;
  const keys = new Set(events.map((e) => dayKey(new Date(e.timestamp))));
  const today = new Date();
  let streak = 0;
  const cursor = new Date(today);
  if (!keys.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!keys.has(dayKey(cursor))) return 0;
  }
  while (keys.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Longest run of consecutive calendar days with >=1 event, ever. */
export function getLongestStreak(): number {
  const events = readRaw().filter((event) => !event.draft);
  if (events.length === 0) return 0;

  const dayMs = 24 * 60 * 60 * 1000;
  const dates = Array.from(new Set(events.map((e) => dayKey(new Date(e.timestamp)))))
    .map((key) => {
      const [y, m, d] = key.split("-").map(Number);
      return Date.UTC(y, m, d);
    })
    .sort((a, b) => a - b);

  let longest = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] - dates[i - 1] === dayMs) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }
  return longest;
}

function cutoffFor(days: number | null): number {
  return days === null ? 0 : Date.now() - days * 24 * 60 * 60 * 1000;
}

export function getRecentActivity(limit = 6, days: number | null = null): ActivityEvent[] {
  const cutoff = cutoffFor(days);
  return readRaw()
    .filter((e) => e.timestamp >= cutoff)
    .slice(0, limit);
}

export type ActivityStats = {
  totalSimulations: number;
  totalSpeeches: number;
  totalLearnModules: number;
  last7Days: number;
};

/** `days` controls only the top-level totals; `last7Days` always looks back a fixed 7 days regardless. */
export function getStats(days: number | null = null): ActivityStats {
  const events = readRaw();
  const rangeCutoff = cutoffFor(days);
  const inRange = events.filter((e) => !e.draft && e.timestamp >= rangeCutoff);
  const sevenDayCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return {
    totalSimulations: inRange.filter((e) => e.type === "simulation").length,
    totalSpeeches: inRange.filter((e) => e.type === "speech").length,
    totalLearnModules: inRange.filter((e) => e.type === "learn").length,
    last7Days: events.filter((e) => !e.draft && e.timestamp >= sevenDayCutoff).length,
  };
}

/** Average composite score across events of one type (or all types) within `days` (null = all time), null if none scored yet. */
export function getAverageComposite(type: ActivityType | null = null, days: number | null = null): number | null {
  const cutoff = cutoffFor(days);
  const scored = readRaw().filter(
    (e) => (type ? e.type === type : true) && typeof e.score === "number" && e.timestamp >= cutoff,
  );
  if (scored.length === 0) return null;
  const sum = scored.reduce((s, e) => s + (e.score as number), 0);
  return Math.round(sum / scored.length);
}

export function getBestScore(days: number | null = null): number | null {
  const scores = readRaw().filter((e) => typeof e.score === "number" && e.timestamp >= cutoffFor(days)).map((e) => e.score as number);
  return scores.length ? Math.max(...scores) : null;
}

/** Chronological (oldest→newest) composite scores within `days` (null = all time), for sparklines/trend lines. Always ≥2 entries. */
export function getCompositeSeries(type: ActivityType | null, limit = 8, days: number | null = null): number[] {
  const cutoff = cutoffFor(days);
  const scored = readRaw()
    .filter((e) => (type ? e.type === type : true) && typeof e.score === "number" && e.timestamp >= cutoff)
    .slice(0, limit)
    .reverse()
    .map((e) => e.score as number);
  if (scored.length === 0) return [0, 0];
  if (scored.length === 1) return [scored[0], scored[0]];
  return scored;
}

/**
 * A rough global-delegate percentile derived from a real average composite —
 * the same "composite - 3, clamped" shape used for the simulator's own
 * scorecard, so the two stay consistent. Null (unranked) until scored.
 */
export function getPercentile(days: number | null = null): number | null {
  const avg = getAverageComposite(null, days);
  if (avg === null) return null;
  return Math.max(5, Math.min(99, avg - 3));
}

export type WeeklyPoint = { label: string; score: number | null };

/** Real weekly-average composite trend, oldest→newest, for the performance chart. Buckets with no scored activity are null, not a fabricated value. */
export function getWeeklyTrend(weeks = 12, days: number | null = null): WeeklyPoint[] {
  const events = readRaw().filter((e) => typeof e.score === "number" && e.timestamp >= cutoffFor(days));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const points: WeeklyPoint[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const end = new Date(today);
    end.setDate(end.getDate() - w * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);

    const inRange = events.filter((e) => {
      const t = new Date(e.timestamp);
      return t >= start && t <= new Date(end.getTime() + 24 * 60 * 60 * 1000 - 1);
    });

    const score =
      inRange.length > 0
        ? Math.round(inRange.reduce((s, e) => s + (e.score as number), 0) / inRange.length)
        : null;

    points.push({ label: `Wk ${weeks - w}`, score });
  }
  return points;
}

export type DimensionAverage = { key: string; averageScore: number; sampleCount: number };

/** Average of every scored dimension across recent activity, for the skill breakdown. */
export function getDimensionAverages(sampleSize = 20, days: number | null = null): DimensionAverage[] {
  const scored = readRaw()
    .filter((e) => e.timestamp >= cutoffFor(days) && e.dimensions && Object.keys(e.dimensions).length > 0)
    .slice(0, sampleSize);
  if (scored.length === 0) return [];

  const totals = new Map<string, { sum: number; count: number }>();
  for (const e of scored) {
    for (const [key, value] of Object.entries(e.dimensions!)) {
      const cur = totals.get(key) ?? { sum: 0, count: 0 };
      cur.sum += value;
      cur.count += 1;
      totals.set(key, cur);
    }
  }

  return Array.from(totals.entries()).map(([key, { sum, count }]) => ({
    key,
    averageScore: Math.round(sum / count),
    sampleCount: count,
  }));
}

export type WeakestDimension = {
  key: string;
  averageScore: number;
  fromType: ActivityType;
  sourceTitle: string;
};

/** Lowest-average dimension across the most recent scored events, for the AI Coach. */
export function getWeakestDimension(sampleSize = 5): WeakestDimension | null {
  const scored = readRaw()
    .filter((e) => e.dimensions && Object.keys(e.dimensions).length > 0)
    .slice(0, sampleSize);
  if (scored.length === 0) return null;

  const totals = new Map<string, { sum: number; count: number }>();
  for (const e of scored) {
    for (const [key, value] of Object.entries(e.dimensions!)) {
      const cur = totals.get(key) ?? { sum: 0, count: 0 };
      cur.sum += value;
      cur.count += 1;
      totals.set(key, cur);
    }
  }

  let worstKey: string | null = null;
  let worstAvg = Infinity;
  for (const [key, { sum, count }] of totals) {
    const avg = sum / count;
    if (avg < worstAvg) {
      worstAvg = avg;
      worstKey = key;
    }
  }
  if (!worstKey) return null;

  return {
    key: worstKey,
    averageScore: Math.round(worstAvg),
    fromType: scored[0].type,
    sourceTitle: scored[0].title,
  };
}
