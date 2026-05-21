import { ASSETS } from "../data/assets.js";
import { teamCode, teamLogo } from "../data/teams.js";

export function Flag({ team, className = "h-8 w-8" }) {
  const src = teamLogo(team);
  return (
    <span className={`relative flex ${className} shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1F1F21] text-[8px] font-black text-[#EEFF00] ring-1 ring-white/10`}>
      {src ? (
        <img
          alt=""
          src={src}
          className="h-full w-full object-contain p-[1px]"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
          draggable={false}
        />
      ) : (
        String(teamCode(team || "TBC")).slice(0, 3)
      )}
    </span>
  );
}

export function BrandMark() {
  return <span className="text-[28px] font-black italic tracking-[-0.08em] text-white">BALLER</span>;
}

export function MondayLogo({ small = false }) {
  return (
    <span className={`${small ? "text-[26px]" : "text-[46px]"} font-black italic uppercase leading-none tracking-[-0.08em] text-white`}>
      BALLER
    </span>
  );
}

export function HamburgerIcon() {
  return <span className="relative flex h-[22px] w-[30px] flex-col items-stretch justify-between">
    <span className="block h-[4px] w-full rounded-full bg-current" />
    <span className="block h-[4px] w-full rounded-full bg-current" />
    <span className="block h-[4px] w-full rounded-full bg-current" />
  </span>;
}
