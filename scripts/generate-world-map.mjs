// One-off generator: precomputes a dotted world map (Robinson projection)
// and writes normalized points + capital pins to src/data so the browser
// bundle never needs the full `dotted-map` country dataset.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import DottedMap from "dotted-map";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CAPITALS = [
  { label: "New York", lat: 40.7128, lng: -74.006 },
  { label: "Brussels", lat: 50.8503, lng: 4.3517 },
  { label: "Geneva", lat: 46.2044, lng: 6.1432 },
  { label: "Nairobi", lat: -1.2921, lng: 36.8219 },
  { label: "New Delhi", lat: 28.6139, lng: 77.209 },
  { label: "Tokyo", lat: 35.6762, lng: 139.6503 },
  { label: "Brasília", lat: -15.7939, lng: -47.8828 },
  { label: "Canberra", lat: -35.2809, lng: 149.13 },
];

const map = new DottedMap({
  width: 120,
  grid: "diagonal",
  projection: { name: "robinson" },
});

for (const capital of CAPITALS) {
  map.addPin({ lat: capital.lat, lng: capital.lng, data: { label: capital.label } });
}

const rawPoints = map.getPoints();
const dotPoints = rawPoints.filter((p) => !p.data);
const pinPoints = rawPoints.filter((p) => p.data);

// Scale x into 0..100 and scale y by the SAME factor (not independently
// normalized) so the true aspect ratio of the projection is preserved.
const xs = dotPoints.map((p) => p.x);
const ys = dotPoints.map((p) => p.y);
const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minY = Math.min(...ys);
const scale = 100 / (maxX - minX);

const project = (p) => [
  Number(((p.x - minX) * scale).toFixed(2)),
  Number(((p.y - minY) * scale).toFixed(2)),
];

const points = dotPoints.map(project);
const pins = pinPoints.map((p) => {
  const [x, y] = project(p);
  return { label: p.data.label, x, y };
});

const width = 100;
const maxY = Math.max(...ys);
const height = Number(((maxY - minY) * scale).toFixed(2));

fs.writeFileSync(
  path.join(__dirname, "..", "src", "data", "world-map-points.json"),
  JSON.stringify(points),
);
fs.writeFileSync(
  path.join(__dirname, "..", "src", "data", "world-map-pins.json"),
  JSON.stringify(pins, null, 2),
);

console.log(`Wrote ${points.length} points and ${pins.length} pins.`);
console.log(`Map bounds: ${width} x ${height} (viewBox="0 0 ${width} ${height}")`);
