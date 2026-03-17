import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Send, Check, Webhook } from "lucide-react";

const WEBHOOK_CHANNELS = [
  "Alpha-Tickets",
  "Alpha-Announcements",
  "Alphas",
  "Leaderboard",
  "Alpha-Points",
] as const;

const STORAGE_KEY = "terr-webhook-urls";

const channelDescriptions: Record<string, string> = {
  "Alpha-Tickets": "Denied raids and claims — ticket logging",
  "Alpha-Announcements": "Approved raids, warnings, major events",
  "Alphas": "New base claims and alpha registrations",
  "Leaderboard": "Automatic leaderboard updates after point changes",
  "Alpha-Points": "Point adjustments from raids, claims, discipline",
};

type WebhookUrls = Record<string, string>;

const WebhookSettings = () => {
  const [urls, setUrls] = useState<WebhookUrls>({});
  const [saving, setSaving] = useState(false);
  const [testingChannel, setTestingChannel] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUrls(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const handleChange = (channel: string, value: string) => {
    setUrls((prev) => ({ ...prev, [channel]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Webhooks saved", description: "Discord webhook URLs have been stored locally." });
    }, 300);
  };

  const handleTest = async (channel: string) => {
    const url = urls[channel];
    if (!url) {
      toast({ title: "No URL", description: `No webhook URL set for ${channel}.`, variant: "destructive" });
      return;
    }

    setTestingChannel(channel);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "🔔 Alpha Dominate Hub — Webhook Test",
              description: `Test message for **${channel}** channel.`,
              color: 0x00b4ff,
              footer: { text: "Alpha Dominate Hub — Season Manager" },
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });

      if (res.ok || res.status === 204) {
        toast({ title: "Test sent!", description: `Message delivered to ${channel}.` });
      } else {
        toast({ title: "Failed", description: `Discord returned status ${res.status}.`, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Could not reach Discord. Check the URL.", variant: "destructive" });
    } finally {
      setTestingChannel(null);
    }
  };

  const configuredCount = WEBHOOK_CHANNELS.filter((ch) => urls[ch]?.trim()).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="card-surface p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Webhook size={20} className="text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">Discord Webhook Configuration</h2>
              <p className="text-sm text-muted-foreground">
                {configuredCount}/{WEBHOOK_CHANNELS.length} channels configured
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-6">
          Configure webhook URLs for automated Discord notifications. Each channel receives specific event types. Click "Test" to verify connectivity.
        </p>

        <div className="space-y-4">
          {WEBHOOK_CHANNELS.map((ch) => (
            <div key={ch} className="bg-card-elevated rounded-lg p-4 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    {ch}
                    {urls[ch]?.trim() && <Check size={14} className="text-success" />}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">{channelDescriptions[ch]}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urls[ch] || ""}
                  onChange={(e) => handleChange(ch, e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="flex-1 bg-accent border-0 rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTest(ch)}
                  disabled={!urls[ch] || testingChannel === ch}
                  className="flex-shrink-0"
                >
                  <Send size={12} className="mr-1" />
                  {testingChannel === ch ? "Sending..." : "Test"}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save All Webhooks"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default WebhookSettings;
