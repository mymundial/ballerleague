import { useMemo, useState } from "react";

const teams = [
  { name: "NDL FC", manager: "Niko Omilana", code: "NDL", bg: "#efff00", text: "#050505", accent: "#efff00" },
  { name: "Deportrio", manager: "Micah Richards, Daniel Sturridge", code: "DEP", bg: "#2d95e7", text: "#ffffff", accent: "#f04444" },
  { name: "Prime FC", manager: "KSI", code: "PRI", bg: "#111111", text: "#f59e0b", accent: "#f97316" },
  { name: "SDS FC", manager: "Sharky", code: "SDS", bg: "#0f6b39", text: "#ffffff", accent: "#62e58a" },
  { name: "Wembley Rangers AFC", manager: "Ian Wright, Alan Shearer", code: "WRA", bg: "#f01393", text: "#ffffff", accent: "#ff8cd8" },
  { name: "Clutch FC", manager: "Chloe Kelly", code: "CLU", bg: "#221622", text: "#ffffff", accent: "#ff7bc6" },
  { name: "Gold Devils FC", manager: "Mark Goldbridge", code: "GDF", bg: "#e11d24", text: "#ffd21a", accent: "#ff9f1c" },
  { name: "N5 FC", manager: "Jens Lehmann", code: "N5", bg: "#a51d2d", text: "#ffffff", accent: "#f2f2f2" },
  { name: "Yanited", manager: "Angry Ginge", code: "YAN", bg: "#0b55b6", text: "#ffdf35", accent: "#ffdf35" },
  { name: "VZN FC", manager: "Tobi Brown", code: "VZN", bg: "#0d0d0d", text: "#efff00", accent: "#efff00" },
  { name: "Rukkas FC", manager: "Idris Elba", code: "RUK", bg: "#151515", text: "#ffffff", accent: "#a7a7a7" },
  { name: "Community FC", manager: "TBC", code: "COM", bg: "#111111", text: "#ffffff", accent: "#777777" },
];

const initialRows = [
  ["NDL FC", 11, 7, 2, 2, 15, 26],
  ["Deportrio", 11, 7, 2, 2, 13, 23],
  ["Prime FC", 11, 6, 2, 3, 25, 21],
  ["SDS FC", 11, 5, 4, 2, 11, 20],
  ["Wembley Rangers AFC", 11, 5, 2, 4, 0, 18],
  ["Clutch FC", 11, 5, 0, 6, -4, 17],
  ["Gold Devils FC", 11, 4, 2, 5, -5, 17],
  ["N5 FC", 11, 5, 0, 6, 3, 15],
  ["Yanited", 11, 4, 3, 4, -4, 15],
  ["VZN FC", 11, 3, 2, 6, -6, 11],
  ["Rukkas FC", 11, 3, 1, 7, -18, 10],
  ["Community FC", 11, 1, 2, 8, -30, 5],
];

const fixturesByMatchday = {
  12: [
    { time: "15:15", home: "Prime FC", away: "Wembley Rangers AFC", homeGoals: 1, awayGoals: 2 },
    { time: "16:30", home: "N5 FC", away: "SDS FC", homeGoals: 3, awayGoals: 6 },
    { time: "18:30", home: "Wembley Rangers AFC", away: "SDS FC", homeGoals: 4, awayGoals: 3 },
  ],
  11: [
    { time: "15:15", home: "NDL FC", away: "Community FC", homeGoals: 5, awayGoals: 1 },
    { time: "16:30", home: "Deportrio", away: "Rukkas FC", homeGoals: 3, awayGoals: 2 },
    { time: "18:30", home: "Gold Devils FC", away: "VZN FC", homeGoals: 2, awayGoals: 2 },
  ],
};

const teamMap = Object.fromEntries(teams.map((team) => [team.name, team]));

function Badge({ name }) {
  const team = teamMap[name] || teams[0];
  return <span className="badge" style={{ "--team-bg": team.bg, "--team-text": team.text, "--team-accent": team.accent }}>{team.code}</span>;
}

function FixtureCard({ fixture }) {
  return (
    <article className="fixture-card">
      <div className="time">{fixture.time}</div>
      <div className="team-name home-name">{fixture.home}</div>
      <Badge name={fixture.home} />
      <div className="score">{fixture.homeGoals} - {fixture.awayGoals}</div>
      <Badge name={fixture.away} />
      <div>
        <div className="team-name">{fixture.away}</div>
        <div className="manager">{teamMap[fixture.away]?.manager}</div>
      </div>
    </article>
  );
}

