const STORAGE_KEY = "terr-webhook-urls";

export type WebhookChannel =
  | "Alpha-Tickets"
  | "Alpha-Announcements"
  | "Alphas"
  | "Leaderboard"
  | "Alpha-Points";

function getWebhookUrl(channel: WebhookChannel): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const urls = JSON.parse(stored);
    return urls[channel] || null;
  } catch {
    return null;
  }
}

export interface DiscordEmbed {
  title: string;
  description?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
  footer?: { text: string };
  timestamp?: string;
}

export async function sendWebhook(
  channel: WebhookChannel,
  embed: DiscordEmbed
): Promise<boolean> {
  const url = getWebhookUrl(channel);
  if (!url) {
    console.warn(`No webhook URL configured for ${channel}`);
    return false;
  }

  const payload = {
    embeds: [
      {
        ...embed,
        footer: embed.footer || { text: "Alpha Dominate Hub — Season Manager" },
        timestamp: embed.timestamp || new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok || res.status === 204;
  } catch (err) {
    console.error(`Webhook send failed for ${channel}:`, err);
    return false;
  }
}

export const EMBED_COLORS = {
  success: 0x22c55e,
  danger: 0xef4444,
  warning: 0xf59e0b,
  info: 0x00b4ff,
  neutral: 0x6b7280,
};
