import { motion } from "framer-motion";
import { MapPin, Check, X, Castle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSeasonStore } from "@/lib/season-store";

const ClaimsList = () => {
  const { claims, approveClaim, denyClaim } = useSeasonStore();
  const pending = claims.filter((c) => c.status === "pending");
  const processed = claims.filter((c) => c.status !== "pending");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Pending Base Claims</h2>
            <p className="text-sm text-muted-foreground">{pending.length} awaiting verification</p>
          </div>
          <div className="flex items-center gap-2">
            <Castle size={18} className="text-primary" />
          </div>
        </div>

        {pending.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Castle size={40} className="mx-auto mb-3 opacity-30" />
            <p>No pending claims.</p>
          </div>
        )}

        <div className="grid gap-3">
          {pending.map((claim, i) => (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card-elevated rounded-lg p-5 border border-border/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{claim.tribeName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(claim.submittedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="label-upper">Location</span>
                  <p className="text-sm text-foreground mt-0.5 flex items-center gap-1">
                    <MapPin size={12} className="text-primary" /> {claim.location}
                  </p>
                </div>
                <div>
                  <span className="label-upper">Coordinates</span>
                  <p className="text-sm font-mono text-foreground mt-0.5">{claim.coordinates}</p>
                </div>
                <div>
                  <span className="label-upper">Turrets</span>
                  <p className="text-sm font-mono text-foreground mt-0.5">{claim.turretCount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => denyClaim(claim.id)}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <X size={14} className="mr-1" /> Deny
                </Button>
                <Button
                  size="sm"
                  onClick={() => approveClaim(claim.id)}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                >
                  <Check size={14} className="mr-1" /> Approve (+5 pts)
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {processed.length > 0 && (
        <div className="card-surface p-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Processed Claims</h3>
          {processed.map((claim) => (
            <div key={claim.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${claim.status === "approved" ? "bg-success" : "bg-destructive"}`} />
                <span className="text-sm">{claim.tribeName}</span>
                <span className="text-xs text-muted-foreground">— {claim.location}</span>
              </div>
              <span className={`text-xs font-medium ${claim.status === "approved" ? "text-success" : "text-destructive"}`}>
                {claim.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ClaimsList;
