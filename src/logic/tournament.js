import { GROUPS, GROUP_LETTERS, TEAM_RANK } from "../data/teams.js";
import { PLAYOFF_SLOTS, KNOCKOUT_PLACEHOLDER_SLOTS } from "../data/tournament.js";

const clone = (value) => JSON.parse(JSON.stringify(value));
const isRealTeam = (value) => Boolean(value && TEAM_RANK[value]);

export const sortRows = (rows) => [...rows].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || (TEAM_RANK[a.team] || 99) - (TEAM_RANK[b.team] || 99));

function roundRobinPairings(teams) {
  const list = [...teams];
  const rounds = [];
  for (let round = 0; round < list.length - 1; round += 1) {
    const pairings = [];
    for (let i = 0; i < list.length / 2; i += 1) {
      const home = list[i];
      const away = list[list.length - 1 - i];
      pairings.push(round % 2 === 0 ? [home, away] : [away, home]);
    }
    rounds.push(pairings);
    list.splice(1, 0, list.pop());
  }
  return rounds;
}

export function buildSchedule() {
  const teams = GROUPS.League;
  return roundRobinPairings(teams).flatMap((pairings, roundIndex) => pairings.map(([home, away], index) => ({
    id: `L-MD${roundIndex + 1}-${index + 1}`,
    group: "League",
    home,
    away,
    week: roundIndex + 1,
    played: false,
    homeGoals: null,
    awayGoals: null,
  })));
}

