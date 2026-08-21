"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Clock, GraduationCap } from "lucide-react";
import { CATEGORY_META, LEARN_MODULES, modulesByCategory } from "@/components/learn/data";
import { getActivity } from "@/lib/activity-store";
import { useClientValue } from "@/lib/use-client-value";
import { BackLink } from "@/components/nav/back-link";
import { AuthGate } from "@/components/auth/auth-gate";
import type { LearnCategory } from "@/components/learn/types";

const CATEGORIES: LearnCategory[] = ["procedure", "resolutions", "strategy"];

function computeCompletedHrefs(): Set<string> {
  return new Set(
    getActivity()
      .filter((e) => e.type === "learn" && e.href)
      .map((e) => e.href as string),
  );
}

export function LearnIndex() {
  const completedHrefs = useClientValue(computeCompletedHrefs, new Set<string>());

  const completedCount = LEARN_MODULES.filter((m) => completedHrefs.has(`/learn/${m.id}`)).length;

  return (
    <AuthGate>
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-panel-border bg-panel px-4 py-3 sm:px-6">
        <BackLink href="/dashboard" label="Dashboard" />
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-gold/20 to-accent-cyan/10">
          <GraduationCap className="h-4 w-4 text-accent-gold" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground">Learn MUN</div>
          <div className="text-xs text-foreground-muted">Structured modules on procedure, drafting, and strategy</div>
        </div>
        <span
          className="hidden rounded-full border border-panel-border px-2.5 py-1 text-xs font-medium text-foreground-muted sm:block"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {completedCount}/{LEARN_MODULES.length} complete
        </span>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">The MUN knowledge hub</h1>
          <p className="mt-2 text-sm text-foreground-muted">
            Six short, interactive modules — read the material, then check your understanding. Every completed
            module logs to your activity and shapes your AI Coach recommendations.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-12">
          {CATEGORIES.map((category) => {
            const meta = CATEGORY_META[category];
            const modules = modulesByCategory(category);
            return (
              <section key={category}>
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${meta.color}1f` }}
                  >
                    <meta.icon className="h-5 w-5" style={{ color: meta.color }} strokeWidth={1.75} />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">{meta.label}</h2>
                    <p className="text-xs text-foreground-muted">{meta.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {modules.map((m, i) => {
                    const isComplete = completedHrefs.has(`/learn/${m.id}`);
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                      >
                        <Link
                          href={`/learn/${m.id}`}
                          className="panel panel-hover flex h-full flex-col rounded-2xl p-5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-semibold text-foreground">{m.title}</h3>
                            {isComplete && (
                              <span className="flex shrink-0 items-center gap-1 rounded-full bg-accent-emerald/15 px-2 py-0.5 text-[10px] font-medium text-accent-emerald">
                                <BadgeCheck className="h-3 w-3" />
                                Done
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 flex-1 text-xs leading-relaxed text-foreground-muted">
                            {m.description}
                          </p>
                          <div className="mt-4 flex items-center justify-between text-[11px] text-foreground-muted">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {m.estimatedMinutes} min
                            </span>
                            <span className="flex items-center gap-1 text-accent-cyan">
                              {isComplete ? "Review" : "Start"}
                              <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
    </AuthGate>
  );
}
