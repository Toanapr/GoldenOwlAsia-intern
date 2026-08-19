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
import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { to: "/", label: "Tổng quan", icon: LayoutDashboard, end: true },
  { to: "/search", label: "Tra cứu điểm", icon: Search },
  { to: "/reports", label: "Phổ điểm", icon: BarChart3 },
  { to: "/top-students", label: "Top khối A", icon: Medal },
];

function navigationClassName({ isActive }: { isActive: boolean }) {
  return [
    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2",
    isActive
      ? "bg-brand-50 text-brand-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  ].join(" ");
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Điều hướng chính" className="space-y-1">
      {navigation.map(({ icon: Icon, ...item }) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={navigationClassName}
          onClick={onNavigate}
        >
          <Icon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <NavLink to="/" className="flex items-center gap-3 focus-visible:outline-2">
      <span className="grid size-10 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
        <GraduationCap className="size-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-base font-bold tracking-tight text-slate-950">
          G-Scores
        </span>
        <span className="block text-[11px] font-medium text-slate-500">
          THPT Quốc gia 2024
        </span>
      </span>
    </NavLink>
  );
}

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/70 lg:grid lg:grid-cols-[252px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white lg:flex lg:min-h-screen lg:flex-col lg:px-5 lg:py-6">
        <Brand />
        <div className="mt-9">
          <Navigation />
        </div>
        <div className="mt-auto rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
          Dữ liệu điểm thi THPT Quốc gia năm 2024.
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
        <Brand />
        <button
          type="button"
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 focus-visible:outline-2"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-slate-950/35"
            aria-label="Đóng menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="relative h-full w-[min(84vw,300px)] bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Brand />
              <button
                type="button"
                aria-label="Đóng menu"
                onClick={() => setMenuOpen(false)}
                className="grid size-9 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-2"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-8">
              <Navigation onNavigate={() => setMenuOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      <main className="min-w-0 px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10 xl:px-14">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
