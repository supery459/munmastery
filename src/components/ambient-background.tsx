import { WorldMap } from "@/components/world-map";

/**
 * Fixed, full-viewport backdrop shared by every page: base gradient wash,
 * drifting glow orbs, a faint grid, and the dotted world map — all
 * decorative, so it lives behind everything with pointer-events disabled.
 */
export function AmbientBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
      aria-hidden="true"
    >
      {/* Base radial wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99, 102, 241, 0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 100% 100%, rgba(76, 201, 240, 0.12), transparent 60%)",
        }}
      />

      {/* Drifting glow orbs */}
      <div
        className="animate-drift absolute -left-40 top-[-10%] h-[36rem] w-[36rem] rounded-full opacity-40 blur-[120px]"
        style={{ background: "var(--accent-indigo)" }}
      />
      <div
        className="animate-drift absolute right-[-15%] top-[20%] h-[30rem] w-[30rem] rounded-full opacity-30 blur-[120px]"
        style={{ background: "var(--accent-cyan)", animationDelay: "-8s" }}
      />
      <div
        className="animate-drift absolute bottom-[-15%] left-[20%] h-[28rem] w-[28rem] rounded-full opacity-20 blur-[130px]"
        style={{ background: "var(--accent-gold)", animationDelay: "-14s" }}
      />

      {/* Faint structural grid, faded toward the edges */}
      <div className="bg-grid-diplomatic mask-fade-edges absolute inset-0 opacity-40" />

      {/* Dotted world map, sitting low in the composition */}
      <div className="absolute inset-x-0 top-1/3 opacity-[0.35] mask-fade-edges">
        <WorldMap className="mx-auto h-auto w-full max-w-6xl" />
      </div>

      {/* Vignette to keep content readable at the edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 40%, transparent 55%, rgba(5, 7, 13, 0.9) 100%)",
        }}
      />
    </div>
  );
}
