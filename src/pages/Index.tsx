import { useState } from "react";
import AppSidebar from "@/components/layout/Sidebar";
import StatsHeader from "@/components/dashboard/StatsHeader";
import LeaderboardTable from "@/components/dashboard/LeaderboardTable";
import RaidQueue from "@/components/dashboard/RaidQueue";
import ClaimsList from "@/components/dashboard/ClaimsList";
import DisciplineLog from "@/components/dashboard/DisciplineLog";
import WebhookSettings from "@/components/dashboard/WebhookSettings";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import AnalyticsView from "@/components/dashboard/AnalyticsView";
import TribeManager from "@/components/dashboard/TribeManager";
import SeasonTimer from "@/components/dashboard/SeasonTimer";
import { useSeasonStore } from "@/lib/season-store";

const Index = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const { raids, claims } = useSeasonStore();
  const pendingRaids = raids.filter((r) => r.status === "pending").length;
  const pendingClaims = claims.filter((c) => c.status === "pending").length;

  const renderContent = () => {
    switch (activeView) {
      case "leaderboard":
        return <LeaderboardTable />;
      case "claims":
        return <ClaimsList />;
      case "raids":
        return <RaidQueue />;
      case "discipline":
        return <DisciplineLog />;
      case "analytics":
        return <AnalyticsView />;
      case "tribes":
        return <TribeManager />;
      case "settings":
        return <WebhookSettings />;
      default:
        return (
          <div className="space-y-4">
            <StatsHeader />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <LeaderboardTable />
              </div>
              <div className="space-y-4">
                <SeasonTimer />
                <ActivityFeed />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        pendingRaids={pendingRaids}
        pendingClaims={pendingClaims}
      />
      <main className="flex-1 overflow-y-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
