import { useState, useCallback } from "react";
import {
  mockTribes as initialTribes,
  mockRaids as initialRaids,
  mockClaims as initialClaims,
  mockWarnings as initialWarnings,
  mockActivity as initialActivity,
  type Tribe,
  type Raid,
  type Claim,
  type Warning,
  type ActivityEvent,
} from "@/lib/mock-data";
import { sendWebhook, EMBED_COLORS } from "@/lib/discord";
import { toast } from "@/hooks/use-toast";

let _tribes = [...initialTribes];
let _raids = [...initialRaids];
let _claims = [...initialClaims];
let _warnings = [...initialWarnings];
let _activity = [...initialActivity];
let _listeners: (() => void)[] = [];

function notify() {
  _listeners.forEach((fn) => fn());
}

function addActivity(event: Omit<ActivityEvent, "id">) {
  _activity = [{ ...event, id: `a${Date.now()}` }, ..._activity];
}

export function useSeasonStore() {
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick((t) => t + 1), []);

  useState(() => {
    _listeners.push(rerender);
    return () => {
      _listeners = _listeners.filter((l) => l !== rerender);
    };
  });

  const approveRaid = async (raidId: string) => {
    const raid = _raids.find((r) => r.id === raidId);
    if (!raid) return;

    const defender = _tribes.find((t) => t.id === raid.defenderId);
    const attacker = _tribes.find((t) => t.id === raid.attackerId);
    if (!defender || !attacker) return;

    const basePoints = raid.type === "online" ? 3 : 1;
    const percentOfDefender = raid.type === "online" ? 0.5 : 0.25;
    const pointsFromDefender = Math.floor(defender.points * percentOfDefender);
    const totalGain = basePoints + pointsFromDefender;

    raid.status = "approved";
    raid.pointsAwarded = totalGain;
    raid.pointsDeducted = pointsFromDefender;
    raid.reviewedAt = new Date().toISOString();

    attacker.points += totalGain;
    attacker.lastRaid = new Date().toISOString();
    defender.points -= pointsFromDefender;

    addActivity({
      type: "raid_approved",
      message: `${attacker.name} raided ${defender.name} — +${totalGain} pts`,
      timestamp: new Date().toISOString(),
      tribeId: attacker.id,
    });

    notify();

    toast({
      title: "Raid approved",
      description: `${attacker.name} +${totalGain} pts | ${defender.name} −${pointsFromDefender} pts`,
    });

    await sendWebhook("Alpha-Announcements", {
      title: "⚔️ Raid Approved",
      description: `**${attacker.name}** raided **${defender.name}** (${raid.type.toUpperCase()})`,
      color: EMBED_COLORS.success,
      fields: [
        { name: "Raid Type", value: raid.type === "online" ? "🟢 Online" : "🟡 Offline", inline: true },
        { name: "Attacker Gain", value: `+${totalGain} pts`, inline: true },
        { name: "Defender Loss", value: `−${pointsFromDefender} pts`, inline: true },
        { name: "Attacker Total", value: `${attacker.points} pts`, inline: true },
        { name: "Defender Total", value: `${defender.points} pts`, inline: true },
        { name: "Proof", value: `[View Clip](${raid.proofUrl})`, inline: true },
      ],
    });

    await sendWebhook("Alpha-Points", {
      title: "📊 Points Update — Raid",
      color: EMBED_COLORS.info,
      fields: [
        { name: attacker.name, value: `${attacker.points - totalGain} → **${attacker.points}** (+${totalGain})`, inline: true },
        { name: defender.name, value: `${defender.points + pointsFromDefender} → **${defender.points}** (−${pointsFromDefender})`, inline: true },
      ],
    });

    await sendLeaderboardUpdate();
  };

  const denyRaid = async (raidId: string) => {
    const raid = _raids.find((r) => r.id === raidId);
    if (!raid) return;

    raid.status = "denied";
    raid.reviewedAt = new Date().toISOString();

    addActivity({
      type: "raid_denied",
      message: `${raid.attackerName} vs ${raid.defenderName} raid denied`,
      timestamp: new Date().toISOString(),
      tribeId: raid.attackerId,
    });

    notify();

    toast({ title: "Raid denied", description: `${raid.attackerName} vs ${raid.defenderName} — no points awarded.` });

    await sendWebhook("Alpha-Tickets", {
      title: "❌ Raid Denied",
      description: `**${raid.attackerName}** vs **${raid.defenderName}** — insufficient proof or rule violation.`,
      color: EMBED_COLORS.danger,
      fields: [
        { name: "Attacker", value: raid.attackerName, inline: true },
        { name: "Defender", value: raid.defenderName, inline: true },
      ],
    });
  };

  const approveClaim = async (claimId: string) => {
    const claim = _claims.find((c) => c.id === claimId);
    if (!claim) return;

    const tribe = _tribes.find((t) => t.id === claim.tribeId);
    if (!tribe) return;

    claim.status = "approved";
    tribe.points += 5;
    tribe.bases = 1;

    addActivity({
      type: "claim_approved",
      message: `${tribe.name} claimed base at ${claim.location} — +5 pts`,
      timestamp: new Date().toISOString(),
      tribeId: tribe.id,
    });

    notify();

    toast({ title: "Claim approved", description: `${tribe.name} +5 pts — base registered.` });

    await sendWebhook("Alphas", {
      title: "🏰 New Alpha Base Claimed",
      description: `**${tribe.name}** has claimed a base!`,
      color: EMBED_COLORS.success,
      fields: [
        { name: "Location", value: claim.location, inline: true },
        { name: "Coordinates", value: claim.coordinates, inline: true },
        { name: "Turrets", value: claim.turretCount.toLocaleString(), inline: true },
      ],
    });

    await sendWebhook("Alpha-Points", {
      title: "📊 Points Update — Claim Bonus",
      color: EMBED_COLORS.info,
      fields: [
        { name: tribe.name, value: `${tribe.points - 5} → **${tribe.points}** (+5 claim bonus)`, inline: true },
      ],
    });

    await sendLeaderboardUpdate();
  };

  const denyClaim = async (claimId: string) => {
    const claim = _claims.find((c) => c.id === claimId);
    if (!claim) return;

    claim.status = "denied";

    addActivity({
      type: "claim_denied",
      message: `${claim.tribeName} base claim at ${claim.location} denied`,
      timestamp: new Date().toISOString(),
      tribeId: claim.tribeId,
    });

    notify();

    toast({ title: "Claim denied", description: `${claim.tribeName} base claim rejected.` });

    await sendWebhook("Alpha-Tickets", {
      title: "❌ Claim Denied",
      description: `**${claim.tribeName}** base claim at ${claim.location} has been denied.`,
      color: EMBED_COLORS.danger,
      fields: [
        { name: "Location", value: claim.location, inline: true },
        { name: "Turrets", value: claim.turretCount.toLocaleString(), inline: true },
      ],
    });
  };

  const issueWarning = async (tribeId: string, level: number, reason: string) => {
    const tribe = _tribes.find((t) => t.id === tribeId);
    if (!tribe) return;

    const deductions: Record<number, number> = { 1: 0, 2: 0.25, 3: 0.5, 4: 1, 5: 1 };
    const pct = deductions[level] || 0;
    const pointDeduction = Math.floor(tribe.points * pct);

    tribe.warnings += 1;
    tribe.points -= pointDeduction;
    if (level >= 5) tribe.status = "disqualified";
    else if (level >= 3) tribe.status = "locked";

    const warning: Warning = {
      id: `w${Date.now()}`,
      tribeId,
      tribeName: tribe.name,
      level,
      reason,
      pointDeduction,
      issuedAt: new Date().toISOString(),
      issuedBy: "Admin",
    };

    _warnings = [warning, ..._warnings];

    addActivity({
      type: "warning_issued",
      message: `${tribe.name} received Level ${level} warning${pointDeduction > 0 ? ` — −${pointDeduction} pts` : ""}`,
      timestamp: new Date().toISOString(),
      tribeId,
    });

    notify();

    toast({ title: "Warning issued", description: `${tribe.name} — Level ${level}${pointDeduction > 0 ? `, −${pointDeduction} pts` : ""}` });

    await sendWebhook("Alpha-Announcements", {
      title: `⚠️ Discipline — Level ${level}`,
      description: `**${tribe.name}** received a Level ${level} warning.`,
      color: level >= 4 ? EMBED_COLORS.danger : EMBED_COLORS.warning,
      fields: [
        { name: "Reason", value: reason, inline: false },
        { name: "Point Deduction", value: pointDeduction > 0 ? `−${pointDeduction} pts` : "None", inline: true },
        { name: "New Total", value: `${tribe.points} pts`, inline: true },
      ],
    });

    if (pointDeduction > 0) {
      await sendWebhook("Alpha-Points", {
        title: "📊 Points Update — Discipline",
        color: EMBED_COLORS.warning,
        fields: [
          { name: tribe.name, value: `${tribe.points + pointDeduction} → **${tribe.points}** (−${pointDeduction})`, inline: true },
        ],
      });
    }

    await sendLeaderboardUpdate();
  };

  return {
    tribes: _tribes,
    raids: _raids,
    claims: _claims,
    warnings: _warnings,
    activity: _activity,
    approveRaid,
    denyRaid,
    approveClaim,
    denyClaim,
    issueWarning,
  };
}

async function sendLeaderboardUpdate() {
  const sorted = [..._tribes]
    .filter((t) => t.status !== "disqualified")
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);

  const leaderboardText = sorted
    .map((t, i) => {
      const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
      return `${medals[i]} **${t.name}** — ${t.points} pts`;
    })
    .join("\n");

  await sendWebhook("Leaderboard", {
    title: "🏆 Season Leaderboard Update",
    description: leaderboardText,
    color: EMBED_COLORS.info,
  });
}
