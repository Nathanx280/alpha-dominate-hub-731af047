export interface Tribe {
  id: string;
  name: string;
  monogram: string;
  leaderSteamId: string;
  leaderName: string;
  points: number;
  bases: number;
  warnings: number;
  rosterSize: number;
  rosterChanges: number;
  status: "active" | "locked" | "disqualified" | "wiped";
  lastRaid: string | null;
  createdAt: string;
  alliance?: string;
  kills: number;
  deaths: number;
}

export interface Raid {
  id: string;
  attackerId: string;
  attackerName: string;
  defenderId: string;
  defenderName: string;
  type: "online" | "offline";
  status: "pending" | "approved" | "denied";
  proofUrl: string;
  pointsAwarded: number;
  pointsDeducted: number;
  submittedAt: string;
  reviewedAt: string | null;
  notes: string;
}

export interface Claim {
  id: string;
  tribeId: string;
  tribeName: string;
  location: string;
  coordinates: string;
  turretCount: number;
  screenshotUrl: string;
  status: "pending" | "approved" | "denied";
  submittedAt: string;
}

export interface Warning {
  id: string;
  tribeId: string;
  tribeName: string;
  level: number;
  reason: string;
  pointDeduction: number;
  issuedAt: string;
  issuedBy: string;
}

export interface ActivityEvent {
  id: string;
  type: "raid_approved" | "raid_denied" | "claim_approved" | "claim_denied" | "warning_issued" | "tribe_joined" | "season_event";
  message: string;
  timestamp: string;
  tribeId?: string;
}

export const mockTribes: Tribe[] = [
  { id: "t1", name: "Devour", monogram: "DV", leaderSteamId: "76561198...", leaderName: "NortaqLeader", points: 247, bases: 1, warnings: 0, rosterSize: 6, rosterChanges: 0, status: "active", lastRaid: "2026-03-15T14:30:00Z", createdAt: "2026-02-28T10:00:00Z", kills: 142, deaths: 38 },
  { id: "t2", name: "Iron Wolves", monogram: "IW", leaderSteamId: "76561198...", leaderName: "AlphaWolf", points: 198, bases: 1, warnings: 1, rosterSize: 5, rosterChanges: 1, status: "active", lastRaid: "2026-03-14T20:15:00Z", createdAt: "2026-03-01T08:00:00Z", kills: 98, deaths: 55 },
  { id: "t3", name: "Obsidian Reign", monogram: "OR", leaderSteamId: "76561198...", leaderName: "ObsidianKing", points: 165, bases: 1, warnings: 0, rosterSize: 4, rosterChanges: 0, status: "active", lastRaid: "2026-03-13T16:45:00Z", createdAt: "2026-03-01T12:00:00Z", kills: 76, deaths: 42 },
  { id: "t4", name: "Crimson Tide", monogram: "CT", leaderSteamId: "76561198...", leaderName: "CrimsonLead", points: 142, bases: 1, warnings: 2, rosterSize: 6, rosterChanges: 2, status: "active", lastRaid: "2026-03-12T09:00:00Z", createdAt: "2026-03-02T14:00:00Z", kills: 112, deaths: 88 },
  { id: "t5", name: "Phantom Reapers", monogram: "PR", leaderSteamId: "76561198...", leaderName: "PhantomX", points: 89, bases: 1, warnings: 0, rosterSize: 3, rosterChanges: 0, status: "active", lastRaid: null, createdAt: "2026-03-03T10:00:00Z", kills: 34, deaths: 21 },
  { id: "t6", name: "Valkyr Guard", monogram: "VG", leaderSteamId: "76561198...", leaderName: "ValkyrOne", points: 72, bases: 1, warnings: 3, rosterSize: 5, rosterChanges: 1, status: "locked", lastRaid: "2026-03-10T22:00:00Z", createdAt: "2026-03-03T16:00:00Z", kills: 65, deaths: 71 },
  { id: "t7", name: "Apex Predators", monogram: "AP", leaderSteamId: "76561198...", leaderName: "ApexAlpha", points: 55, bases: 1, warnings: 0, rosterSize: 4, rosterChanges: 0, status: "active", lastRaid: "2026-03-11T11:30:00Z", createdAt: "2026-03-04T09:00:00Z", kills: 45, deaths: 30 },
  { id: "t8", name: "Shadow Syndicate", monogram: "SS", leaderSteamId: "76561198...", leaderName: "ShadowBoss", points: 0, bases: 0, warnings: 5, rosterSize: 0, rosterChanges: 3, status: "disqualified", lastRaid: "2026-03-08T18:00:00Z", createdAt: "2026-03-01T20:00:00Z", kills: 23, deaths: 90 },
  { id: "t9", name: "Neon Vipers", monogram: "NV", leaderSteamId: "76561198...", leaderName: "ViperQueen", points: 180, bases: 1, warnings: 0, rosterSize: 5, rosterChanges: 0, status: "active", lastRaid: "2026-03-16T10:00:00Z", createdAt: "2026-03-01T06:00:00Z", kills: 120, deaths: 44 },
  { id: "t10", name: "Berserker Clan", monogram: "BC", leaderSteamId: "76561198...", leaderName: "BerserkerX", points: 110, bases: 1, warnings: 1, rosterSize: 6, rosterChanges: 1, status: "active", lastRaid: "2026-03-15T08:20:00Z", createdAt: "2026-03-02T11:00:00Z", kills: 88, deaths: 62 },
];

