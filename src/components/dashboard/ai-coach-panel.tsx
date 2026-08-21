"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Check,
  Gavel,
  GraduationCap,
  Mic,
  Sparkles,
  Swords,
  Target,
  Users,
} from "lucide-react";
import { useClientValue } from "@/lib/use-client-value";
import { getStats, getWeakestDimension } from "@/lib/activity-store";
import { getCurrentUserId } from "@/lib/user-store";

function reviewedKey(): string | null {
  const userId = getCurrentUserId();
  return userId ? `mun-mastery:coach-reviewed:v1:${userId}` : null;
}

function loadReviewed(): Set<string> {
  const key = reviewedKey();
  if (!key || typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveReviewed(ids: Set<string>): void {
  const key = reviewedKey();
  if (!key || typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify([...ids]));
  } catch {
    // Private-browsing / storage-full — the reviewed state just won't persist this run.
  }
}

type Tone = "critical" | "warning" | "positive";

type Directive = {
  id: string;
  icon: typeof Mic;
  tone: Tone;
  tag: string;
  title: string;
  detail: string;
  action: string;
  href?: string;
  time: string;
};

// Evergreen coaching tips — generic advice, not claims about the delegate's
// actual history. Real, personalized directives come from buildDynamicDirectives()
// below, based on what's genuinely in the activity log.
const STATIC_DIRECTIVES: Directive[] = [
  {
    id: "tip-filler-words",
    icon: Mic,
    tone: "warning",
    tag: "Coaching tip",
    title: "Watch for filler words in your closing lines",
    detail: "Closings are where hedging and \"um\"s creep in most. Run a speech check to see exactly where.",
    action: "Check a speech",
    href: "/speech-lab",
    time: "8 min",
  },
  {
    id: "tip-crisis-procedure",
    icon: Gavel,
    tone: "warning",
    tag: "Coaching tip",
    title: "Crisis procedure moves fast — drill it ahead of time",
    detail: "Motions and points land differently under time pressure. The crisis strategy module covers the gap.",
    action: "Review the module",
    href: "/learn/crisis-management",
    time: "6 min",
  },
  {
    id: "tip-negotiation",
    icon: Users,
    tone: "positive",
    tag: "Coaching tip",
    title: "Build your bloc-negotiation instincts",
    detail: "Trading language during unmoderated caucus is a learnable skill. Practice it in a live simulation.",
    action: "Practice negotiation",
    href: "/simulator",
    time: "15 min",
  },
];

const DIMENSION_DISPLAY: Record<string, string> = {
  clarity: "Speaking clarity",
  diplomaticStrategy: "Diplomatic strategy",
  researchDepth: "Research depth",
  persuasiveness: "Persuasiveness",
  confidence: "Confidence",
  diplomaticTone: "Diplomatic tone",
  evidenceDensity: "Evidence density",
  structure: "Structure",
  pacing: "Pacing",
  policyAlignment: "Country policy alignment",
  topicAnalysis: "Topic analysis",
  proposedSolutions: "Proposed solutions",
  formatting: "Formatting & structure",
};

const TONE_STYLES: Record<Tone, string> = {
  critical: "border-accent-rose/30 bg-accent-rose/10 text-accent-rose",
  warning: "border-accent-gold/30 bg-accent-gold/10 text-accent-gold",
  positive: "border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald",
};

function buildDynamicDirectives(): Directive[] {
  const directives: Directive[] = [];
  const stats = getStats();
  const weakest = getWeakestDimension(5);

  if (weakest) {
    const label = DIMENSION_DISPLAY[weakest.key] ?? weakest.key;
    directives.push({
      id: `dyn-weak-${weakest.key}`,
      icon: Target,
      tone: weakest.averageScore < 60 ? "critical" : "warning",
      tag: "From your recent activity",
      title: `${label} is your lowest recent score (${weakest.averageScore})`,
      detail: `Based on "${weakest.sourceTitle}" and other recent sessions. A focused Learn module is the fastest way to raise it.`,
      action: "Browse Learn modules",
      href: "/learn",
      time: "5 min",
    });
  }

  if (stats.totalLearnModules === 0) {
    directives.push({
      id: "dyn-try-learn",
      icon: GraduationCap,
      tone: "warning",
      tag: "Getting started",
      title: "You haven't completed a Learn module yet",
      detail:
        "Six short modules cover procedure, resolution writing, and strategy — a fast way to raise your floor.",
      action: "Start Learn MUN",
      href: "/learn",
      time: "5 min",
    });
  }

  if (stats.totalSimulations === 0 && stats.totalSpeeches === 0) {
    directives.push({
      id: "dyn-try-sim",
      icon: Swords,
      tone: "warning",
      tag: "Getting started",
      title: "Run your first live simulation",
      detail: "Practice a full committee session against AI delegates and get an instant executive debrief.",
      action: "Enter the simulator",
      href: "/simulator",
      time: "10 min",
    });
  }

  return directives.slice(0, 2);
}

export function AiCoachPanel() {
  const [done, setDone] = useState<Set<string>>(() => loadReviewed());
  const dynamicDirectives = useClientValue(buildDynamicDirectives, []);

  const directives = [...dynamicDirectives, ...STATIC_DIRECTIVES];
  const activeCount = directives.length - done.size;

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveReviewed(next);
      return next;
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-indigo/20">
            <Bot className="h-4 w-4 text-accent-cyan" strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-foreground">AI Coach</h2>
            <p className="text-xs text-foreground-muted">Based on your last 30 days</p>
          </div>
        </div>
        <span className="glass flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-foreground">
          <Sparkles className="h-3 w-3 text-accent-gold" />
          {activeCount} active
        </span>
      </div>

      <ul className="flex flex-1 flex-col gap-3">
        {directives.map((d) => {
          const isDone = done.has(d.id);
          return (
            <li
              key={d.id}
              className={`rounded-xl border p-3.5 transition-opacity ${
                isDone ? "border-panel-border opacity-50" : "border-panel-border"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                  <d.icon className="h-3.5 w-3.5 text-foreground-muted" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${TONE_STYLES[d.tone]}`}
                    >
                      {d.tag}
                    </span>
                    <span className="text-[11px] text-foreground-muted">{d.time}</span>
                  </div>
                  <h3 className={`mt-1.5 text-sm font-medium text-foreground ${isDone ? "line-through" : ""}`}>
                    {d.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-foreground-muted">{d.detail}</p>

                  <div className="mt-3 flex items-center gap-2">
                    {d.href ? (
                      <Link
                        href={d.href}
                        className="panel-hover rounded-lg border border-panel-border px-3 py-1.5 text-xs font-medium text-foreground"
                      >
                        {d.action}
                      </Link>
                    ) : (
                      <button className="panel-hover rounded-lg border border-panel-border px-3 py-1.5 text-xs font-medium text-foreground">
                        {d.action}
                      </button>
                    )}
                    <button
                      onClick={() => toggle(d.id)}
                      className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        isDone ? "text-accent-emerald" : "text-foreground-muted hover:text-foreground"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                      {isDone ? "Reviewed" : "Mark reviewed"}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
