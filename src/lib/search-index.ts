"use client";

/**
 * Client-side search across everything the app knows about: static content
 * (Learn modules, committees, topics, countries) plus each account's own
 * dynamic data (portfolios, logged activity). There's no backend, so this
 * just filters a small in-memory list built fresh on every keystroke — the
 * dataset is a few hundred entries at most, well within "just filter it."
 */

import {
  BarChart3,
  Bot,
  FileText,
  Flag,
  Flame,
  FolderKanban,
  Gavel,
  GraduationCap,
  Mic,
  Swords,
  type LucideIcon,
} from "lucide-react";
import { COMMITTEES, COUNTRIES, TOPICS } from "@/components/simulator/data";
import { LEARN_MODULES, CATEGORY_META } from "@/components/learn/data";
import { getActivity } from "@/lib/activity-store";
import { getPortfolios } from "@/lib/portfolio-store";

export type SearchResult = {
  id: string;
  group: "Modules" | "Committees & topics" | "Delegations" | "Your conferences" | "Your activity";
  title: string;
  subtitle: string;
  href: string;
  icon: LucideIcon;
};

function staticIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const m of LEARN_MODULES) {
    results.push({
      id: `module-${m.id}`,
      group: "Modules",
      title: m.title,
      subtitle: CATEGORY_META[m.category].label,
      href: `/learn/${m.id}`,
      icon: GraduationCap,
    });
  }

  for (const c of COMMITTEES) {
    results.push({
      id: `committee-${c.id}`,
      group: "Committees & topics",
      title: c.name,
      subtitle: c.description,
      href: "/simulator",
      icon: Gavel,
    });
  }

  for (const t of TOPICS) {
    const committee = COMMITTEES.find((c) => c.id === t.committeeId);
    results.push({
      id: `topic-${t.id}`,
      group: "Committees & topics",
      title: t.title,
      subtitle: committee ? committee.shortName : "Agenda topic",
      href: "/simulator",
      icon: FileText,
    });
  }

  for (const c of COUNTRIES) {
    results.push({
      id: `country-${c.code}`,
      group: "Delegations",
      title: c.name,
      subtitle: c.bloc,
      href: "/simulator",
      icon: Flag,
    });
  }

  return results;
}

const ACTIVITY_ICON: Record<string, LucideIcon> = {
  simulation: Swords,
  speech: Mic,
  learn: GraduationCap,
};

function dynamicIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  for (const p of getPortfolios()) {
    results.push({
      id: `portfolio-${p.id}`,
      group: "Your conferences",
      title: p.conferenceName,
      subtitle: `${p.committee} · ${p.country}`,
      href: `/portfolios/${p.id}`,
      icon: FolderKanban,
    });
  }

  for (const e of getActivity().slice(0, 40)) {
    results.push({
      id: `activity-${e.id}`,
      group: "Your activity",
      title: e.title,
      subtitle: e.subtitle ?? "Logged session",
      href: e.href ?? "/dashboard",
      icon: ACTIVITY_ICON[e.type] ?? Flame,
    });
  }

  return results;
}

/** Shortcuts shown for an empty query, so search still feels useful before typing. */
export function searchShortcuts(): SearchResult[] {
  return [
    { id: "sc-sim", group: "Modules", title: "Debate Simulator", subtitle: "Run a full committee session", href: "/simulator", icon: Swords },
    { id: "sc-speech", group: "Modules", title: "Speech Analysis", subtitle: "Get instant delivery feedback", href: "/speech-lab", icon: Mic },
    { id: "sc-paper", group: "Modules", title: "Position Paper Grader", subtitle: "Score a draft out of 100", href: "/position-paper-grader", icon: FileText },
    { id: "sc-portfolios", group: "Your conferences", title: "Portfolios", subtitle: "Manage your conferences", href: "/portfolios", icon: FolderKanban },
    { id: "sc-perf", group: "Modules", title: "Performance", subtitle: "Your readiness trend", href: "/dashboard#performance", icon: BarChart3 },
    { id: "sc-coach", group: "Modules", title: "AI Coach", subtitle: "Personalized directives", href: "/dashboard#coach", icon: Bot },
  ];
}

export function search(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const all = [...staticIndex(), ...dynamicIndex()];
  return all
    .filter((r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q))
    .slice(0, 24);
}