export const mockRaids: Raid[] = [
  { id: "r1", attackerId: "t1", attackerName: "Devour", defenderId: "t4", defenderName: "Crimson Tide", type: "online", status: "pending", proofUrl: "https://clips.example.com/raid-001", pointsAwarded: 0, pointsDeducted: 0, submittedAt: "2026-03-17T08:30:00Z", reviewedAt: null, notes: "Full wipe with online defenders. 3 defenders killed." },
  { id: "r2", attackerId: "t3", attackerName: "Obsidian Reign", defenderId: "t7", defenderName: "Apex Predators", type: "offline", status: "pending", proofUrl: "https://clips.example.com/raid-002", pointsAwarded: 0, pointsDeducted: 0, submittedAt: "2026-03-17T06:15:00Z", reviewedAt: null, notes: "Offline raid. Complete destruction documented." },
  { id: "r3", attackerId: "t2", attackerName: "Iron Wolves", defenderId: "t5", defenderName: "Phantom Reapers", type: "online", status: "approved", proofUrl: "https://clips.example.com/raid-003", pointsAwarded: 47, pointsDeducted: 44, submittedAt: "2026-03-14T19:00:00Z", reviewedAt: "2026-03-14T20:15:00Z", notes: "Online raid verified. Full wipe confirmed." },
  { id: "r4", attackerId: "t9", attackerName: "Neon Vipers", defenderId: "t10", defenderName: "Berserker Clan", type: "online", status: "pending", proofUrl: "https://clips.example.com/raid-004", pointsAwarded: 0, pointsDeducted: 0, submittedAt: "2026-03-17T02:00:00Z", reviewedAt: null, notes: "Online raid with video proof. 5v6 engagement." },
  { id: "r5", attackerId: "t4", attackerName: "Crimson Tide", defenderId: "t6", defenderName: "Valkyr Guard", type: "offline", status: "denied", proofUrl: "https://clips.example.com/raid-005", pointsAwarded: 0, pointsDeducted: 0, submittedAt: "2026-03-13T12:00:00Z", reviewedAt: "2026-03-13T14:00:00Z", notes: "Denied — insufficient video evidence." },
];

export const mockClaims: Claim[] = [
  { id: "c1", tribeId: "t5", tribeName: "Phantom Reapers", location: "The Island - Volcano Base", coordinates: "42.5, 38.2", turretCount: 3200, screenshotUrl: "/placeholder.svg", status: "pending", submittedAt: "2026-03-16T14:00:00Z" },
  { id: "c2", tribeId: "t7", tribeName: "Apex Predators", location: "Ragnarok - Highland Plateau", coordinates: "28.1, 55.7", turretCount: 4100, screenshotUrl: "/placeholder.svg", status: "pending", submittedAt: "2026-03-16T10:00:00Z" },
  { id: "c3", tribeId: "t9", tribeName: "Neon Vipers", location: "Extinction - Sanctuary", coordinates: "55.2, 62.8", turretCount: 5800, screenshotUrl: "/placeholder.svg", status: "pending", submittedAt: "2026-03-17T01:00:00Z" },
];

export const mockWarnings: Warning[] = [
  { id: "w1", tribeId: "t4", tribeName: "Crimson Tide", level: 2, reason: "Non-rostered raiders detected during offensive", pointDeduction: 36, issuedAt: "2026-03-10T12:00:00Z", issuedBy: "Admin" },
  { id: "w2", tribeId: "t6", tribeName: "Valkyr Guard", level: 3, reason: "Excessive roster rotation (4 changes)", pointDeduction: 108, issuedAt: "2026-03-09T15:00:00Z", issuedBy: "Admin" },
  { id: "w3", tribeId: "t10", tribeName: "Berserker Clan", level: 1, reason: "Chat toxicity reported by multiple tribes", pointDeduction: 0, issuedAt: "2026-03-14T09:00:00Z", issuedBy: "Moderator" },
  { id: "w4", tribeId: "t8", tribeName: "Shadow Syndicate", level: 5, reason: "Confirmed use of exploits in base defense", pointDeduction: 0, issuedAt: "2026-03-07T18:00:00Z", issuedBy: "Admin" },
];

export const mockActivity: ActivityEvent[] = [
  { id: "a1", type: "raid_approved", message: "Iron Wolves raided Phantom Reapers — +47 pts", timestamp: "2026-03-14T20:15:00Z", tribeId: "t2" },
  { id: "a2", type: "warning_issued", message: "Crimson Tide received Level 2 warning — −36 pts", timestamp: "2026-03-10T12:00:00Z", tribeId: "t4" },
  { id: "a3", type: "tribe_joined", message: "Neon Vipers registered for Season Alpha", timestamp: "2026-03-01T06:00:00Z", tribeId: "t9" },
  { id: "a4", type: "claim_approved", message: "Devour claimed Volcano base — +5 pts", timestamp: "2026-03-05T16:00:00Z", tribeId: "t1" },
  { id: "a5", type: "season_event", message: "Season Alpha officially started", timestamp: "2026-02-28T00:00:00Z" },
  { id: "a6", type: "raid_denied", message: "Crimson Tide vs Valkyr Guard raid denied", timestamp: "2026-03-13T14:00:00Z", tribeId: "t4" },
  { id: "a7", type: "warning_issued", message: "Shadow Syndicate DQ'd — exploit usage confirmed", timestamp: "2026-03-07T18:00:00Z", tribeId: "t8" },
];
