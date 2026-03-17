import { motion } from "framer-motion";
import { useSeasonStore } from "@/lib/season-store";
import { BarChart3, TrendingUp, Swords, Shield } from "lucide-react";

const AnalyticsView = () => {
  const { tribes, raids, warnings } = useSeasonStore();

  const sortedByPoints = [...tribes].sort((a, b) => b.points - a.points).filter((t) => t.status !== "disqualified");
  const maxPoints = sortedByPoints[0]?.points || 1;

  const totalOnline = raids.filter((r) => r.type === "online").length;
  const totalOffline = raids.filter((r) => r.type === "offline").length;
  const approvedRaids = raids.filter((r) => r.status === "approved").length;
  const deniedRaids = raids.filter((r) => r.status === "denied").length;

  const topKiller = [...tribes].sort((a, b) => b.kills - a.kills)[0];
  const bestKD = [...tribes].filter((t) => t.deaths > 0).sort((a, b) => (b.kills / b.deaths) - (a.kills / a.deaths))[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Raids", value: raids.length, icon: <Swords size={16} />, color: "text-primary" },
          { label: "Approval Rate", value: raids.length > 0 ? `${Math.round((approvedRaids / (approvedRaids + deniedRaids || 1)) * 100)}%` : "—", icon: <TrendingUp size={16} />, color: "text-success" },
          { label: "Online / Offline", value: `${totalOnline} / ${totalOffline}`, icon: <BarChart3 size={16} />, color: "text-warning" },
          { label: "Warnings Issued", value: warnings.length, icon: <Shield size={16} />, color: "text-destructive" },
        ].map((stat) => (
          <div key={stat.label} className="card-surface p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className={stat.color}>{stat.icon}</span>
              <span className="label-upper">{stat.label}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Points Distribution Bar Chart */}
      <div className="card-surface p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Points Distribution</h3>
        <div className="space-y-3">
          {sortedByPoints.map((tribe, i) => (
            <motion.div
              key={tribe.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="w-20 text-xs font-medium text-foreground truncate">{tribe.name}</span>
              <div className="flex-1 h-6 bg-secondary rounded overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(tribe.points / maxPoints) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  className="h-full rounded"
                  style={{ background: "var(--gradient-brand)" }}
                />
              </div>
              <span className="w-14 text-right text-xs font-mono text-muted-foreground">{tribe.points}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Kill Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-surface p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Killers</h3>
          <div className="space-y-3">
            {[...tribes].sort((a, b) => b.kills - a.kills).slice(0, 5).map((tribe, i) => (
              <div key={tribe.id} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                  <span className="text-sm font-medium text-foreground">{tribe.name}</span>
                </div>
                <span className="text-sm font-mono text-success">{tribe.kills}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Best K/D Ratio</h3>
          <div className="space-y-3">
            {[...tribes]
              .filter((t) => t.deaths > 0)
              .sort((a, b) => (b.kills / b.deaths) - (a.kills / a.deaths))
              .slice(0, 5)
              .map((tribe, i) => (
                <div key={tribe.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                    <span className="text-sm font-medium text-foreground">{tribe.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono text-primary">{(tribe.kills / tribe.deaths).toFixed(2)}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">({tribe.kills}/{tribe.deaths})</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Raid Type Breakdown */}
      <div className="card-surface p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Raid Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-card-elevated rounded-lg">
            <p className="text-2xl font-bold text-foreground font-mono">{totalOnline}</p>
            <p className="text-xs text-success mt-1">Online Raids</p>
          </div>
          <div className="text-center p-4 bg-card-elevated rounded-lg">
            <p className="text-2xl font-bold text-foreground font-mono">{totalOffline}</p>
            <p className="text-xs text-warning mt-1">Offline Raids</p>
          </div>
          <div className="text-center p-4 bg-card-elevated rounded-lg">
            <p className="text-2xl font-bold text-foreground font-mono">{approvedRaids}</p>
            <p className="text-xs text-success mt-1">Approved</p>
          </div>
          <div className="text-center p-4 bg-card-elevated rounded-lg">
            <p className="text-2xl font-bold text-foreground font-mono">{deniedRaids}</p>
            <p className="text-xs text-destructive mt-1">Denied</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsView;
