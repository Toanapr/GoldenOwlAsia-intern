import { Link } from 'react-router-dom'

const shortcuts = [
  { to: '/search', title: 'Tra cứu điểm', description: 'Tìm kết quả theo số báo danh.' },
  { to: '/reports', title: 'Phổ điểm', description: 'Theo dõi phân bố điểm của chín môn.' },
  { to: '/top-students', title: 'Top khối A', description: 'Xem mười thí sinh có tổng điểm cao nhất.' },
]

export function DashboardPage() {
  return (
    <section aria-labelledby="dashboard-title">
      <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">Kỳ thi THPT 2024</p>
      <h1 id="dashboard-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        G-Scores Dashboard
      </h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Không gian tra cứu và phân tích điểm thi. Dữ liệu nghiệp vụ sẽ được kết nối trong các phase tiếp theo.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {shortcuts.map((shortcut) => (
          <Link
            key={shortcut.to}
            to={shortcut.to}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-600 hover:shadow-md focus-visible:outline-2"
          >
            <h2 className="font-semibold text-slate-950">{shortcut.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{shortcut.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
