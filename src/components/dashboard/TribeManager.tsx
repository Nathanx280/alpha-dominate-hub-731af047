import { motion } from "framer-motion";
import { useSeasonStore } from "@/lib/season-store";
import { Shield, Users, Crosshair, AlertTriangle, Lock, Ban, Skull } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: { label: "Active", color: "text-success bg-success/10", icon: <Shield size={12} /> },
  locked: { label: "Locked", color: "text-warning bg-warning/10", icon: <Lock size={12} /> },
  disqualified: { label: "Disqualified", color: "text-destructive bg-destructive/10", icon: <Ban size={12} /> },
  wiped: { label: "Wiped", color: "text-destructive bg-destructive/10", icon: <Skull size={12} /> },
};

const TribeManager = () => {
  const { tribes, raids, warnings } = useSeasonStore();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Tribe Manager</h2>
            <p className="text-sm text-muted-foreground">Detailed view of all registered tribes</p>
          </div>
        </div>

        <div className="grid gap-4">
          {tribes.map((tribe, i) => {
            const status = statusConfig[tribe.status];
            const tribeRaids = raids.filter((r) => r.attackerId === tribe.id || r.defenderId === tribe.id);
            const tribeWarnings = warnings.filter((w) => w.tribeId === tribe.id);
            const kd = tribe.deaths > 0 ? (tribe.kills / tribe.deaths).toFixed(2) : tribe.kills.toString();

            return (
              <motion.div
                key={tribe.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card-elevated rounded-lg p-5 border border-border/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary font-mono">
                      {tribe.monogram}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{tribe.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Led by {tribe.leaderName} • Created {new Date(tribe.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                      </p>
                    </div>
                  </div>
                  <span className={cn("px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1", status.color)}>
                    {status.icon} {status.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div>
                    <span className="label-upper">Points</span>
                    <p className="text-lg font-bold text-foreground font-mono mt-0.5">{tribe.points}</p>
                  </div>
                  <div>
                    <span className="label-upper">Roster</span>
                    <p className="text-sm text-foreground mt-0.5 flex items-center gap-1">
                      <Users size={12} /> {tribe.rosterSize} ({tribe.rosterChanges} changes)
                    </p>
                  </div>
                  <div>
                    <span className="label-upper">K/D</span>
                    <p className="text-sm font-mono text-foreground mt-0.5">
                      {kd} <span className="text-[10px] text-muted-foreground">({tribe.kills}/{tribe.deaths})</span>
                    </p>
                  </div>
                  <div>
                    <span className="label-upper">Bases</span>
                    <p className="text-sm font-mono text-foreground mt-0.5">{tribe.bases}</p>
                  </div>
                  <div>
                    <span className="label-upper">Raids</span>
                    <p className="text-sm font-mono text-foreground mt-0.5 flex items-center gap-1">
                      <Crosshair size={12} /> {tribeRaids.length}
                    </p>
                  </div>
                  <div>
                    <span className="label-upper">Warnings</span>
                    <p className={cn("text-sm font-mono mt-0.5 flex items-center gap-1", tribe.warnings > 0 ? "text-warning" : "text-foreground")}>
                      {tribe.warnings > 0 && <AlertTriangle size={12} />}
                      {tribe.warnings}
                    </p>
                  </div>
                </div>

                {tribeWarnings.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <span className="label-upper">Warning History</span>
                    <div className="mt-1 space-y-1">
                      {tribeWarnings.map((w) => (
                        <p key={w.id} className="text-[11px] text-muted-foreground">
                          Level {w.level} — {w.reason}
                          {w.pointDeduction > 0 && <span className="text-destructive ml-1">(−{w.pointDeduction} pts)</span>}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default TribeManager;
