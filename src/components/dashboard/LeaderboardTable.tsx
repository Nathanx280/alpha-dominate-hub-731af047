import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertTriangle, Lock, Ban, Minus, TrendingUp, TrendingDown } from "lucide-react";
import { useSeasonStore } from "@/lib/season-store";
import type { Tribe } from "@/lib/mock-data";
import { useState } from "react";

const statusConfig: Record<string, { label: string; className: string; icon?: React.ReactNode }> = {
  active: { label: "Active", className: "text-success" },
  locked: { label: "Locked", className: "text-warning", icon: <Lock size={12} /> },
  disqualified: { label: "DQ", className: "text-destructive", icon: <Ban size={12} /> },
  wiped: { label: "Wiped", className: "text-destructive", icon: <Minus size={12} /> },
};

const LeaderboardTable = () => {
  const { tribes } = useSeasonStore();
  const [sortBy, setSortBy] = useState<"points" | "kills" | "kd">("points");
  
  const sorted = [...tribes].sort((a, b) => {
    if (sortBy === "kills") return b.kills - a.kills;
    if (sortBy === "kd") return (b.kills / (b.deaths || 1)) - (a.kills / (a.deaths || 1));
    return b.points - a.points;
  });

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card-surface p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Season Leaderboard</h2>
          <p className="text-sm text-muted-foreground">{tribes.length} tribes registered</p>
        </div>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {(["points", "kills", "kd"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                sortBy === key
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {key === "kd" ? "K/D" : key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 label-upper w-12">#</th>
              <th className="text-left py-3 px-3 label-upper">Tribe</th>
              <th className="text-left py-3 px-3 label-upper">Status</th>
              <th className="text-right py-3 px-3 label-upper">Points</th>
              <th className="text-right py-3 px-3 label-upper">K/D</th>
              <th className="text-right py-3 px-3 label-upper">Bases</th>
              <th className="text-right py-3 px-3 label-upper">Warns</th>
              <th className="text-right py-3 px-3 label-upper">Last Raid</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((tribe, i) => {
              const status = statusConfig[tribe.status];
              const kd = tribe.deaths > 0 ? (tribe.kills / tribe.deaths).toFixed(2) : tribe.kills.toString();
              const kdGood = tribe.kills / (tribe.deaths || 1) >= 1.5;
              return (
                <motion.tr
                  key={tribe.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="zebra-row border-b border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <td className="py-3 px-3 font-mono text-muted-foreground">
                    {i < 3 ? <span className="text-base">{medals[i]}</span> : i + 1}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary font-mono">
                        {tribe.monogram}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{tribe.name}</p>
                        <p className="text-xs text-muted-foreground">{tribe.rosterSize} members</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className={cn("flex items-center gap-1 text-xs font-medium", status.className)}>
                      {status.icon}
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right data-cell font-semibold text-foreground">{tribe.points}</td>
                  <td className="py-3 px-3 text-right">
                    <span className={cn("data-cell", kdGood ? "text-success" : "text-muted-foreground")}>
                      {kd}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right data-cell">{tribe.bases}</td>
                  <td className="py-3 px-3 text-right">
                    {tribe.warnings > 0 ? (
                      <span className="flex items-center gap-1 justify-end text-warning">
                        <AlertTriangle size={12} />
                        <span className="data-cell">{tribe.warnings}</span>
                      </span>
                    ) : (
                      <span className="data-cell text-muted-foreground">0</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right data-cell text-muted-foreground">
                    {tribe.lastRaid
                      ? new Date(tribe.lastRaid).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
                      : "—"}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default LeaderboardTable;