function TableView() {
  const rows = useMemo(() => initialRows.map(([name, pld, w, d, l, gd, pts]) => ({ name, pld, w, d, l, gd, pts })), []);
  return (
    <section>
      <h1 className="section-title">Table</h1>
      <div className="section-rule" />
      <div className="table-panel">
        <div className="table-row header">
          <div className="numeric">#</div><div></div><div>Club</div><div className="numeric">PLD</div><div className="numeric">W</div><div className="numeric">D</div><div className="numeric">L</div><div className="numeric">GD</div><div className="numeric">PTS</div>
        </div>
        {rows.map((row, idx) => (
          <div className={`table-row ${idx === 3 ? "qualify-line" : ""}`} key={row.name}>
            <div className="numeric">{idx + 1}</div>
            <Badge name={row.name} />
            <div><div className="table-team">{row.name}</div><div className="manager">{teamMap[row.name]?.manager}</div></div>
            <div className="numeric">{row.pld}</div>
            <div className="numeric">{row.w}</div>
            <div className="numeric">{row.d}</div>
            <div className="numeric">{row.l}</div>
            <div className="numeric">{row.gd > 0 ? `+${row.gd}` : row.gd}</div>
            <div className="numeric pts">{row.pts}</div>
          </div>
        ))}
        <div className="qualify-note">Top 4 teams qualify for the playoffs</div>
      </div>
    </section>
  );
}

function AdBoard() {
  return (
    <aside className="ad-board" aria-label="Baller League advert">
      <div className="ad-brand">
        <img src="/baller-icon.svg" alt="Baller League" />
        <strong>Baller<br/>League</strong>
      </div>
      <div className="ad-copy">
        <strong>It’s <span className="yellow">Baller</span></strong>
        <p>Watch live on YouTube <span>↗</span></p>
      </div>
    </aside>
  );
}

function PlayoffsView() {
  return <div className="playoffs">Playoffs unlock after the regular season table is finalised.</div>;
}

function Menu({ view, setView, reset }) {
  return <div className="menu-popover">
    <button onClick={() => setView("live")}>Live Match</button>
    <button onClick={() => setView("fixtures")} className={view === "fixtures" ? "active" : ""}>Fixtures</button>
    <button onClick={() => setView("table")} className={view === "table" ? "active" : ""}>Table</button>
    <button onClick={() => setView("playoffs")} className={view === "playoffs" ? "active" : ""}>Playoffs</button>
    <button className="danger" onClick={reset}>Reset Season</button>
  </div>;
}

export default function App() {
  const [view, setView] = useState("table");
  const [matchday, setMatchday] = useState(12);
  const [menuOpen, setMenuOpen] = useState(false);
  const fixtures = fixturesByMatchday[matchday] || fixturesByMatchday[12];

  const reset = () => {
    setView("table");
    setMatchday(12);
    setMenuOpen(false);
  };

  return (
    <main className="baller-shell">
      <header className="baller-topbar">
        <button aria-label="Menu" onClick={() => setMenuOpen((open) => !open)} className="hamburger"><span/><span/><span/></button>
        <nav className="nav" aria-label="Primary">
          <button className={view === "fixtures" ? "active" : ""} onClick={() => setView("fixtures")}>Fixtures</button>
          <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}>Table</button>
          <button className={view === "playoffs" ? "active" : ""} onClick={() => setView("playoffs")}>Playoffs</button>
        </nav>
        <button className="season">Season 3⌄</button>
      </header>

      {menuOpen && <Menu view={view} setView={(next) => { setView(next); setMenuOpen(false); }} reset={reset} />}

      <div className="matchdays">
        {Array.from({ length: 12 }, (_, idx) => idx + 1).map((day) => <button key={day} className={day === matchday ? "active" : ""} onClick={() => setMatchday(day)}>{day}</button>)}
      </div>

      <section className="fixture-list">
        {fixtures.map((fixture, idx) => <FixtureCard fixture={fixture} key={`${fixture.time}-${idx}`} />)}
      </section>

      <AdBoard />

      {view === "playoffs" ? <PlayoffsView /> : <TableView />}
    </main>
  );
}
