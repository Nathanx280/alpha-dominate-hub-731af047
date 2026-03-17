import { motion } from "framer-motion";
import { useSeasonStore } from "@/lib/season-store";
import { AlertTriangle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const levelConfig: Record<number, { label: string; color: string }> = {
  1: { label: "Verbal Warning", color: "text-muted-foreground" },
  2: { label: "−25% Points", color: "text-warning" },
  3: { label: "−50% Points", color: "text-warning" },
  4: { label: "Full Reset", color: "text-destructive" },
  5: { label: "Season DQ", color: "text-destructive" },
};

const DisciplineLog = () => {
  const { warnings, tribes, issueWarning } = useSeasonStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedTribe, setSelectedTribe] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [reason, setReason] = useState("");

  const handleSubmit = async () => {
    if (!selectedTribe || !reason.trim()) return;
    await issueWarning(selectedTribe, selectedLevel, reason.trim());
    setShowForm(false);
    setSelectedTribe("");
    setSelectedLevel(1);
    setReason("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Discipline Log</h2>
            <p className="text-sm text-muted-foreground">{warnings.length} issued</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowForm(!showForm)}
            className="border-warning/30 text-warning hover:bg-warning/10"
          >
            <Plus size={14} className="mr-1" /> Issue Warning
          </Button>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-card-elevated rounded-lg p-5 border border-border/50 mb-4"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">New Warning</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="label-upper mb-1 block">Tribe</label>
                <select
                  value={selectedTribe}
                  onChange={(e) => setSelectedTribe(e.target.value)}
                  className="w-full bg-accent border-0 rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select tribe...</option>
                  {tribes.filter((t) => t.status !== "disqualified").map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-upper mb-1 block">Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  className="w-full bg-accent border-0 rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {[1, 2, 3, 4, 5].map((l) => (
                    <option key={l} value={l}>Level {l} — {levelConfig[l].label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="label-upper mb-1 block">Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-accent border-0 rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none h-20"
                placeholder="Describe the violation..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!selectedTribe || !reason.trim()}
                className="bg-warning hover:bg-warning/90 text-warning-foreground"
              >
                Issue Warning
              </Button>
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          {warnings.map((w, i) => {
            const config = levelConfig[w.level] || levelConfig[1];
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-3 py-3 border-b border-border/30 last:border-0"
              >
                <AlertTriangle size={16} className={cn("mt-0.5 flex-shrink-0", config.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm text-foreground">{w.tribeName}</span>
                    <span className={cn("text-xs font-medium", config.color)}>
                      Level {w.level}: {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{w.reason}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(w.issuedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    <span className="text-[11px] text-muted-foreground">by {w.issuedBy}</span>
                    {w.pointDeduction > 0 && (
                      <span className="text-[11px] font-medium text-destructive">−{w.pointDeduction} pts</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default DisciplineLog;
