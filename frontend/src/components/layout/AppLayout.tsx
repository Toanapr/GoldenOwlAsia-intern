import {
  BarChart3,
  BookOpenText,
  LayoutDashboard,
  Menu,
  Medal,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

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
                `flex min-h-11 items-center gap-3 border-l-2 px-3 py-2.5 text-base font-semibold transition-colors duration-200 focus-visible:outline-2 ${
                  isActive
                    ? "border-accent bg-brand-50 text-accent"
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
    <NavLink
      to="/"
      className="flex min-h-11 items-center gap-3 focus-visible:outline-2"
    >
      <span
        className={`grid size-10 place-items-center ${inverse ? "bg-white text-accent" : "bg-primary text-white"}`}
      >
        <BookOpenText className="size-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span>
        <span
          className={`block text-base font-bold tracking-tight ${inverse ? "text-white" : "text-foreground"}`}
        >
          ĐIỂM THI 2024
        </span>
        <span
          className={`block text-xs font-normal ${inverse ? "text-blue-100" : "text-muted-foreground"}`}
        >
          Tra cứu và thống kê
        </span>
      </span>
    </NavLink>
  );
}

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return;
    previousPathRef.current = location.pathname;
    mainRef.current?.focus();
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    closeButtonRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      closeMenuAndRestoreFocus();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  function closeMenuAndRestoreFocus() {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[240px_1fr]">
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-[100] -translate-y-20 bg-primary px-4 py-3 font-bold text-white transition-transform duration-200 focus:translate-y-0"
      >
        Bỏ qua điều hướng
      </a>
      <aside className="hidden border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="border-b border-slate-200 px-6 py-6">
          <Brand />
        </div>
        <div className="px-4 py-7">
          <p className="mb-3 px-3 text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">
            Chức năng
          </p>
          <Navigation />
        </div>
        <div className="mt-auto border-t border-slate-200 px-6 py-5 text-xs leading-5 text-muted-foreground">
          Dữ liệu kỳ thi tốt nghiệp THPT năm 2024.
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Brand />
        <button
          ref={menuButtonRef}
          type="button"
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(true)}
          className="grid size-11 place-items-center border border-slate-300 bg-white text-slate-900 transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-2"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-slate-950/40"
            aria-label="Đóng menu"
            onClick={closeMenuAndRestoreFocus}
          />
          <aside
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng"
            className="relative h-full w-[min(86vw,300px)] bg-white shadow-xl"
          >
            <div className="flex items-center justify-between bg-primary p-5">
              <Brand inverse />
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Đóng menu"
                onClick={closeMenuAndRestoreFocus}
                className="grid size-11 place-items-center border border-white/30 text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-2"
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

      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className="min-w-0 overflow-hidden px-4 py-7 focus:outline-none sm:px-7 sm:py-9 lg:px-10 lg:py-10 xl:px-14"
      >
        <div className="mx-auto max-w-[1120px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
