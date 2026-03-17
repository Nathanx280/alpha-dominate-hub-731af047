import { motion } from "framer-motion";
import { useSeasonStore } from "@/lib/season-store";
import { Users, Crosshair, Trophy, Clock, TrendingUp, Shield } from "lucide-react";

const StatsHeader = () => {
  const { tribes, raids, claims } = useSeasonStore();
  const activeTribes = tribes.filter((t) => t.status === "active").length;
  const totalPoints = tribes.reduce((sum, t) => sum + t.points, 0);
  const recentRaids = raids.filter((r) => {
    const diff = Date.now() - new Date(r.submittedAt).getTime();
    return diff < 24 * 60 * 60 * 1000;
  }).length;
  const pendingClaims = claims.filter((c) => c.status === "pending").length;
  const topTribe = [...tribes].sort((a, b) => b.points - a.points)[0];
  const totalKills = tribes.reduce((s, t) => s + t.kills, 0);

  const stats = [
    { label: "Active Tribes", value: activeTribes, icon: <Users size={18} />, color: "text-primary" },
    { label: "Raids (24h)", value: recentRaids, icon: <Crosshair size={18} />, color: "text-destructive" },
    { label: "Season Points", value: totalPoints.toLocaleString(), icon: <Trophy size={18} />, color: "text-warning" },
    { label: "Pending Claims", value: pendingClaims, icon: <Clock size={18} />, color: "text-primary" },
    { label: "Total Kills", value: totalKills.toLocaleString(), icon: <TrendingUp size={18} />, color: "text-success" },
    { label: "Leader", value: topTribe?.monogram || "—", icon: <Shield size={18} />, color: "text-warning", sub: topTribe?.name },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="card-surface card-surface-hover p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className={stat.color}>{stat.icon}</span>
            <span className="label-upper">{stat.label}</span>
          </div>
          <div className="stat-value">{stat.value}</div>
          {stat.sub && <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>}
        </motion.div>
      ))}
    </div>
  );
};

export default StatsHeader;
