import { motion } from "framer-motion";
import { useSeasonStore } from "@/lib/season-store";
import { Trophy } from "lucide-react";

const SeasonTimer = () => {
  const seasonEnd = new Date("2026-04-15T00:00:00Z");
  const seasonStart = new Date("2026-02-28T00:00:00Z");
  const now = new Date();
  const totalDuration = seasonEnd.getTime() - seasonStart.getTime();
  const elapsed = now.getTime() - seasonStart.getTime();
  const remaining = seasonEnd.getTime() - now.getTime();
  const progress = Math.min(100, (elapsed / totalDuration) * 100);

  const daysLeft = Math.max(0, Math.floor(remaining / (1000 * 60 * 60 * 24)));
  const hoursLeft = Math.max(0, Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));

  return (
    <div className="card-surface card-glow p-5">
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={16} className="text-warning" />
        <h3 className="text-sm font-semibold text-foreground">Season Alpha</h3>
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold font-display brand-gradient-text">{daysLeft}</span>
        <span className="text-sm text-muted-foreground">days</span>
        <span className="text-xl font-bold font-display text-foreground">{hoursLeft}</span>
        <span className="text-sm text-muted-foreground">hrs remaining</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: "var(--gradient-brand)" }}
        />
      </div>
      <p className="text-[10px] text-muted-foreground mt-2">
        {Math.round(progress)}% complete • Ends Apr 15, 2026
      </p>
    </div>
  );
};

export default SeasonTimer;
