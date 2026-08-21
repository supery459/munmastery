import { Radio } from "lucide-react";

export function NewsTicker({ headlines }: { headlines: string[] }) {
  const content = headlines.length > 0 ? headlines.join("     •     ") : "Monitoring global developments…";
  const doubled = `${content}     •     ${content}`;

  return (
    <div className="flex items-center gap-3 overflow-hidden border-b border-panel-border bg-panel px-4 py-2">
      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-accent-rose/15 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-accent-rose">
        <Radio className="h-3 w-3 animate-pulse" />
        LIVE
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="animate-marquee flex w-max whitespace-nowrap text-xs text-foreground-muted">
          <span className="pr-2">{doubled}</span>
        </div>
      </div>
    </div>
  );
}
