import { LEAGUE_TEAMS } from "../data/teams.js";

export function blankLeagueTable(teams = LEAGUE_TEAMS) {
  return Object.fromEntries(teams.map((team) => [team, { team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 }]));
}

export function sortLeagueRows(rows) {
  return [...rows].sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team));
}

export function buildLeagueSchedule(teams = LEAGUE_TEAMS) {
  if (teams.length % 2 !== 0) throw new Error("League schedule requires an even number of teams.");
  const rotated = [...teams];
  const fixtures = [];
  let matchNo = 1;

  for (let round = 0; round < teams.length - 1; round += 1) {
    const week = round + 1;
    for (let i = 0; i < teams.length / 2; i += 1) {
      const a = rotated[i];
      const b = rotated[rotated.length - 1 - i];
      const flip = round % 2 === 1;
      const home = flip ? b : a;
      const away = flip ? a : b;
      fixtures.push({ id: `L${matchNo}`, matchNo, week, stage: "league", home, away, played: false, homeGoals: null, awayGoals: null });
      matchNo += 1;
    }
    const fixed = rotated[0];
    const rest = rotated.slice(1);
    rest.unshift(rest.pop());
    rotated.splice(0, rotated.length, fixed, ...rest);
  }

  return fixtures;
}

export function applyLeagueResult(table, fixture, homeGoals, awayGoals) {
  const next = Object.fromEntries(Object.entries(table).map(([team, row]) => [team, { ...row }]));
  const home = next[fixture.home];
  const away = next[fixture.away];
  if (!home || !away) return next;

  home.played += 1;
  away.played += 1;
  home.gf += homeGoals;
  home.ga += awayGoals;
  away.gf += awayGoals;
  away.ga += homeGoals;
  home.gd = home.gf - home.ga;
  away.gd = away.gf - away.ga;

  if (homeGoals > awayGoals) {
    home.won += 1;
    away.lost += 1;
    home.pts += 3;
  } else if (awayGoals > homeGoals) {
    away.won += 1;
    home.lost += 1;
    away.pts += 3;
  } else {
    home.drawn += 1;
    away.drawn += 1;
    home.pts += 1;
    away.pts += 1;
  }

  return next;
}

export function randomScore() {
  const home = Math.floor(Math.random() * 5);
  const away = Math.floor(Math.random() * 5);
  return [home, away];
}

export function completeMatchday(schedule, table, week, userFixtureId = null) {
  let updatedTable = table;
  const updatedSchedule = schedule.map((fixture) => {
    if (fixture.week !== week || fixture.played || fixture.id === userFixtureId) return fixture;
    const [homeGoals, awayGoals] = randomScore();
    updatedTable = applyLeagueResult(updatedTable, fixture, homeGoals, awayGoals);
    return { ...fixture, played: true, homeGoals, awayGoals };
  });
  return { updatedSchedule, updatedTable };
}

export function getTopFour(table) {
  return sortLeagueRows(Object.values(table)).slice(0, 4);
}

export function didTeamReachPlayoffs(team, table) {
  return getTopFour(table).some((row) => row.team === team);
}

export function buildPlayoffFixtures(table) {
  const [first, second, third, fourth] = getTopFour(table);
  if (!first || !second || !third || !fourth) return [];
  return [
    { id: "SF1", matchNo: 101, week: null, stage: "semiFinal", home: first.team, away: fourth.team, played: false, homeGoals: null, awayGoals: null },
    { id: "SF2", matchNo: 102, week: null, stage: "semiFinal", home: second.team, away: third.team, played: false, homeGoals: null, awayGoals: null },
  ];
}

export function winnerOf(fixture) {
  if (!fixture?.played) return null;
  return fixture.homeGoals > fixture.awayGoals ? fixture.home : fixture.away;
}

export function loserOf(fixture) {
  if (!fixture?.played) return null;
  return fixture.homeGoals > fixture.awayGoals ? fixture.away : fixture.home;
}

function simulatePlayoffFixture(fixture) {
  let homeGoals = Math.floor(Math.random() * 6);
  let awayGoals = Math.floor(Math.random() * 6);
  if (homeGoals === awayGoals) homeGoals += Math.random() < 0.5 ? 1 : 0, awayGoals += homeGoals === awayGoals ? 1 : 0;
  return { ...fixture, played: true, homeGoals, awayGoals };
}

export function completePlayoffRound({ fixtures, currentMatch, result }) {
  let updatedFixtures = fixtures.map((fixture) => fixture.id === currentMatch.id ? { ...fixture, played: true, homeGoals: result.homeGoals, awayGoals: result.awayGoals } : fixture);

  const currentStage = currentMatch.stage;
  if (currentStage === "semiFinal") {
    updatedFixtures = updatedFixtures.map((fixture) => fixture.stage === "semiFinal" && !fixture.played ? simulatePlayoffFixture(fixture) : fixture);
    const semis = updatedFixtures.filter((fixture) => fixture.stage === "semiFinal");
    if (semis.length === 2 && semis.every((fixture) => fixture.played) && !updatedFixtures.some((fixture) => fixture.stage === "final")) {
      updatedFixtures.push({ id: "FINAL", matchNo: 103, week: null, stage: "final", home: winnerOf(semis[0]), away: winnerOf(semis[1]), played: false, homeGoals: null, awayGoals: null });
    }
  }

  const final = updatedFixtures.find((fixture) => fixture.stage === "final" && fixture.played);
  return {
    updatedFixtures,
    nextUserFixture: findTeamPlayoffFixture(result.userTeam, updatedFixtures),
    podium: final ? { winner: winnerOf(final), runnerUp: loserOf(final) } : null,
  };
}

export function findTeamPlayoffFixture(team, fixtures) {
  return fixtures.find((fixture) => !fixture.played && (fixture.home === team || fixture.away === team)) || null;
}

export function getFixtureOpponent(team, fixture) {
  if (!fixture) return "Opponent";
  return fixture.home === team ? fixture.away : fixture.home;
}

export function playoffStageLabel(fixture) {
  if (fixture?.stage === "semiFinal") return "SEMI-FINAL";
  if (fixture?.stage === "final") return "CHAMPIONSHIP FINAL";
  return "LEAGUE MATCH";
}

export function runSelfTests() {
  const schedule = buildLeagueSchedule();
  if (schedule.length !== 66) throw new Error(`Expected 66 league fixtures, got ${schedule.length}`);
  const unique = new Set(schedule.map((f) => [f.home, f.away].sort().join("-")));
  if (unique.size !== 66) throw new Error("Duplicate league fixtures detected");
}