export function blankTable() {
  const table = {};
  GROUPS.League.forEach((team) => {
    table[team] = { team, group: "League", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
  });
  return table;
}

export function buildQualifiers(table) {
  const rows = sortRows(GROUPS.League.map((team) => table[team]));
  return { byGroup: { League: rows }, topFour: rows.slice(0, 4), best3RDs: [], thirdPlaceRows: [] };
}

export function didTeamQualify(team, table) {
  return buildQualifiers(table).topFour.some((row) => row.team === team);
}

export function buildRound32Fixtures(table) {
  const topFour = buildQualifiers(table).topFour;
  return PLAYOFF_SLOTS.map((slot, index) => {
    const home = topFour[index === 0 ? 0 : 1]?.team || slot.homeSeed;
    const away = topFour[index === 0 ? 3 : 2]?.team || slot.awaySeed;
    return { id: `M${slot.matchNo}`, matchNo: slot.matchNo, home, away, homeSeed: slot.homeSeed, awaySeed: slot.awaySeed, played: false, homeGoals: null, awayGoals: null };
  });
}

export function buildRound32Placeholders() {
  return PLAYOFF_SLOTS.map((slot) => ({ id: `M${slot.matchNo}`, matchNo: slot.matchNo, home: slot.homeSeed, away: slot.awaySeed, homeSeed: slot.homeSeed, awaySeed: slot.awaySeed, played: false, homeGoals: null, awayGoals: null }));
}

export function findTeamKnockoutFixture(team, fixtures) {
  return fixtures.find((fixture) => fixture.home === team || fixture.away === team) || null;
}

export function getFixtureOpponent(team, fixture) {
  if (!fixture) return "Opponent";
  return fixture.home === team ? fixture.away : fixture.home;
}

export function applyFixtureResult(tableState, fixture, homeGoals, awayGoals) {
  const next = clone(tableState);
  const home = next[fixture.home];
  const away = next[fixture.away];
  if (!home || !away) return next;
  home.played += 1; away.played += 1;
  home.gf += homeGoals; home.ga += awayGoals;
  away.gf += awayGoals; away.ga += homeGoals;
  home.gd = home.gf - home.ga; away.gd = away.gf - away.ga;
  if (homeGoals > awayGoals) { home.won += 1; away.lost += 1; home.pts += 3; }
  else if (awayGoals > homeGoals) { away.won += 1; home.lost += 1; away.pts += 3; }
  else { home.drawn += 1; away.drawn += 1; home.pts += 1; away.pts += 1; }
  return next;
}

export function simulateFixtureScore(home, away) {
  const homeRank = TEAM_RANK[home] || 12;
  const awayRank = TEAM_RANK[away] || 12;
  return {
    homeGoals: Math.max(0, Math.round(Math.random() * 3 + (homeRank < awayRank ? 0.6 : 0))),
    awayGoals: Math.max(0, Math.round(Math.random() * 3 + (awayRank < homeRank ? 0.6 : 0))),
  };
}

export function completeMatchday(scheduleState, tableState, week) {
  let updatedSchedule = scheduleState;
  let updatedTable = tableState;
  scheduleState.filter((fixture) => !fixture.played && fixture.week === week).forEach((fixture) => {
    const { homeGoals, awayGoals } = simulateFixtureScore(fixture.home, fixture.away);
    updatedSchedule = updatedSchedule.map((item) => item.id === fixture.id ? { ...item, played: true, homeGoals, awayGoals } : item);
    updatedTable = applyFixtureResult(updatedTable, fixture, homeGoals, awayGoals);
  });
  return { updatedSchedule, updatedTable };
}

const ROUND_SLOTS = { "SEMI-FINALS": PLAYOFF_SLOTS, FINAL: KNOCKOUT_PLACEHOLDER_SLOTS.Final };
const ROUND_ORDER = ["SEMI-FINALS", "FINAL"];

function fixtureWinner(fixture) {
  if (!fixture?.played) return null;
  return fixture.homeGoals > fixture.awayGoals ? fixture.home : fixture.away;
}
function fixtureRunnerUp(fixture) {
  if (!fixture?.played) return null;
  return fixture.homeGoals > fixture.awayGoals ? fixture.away : fixture.home;
}
function resolveKnockoutSeed(seed, fixtures) {
  if (isRealTeam(seed)) return seed;
  const match = String(seed || "").match(/^W(\d+)$/);
  if (match) return fixtureWinner(fixtures.find((fixture) => fixture.matchNo === Number(match[1])));
  return null;
}
function roundNameForMatchNo(matchNo) {
  if (matchNo === 67 || matchNo === 68) return "SEMI-FINALS";
  if (matchNo === 69) return "FINAL";
  return "PLAYOFF";
}
export function knockoutStageLabel(matchNo) { return roundNameForMatchNo(matchNo); }
function nextRoundName(roundName) {
  const index = ROUND_ORDER.indexOf(roundName);
  return index >= 0 ? ROUND_ORDER[index + 1] || null : null;
}
function replaceFixtures(fixtures, replacements) {
  const byMatchNo = new Map(fixtures.map((fixture) => [fixture.matchNo, fixture]));
  replacements.forEach((fixture) => byMatchNo.set(fixture.matchNo, fixture));
  return Array.from(byMatchNo.values()).sort((a, b) => a.matchNo - b.matchNo);
}
function fixtureFromSlot(slot, fixtures) {
  const existing = fixtures.find((fixture) => fixture.matchNo === slot.matchNo);
  const home = resolveKnockoutSeed(slot.homeSeed, fixtures) || existing?.home || slot.homeSeed;
  const away = resolveKnockoutSeed(slot.awaySeed, fixtures) || existing?.away || slot.awaySeed;
  return { id: `M${slot.matchNo}`, matchNo: slot.matchNo, home, away, homeSeed: slot.homeSeed, awaySeed: slot.awaySeed, played: existing?.played || false, homeGoals: existing?.homeGoals ?? null, awayGoals: existing?.awayGoals ?? null };
}
function simulateKnockoutFixture(fixture) {
  if (fixture.played) return fixture;
  const homeRank = TEAM_RANK[fixture.home] || 99;
  const awayRank = TEAM_RANK[fixture.away] || 99;
  const homeWins = homeRank <= awayRank;
  return { ...fixture, played: true, homeGoals: homeWins ? 1 : 0, awayGoals: homeWins ? 0 : 1 };
}

export function createNextKnockoutFixture({ previousMatchNo, team, fixtures }) {
  const nextRound = nextRoundName(roundNameForMatchNo(previousMatchNo));
  if (!nextRound) return null;
  const winnerSeed = `W${previousMatchNo}`;
  const slot = (ROUND_SLOTS[nextRound] || []).find((candidate) => candidate.homeSeed === winnerSeed || candidate.awaySeed === winnerSeed);
  if (!slot) return null;
  const generated = fixtureFromSlot(slot, fixtures);
  return generated.home === team || generated.away === team ? generated : null;
}

export function completeKnockoutRound({ fixtures, currentMatch, userTeam, userResult = null }) {
  const roundName = roundNameForMatchNo(currentMatch.matchNo);
  const currentSlots = ROUND_SLOTS[roundName] || [];
  const homeGoals = userResult ? userResult.homeGoals : (currentMatch.home === userTeam ? 1 : 0);
  const awayGoals = userResult ? userResult.awayGoals : (currentMatch.away === userTeam ? 1 : 0);
  const playedUserMatch = { ...currentMatch, played: true, homeGoals, awayGoals };
  let workingFixtures = replaceFixtures(fixtures, [playedUserMatch]);

  const completedRoundFixtures = currentSlots.map((slot) => {
    const fixture = fixtureFromSlot(slot, workingFixtures);
    return fixture.matchNo === playedUserMatch.matchNo ? playedUserMatch : simulateKnockoutFixture(fixture);
  });
  workingFixtures = replaceFixtures(workingFixtures, completedRoundFixtures);

  let nextRoundFixtures = [];
  if (roundName === "SEMI-FINALS") {
    nextRoundFixtures = KNOCKOUT_PLACEHOLDER_SLOTS.Final.map((slot) => fixtureFromSlot(slot, workingFixtures));
  }
  const updatedFixtures = replaceFixtures(workingFixtures, nextRoundFixtures);
  const nextUserFixture = nextRoundFixtures.find((fixture) => fixture.home === userTeam || fixture.away === userTeam) || null;
  const finalFixture = updatedFixtures.find((fixture) => fixture.matchNo === 69);
  const podium = finalFixture?.played ? { winner: fixtureWinner(finalFixture), runnerUp: fixtureRunnerUp(finalFixture) } : null;
  return { updatedFixtures, playedUserMatch, nextUserFixture, podium };
}

export function mergeKnockoutFixtures(slots, fixtures) {
  return slots.map((slot) => fixtureFromSlot(slot, fixtures));
}

export function runSelfTests() {
  const schedule = buildSchedule();
  const table = blankTable();
  const playoffs = buildRound32Fixtures(table);
  console.assert(schedule.length === 66, "Expected 66 league fixtures");
  console.assert(Object.keys(table).length === 12, "Expected 12 teams in table");
  console.assert(buildQualifiers(table).topFour.length === 4, "Expected top four qualifiers");
  console.assert(playoffs.length === 2 && playoffs[0].matchNo === 67, "Expected two semi-finals");
  console.assert(knockoutStageLabel(69) === "FINAL", "Expected final stage label");
}
