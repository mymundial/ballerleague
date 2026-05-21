import { MondayLogo } from "../shared.jsx";

export function Shell({ children }) {
  return <div className="min-h-[100dvh] bg-[#0A0A0A] text-white"><div className="mx-auto min-h-[100dvh] w-full max-w-md overflow-hidden bg-[#0A0A0A] shadow-2xl">{children}</div></div>;
}

export function DrawerShell({ children }) {
  return <Shell><div className="flex h-[100dvh] flex-col overflow-hidden bg-[#0A0A0A] bg-[radial-gradient(circle_at_50%_0%,rgba(238,255,0,0.08),transparent_34%),linear-gradient(180deg,#0A0A0A,#0D0D0D)]">{children}</div></Shell>;
}

export function GreenCard({ children }) {
  return <div className="mx-auto w-[92%] rounded-[1.25rem] border border-white/10 bg-[#1F1F21]/95 p-4 text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)]">{children}</div>;
}

export function SelectionLayout({ children }) {
  return <Shell><main className="flex min-h-[100dvh] flex-col items-center justify-center gap-7 bg-[#0A0A0A] px-4 py-8"><MondayLogo /><div className="w-full">{children}</div></main></Shell>;
}
