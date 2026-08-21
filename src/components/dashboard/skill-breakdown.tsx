"use client";

import { BarChart3 } from "lucide-react";
import { getDimensionAverages } from "@/lib/activity-store";
import { useClientValue } from "@/lib/use-client-value";
import type { DimensionAverage } from "@/lib/activity-store";

const DIMENSION_LABELS: Record<string, string> = {
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

function computeSkills(): DimensionAverage[] {
  return getDimensionAverages(20).sort((a, b) => b.averageScore - a.averageScore);
}

export function SkillBreakdown() {
  const skills = useClientValue(computeSkills, [] as DimensionAverage[]);

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-foreground">Skill breakdown</h2>
        <p className="mt-0.5 text-xs text-foreground-muted">Averaged across your scored sessions</p>
      </div>

      {skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-panel-border bg-white/[0.02] px-6 py-10 text-center">
          <BarChart3 className="h-5 w-5 text-foreground-muted" />
          <p className="text-xs text-foreground-muted">
            Complete a simulation or speech check to see your skill breakdown here.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {skills.map((skill) => (
            <li
              key={skill.key}
              className="group -mx-2 rounded-lg px-2 py-1 transition-colors hover:bg-white/[0.03]"
            >
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
                <span className="text-foreground-muted">{DIMENSION_LABELS[skill.key] ?? skill.key}</span>
                <span
                  className="font-medium text-foreground"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {skill.averageScore}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06]">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-indigo"
                  style={{ width: `${skill.averageScore}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
