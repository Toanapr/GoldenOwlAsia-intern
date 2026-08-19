import {
  BarChart3,
  BookOpenText,
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
  { to: "/top-students", label: "Xếp hạng khối A", icon: Medal },
];

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Điều hướng chính">
      <ul className="space-y-1">
        {navigation.map(({ icon: Icon, ...item }) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 border-l-2 px-3 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 ${
                  isActive
                    ? "border-brand-600 bg-blue-50 text-brand-700"
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                }`
              }
            >
              <Icon
                className="size-[17px]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <NavLink to="/" className="flex items-center gap-3 focus-visible:outline-2">
      <span
        className={`grid size-10 place-items-center ${inverse ? "bg-white text-brand-700" : "bg-brand-700 text-white"}`}
      >
        <BookOpenText className="size-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span>
        <span
          className={`block text-sm font-extrabold tracking-tight ${inverse ? "text-white" : "text-slate-950"}`}
        >
          ĐIỂM THI 2024
        </span>
        <span
          className={`block text-[10px] font-medium ${inverse ? "text-blue-100" : "text-slate-500"}`}
        >
          Tra cứu và thống kê
        </span>
      </span>
    </NavLink>
  );
}

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="border-b border-slate-200 px-6 py-6">
          <Brand />
        </div>
        <div className="px-4 py-7">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">
            Chức năng
          </p>
          <Navigation />
        </div>
        <div className="mt-auto border-t border-slate-200 px-6 py-5 text-[11px] leading-5 text-slate-500">
          Dữ liệu kỳ thi tốt nghiệp THPT năm 2024.
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Brand />
        <button
          type="button"
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
          className="grid size-10 place-items-center border border-slate-300 bg-white text-slate-900 focus-visible:outline-2"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-slate-950/40"
            aria-label="Đóng menu"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="relative h-full w-[min(86vw,300px)] bg-white shadow-xl">
            <div className="flex items-center justify-between bg-brand-700 p-5">
              <Brand inverse />
              <button
                type="button"
                aria-label="Đóng menu"
                onClick={() => setMenuOpen(false)}
                className="grid size-9 place-items-center border border-white/30 text-white focus-visible:outline-2"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="p-4">
              <Navigation onNavigate={() => setMenuOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      <main className="min-w-0 overflow-hidden px-4 py-7 sm:px-7 sm:py-9 lg:px-10 lg:py-10 xl:px-14">
        <div className="mx-auto max-w-[1120px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
