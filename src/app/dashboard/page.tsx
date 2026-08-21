import { Panel } from "@/components/dashboard/panel";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatRow } from "@/components/dashboard/stat-row";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { SkillBreakdown } from "@/components/dashboard/skill-breakdown";
import { ConsistencyHeatmap } from "@/components/dashboard/consistency-heatmap";
import { AiCoachPanel } from "@/components/dashboard/ai-coach-panel";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ConferenceSpeechHub } from "@/components/dashboard/conference-speech-hub";

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <DashboardHeader />

      <StatRow />

      <Panel id="activity">
        <RecentActivity />
      </Panel>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel id="performance" className="lg:col-span-2">
          <PerformanceChart />
        </Panel>
        <Panel id="coach">
          <AiCoachPanel />
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel id="training" className="lg:col-span-2">
          <ConsistencyHeatmap />
        </Panel>
        <Panel>
          <SkillBreakdown />
        </Panel>
      </div>

      <Panel id="hub">
        <ConferenceSpeechHub />
      </Panel>
    </div>
  );
}
