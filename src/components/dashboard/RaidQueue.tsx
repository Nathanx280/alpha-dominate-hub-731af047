import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ExternalLink, Check, X, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeasonStore } from "@/lib/season-store";

const RaidQueue = () => {
  const { raids, tribes, approveRaid, denyRaid } = useSeasonStore();
  const pendingRaids = raids.filter((r) => r.status === "pending");
  const completedRaids = raids.filter((r) => r.status !== "pending");

  const getPointPreview = (raid: typeof raids[0]) => {
    const defender = tribes.find((t) => t.id === raid.defenderId);
    if (!defender) return { gain: 0, loss: 0, defPts: 0 };
    const base = raid.type === "online" ? 3 : 1;
    const pct = raid.type === "online" ? 0.5 : 0.25;
    const fromDef = Math.floor(defender.points * pct);
    return { gain: base + fromDef, loss: fromDef, defPts: defender.points };
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Pending Raid Verifications</h2>
            <p className="text-sm text-muted-foreground">{pendingRaids.length} awaiting review</p>
          </div>
          <div className="flex items-center gap-2">
            <Swords size={18} className="text-primary" />
            <span className="text-sm font-medium text-primary">{pendingRaids.length} pending</span>
          </div>
        </div>

        {pendingRaids.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Swords size={40} className="mx-auto mb-3 opacity-30" />
            <p>No pending raids — all clear.</p>
          </div>
        )}

        <AnimatePresence>
          {pendingRaids.map((raid) => {
            const preview = getPointPreview(raid);
            return (
              <motion.div
                key={raid.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card-elevated rounded-lg p-5 mb-3 border border-border/50"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-foreground">{raid.attackerName}</span>
                      <span className="text-xs text-muted-foreground">vs</span>
                      <span className="font-semibold text-foreground">{raid.defenderName}</span>
                      <span className={cn(
                        "ml-2 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider",
                        raid.type === "online"
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      )}>
                        {raid.type}
                      </span>
                    </div>

                    <a
                      href={raid.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mb-2"
                    >
                      <ExternalLink size={12} /> View Proof Clip
                    </a>

                    <p className="text-xs text-muted-foreground mb-3">{raid.notes}</p>

                    <div className="flex gap-6 text-xs">
                      <div>
                        <span className="text-muted-foreground">Defender Points: </span>
                        <span className="font-mono text-foreground">{preview.defPts} → {preview.defPts - preview.loss}</span>
                        <span className="text-destructive ml-1">(−{preview.loss})</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Attacker Gains: </span>
                        <span className="font-mono text-success">+{preview.gain}</span>
                        <span className="text-muted-foreground ml-1">({raid.type === "online" ? 3 : 1} base + {preview.loss})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => denyRaid(raid.id)}
                      className="border-destructive/30 text-destructive hover:bg-destructive/10"
                    >
                      <X size={14} className="mr-1" /> Deny
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => approveRaid(raid.id)}
                      className="bg-success hover:bg-success/90 text-success-foreground"
                    >
                      <Check size={14} className="mr-1" /> Approve & Broadcast
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Recent history */}
      {completedRaids.length > 0 && (
        <div className="card-surface p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent History</h3>
          <div className="space-y-2">
            {completedRaids.slice(0, 5).map((raid) => (
              <div key={raid.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    raid.status === "approved" ? "bg-success" : "bg-destructive"
                  )} />
                  <span className="text-sm text-foreground">{raid.attackerName} vs {raid.defenderName}</span>
                  <span className={cn(
                    "text-[11px] px-1.5 py-0.5 rounded font-medium uppercase",
                    raid.type === "online" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>{raid.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  {raid.pointsAwarded > 0 && (
                    <span className="text-xs font-mono text-success">+{raid.pointsAwarded}</span>
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    raid.status === "approved" ? "text-success" : "text-destructive"
                  )}>
                    {raid.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RaidQueue;
