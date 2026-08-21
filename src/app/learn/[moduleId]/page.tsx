import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORY_META, getModule, LEARN_MODULES } from "@/components/learn/data";
import { ModuleRunner } from "@/components/learn/module-runner";
import { BackLink } from "@/components/nav/back-link";
import { AuthGate } from "@/components/auth/auth-gate";

export function generateStaticParams() {
  return LEARN_MODULES.map((m) => ({ moduleId: m.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const learnModule = getModule(moduleId);
  if (!learnModule) return { title: "Module not found — MUN Mastery" };
  return {
    title: `${learnModule.title} — Learn MUN`,
    description: learnModule.description,
  };
}

export default async function LearnModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const learnModule = getModule(moduleId);
  if (!learnModule) notFound();

  const meta = CATEGORY_META[learnModule.category];

  return (
    <AuthGate>
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-panel-border bg-panel px-4 py-3 sm:px-6">
        <BackLink href="/learn" label="Learn" hideLabelOnMobile />
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${meta.color}1f` }}
        >
          <meta.icon className="h-4 w-4" style={{ color: meta.color }} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">{learnModule.title}</div>
          <div className="text-xs text-foreground-muted">{meta.label}</div>
        </div>
      </header>

      <ModuleRunner module={learnModule} />
    </div>
    </AuthGate>
  );
}
