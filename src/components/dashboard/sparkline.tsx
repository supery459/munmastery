type SparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  color: string;
};

/** Minimal trend line for a stat tile: de-emphasized stroke, accent end-dot. */
export function Sparkline({ data, width = 96, height = 30, color }: SparklineProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 3;

  const coords = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = pad + (1 - (d - min) / range) * (height - pad * 2);
    return [x, y] as const;
  });

  const points = coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [lastX, lastY] = coords[coords.length - 1];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeOpacity={0.55}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r={2.5} fill={color} stroke="var(--panel)" strokeWidth={2} />
    </svg>
  );
}
