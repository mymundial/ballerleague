import { HamburgerIcon } from "../shared.jsx";

const NAV = {
  live: "LIVE MATCH",
  fixtures: "FIXTURES",
  table: "TABLE",
  playoffs: "PLAYOFFS",
};

export function MenuButton({ children, onClick, danger = false, active = false }) {
  return <button onClick={onClick} className={`flex w-full items-center justify-between px-5 py-4 text-left text-[16px] font-black uppercase transition-colors ${danger ? "text-[#FF4545] hover:bg-[#FF4545]/10" : active ? "text-[#EEFF00]" : "text-white hover:bg-white/5"}`}>
    <span>{children}</span><span className="text-white/30">›</span>
  </button>;
}

export function MenuDropdown({ onClose, onMatch, onFixtures, onGroups, onRestart }) {
  return <div className="fixed inset-0 z-[80] flex justify-center bg-black/45">
    <button aria-label="Close menu" onClick={onClose} className="absolute inset-0" />
    <div className="pointer-events-none relative h-[100dvh] w-full max-w-md px-4 pt-[70px]">
      <div className="pointer-events-auto absolute right-4 top-[70px] w-[205px] overflow-hidden rounded-lg border border-white/15 border-t-[#EEFF00] bg-[#111]/95 text-white shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur">
        <div className="py-3">
          <MenuButton onClick={onMatch}>{NAV.live}</MenuButton>
          <MenuButton onClick={onFixtures}>{NAV.fixtures}</MenuButton>
          <MenuButton active onClick={onGroups}>{NAV.table}</MenuButton>
          <MenuButton onClick={() => { onGroups?.(); }}>{NAV.playoffs}</MenuButton>
        </div>
        <div className="border-t border-white/10 py-3"><MenuButton danger onClick={onRestart}>RESET SEASON</MenuButton></div>
      </div>
    </div>
  </div>;
}

export function HeaderMenuButton({ onClick }) {
  return <button onClick={onClick} className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md text-white"><HamburgerIcon /></button>;
}

export function TopNav({ active = "table", onToggleMenu, onFixtures, onGroups }) {
  const navClass = (key) => `relative flex h-[70px] items-center px-3 text-[14px] font-black uppercase ${active === key ? "text-[#EEFF00] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-[#EEFF00]" : "text-white"}`;
  return <section className="relative h-[70px] shrink-0 border-b border-white/10 bg-[#0A0A0A]">
    <HeaderMenuButton onClick={onToggleMenu} />
    <div className="ml-[82px] mr-4 flex h-full items-center justify-between">
      <button onClick={onFixtures} className={navClass("fixtures")}>Fixtures</button>
      <button onClick={onGroups} className={navClass("table")}>Table</button>
      <button onClick={onGroups} className={navClass("playoffs")}>Playoffs</button>
    </div>
  </section>;
}

export function ScreenTitle({ children, menuOpen, onToggleMenu, onMatch, onFixtures, onGroups, onRestart }) {
  const active = String(children).toLowerCase().includes("fixture") ? "fixtures" : String(children).toLowerCase().includes("play") ? "playoffs" : "table";
  return <>
    <TopNav active={active} onToggleMenu={onToggleMenu} onFixtures={onFixtures} onGroups={onGroups} />
    {menuOpen && <MenuDropdown onClose={onToggleMenu} onMatch={onMatch} onFixtures={onFixtures} onGroups={onGroups} onRestart={onRestart} />}
  </>;
}
