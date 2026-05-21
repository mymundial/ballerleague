export const GROUP_LETTERS = ["League"];

export const BALLER_TEAMS = [
  "Clutch FC",
  "Community FC",
  "Deportrio",
  "Gold Devils FC",
  "N5 FC",
  "NDL FC",
  "Prime FC",
  "Rukkas FC",
  "SDS FC",
  "VZN FC",
  "Wembley Rangers AFC",
  "Yanited",
];

export const GROUPS = { League: BALLER_TEAMS };

export const HOST_TEAMS = BALLER_TEAMS.slice(0, 6).map((name) => ({
  name,
  group: "League",
  code: teamCode(name),
}));

export const TEAM_RANK = Object.fromEntries(BALLER_TEAMS.map((team, index) => [team, index + 1]));

export const FLAG_CC = Object.fromEntries(BALLER_TEAMS.map((team) => [team, null]));

const THEMES = [
  ["#111827", "#F5F0E6"], ["#0B5F35", "#F5F0E6"], ["#7C2D12", "#F5F0E6"],
  ["#D4AF37", "#072D1D"], ["#1D4ED8", "#F5F0E6"], ["#701A75", "#F5F0E6"],
  ["#B91C1C", "#F5F0E6"], ["#EA580C", "#072D1D"], ["#0F766E", "#F5F0E6"],
  ["#4338CA", "#F5F0E6"], ["#166534", "#F5F0E6"], ["#BE123C", "#F5F0E6"],
];

export function teamCode(team = "") {
  const clean = String(team).replace(/\bFC\b|\bAFC\b/gi, "").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (!words.length) return "TBC";
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.map((word) => word[0]).join("").slice(0, 3).toUpperCase();
}

export function getTeamTheme(team) {
  const index = Math.max(0, (TEAM_RANK[team] || 1) - 1) % THEMES.length;
  const [bg, text] = THEMES[index];
  return { bg, text };
}
