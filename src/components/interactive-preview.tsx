"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Gavel, Mic, ScrollText } from "lucide-react";

const TOOLS = [
  {
    id: "speech",
    icon: Mic,
    title: "Speech Practice",
    tagline: "Rehearse with instant AI scoring",
    color: "text-accent-cyan",
    glow: "from-accent-cyan/15",
  },
  {
    id: "procedure",
    icon: Gavel,
    title: "Procedure Trainer",
    tagline: "Drill motions & points of order",
    color: "text-accent-indigo",
    glow: "from-accent-indigo/15",
  },
  {
    id: "resolution",
    icon: ScrollText,
    title: "Resolution Builder",
    tagline: "Draft clauses with a guided assistant",
    color: "text-accent-gold",
    glow: "from-accent-gold/15",
  },
  {
    id: "paper",
    icon: FileText,
    title: "Position Paper Assistant",
    tagline: "Outline & polish before conference",
    color: "text-accent-emerald",
    glow: "from-accent-emerald/15",
  },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

export function InteractivePreview() {
  const [active, setActive] = useState<ToolId>("speech");

  return (
    <section id="preview" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="text-gradient-diplomatic">Try before you commit.</span>
          </h2>
          <p className="mt-4 text-foreground-muted">
            Click a tool to preview exactly what your practice sessions look
            like — no sign-up needed to look around.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((tool) => {
            const isActive = tool.id === active;
            return (
              <button
                key={tool.id}
                onClick={() => setActive(tool.id)}
                className={`glass-hover rounded-2xl border p-5 text-left transition-colors ${
                  isActive
                    ? "border-accent-cyan/40 bg-surface-glass-hover"
                    : "border-border-glass bg-surface-glass"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tool.glow} to-transparent`}
                >
                  <tool.icon className={`h-4 w-4 ${tool.color}`} strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  {tool.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-foreground-muted">
                  {tool.tagline}
                </p>
              </button>
            );
          })}
        </div>

        <div className="glass-panel glow-indigo relative mt-6 min-h-[320px] overflow-hidden rounded-3xl p-6 sm:p-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <ToolPreview id={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ToolPreview({ id }: { id: ToolId }) {
  if (id === "speech") {
    return (
      <PreviewFrame label="Speech Practice" badge="87 · Confidence Score">
        <div className="flex items-end gap-1 py-2">
          {[40, 65, 30, 80, 55, 90, 45, 70, 60, 85, 35, 75, 50, 95, 40].map((h, i) => (
            <span
              key={i}
              className="w-full rounded-full bg-gradient-to-t from-accent-cyan/70 to-accent-indigo/70"
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
        <p className="mt-4 text-sm text-foreground-muted">
          &ldquo;Pace is strong. Consider a brief pause after your call to
          action for emphasis.&rdquo;
        </p>
      </PreviewFrame>
    );
  }

  if (id === "procedure") {
    return (
      <PreviewFrame label="Procedure Trainer" badge="Round 3 of 8">
        <div className="rounded-xl border border-border-glass bg-background-elevated/60 p-4">
          <p className="text-xs text-foreground-muted">Prompt</p>
          <p className="mt-1.5 text-sm text-foreground">
            The delegate of Kenya wishes to raise a point during a moderated
            caucus. What&rsquo;s the correct procedure?
          </p>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { label: "Point of Order", correct: false },
            { label: "Wait for recognition, then speak", correct: true },
            { label: "Point of Personal Privilege", correct: false },
            { label: "Motion to table the topic", correct: false },
          ].map((option) => (
            <div
              key={option.label}
              className={`rounded-lg border px-3 py-2 text-xs ${
                option.correct
                  ? "border-accent-emerald/40 bg-accent-emerald/10 text-accent-emerald"
                  : "border-border-glass text-foreground-muted"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      </PreviewFrame>
    );
  }

  if (id === "resolution") {
    return (
      <PreviewFrame label="Resolution Builder" badge="Draft 1.2">
        <div className="space-y-2.5">
          {[
            { tag: "Preambulatory", text: "Reaffirming the principles of UNCLOS," },
            { tag: "Operative 1", text: "Calls upon member states to increase..." },
            { tag: "Operative 2", text: "Requests the Secretary-General to..." },
          ].map((clause) => (
            <div
              key={clause.tag}
              className="flex items-start gap-3 rounded-lg border border-border-glass bg-background-elevated/60 px-3 py-2.5"
            >
              <span className="mt-0.5 shrink-0 rounded-full bg-accent-gold/15 px-2 py-0.5 text-[10px] font-medium text-accent-gold">
                {clause.tag}
              </span>
              <span className="text-xs text-foreground-muted">{clause.text}</span>
            </div>
          ))}
        </div>
      </PreviewFrame>
    );
  }

  return (
    <PreviewFrame label="Position Paper Assistant" badge="82% complete">
      <div className="space-y-3">
        {[
          { section: "Country background", status: "done" },
          { section: "Past international actions", status: "done" },
          { section: "Proposed solutions", status: "in progress" },
        ].map((row) => (
          <div key={row.section} className="flex items-center justify-between text-sm">
            <span className="text-foreground-muted">{row.section}</span>
            <span
              className={
                row.status === "done" ? "text-accent-emerald" : "text-accent-gold"
              }
            >
              {row.status === "done" ? "Complete" : "In progress"}
            </span>
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

function PreviewFrame({
  label,
  badge,
  children,
}: {
  label: string;
  badge: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border-glass bg-background-elevated/40 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-accent-emerald" />
          <span className="text-xs font-medium text-foreground-muted">{label}</span>
        </div>
        <span className="glass rounded-full px-3 py-1 text-xs font-medium text-foreground">
          {badge}
        </span>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
