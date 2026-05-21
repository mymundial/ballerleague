import { useState } from "react";
import { Flag } from "../shared.jsx";
import { ScreenTitle } from "../layout/Menu.jsx";

const formatScore = (fixture) => fixture.played ? `${fixture.homeGoals} – ${fixture.awayGoals}` : "v";

function WeekPill({ weeks, activeWeek, onChange }) {
  return <div className="px-4 pt-5">
    <div className="flex h-[58px] items-center gap-1 overflow-x-auto rounded-full border border-white/15 bg-black px-2 baller-scroll">
      {weeks.map((week) => (
        <button
          key={week}
          onClick={() => onChange(week)}
          className={`grid h-[46px] min-w-[46px] place-items-center rounded-full text-[19px] font-black transition ${week === activeWeek ? "bg-[#EEFF00] text-black" : "text-white hover:bg-white/5"}`}
        >
          {week}
        </button>
      ))}
    </div>
  </div>;
}

function TeamName({ children, align = "right" }) {
  return <span className={`min-w-0 truncate text-[15px] font-black uppercase leading-tight tracking-[-0.04em] text-white ${align === "right" ? "text-right" : "text-left"}`}>{children}</span>;
}

export function FixtureCard({ home = "TBC", away = "TBC", played = false, homeGoals = null, awayGoals = null, matchNo = null, week = null, userTeam = null }) {
  const isUserFixture = userTeam && (home === userTeam || away === userTeam);
  return <div className={`grid min-h-[92px] grid-cols-[52px_minmax(0,1fr)_38px_70px_38px_minmax(0,1fr)] items-center gap-2 rounded-md bg-[#2B2B2D] px-4 text-white baller-shadow ${isUserFixture ? "ring-1 ring-[#EEFF00]/70" : ""}`}>
    <div className="text-[13px] font-medium tabular-nums text-[#8E8E93]">{week ? `${15 + ((week - 1) % 4)}:${week % 2 ? "15" : "30"}` : matchNo ? `M${matchNo}` : "TBC"}</div>
    <TeamName>{home}</TeamName>
    <div className="flex justify-center"><Flag team={home} className="h-9 w-9" /></div>
    <div className="text-center text-[23px] font-black tabular-nums tracking-[-0.04em] text-[#EEFF00]">{formatScore({ played, homeGoals, awayGoals })}</div>
    <div className="flex justify-center"><Flag team={away} className="h-9 w-9" /></div>
    <TeamName align="left">{away}</TeamName>
  </div>;
}

export function FixturesToggle({ value, onChange }) {
  return <div className="mx-4 mt-4 grid grid-cols-2 overflow-hidden rounded-full border border-white/15 bg-black p-1">
    <button onClick={() => onChange("league")} className={`rounded-full px-4 py-2 text-[12px] font-black uppercase ${value === "league" ? "bg-[#EEFF00] text-black" : "text-white"}`}>Fixtures</button>
    <button onClick={() => onChange("playoffs")} className={`rounded-full px-4 py-2 text-[12px] font-black uppercase ${value === "playoffs" ? "bg-[#EEFF00] text-black" : "text-white"}`}>Playoffs</button>
  </div>;
}

export function FixtureSection({ title, children }) {
  return <section className="px-4 pt-6">
    <h1 className="mb-5 border-b border-white/15 pb-5 text-[42px] font-black italic uppercase leading-none tracking-[-0.08em] text-white">{title}</h1>
    <div className="space-y-3">{children}</div>
  </section>;
}

export function FixturesScreen({ fixtureView, onFixtureViewChange, schedule, menuProps, knockoutFixtures = [], userTeam = null }) {
  const weeks = [...new Set(schedule.map((fixture) => fixture.week))];
  const firstUnplayed = schedule.find((fixture) => !fixture.played)?.week || weeks[0] || 1;
  const [activeWeek, setActiveWeek] = useStateSafe(firstUnplayed);
  const visibleWeek = weeks.includes(activeWeek) ? activeWeek : firstUnplayed;
  const weeklyFixtures = schedule.filter((fixture) => fixture.week === visibleWeek);
  const playoffFixtures = knockoutFixtures.length ? knockoutFixtures : [
    { id: "SF1", matchNo: 101, stage: "semiFinal", home: "1st", away: "4th" },
    { id: "SF2", matchNo: 102, stage: "semiFinal", home: "2nd", away: "3rd" },
    { id: "FINAL", matchNo: 103, stage: "final", home: "W101", away: "W102" },
  ];

  return <main className="flex min-h-0 flex-1 flex-col">
    <ScreenTitle {...menuProps}>FIXTURES</ScreenTitle>
    <FixturesToggle value={fixtureView} onChange={onFixtureViewChange} />
    {fixtureView === "league" && <WeekPill weeks={weeks} activeWeek={visibleWeek} onChange={setActiveWeek} />}
    <section className="min-h-0 flex-1 overflow-auto pb-8 baller-scroll">
      {fixtureView === "league" ? (
        <FixtureSection title={`Gameweek ${visibleWeek}`}>{weeklyFixtures.map((fixture) => <FixtureCard key={fixture.id} {...fixture} userTeam={userTeam} />)}</FixtureSection>
      ) : (
        <FixtureSection title="Playoffs">{playoffFixtures.map((fixture) => <FixtureCard key={fixture.id} {...fixture} userTeam={userTeam} />)}</FixtureSection>
      )}
    </section>
  </main>;
}

function useStateSafe(initial) { return useState(initial); }
