import { useMemo, useState } from "react";
import { LEAGUE_TEAMS } from "./data/teams.js";
import {
  buildLeagueSchedule,
  blankLeagueTable,
  sortLeagueRows,
  applyLeagueResult,
  completeMatchday,
  didTeamReachPlayoffs,
  buildPlayoffFixtures,
  findTeamPlayoffFixture,
  getFixtureOpponent,
  completePlayoffRound,
  playoffStageLabel,
  runSelfTests,
} from "./logic/ballerLeague.js";
import { DrawerShell } from "./components/layout/Layout.jsx";
import { HomeScreen, TeamSelectScreen } from "./components/selection/SelectionScreens.jsx";
import { FixturesScreen } from "./components/schedule/ScheduleScreens.jsx";
import { GroupsScreen } from "./components/standings/StandingsScreens.jsx";
import { MatchScreen } from "./components/match/MatchScreen.jsx";

runSelfTests();

const stageKeyFromFixture = (fixture) => fixture?.stage || "league";

function toGameFixture(fixture) {
  if (!fixture) return null;
  const isKnockout = fixture.stage === "semiFinal" || fixture.stage === "final";
  return {
    id: fixture.id,
    matchNo: fixture.matchNo ?? null,
    stage: stageKeyFromFixture(fixture),
    homeTeamId: fixture.home,
    awayTeamId: fixture.away,
    allowDraw: !isKnockout,
    requiresWinner: isKnockout,
  };
}

function resultBelongsToFixture(result, fixture) {
  if (!result || !fixture) return false;
  if (result.fixtureId && fixture.id) return result.fixtureId === fixture.id;
  if (result.matchNo && fixture.matchNo) return result.matchNo === fixture.matchNo;
  return result.homeTeam === fixture.home && result.awayTeam === fixture.away;
}

