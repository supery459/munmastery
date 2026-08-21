import { DIMENSION_LABELS } from "@/components/simulator/scoring";
import type { ScoreDimension } from "@/components/simulator/types";

const AXES: ScoreDimension[] = ["clarity", "diplomaticStrategy", "researchDepth", "persuasiveness"];
const SIZE = 280;
const CENTER = SIZE / 2;
const MAX_R = 96;
const RINGS = [0.25, 0.5, 0.75, 1];

function pointAt(index: number, fraction: number): [number, number] {
  const angle = -Math.PI / 2 + index * ((Math.PI * 2) / AXES.length);
  const r = fraction * MAX_R;
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
}

function polygonPoints(fractions: number[]): string {
  return fractions.map((f, i) => pointAt(i, f).join(",")).join(" ");
}

export function RadarChart({ values }: { values: Record<ScoreDimension, number> }) {
  const dataFractions = AXES.map((d) => values[d] / 100);

  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-[280px]" role="img" aria-label="Score breakdown radar chart">
      {RINGS.map((f) => (
        <polygon
          key={f}
          points={polygonPoints(AXES.map(() => f))}
          fill="none"
          stroke="var(--chart-grid)"
          strokeWidth={1}
        />
      ))}

      {AXES.map((_, i) => {
        const [x, y] = pointAt(i, 1);
        return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="var(--chart-grid)" strokeWidth={1} />;
      })}

      <polygon
        points={polygonPoints(dataFractions)}
        fill="#4cc9f0"
        fillOpacity={0.16}
        stroke="#4cc9f0"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {dataFractions.map((f, i) => {
        const [x, y] = pointAt(i, f);
        return <circle key={i} cx={x} cy={y} r={3.5} fill="#4cc9f0" stroke="var(--panel)" strokeWidth={2} />;
      })}

      {AXES.map((d, i) => {
        const [x, y] = pointAt(i, 1.32);
        return (
          <text
            key={d}
            x={x}
            y={y}
            fontSize={10.5}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--foreground-muted)"
          >
            <tspan x={x} dy="-0.3em" fill="var(--foreground)" fontWeight={600} style={{ fontVariantNumeric: "tabular-nums" }}>
              {values[d]}
            </tspan>
            <tspan x={x} dy="1.2em">
              {DIMENSION_LABELS[d]}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}
