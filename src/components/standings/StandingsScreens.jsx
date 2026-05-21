import { Flag } from "../shared.jsx";
import { ScreenTitle } from "../layout/Menu.jsx";
import { FixturesToggle, FixtureCard } from "../schedule/ScheduleScreens.jsx";

function gd(value) {
  if (value > 0) return `+${value}`;
  return String(value ?? 0);
}

export function GroupTable({ title = "TABLE", rows, qualifiedTeams = new Set(), userTeam = null }) {
  return <section className="px-4 pt-7">
    <div className="mb-10 flex items-center justify-between border-b border-white/15 pb-7">
      <h1 className="text-[52px] font-black italic uppercase leading-none tracking-[-0.09em] text-white">{title}</h1>
      <button className="rounded-full border border-white/15 px-4 py-2 text-[12px] font-black uppercase text-white">Season 3</button>
    </div>
    <div className="overflow-hidden rounded-md bg-[#2B2B2D] p-4 text-white baller-shadow">
      <div className="grid grid-cols-[34px_52px_minmax(0,1fr)_38px_38px_38px_38px_48px_52px] items-center gap-2 border-b border-white/10 px-2 pb-3 text-center text-[11px] font-black uppercase text-[#8E8E93]">
        <span>#</span><span></span><span className="text-left">Club</span><span>PLD</span><span>W</span><span>D</span><span>L</span><span>GD</span><span>PTS</span>
      </div>
      {rows.map((row, index) => {
        const isUserTeam = userTeam === row.team;
        const isCutLine = index === 3;
        return <div key={row.team} className={`relative grid grid-cols-[34px_52px_minmax(0,1fr)_38px_38px_38px_38px_48px_52px] items-center gap-2 border-b border-white/10 px-2 py-3 text-center text-[14px] font-semibold text-white last:border-b-0 ${isUserTeam ? "bg-white/[0.035]" : ""}`}>
          {isCutLine && <div className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-[2px] bg-[#EEFF00]" />}
          <span className="font-black">{index + 1}</span>
          <span className="flex justify-center"><Flag team={row.team} className="h-8 w-8" /></span>
          <span className="min-w-0 truncate text-left text-[14px] font-black uppercase tracking-[-0.03em]">{row.team}</span>
          <span>{row.played}</span><span>{row.won}</span><span>{row.drawn}</span><span>{row.lost}</span><span>{gd(row.gd)}</span><span className="font-black text-[#EEFF00]">{row.pts}</span>
        </div>;
      })}
      <div className="px-3 pt-5 text-center text-[12px] font-black uppercase tracking-[0.04em] text-[#8E8E93]">Top 4 teams qualify for the playoffs</div>
    </div>
  </section>;
}

function PlayoffBracket({ fixtures = [], podium = {}, userTeam }) {
  const semis = fixtures.filter((f) => f.stage === "semiFinal");
  const final = fixtures.find((f) => f.stage === "final");
  const cards = semis.length ? [...semis, ...(final ? [final] : [{ id: "FINAL", matchNo: 103, home: "W101", away: "W102", stage: "final" }])] : [
    { id: "SF1", matchNo: 101, home: "1st", away: "4th" },
    { id: "SF2", matchNo: 102, home: "2nd", away: "3rd" },
    { id: "FINAL", matchNo: 103, home: "W101", away: "W102" },
  ];

  return <section className="px-4 pt-7">
    <h1 className="mb-7 border-b border-white/15 pb-7 text-[46px] font-black italic uppercase leading-none tracking-[-0.08em] text-white">PLAYOFFS</h1>
    <div className="space-y-3">{cards.map((fixture) => <FixtureCard key={fixture.id} {...fixture} userTeam={userTeam} />)}</div>
    {(podium.winner || podium.runnerUp) && <div className="mt-5 rounded-md border border-[#EEFF00]/50 bg-[#111] p-5 text-center">
      <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8E8E93]">Champion</div>
      <div className="mt-2 text-[28px] font-black uppercase tracking-[-0.05em] text-[#EEFF00]">{podium.winner || "TBC"}</div>
    </div>}
  </section>;
}

export function GroupsScreen({ allGroups, menuProps, standingsView, onStandingsViewChange, knockoutFixtures, qualifiedTeams = new Set(), userTeam = null, podium = {} }) {
  const rows = allGroups?.[0]?.rows || [];
  return <main className="flex min-h-0 flex-1 flex-col">
    <ScreenTitle {...menuProps}>TABLE</ScreenTitle>
    <FixturesToggle value={standingsView} onChange={onStandingsViewChange} />
    <section className="min-h-0 flex-1 overflow-auto pb-8 baller-scroll">
      {standingsView === "league" && <GroupTable title="TABLE" rows={rows} qualifiedTeams={qualifiedTeams} userTeam={userTeam} />}
      {standingsView === "playoffs" && <PlayoffBracket fixtures={knockoutFixtures} podium={podium} userTeam={userTeam} />}
    </section>
  </main>;
}