function userScoreFromFixtureResult(result, userTeam) {
  const userIsHome = result.homeTeam === userTeam || result.home === userTeam;
  return userIsHome ? [result.homeGoals, result.awayGoals] : [result.awayGoals, result.homeGoals];
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [drawer, setDrawer] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fixtureView, setFixtureView] = useState("league");
  const [standingsView, setStandingsView] = useState("league");
  const [team, setTeam] = useState(null);
  const [opponent, setOpponent] = useState("");
  const [score, setScore] = useState([0, 0]);
  const [matchResult, setMatchResult] = useState(null);
  const [modalDismissed, setModalDismissed] = useState(false);
  const [table, setTable] = useState(blankLeagueTable());
  const [schedule, setSchedule] = useState(buildLeagueSchedule());
  const [playoffFixtures, setPlayoffFixtures] = useState([]);
  const [currentPlayoffMatch, setCurrentPlayoffMatch] = useState(null);
  const [podium, setPodium] = useState({});
  const [matchStage, setMatchStage] = useState("LEAGUE MATCH");

  const leagueComplete = schedule.every((fixture) => fixture.played);
  const leagueRows = useMemo(() => sortLeagueRows(Object.values(table)), [table]);
  const qualifiedTeams = useMemo(() => new Set((leagueComplete ? leagueRows.slice(0, 4) : []).map((row) => row.team)), [leagueComplete, leagueRows]);
  const visiblePlayoffFixtures = leagueComplete && !playoffFixtures.length ? buildPlayoffFixtures(table) : playoffFixtures;
  const allGroups = useMemo(() => [{ group: "League", rows: leagueRows }], [leagueRows]);

  const activeLeagueFixture = useMemo(() => {
    if (!team) return null;
    return schedule.find((fixture) => !fixture.played && (fixture.home === team || fixture.away === team))
      || schedule.find((fixture) => fixture.home === team || fixture.away === team)
      || null;
  }, [schedule, team]);

  const currentFixture = currentPlayoffMatch ? toGameFixture(currentPlayoffMatch) : toGameFixture(activeLeagueFixture);

  const closeMenu = () => setMenuOpen(false);
  const resetTournament = () => {
    setScreen("home"); setDrawer(null); setMenuOpen(false); setFixtureView("league"); setStandingsView("league"); setTeam(null); setOpponent(""); setScore([0, 0]); setMatchResult(null); setModalDismissed(false); setTable(blankLeagueTable()); setSchedule(buildLeagueSchedule()); setPlayoffFixtures([]); setCurrentPlayoffMatch(null); setPodium({}); setMatchStage("LEAGUE MATCH");
  };
  const openMatch = () => { closeMenu(); setDrawer(null); };
  const openFixtures = () => { closeMenu(); setFixtureView(leagueComplete ? "playoffs" : "league"); setDrawer("fixtures"); };
  const openGroups = () => { closeMenu(); setStandingsView(leagueComplete ? "playoffs" : "league"); setDrawer("groups"); };

  const startTeam = (name) => {
    const fixture = schedule.find((item) => !item.played && (item.home === name || item.away === name)) || schedule.find((item) => item.home === name || item.away === name);
    setTeam(name);
    setOpponent(fixture?.home === name ? fixture.away : fixture?.home || LEAGUE_TEAMS.find((candidate) => candidate !== name) || "Opponent");
    setScreen("match");
    setDrawer(null);
    setMenuOpen(false);
    setScore([0, 0]);
    setCurrentPlayoffMatch(null);
    setMatchStage("LEAGUE MATCH");
    setMatchResult(null);
    setModalDismissed(false);
  };

  const quickWin = () => {
    if (!team || !activeLeagueFixture) return;
    const match = activeLeagueFixture;
    const homeGoals = match.home === team ? 1 : 0;
    const awayGoals = match.away === team ? 1 : 0;
    handleMatchComplete({ fixtureId: match.id, homeTeam: match.home, awayTeam: match.away, homeGoals, awayGoals, userWon: true, isDraw: false });
  };

  const handleMatchComplete = (result) => {
    if (!result || !team) return;

    if (currentPlayoffMatch && resultBelongsToFixture(result, currentPlayoffMatch)) {
      const { updatedFixtures, nextUserFixture, podium: completedPodium } = completePlayoffRound({
        fixtures: playoffFixtures,
        currentMatch: currentPlayoffMatch,
        result: { ...result, userTeam: team },
      });
      const playedUserMatch = updatedFixtures.find((fixture) => fixture.id === currentPlayoffMatch.id);
      const userScore = userScoreFromFixtureResult({ homeTeam: playedUserMatch.home, awayTeam: playedUserMatch.away, homeGoals: playedUserMatch.homeGoals, awayGoals: playedUserMatch.awayGoals }, team);
      setScore(userScore);
      setPlayoffFixtures(updatedFixtures);
      if (completedPodium) setPodium(completedPodium);

      const won = result.userWon;
      const status = playedUserMatch.stage === "final" ? (won ? "champion" : "runnerUp") : (won ? "knockoutWin" : "eliminated");
      setModalDismissed(false);
      setMatchResult({ home: playedUserMatch.home, away: playedUserMatch.away, homeGoals: playedUserMatch.homeGoals, awayGoals: playedUserMatch.awayGoals, won, week: null, matchNo: playedUserMatch.matchNo, status, nextFixture: nextUserFixture });
      return;
    }

    const match = schedule.find((fixture) => fixture.id === result.fixtureId) || activeLeagueFixture;
    if (!match) return;

    const afterUserSchedule = schedule.map((fixture) => fixture.id === match.id ? { ...fixture, played: true, homeGoals: result.homeGoals, awayGoals: result.awayGoals } : fixture);
    const afterUserTable = applyLeagueResult(table, match, result.homeGoals, result.awayGoals);
    const { updatedSchedule, updatedTable } = completeMatchday(afterUserSchedule, afterUserTable, match.week, match.id);
    const completedLeague = updatedSchedule.every((fixture) => fixture.played);
    const qualified = completedLeague ? didTeamReachPlayoffs(team, updatedTable) : false;
    const userScore = userScoreFromFixtureResult(result, team);

    setScore(userScore);
    setSchedule(updatedSchedule);
    setTable(updatedTable);
    if (completedLeague) setPlayoffFixtures(buildPlayoffFixtures(updatedTable));
    setModalDismissed(false);
    setMatchResult({
      home: match.home, away: match.away, homeGoals: result.homeGoals, awayGoals: result.awayGoals, won: result.userWon, week: match.week,
      status: completedLeague ? (qualified ? "qualified" : "eliminated") : (result.isDraw ? "leagueDraw" : result.userWon ? "leagueWin" : "leagueLoss"),
      isDraw: result.isDraw || result.homeGoals === result.awayGoals,
    });
  };

  const nextMatch = () => {
    if (!team || !matchResult) return;

    if (["eliminated", "runnerUp"].includes(matchResult.status)) { resetTournament(); return; }

    if (matchResult.status === "champion") {
      setCurrentPlayoffMatch(null);
      setStandingsView("playoffs");
      setDrawer("groups");
      setMatchResult(null);
      setModalDismissed(false);
      return;
    }

    if (matchResult.status === "qualified") {
      const fixtures = playoffFixtures.length ? playoffFixtures : buildPlayoffFixtures(table);
      const userFixture = findTeamPlayoffFixture(team, fixtures);
      if (userFixture) {
        setPlayoffFixtures(fixtures);
        setCurrentPlayoffMatch(userFixture);
        setOpponent(getFixtureOpponent(team, userFixture));
        setScore([0, 0]);
        setMatchStage(playoffStageLabel(userFixture));
        setMatchResult(null);
        setModalDismissed(false);
        setDrawer(null);
        setScreen("match");
        return;
      }
    }

    if (matchResult.status === "knockoutWin") {
      const nextFixture = matchResult.nextFixture || playoffFixtures.find((fixture) => !fixture.played && (fixture.home === team || fixture.away === team));
      if (nextFixture) {
        setCurrentPlayoffMatch(nextFixture);
        setOpponent(getFixtureOpponent(team, nextFixture));
        setScore([0, 0]);
        setMatchStage(playoffStageLabel(nextFixture));
        setMatchResult(null);
        setModalDismissed(false);
        setDrawer(null);
        setScreen("match");
        return;
      }
    }

    const upcoming = schedule.find((fixture) => !fixture.played && (fixture.home === team || fixture.away === team));
    setMatchResult(null);
    setModalDismissed(false);
    if (upcoming) {
      setOpponent(upcoming.home === team ? upcoming.away : upcoming.home);
      setScore([0, 0]);
      setCurrentPlayoffMatch(null);
      setMatchStage("LEAGUE MATCH");
      setDrawer(null);
      setScreen("match");
    } else {
      setFixtureView(leagueComplete ? "playoffs" : "league");
      setStandingsView(leagueComplete ? "playoffs" : "league");
      setDrawer("fixtures");
    }
  };

  const menuProps = { menuOpen, onToggleMenu: () => setMenuOpen((open) => !open), onMatch: openMatch, onFixtures: openFixtures, onGroups: openGroups, onRestart: resetTournament };

  if (screen === "home") return <HomeScreen onSelectTeam={startTeam} />;
  if (screen === "teams") return <TeamSelectScreen onSelectTeam={startTeam} />;
  if (drawer === "groups") return <DrawerShell><GroupsScreen allGroups={allGroups} menuProps={menuProps} standingsView={standingsView} onStandingsViewChange={setStandingsView} knockoutFixtures={visiblePlayoffFixtures} qualifiedTeams={qualifiedTeams} userTeam={team} podium={podium} /></DrawerShell>;
  if (drawer === "fixtures") return <DrawerShell><FixturesScreen fixtureView={fixtureView} onFixtureViewChange={setFixtureView} schedule={schedule} menuProps={menuProps} knockoutFixtures={visiblePlayoffFixtures} userTeam={team} /></DrawerShell>;
  return <MatchScreen team={team} opponent={opponent} score={score} matchResult={matchResult} modalDismissed={modalDismissed} onDismissModal={() => setModalDismissed(true)} onQuickWin={quickWin} onMatchComplete={handleMatchComplete} onNextMatch={nextMatch} menuProps={menuProps} stageLabel={matchStage} fixture={currentFixture} groupRows={leagueRows} qualifiedTeams={qualifiedTeams} selectedGroup="League" />;
}
