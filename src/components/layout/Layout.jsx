export function DrawerShell({ children }) {
  return <div className="mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-[#F5F0E6] text-[#072D1D]">{children}</div>;
}
export function SelectionLayout({ children }) {
  return <main className="mx-auto flex h-[100dvh] max-w-md flex-col items-center justify-center bg-[#F5F0E6] p-5 text-[#072D1D]">{children}</main>;
}
export function GreenCard({ children }) {
  return <section className="w-full overflow-hidden rounded-[2rem] bg-[#0B5F35] p-5 text-[#F5F0E6] shadow-[0_18px_50px_rgba(7,45,29,0.18)]">{children}</section>;
}
export function Shell({ children }) { return <DrawerShell>{children}</DrawerShell>; }
