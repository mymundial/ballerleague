export const LEAGUE_TEAMS = [
  "NDL FC",
  "Deportrio",
  "Prime FC",
  "SDS FC",
  "Wembley Rangers AFC",
  "Clutch FC",
  "Gold Devils FC",
  "N5 FC",
  "Yanited",
  "VZN FC",
  "Rukkas FC",
  "Community FC",
];

export const GROUP_LETTERS = ["League"];
export const GROUPS = { League: LEAGUE_TEAMS };

export const TEAM_CODES = {
  "NDL FC": "NDL",
  "Deportrio": "DPT",
  "Prime FC": "PFC",
  "SDS FC": "SDS",
  "Wembley Rangers AFC": "WRS",
  "Clutch FC": "CFC",
  "Gold Devils FC": "GDF",
  "N5 FC": "N5F",
  "Yanited": "YTD",
  "VZN FC": "VZN",
  "Rukkas FC": "RKS",
  "Community FC": "CFC",
};

export const TEAM_LOGOS = {
  "NDL FC": "https://ballerleague.uk/uploads/teams/logo_342.svg",
  "Deportrio": "https://ballerleague.uk/uploads/teams/logo_340.svg",
  "Prime FC": "https://ballerleague.uk/uploads/teams/logo_345.svg",
  "SDS FC": "https://ballerleague.uk/uploads/teams/logo_334.svg",
  "Wembley Rangers AFC": "https://ballerleague.uk/uploads/teams/logo_331.svg",
  "Clutch FC": "https://ballerleague.uk/uploads/teams/logo_343.svg",
  "Gold Devils FC": "https://ballerleague.uk/uploads/teams/logo_346.svg",
  "N5 FC": "https://ballerleague.uk/uploads/teams/logo_337.svg",
  "Yanited": "https://ballerleague.uk/uploads/teams/logo_330.svg",
  "VZN FC": "https://ballerleague.uk/uploads/teams/logo_332.svg",
  "Rukkas FC": "https://ballerleague.uk/uploads/teams/logo_344.svg",
  "Community FC": "https://ballerleague.uk/uploads/teams/logo_347.svg",
};

export const HOST_TEAMS = LEAGUE_TEAMS.slice(0, 6).map((name) => ({
  name,
  code: teamCode(name),
  group: "League",
  logo: TEAM_LOGOS[name],
}));

export const TEAM_RANK = Object.fromEntries(LEAGUE_TEAMS.map((team, index) => [team, index + 1]));
export const FLAG_CC = {};

const TEAM_THEMES = [
  ["#EEFF00", "#0A0A0A"],
  ["#1A75FF", "#FFFFFF"],
  ["#F28C28", "#0A0A0A"],
  ["#27D46B", "#0A0A0A"],
  ["#FF1694", "#FFFFFF"],
  ["#F778B7", "#0A0A0A"],
  ["#FF351F", "#FFE900"],
  ["#D82032", "#FFFFFF"],
  ["#F8DC23", "#053E2C"],
  ["#EEFF00", "#0A0A0A"],
  ["#FFFFFF", "#0A0A0A"],
  ["#0E0E0E", "#FFFFFF"],
];

export function teamCode(name = "") {
  if (TEAM_CODES[name]) return TEAM_CODES[name];
  return String(name).split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 3).toUpperCase() || "TBC";
}

export function teamLogo(name = "") {
  return TEAM_LOGOS[name] || "";
}

export function getTeamTheme(name) {
  const idx = Math.max(0, LEAGUE_TEAMS.indexOf(name));
  const [bg, text] = TEAM_THEMES[idx % TEAM_THEMES.length];
  return { bg, text };
}
