import {
  Award,
  FileText,
  Gavel,
  Mic,
  ScrollText,
  Users,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";

const FEATURES = [
  {
    icon: Mic,
    title: "AI speech coach",
    description:
      "Deliver a speech and get instant scoring on clarity, pace, confidence, and persuasiveness — with line-by-line notes, not just a grade.",
    color: "text-accent-cyan",
    glow: "from-accent-cyan/15",
  },
  {
    icon: Gavel,
    title: "Parliamentary procedure trainer",
    description:
      "Drill motions, points, and voting procedure through realistic scenarios until they're second nature, before you ever step into a real committee.",
    color: "text-accent-indigo",
    glow: "from-accent-indigo/15",
  },
  {
    icon: ScrollText,
    title: "Resolution & clause assistant",
    description:
      "Draft preambulatory and operative clauses with guided suggestions, formatting checks, and bloc-alignment feedback as you write.",
    color: "text-accent-gold",
    glow: "from-accent-gold/15",
  },
  {
    icon: Users,
    title: "Committee simulation",
    description:
      "Practice full sessions against AI delegates who negotiate, lobby, and challenge your position — a realistic dry run before conference day.",
    color: "text-accent-emerald",
    glow: "from-accent-emerald/15",
  },
  {
    icon: FileText,
    title: "Position paper review",
    description:
      "Upload a draft and get structural and research feedback aligned to your committee's topic, so it's ready before the submission deadline.",
    color: "text-accent-cyan",
    glow: "from-accent-cyan/15",
  },
  {
    icon: Award,
    title: "Progress & readiness score",
    description:
      "Track improvement across every practice session and see a single readiness score that tells you exactly how prepared you are.",
    color: "text-accent-indigo",
    glow: "from-accent-indigo/15",
  },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to{" "}
            <span className="text-gradient-diplomatic">win your committee</span>
          </h2>
          <p className="mt-4 text-foreground-muted">
            From your first motion to your closing speech, MUN Mastery covers
            every skill a delegate needs — beginner or veteran.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <GlassCard key={feature.title} delay={i * 0.07} className="p-6">
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${feature.glow} to-transparent`}
              >
                <feature.icon className={`h-5 w-5 ${feature.color}`} strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
