export {
  buildLeagueSchedule as buildSchedule,
  blankLeagueTable as blankTable,
  sortLeagueRows as sortRows,
  applyLeagueResult as applyFixtureResult,
  completeMatchday,
  didTeamReachPlayoffs as didTeamQualify,
  buildPlayoffFixtures as buildRound32Fixtures,
  findTeamPlayoffFixture as findTeamKnockoutFixture,
  getFixtureOpponent,
  completePlayoffRound as completeKnockoutRound,
  playoffStageLabel as knockoutStageLabel,
  runSelfTests,
} from "./ballerLeague.js";

export function buildQualifiers(table) {
  const rows = Object.values(table).sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  return { byGroup: { League: rows.slice(0, 4) }, best3RDs: [] };
}

export function buildRound32Placeholders() { return []; }
