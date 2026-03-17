import { motion } from "framer-motion";
import { useSeasonStore } from "@/lib/season-store";
import { Activity, Swords, MapPin, AlertTriangle, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  raid_approved: { icon: <Swords size={14} />, color: "text-success" },
  raid_denied: { icon: <Swords size={14} />, color: "text-destructive" },
  claim_approved: { icon: <MapPin size={14} />, color: "text-success" },
  claim_denied: { icon: <MapPin size={14} />, color: "text-destructive" },
  warning_issued: { icon: <AlertTriangle size={14} />, color: "text-warning" },
  tribe_joined: { icon: <Users size={14} />, color: "text-primary" },
  season_event: { icon: <Zap size={14} />, color: "text-primary" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const ActivityFeed = () => {
  const { activity } = useSeasonStore();

  return (
    <div className="card-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={16} className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Activity Feed</h3>
        <span className="pulse-dot ml-auto" />
      </div>

      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {activity.slice(0, 15).map((event, i) => {
          const config = typeConfig[event.type] || typeConfig.season_event;
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-start gap-2.5 py-2 border-b border-border/20 last:border-0"
            >
              <span className={cn("mt-0.5 flex-shrink-0", config.color)}>{config.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-relaxed">{event.message}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(event.timestamp)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;
