import { Star } from "lucide-react";
import { GlassCard } from "@/components/glass-card";

const TESTIMONIALS = [
  {
    quote:
      "I'd never done MUN before and was terrified of getting a motion wrong in front of everyone. First Conference Mode walked me through everything — by the second committee session I felt like I'd done this for years.",
    name: "Amara Okafor",
    role: "First-time delegate, Lagos",
    initials: "AO",
    gradient: "from-accent-cyan to-accent-indigo",
  },
  {
    quote:
      "The speech coach caught filler words and pacing issues my actual coach never mentioned. My clarity score went from 61 to 89 in three weeks, and it showed on the floor.",
    name: "Daniel Reyes",
    role: "Delegate, Model UN Club President",
    initials: "DR",
    gradient: "from-accent-indigo to-accent-gold",
  },
  {
    quote:
      "We use the committee simulation with our entire team before every conference now. It's the closest thing to a real crisis room we've found without flying in judges.",
    name: "Priya Nathan",
    role: "Faculty advisor, high school MUN team",
    initials: "PN",
    gradient: "from-accent-gold to-accent-emerald",
  },
  {
    quote:
      "The resolution builder alone is worth it. Clause formatting used to eat half our prep time — now a working draft takes twenty minutes.",
    name: "Lucas Bianchi",
    role: "Head delegate, university MUN society",
    initials: "LB",
    gradient: "from-accent-emerald to-accent-cyan",
  },
  {
    quote:
      "I chair committees now, and I recommend MUN Mastery to every new delegate who looks lost in the first ten minutes. It genuinely closes the experience gap.",
    name: "Sofia Kowalski",
    role: "Committee chair, regional conference circuit",
    initials: "SK",
    gradient: "from-accent-cyan to-accent-gold",
  },
  {
    quote:
      "Best gavel I've won. The AI feedback on my position paper flagged a research gap I would've missed until it was too late to fix.",
    name: "Tomás Herrera",
    role: "Best Delegate, Nationals",
    initials: "TH",
    gradient: "from-accent-indigo to-accent-emerald",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Delegates who{" "}
            <span className="text-gradient-diplomatic">stopped guessing</span>
          </h2>
          <p className="mt-4 text-foreground-muted">
            From first-timers to award-winning delegates, here&rsquo;s what
            changed once they had a coach in their corner.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <GlassCard key={t.name} delay={i * 0.06} className="flex flex-col p-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    className="h-3.5 w-3.5 fill-accent-gold text-accent-gold"
                  />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground-muted">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-xs font-semibold text-[#05070d]`}
                >
                  {t.initials}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-foreground">
                    {t.name}
                  </div>
                  <div className="truncate text-xs text-foreground-muted">
                    {t.role}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
