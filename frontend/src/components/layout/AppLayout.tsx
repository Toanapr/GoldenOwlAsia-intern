import {
  BarChart3,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Medal,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const navigation = [
  {
    to: "/",
    label: "Tổng quan",
    icon: LayoutDashboard,
    end: true,
    index: "01",
  },
  { to: "/search", label: "Tra cứu điểm", icon: Search, index: "02" },
  { to: "/reports", label: "Phổ điểm", icon: BarChart3, index: "03" },
  { to: "/top-students", label: "Top khối A", icon: Medal, index: "04" },
];

function navigationClassName({ isActive }: { isActive: boolean }) {
  return [
    "group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-sm font-bold transition-all duration-200 focus-visible:outline-2",
    isActive
      ? "bg-white/[0.09] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
      : "text-blue-100/55 hover:bg-white/[0.05] hover:text-white",
  ].join(" ");
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Điều hướng chính" className="space-y-1.5">
      {navigation.map(({ icon: Icon, index, ...item }) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={navigationClassName}
          onClick={onNavigate}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-brand-300" />
              )}
              <span
                className={`grid size-9 place-items-center rounded-xl transition-colors ${isActive ? "bg-brand-400 text-blue-950" : "bg-white/[0.05]"}`}
              >
                <Icon
                  className="size-[17px]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
              <span className="flex-1">{item.label}</span>
              <span className="font-mono text-[10px] font-medium opacity-40">
                {index}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <NavLink to="/" className="flex items-center gap-3 focus-visible:outline-2">
      <span className="relative grid size-11 place-items-center rounded-2xl bg-brand-400 text-blue-950 shadow-[0_8px_30px_rgba(96,165,250,0.25)]">
        <GraduationCap
          className="size-5"
          strokeWidth={2.4}
          aria-hidden="true"
        />
        <span
          className={`absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 bg-amber-300 ${compact ? "border-[#f4f7f5]" : "border-[#0b1026]"}`}
        />
      </span>
      <span>
        <span
          className={`block font-extrabold tracking-[-0.04em] ${compact ? "text-slate-950" : "text-white"}`}
        >
          G<span className="text-brand-400">/</span>SCORES
        </span>
        <span
          className={`block text-[9px] font-bold tracking-[0.2em] uppercase ${compact ? "text-slate-500" : "text-blue-100/45"}`}
        >
          Exam intelligence
        </span>
      </span>
    </NavLink>
  );
}

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="relative hidden overflow-hidden bg-[#0b1026] lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:px-5 lg:py-7">
        <div className="pointer-events-none absolute -top-24 -left-24 size-64 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="relative px-2">
          <Brand />
        </div>
        <p className="relative mt-11 px-3 text-[10px] font-extrabold tracking-[0.2em] text-blue-100/30 uppercase">
          Workspace
        </p>
        <div className="relative mt-3">
          <Navigation />
        </div>
        <p className="relative mt-auto px-2 font-mono text-[9px] tracking-widest text-blue-100/25">
          G-SCORES / 2024.1
        </p>
      </aside>

      <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200/70 bg-[#f4f7f5]/90 px-4 backdrop-blur-xl lg:hidden">
        <Brand compact />
        <button
          type="button"
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="grid size-11 place-items-center rounded-2xl bg-[#0b1026] text-white shadow-lg shadow-blue-950/10 focus-visible:outline-2"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-blue-950/50 backdrop-blur-sm"
            aria-label="Đóng menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="relative h-full w-[min(86vw,320px)] overflow-hidden bg-[#0b1026] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                aria-label="Đóng menu"
                onClick={() => setMenuOpen(false)}
                className="grid size-10 place-items-center rounded-xl bg-white/[0.07] text-blue-50 focus-visible:outline-2"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-10">
              <Navigation />
            </div>
          </aside>
        </div>
      )}

      <main className="min-w-0 overflow-hidden px-4 py-7 sm:px-7 sm:py-10 lg:px-10 lg:py-11 xl:px-14">
        <div
          className="mx-auto max-w-[1180px] page-reveal"
          key={location.pathname}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
