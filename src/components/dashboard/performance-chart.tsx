"use client";

import { useRef, useState, type PointerEvent } from "react";
import { TrendingUp } from "lucide-react";
import { getWeeklyTrend } from "@/lib/activity-store";
import { useClientValue } from "@/lib/use-client-value";
import type { WeeklyPoint } from "@/lib/activity-store";

const WEEKS = 12;
const W = 600;
const H = 220;
const PAD = { top: 16, bottom: 26, left: 6, right: 6 };
const Y_TICKS = [0, 25, 50, 75, 100];
const LINE_COLOR = "#4cc9f0";

function xFor(i: number) {
  return PAD.left + (i / (WEEKS - 1)) * (W - PAD.left - PAD.right);
}
function yFor(v: number) {
  const t = v / 100;
  return H - PAD.bottom - t * (H - PAD.top - PAD.bottom);
}

function buildSegments(data: WeeklyPoint[]): { index: number; value: number }[][] {
  const segments: { index: number; value: number }[][] = [];
  let current: { index: number; value: number }[] = [];
  data.forEach((w, i) => {
    if (w.score !== null) {
      current.push({ index: i, value: w.score });
    } else if (current.length > 0) {
      segments.push(current);
      current = [];
    }
  });
  if (current.length > 0) segments.push(current);
  return segments;
}

export function PerformanceChart() {
  const data = useClientValue(() => getWeeklyTrend(WEEKS), [] as WeeklyPoint[]);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const knownIndices = data.reduce<number[]>((acc, w, i) => {
    if (w.score !== null) acc.push(i);
    return acc;
  }, []);
  const hasData = knownIndices.length > 0;

  if (!hasData) {
    return (
      <div>
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-foreground">Readiness score</h2>
          <p className="mt-0.5 text-xs text-foreground-muted">Composite of speech, procedure &amp; negotiation drills</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-panel-border bg-white/[0.02] px-6 py-14 text-center">
          <TrendingUp className="h-6 w-6 text-foreground-muted" />
          <p className="text-sm font-medium text-foreground">No trend yet</p>
          <p className="max-w-xs text-xs text-foreground-muted">
            Complete a simulation or speech check to start tracking your readiness score over time.
          </p>
        </div>
      </div>
    );
  }

  const segments = buildSegments(data);
  const active = hover !== null ? hover : knownIndices[knownIndices.length - 1];
  const activePoint = data[active];
  const activeValue = activePoint.score ?? 0;

  function handlePointerMove(e: PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const fraction = (e.clientX - rect.left) / rect.width;
    const raw = Math.round(fraction * (WEEKS - 1));
    let closest = knownIndices[0];
    let bestDist = Math.abs(raw - closest);
    for (const idx of knownIndices) {
      const dist = Math.abs(raw - idx);
      if (dist < bestDist) {
        closest = idx;
        bestDist = dist;
      }
    }
    setHover(closest);
  }

  const tooltipLeftPct = Math.min(90, Math.max(10, (xFor(active) / W) * 100));

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Readiness score</h2>
          <p className="mt-0.5 text-xs text-foreground-muted">Composite of speech, procedure &amp; negotiation drills</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-foreground sm:text-3xl">{activeValue}</div>
          <div className="text-xs text-foreground-muted">{activePoint.label}</div>
        </div>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-none"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="perf-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.28} />
              <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>

          {Y_TICKS.map((tick) => (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={yFor(tick)}
                y2={yFor(tick)}
                stroke="var(--chart-grid)"
                strokeWidth={1}
              />
              <text
                x={PAD.left}
                y={yFor(tick) - 5}
                fontSize={9}
                fill="var(--foreground-muted)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {tick}
              </text>
            </g>
          ))}

          {segments.map((segment, si) => {
            const linePoints = segment.map((p) => `${xFor(p.index)},${yFor(p.value)}`).join(" ");
            const areaPoints =
              segment.length > 1
                ? `${xFor(segment[0].index)},${yFor(0)} ${linePoints} ${xFor(segment[segment.length - 1].index)},${yFor(0)}`
                : "";
            return (
              <g key={si}>
                {segment.length > 1 && <polygon points={areaPoints} fill="url(#perf-area)" />}
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke={LINE_COLOR}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {segment.map((p) => (
                  <circle
                    key={p.index}
                    cx={xFor(p.index)}
                    cy={yFor(p.value)}
                    r={active === p.index ? 4 : 2.5}
                    fill={LINE_COLOR}
                    stroke="var(--panel)"
                    strokeWidth={2}
                  />
                ))}
              </g>
            );
          })}

          {data.map((d, i) =>
            i % 2 === 0 ? (
              <text
                key={d.label}
                x={xFor(i)}
                y={H - 8}
                fontSize={9}
                textAnchor="middle"
                fill="var(--foreground-muted)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {d.label}
              </text>
            ) : null,
          )}

          {hover !== null && (
            <line
              x1={xFor(hover)}
              x2={xFor(hover)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke="var(--chart-axis)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}
        </svg>

        {hover !== null && (
          <div
            className="pointer-events-none absolute top-2 -translate-x-1/2 rounded-lg border border-panel-border bg-background px-2.5 py-1.5 text-xs shadow-lg"
            style={{ left: `${tooltipLeftPct}%` }}
          >
            <div className="text-foreground-muted">{activePoint.label}</div>
            <div className="font-semibold text-foreground" style={{ fontVariantNumeric: "tabular-nums" }}>
              {activeValue} pts
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
