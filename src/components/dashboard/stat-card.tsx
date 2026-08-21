import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Sparkline } from "@/components/dashboard/sparkline";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  /** Omit when there's no real trend yet (e.g. a brand-new, empty account). */
  delta?: string;
  /** Direction the value moved — drives the arrow glyph, not the color. */
  direction?: "up" | "down";
  /** Whether that movement is good news — drives the color, per direction. */
  good?: boolean;
  sparkline: number[];
  accent: string;
};

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  direction,
  good,
  sparkline,
  accent,
}: StatCardProps) {
  const DeltaIcon = direction === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="panel panel-hover rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}1f` }}
        >
          <Icon className="h-4 w-4" style={{ color: accent }} strokeWidth={1.75} />
        </span>
        <Sparkline data={sparkline} color={accent} />
      </div>

      <p className="mt-4 text-xs text-foreground-muted">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-foreground sm:text-[1.75rem]">
          {value}
        </span>
        {delta && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              good ? "text-accent-emerald" : "text-accent-rose"
            }`}
          >
            <DeltaIcon className="h-3 w-3" />
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
