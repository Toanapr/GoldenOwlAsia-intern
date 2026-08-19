import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/search', label: 'Tra cứu điểm' },
  { to: '/reports', label: 'Phổ điểm' },
  { to: '/top-students', label: 'Top khối A' },
]

function navigationClassName({ isActive }: { isActive: boolean }) {
  return [
    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-600 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  ].join(' ')
}

export function AppLayout() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-slate-200 bg-white lg:min-h-screen lg:border-r lg:border-b-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:block lg:px-6 lg:py-8">
          <NavLink to="/" className="text-lg font-bold text-slate-950">
            G-Scores
          </NavLink>

          <nav aria-label="Điều hướng chính" className="flex gap-1 overflow-x-auto lg:mt-8 lg:flex-col">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navigationClassName}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
