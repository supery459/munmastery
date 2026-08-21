import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import type { Country } from "@/components/simulator/types";
import type { Directive, DirectiveDecision } from "@/components/crisis/types";

const CLASSIFICATION_STYLES: Record<Directive["classification"], string> = {
  "EYES ONLY": "text-accent-rose",
  CONFIDENTIAL: "text-accent-gold",
  RESTRICTED: "text-accent-cyan",
};

export function DirectiveFeed({
  directives,
  country,
  decisions,
  onRespond,
}: {
  directives: Directive[];
  country: Country;
  decisions: DirectiveDecision[];
  onRespond: (directiveId: string, response: string) => void;
}) {
  const decisionFor = (id: string) => decisions.find((d) => d.directiveId === id);

  return (
    <div className="flex flex-col gap-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground-muted">
        <LockKeyhole className="h-3.5 w-3.5" />
        Confidential directives
      </div>

      {directives.length === 0 && (
        <div className="panel rounded-2xl p-5 text-center text-xs text-foreground-muted">
          No directives on file yet. Classified guidance will appear here as the situation develops.
        </div>
      )}

      <AnimatePresence initial={false}>
        {directives.map((directive) => {
          const decision = decisionFor(directive.id);
          return (
            <motion.div
              key={directive.id}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl border border-panel-border bg-[#0a0908] p-4"
            >
              <span
                className="pointer-events-none absolute -right-6 top-3 rotate-[18deg] select-none text-[10px] font-bold tracking-[0.2em] opacity-[0.14]"
                style={{ color: "currentColor" }}
              >
                {directive.classification} · {directive.classification} · {directive.classification}
              </span>

              <div className="relative flex items-center gap-2">
                <LockKeyhole className={`h-3.5 w-3.5 ${CLASSIFICATION_STYLES[directive.classification]}`} />
                <span className={`text-[10px] font-bold tracking-wider ${CLASSIFICATION_STYLES[directive.classification]}`}>
                  {directive.classification}
                </span>
                <span className="ml-auto text-[10px] text-foreground-muted">TO: Delegation of {country.name}</span>
              </div>

              <div className="relative mt-2.5">
                <div className="text-[11px] text-foreground-muted">From: {directive.from}</div>
                <h3 className="mt-0.5 text-sm font-semibold text-foreground">{directive.subject}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground-muted">{directive.body}</p>
              </div>

              {decision ? (
                <div className="relative mt-3 flex items-center gap-1.5 rounded-lg border border-accent-emerald/30 bg-accent-emerald/10 px-3 py-2 text-xs text-accent-emerald">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  Response logged: {decision.response}
                </div>
              ) : (
                <div className="relative mt-3 flex flex-wrap gap-1.5">
                  {directive.responses.map((response) => (
                    <button
                      key={response}
                      onClick={() => onRespond(directive.id, response)}
                      className="rounded-lg border border-panel-border px-2.5 py-1.5 text-[11px] font-medium text-foreground-muted transition-colors hover:border-accent-cyan/30 hover:text-foreground"
                    >
                      {response}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
