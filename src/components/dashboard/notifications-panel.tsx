"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Calendar, Flame, Target, Sparkles, type LucideIcon } from "lucide-react";
import { getRecentActivity, getStreakDays, getWeakestDimension } from "@/lib/activity-store";
import { daysUntil, getActivePortfolio } from "@/lib/portfolio-store";
import { useClientValue } from "@/lib/use-client-value";

type Notification = {
  id: string;
  icon: LucideIcon;
  tone: "cyan" | "gold" | "emerald";
  title: string;
  detail: string;
  href?: string;
};

const DIMENSION_DISPLAY: Record<string, string> = {
  clarity: "speaking clarity",
  diplomaticStrategy: "diplomatic strategy",
  researchDepth: "research depth",
  persuasiveness: "persuasiveness",
  confidence: "confidence",
  diplomaticTone: "diplomatic tone",
  evidenceDensity: "evidence density",
  structure: "structure",
  pacing: "pacing",
  policyAlignment: "country policy alignment",
  topicAnalysis: "topic analysis",
  proposedSolutions: "proposed solutions",
  formatting: "formatting & structure",
};

function computeNotifications(): Notification[] {
  const notifications: Notification[] = [];

  const portfolio = getActivePortfolio();
  if (portfolio?.positionPaperDeadline) {
    const remaining = daysUntil(portfolio.positionPaperDeadline);
    if (remaining >= 0 && remaining <= 14) {
      notifications.push({
        id: "deadline",
        icon: Calendar,
        tone: remaining <= 3 ? "gold" : "cyan",
        title:
          remaining === 0
            ? `Position paper due today for ${portfolio.conferenceName}`
            : `Position paper due in ${remaining} day${remaining === 1 ? "" : "s"} — ${portfolio.conferenceName}`,
        detail: `${portfolio.committee} · ${portfolio.country}`,
        href: `/portfolios/${portfolio.id}`,
      });
    }
  }

  const streak = getStreakDays();
  if (streak >= 2) {
    notifications.push({
      id: "streak",
      icon: Flame,
      tone: "gold",
      title: `You're on a ${streak}-day practice streak`,
      detail: "Keep it going with one more session today.",
    });
  }

  const weakest = getWeakestDimension(5);
  if (weakest) {
    notifications.push({
      id: "weakest",
      icon: Target,
      tone: "cyan",
      title: `${DIMENSION_DISPLAY[weakest.key] ?? weakest.key} is your lowest recent score`,
      detail: `Averaging ${weakest.averageScore} across recent sessions — worth a focused review.`,
      href: "/dashboard#coach",
    });
  }

  const recent = getRecentActivity(1);
  if (recent.length > 0) {
    const e = recent[0];
    notifications.push({
      id: "recent",
      icon: Sparkles,
      tone: "emerald",
      title: "Latest session logged",
      detail: e.title + (typeof e.score === "number" ? ` · scored ${e.score}` : ""),
      href: e.href,
    });
  }

  if (notifications.length === 0) {
    notifications.push({
      id: "empty",
      icon: Sparkles,
      tone: "cyan",
      title: "You're all caught up",
      detail: "Complete a simulation, speech check, or position paper to see updates here.",
    });
  }

  return notifications;
}

const TONE_STYLES: Record<Notification["tone"], string> = {
  cyan: "bg-accent-cyan/15 text-accent-cyan",
  gold: "bg-accent-gold/15 text-accent-gold",
  emerald: "bg-accent-emerald/15 text-accent-emerald",
};

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const notifications = useClientValue(computeNotifications, [] as Notification[]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const hasAlerts = notifications.some((n) => n.id !== "empty");

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="panel-hover relative flex h-9 w-9 items-center justify-center rounded-lg border border-panel-border text-foreground-muted hover:text-foreground"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="h-4 w-4" />
        {hasAlerts && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent-rose" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="panel absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl p-2 shadow-2xl"
          >
            <div className="px-2.5 py-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted/70">
              Notifications
            </div>
            <ul className="flex flex-col gap-1">
              {notifications.map((n) => {
                const content = (
                  <div className="flex items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-white/[0.05]">
                    <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${TONE_STYLES[n.tone]}`}>
                      <n.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium leading-snug text-foreground">{n.title}</div>
                      <div className="mt-0.5 text-[11px] leading-snug text-foreground-muted">{n.detail}</div>
                    </div>
                  </div>
                );
                return (
                  <li key={n.id}>
                    {n.href ? (
                      <Link href={n.href} onClick={() => setOpen(false)} className="block">
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
