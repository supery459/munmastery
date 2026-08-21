"use client";

/**
 * Conference portfolios: one per MUN conference a delegate is preparing for.
 * Like activity-store, everything here is scoped to the signed-in account
 * (via user-store's session) and lives only in localStorage — there's no
 * backend. A portfolio can be marked "active," which the simulator, speech
 * lab, and position paper grader read to auto-tailor their prompts and
 * prefill the committee/country/topic for that specific conference.
 *
 * Position papers, speech checks, and simulator sessions are NOT stored
 * here — they're regular activity-store events, each optionally carrying a
 * `portfolioId`. That keeps one canonical history (so nothing a delegate
 * does ever goes missing just because no portfolio was active) while still
 * letting a portfolio's page show only its own entries, via
 * `getActivityForPortfolio`.
 */

import { getCurrentUserId } from "@/lib/user-store";
import { unassignPortfolio } from "@/lib/activity-store";

export type Portfolio = {
  id: string;
  conferenceName: string;
  committee: string;
  country: string;
  agendaTopics: string[];
  startDate: string | null;
  endDate: string | null;
  positionPaperDeadline: string | null;
  notes: string;
  motions: string;
  cheatsheet: string;
  createdAt: number;
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function portfoliosKey(): string | null {
  const userId = getCurrentUserId();
  return userId ? `mun-mastery:portfolios:v1:${userId}` : null;
}

function activeKey(): string | null {
  const userId = getCurrentUserId();
  return userId ? `mun-mastery:active-portfolio:v1:${userId}` : null;
}

function newId(): string {
  if (isBrowser() && "randomUUID" in window.crypto) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function readList<T>(key: string | null): T[] {
  if (!isBrowser() || !key) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string | null, list: T[]): void {
  if (!isBrowser() || !key) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Private-browsing / storage-full — the change just won't persist.
  }
}

export function getPortfolios(): Portfolio[] {
  return readList<Portfolio>(portfoliosKey()).sort((a, b) => b.createdAt - a.createdAt);
}

export function getPortfolio(id: string): Portfolio | null {
  return readList<Portfolio>(portfoliosKey()).find((p) => p.id === id) ?? null;
}

export type PortfolioInput = {
  conferenceName: string;
  committee: string;
  country: string;
  agendaTopics: string[];
  startDate: string | null;
  endDate: string | null;
  positionPaperDeadline: string | null;
};

export function createPortfolio(input: PortfolioInput): Portfolio {
  const portfolio: Portfolio = {
    id: newId(),
    ...input,
    notes: "",
    motions: "",
    cheatsheet: "",
    createdAt: Date.now(),
  };
  const key = portfoliosKey();
  writeList(key, [...readList<Portfolio>(key), portfolio]);

  if (getActivePortfolioId() === null) setActivePortfolioId(portfolio.id);
  return portfolio;
}

export function updatePortfolio(id: string, updates: Partial<Omit<Portfolio, "id" | "createdAt">>): Portfolio | null {
  const key = portfoliosKey();
  const list = readList<Portfolio>(key);
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const updated = { ...list[index], ...updates };
  list[index] = updated;
  writeList(key, list);
  return updated;
}

export function deletePortfolio(id: string): void {
  const key = portfoliosKey();
  writeList(
    key,
    readList<Portfolio>(key).filter((p) => p.id !== id),
  );

  // The position papers, speeches, and simulations pinned to this portfolio
  // are real activity history — deleting the portfolio un-pins them (back to
  // global) rather than destroying them.
  unassignPortfolio(id);

  if (getActivePortfolioId() === id) setActivePortfolioId(null);
}

export function getActivePortfolioId(): string | null {
  if (!isBrowser()) return null;
  const key = activeKey();
  if (!key) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setActivePortfolioId(id: string | null): void {
  if (!isBrowser()) return;
  const key = activeKey();
  if (!key) return;
  try {
    if (id === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, id);
  } catch {
    // Ignore.
  }
}

export function getActivePortfolio(): Portfolio | null {
  const id = getActivePortfolioId();
  if (!id) return null;
  return getPortfolio(id);
}

/** Whole calendar days from today to `dateStr` (negative if it's already past). */
export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}
