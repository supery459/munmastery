import { AnimatePresence, motion } from "framer-motion";
import { Gavel, HelpCircle, Vote } from "lucide-react";
import { TypingIndicator } from "@/components/simulator/typing-indicator";
import type { Country, FeedEntry } from "@/components/simulator/types";

const STATUS_STYLES = {
  pending: "border-accent-gold/30 bg-accent-gold/10 text-accent-gold",
  passed: "border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald",
  failed: "border-accent-rose/30 bg-accent-rose/10 text-accent-rose",
};

function AiBubble({ country, text }: { country: Country; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-semibold text-foreground-muted">
        {country.code}
      </span>
      <div className="max-w-2xl rounded-2xl rounded-tl-sm border border-panel-border bg-panel px-4 py-3">
        <div className="mb-1 text-xs font-medium text-foreground-muted">{country.name}</div>
        <p className="text-sm leading-relaxed text-foreground">{text}</p>
      </div>
    </div>
  );
}

function UserBubble({ text, timedOut }: { text: string; timedOut: boolean }) {
  return (
    <div className="flex items-start justify-end gap-3">
      <div className="max-w-2xl rounded-2xl rounded-tr-sm border border-accent-cyan/30 bg-accent-cyan/[0.08] px-4 py-3">
        <div className="mb-1 text-right text-xs font-medium text-accent-cyan">
          You {timedOut && <span className="text-foreground-muted">&middot; cut off by the chair</span>}
        </div>
        <p className="text-sm leading-relaxed text-foreground">
          {text || <span className="italic text-foreground-muted">Yielded the floor without remarks.</span>}
        </p>
      </div>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-cyan to-accent-indigo text-[10px] font-semibold text-[#05070d]">
        You
      </span>
    </div>
  );
}

export function TranscriptFeed({ entries }: { entries: FeedEntry[] }) {
  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence initial={false}>
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {entry.kind === "chair" && (
              <div className="flex items-start gap-3 rounded-xl border border-accent-gold/20 bg-accent-gold/[0.06] px-4 py-3">
                <Gavel className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />
                <p className="text-sm leading-relaxed text-foreground">
                  <span className="font-medium text-accent-gold">The Chair: </span>
                  {entry.text}
                </p>
              </div>
            )}

            {entry.kind === "typing" && <TypingIndicator country={entry.country} />}

            {entry.kind === "ai-speech" && <AiBubble country={entry.country} text={entry.text} />}

            {entry.kind === "user-speech" && <UserBubble text={entry.text} timedOut={entry.timedOut} />}

            {entry.kind === "point-prompt" && (
              <div className="flex items-start gap-3 rounded-xl border border-panel-border bg-white/[0.03] px-4 py-3">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-foreground-muted" />
                <p className="text-sm leading-relaxed text-foreground-muted">
                  <span className="font-medium text-foreground">{entry.raiser.name} raises a point of inquiry: </span>
                  &ldquo;{entry.question}&rdquo;
                </p>
              </div>
            )}

            {entry.kind === "motion" && (
              <div className="rounded-xl border border-panel-border bg-white/[0.03] px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Vote className="h-4 w-4 text-foreground-muted" />
                  <span className="text-xs font-medium text-foreground">
                    {entry.mover.name} moves {entry.text}
                  </span>
                  <span
                    className={`ml-auto rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_STYLES[entry.status]}`}
                  >
                    {entry.status}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
