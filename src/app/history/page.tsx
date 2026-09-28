import { HistoryRoot } from "@/components/history/history-root";

export default async function HistoryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const entry = typeof params.entry === "string" ? params.entry : null;
  const type = typeof params.type === "string" ? params.type : "all";
  return <HistoryRoot key={`${entry}:${type}`} entry={entry} type={type} />;
}
