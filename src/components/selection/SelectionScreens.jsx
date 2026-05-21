import { LEAGUE_TEAMS, TEAM_RANK } from "../../data/teams.js";
import { Flag } from "../shared.jsx";
import { GreenCard, SelectionLayout } from "../layout/Layout.jsx";

function TeamButton({ name, onSelectTeam }) {
  return <button onClick={() => onSelectTeam(name)} className="grid h-[58px] grid-cols-[44px_minmax(0,1fr)_42px] items-center gap-3 rounded-md border border-white/10 bg-[#2B2B2D] px-4 text-left text-white transition hover:border-[#EEFF00]/60">
    <Flag team={name} className="h-9 w-9" />
    <span className="truncate text-[15px] font-black uppercase tracking-[-0.04em]">{name}</span>
    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#EEFF00] text-[12px] font-black tabular-nums text-black">#{TEAM_RANK[name]}</span>
  </button>;
}

function LeaguePanel({ onSelectTeam }) {
  return <GreenCard>
    <div className="mb-1 text-center text-[40px] font-black italic uppercase leading-none tracking-[-0.08em] text-white">Select club</div>
    <div className="mb-5 text-center text-[11px] font-black uppercase tracking-[0.16em] text-[#8E8E93]">12 teams • top 4 reach playoffs</div>
    <div className="grid gap-2">{LEAGUE_TEAMS.map((name) => <TeamButton key={name} name={name} onSelectTeam={onSelectTeam} />)}</div>
  </GreenCard>;
}

export function HomeScreen({ onSelectTeam }) { return <SelectionLayout><LeaguePanel onSelectTeam={onSelectTeam} /></SelectionLayout>; }
export function TeamSelectScreen({ onSelectTeam }) { return <SelectionLayout><LeaguePanel onSelectTeam={onSelectTeam} /></SelectionLayout>; }
