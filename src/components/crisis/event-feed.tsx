import { AnimatePresence, motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { CATEGORY_META } from "@/components/crisis/data";
import type { CrisisEvent } from "@/components/crisis/types";

const SEVERITY_STYLES: Record<CrisisEvent["severity"], string> = {
  critical: "border-accent-rose/35 bg-accent-rose/[0.06]",
  severe: "border-accent-gold/30 bg-accent-gold/[0.05]",
  elevated: "border-panel-border bg-white/[0.02]",
};

const SEVERITY_BADGE: Record<CrisisEvent["severity"], string> = {
  critical: "border-accent-rose/30 bg-accent-rose/10 text-accent-rose",
  severe: "border-accent-gold/30 bg-accent-gold/10 text-accent-gold",
  elevated: "border-panel-border text-foreground-muted",
};

export function EventFeed({ events }: { events: CrisisEvent[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
        <Newspaper className="h-3.5 w-3.5" />
        Situation feed
      </div>

      {events.length === 0 && (
        <div className="panel rounded-2xl p-6 text-center text-sm text-foreground-muted">
          Monitoring stations are online. The first dispatch will arrive shortly.
        </div>
      )}

      <AnimatePresence initial={false}>
        {events.map((event) => {
          const meta = CATEGORY_META[event.category];
          return (
            <motion.div
              key={event.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`rounded-2xl border p-4 ${SEVERITY_STYLES[event.severity]}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${meta.color}1f` }}
                >
                  <meta.icon className="h-3.5 w-3.5" style={{ color: meta.color }} strokeWidth={1.75} />
                </span>
                <span className="text-[11px] font-medium text-foreground-muted">{meta.label}</span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase ${SEVERITY_BADGE[event.severity]}`}
                >
                  {event.severity}
                </span>
                <span className="ml-auto text-[11px] text-foreground-muted">{event.region}</span>
              </div>

              <h3 className="mt-2.5 text-sm font-semibold leading-snug text-foreground">{event.headline}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground-muted">{event.brief}</p>
              <p className="mt-2 text-[10px] uppercase tracking-wide text-foreground-muted/70">
                Source: {event.source}
              </p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
