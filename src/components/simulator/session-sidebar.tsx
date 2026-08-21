import { Gavel, Radio, Users, Vote } from "lucide-react";
import type { Country, FeedEntry } from "@/components/simulator/types";

type SessionSidebarProps = {
  entries: FeedEntry[];
  mode: string;
  userCountry: Country;
  aiDelegates: Country[];
  activeSpeakerCode: string | null;
};

export function SessionSidebar({ entries, mode, userCountry, aiDelegates, activeSpeakerCode }: SessionSidebarProps) {
  const lastChair = [...entries].reverse().find((e) => e.kind === "chair");
  const motions = entries.filter((e): e is Extract<FeedEntry, { kind: "motion" }> => e.kind === "motion");
  const roster = [userCountry, ...aiDelegates];

  return (
    <div className="flex flex-col gap-4">
      <div className="panel rounded-2xl p-4">
        <div className="mb-2.5 flex items-center gap-2">
          <Gavel className="h-3.5 w-3.5 text-accent-gold" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">The Dais</h3>
        </div>
        <span className="mb-2 inline-block rounded-full border border-accent-gold/30 bg-accent-gold/10 px-2.5 py-0.5 text-[10px] font-medium text-accent-gold">
          {mode}
        </span>
        <p className="text-xs leading-relaxed text-foreground-muted">
          {lastChair && lastChair.kind === "chair" ? lastChair.text : "Awaiting the chair's opening remarks."}
        </p>
      </div>

      <div className="panel rounded-2xl p-4">
        <div className="mb-2.5 flex items-center gap-2">
          <Vote className="h-3.5 w-3.5 text-accent-cyan" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Motions queue</h3>
        </div>
        {motions.length === 0 ? (
          <p className="text-xs text-foreground-muted">No motions on the floor yet.</p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {motions.map((m) => (
              <li key={m.id} className="text-xs">
                <div className="font-medium text-foreground">{m.mover.name}</div>
                <p className="mt-0.5 text-foreground-muted">Moves {m.text}</p>
                <span
                  className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${
                    m.status === "passed"
                      ? "border-accent-emerald/30 bg-accent-emerald/10 text-accent-emerald"
                      : m.status === "failed"
                        ? "border-accent-rose/30 bg-accent-rose/10 text-accent-rose"
                        : "border-accent-gold/30 bg-accent-gold/10 text-accent-gold"
                  }`}
                >
                  {m.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="panel rounded-2xl p-4">
        <div className="mb-2.5 flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-foreground-muted" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-muted">Delegation roster</h3>
        </div>
        <ul className="flex flex-col gap-1.5">
          {roster.map((c) => {
            const isUser = c.code === userCountry.code;
            const isActive = isUser ? activeSpeakerCode === "YOU" : activeSpeakerCode === c.code;
            return (
              <li
                key={c.code}
                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${
                  isActive ? "bg-white/[0.06]" : ""
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold ${
                    isUser
                      ? "bg-gradient-to-br from-accent-cyan to-accent-indigo text-[#05070d]"
                      : "bg-white/[0.06] text-foreground-muted"
                  }`}
                >
                  {isUser ? "You" : c.code}
                </span>
                <span className={isUser ? "font-medium text-foreground" : "text-foreground-muted"}>
                  {isUser ? `${userCountry.name} (you)` : c.name}
                </span>
                {isActive && (
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-accent-cyan">
                    <Radio className="h-3 w-3 animate-pulse" />
                    live
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
