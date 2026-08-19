import { ArrowRight, BarChart3, Database, Medal, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";

const shortcuts = [
  {
    to: "/search",
    title: "Tra cứu điểm",
    description: "Tìm đầy đủ điểm chín môn theo số báo danh.",
    icon: Search,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    to: "/reports",
    title: "Phổ điểm",
    description: "So sánh phân bố bốn khoảng điểm theo từng môn.",
    icon: BarChart3,
    tone: "bg-violet-50 text-violet-700",
  },
  {
    to: "/top-students",
    title: "Top khối A",
    description: "Xem mười thí sinh có tổng Toán, Lý, Hóa cao nhất.",
    icon: Medal,
    tone: "bg-amber-50 text-amber-700",
  },
];

const metrics = [
  { value: "1.061.605", label: "Thí sinh" },
  { value: "9", label: "Môn thi" },
  { value: "2024", label: "Năm dữ liệu" },
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white shadow-xl shadow-slate-200 sm:px-10 sm:py-12">
        <div
          className="absolute -top-24 -right-20 size-72 rounded-full bg-brand-600/30 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
            <Database className="size-3.5" aria-hidden="true" />
            Dữ liệu kỳ thi THPT Quốc gia
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            Điểm thi 2024,
            <span className="block text-blue-300">rõ ràng trong một nơi.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Tra cứu kết quả, khám phá phổ điểm và theo dõi nhóm thí sinh dẫn đầu
            khối A từ dữ liệu chính thức.
          </p>
          <Link
            to="/search"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-white"
          >
            Tra cứu ngay
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section
        aria-label="Thông tin dữ liệu"
        className="grid grid-cols-3 gap-3"
      >
        {metrics.map((metric) => (
          <Card key={metric.label} className="px-3 py-5 text-center sm:p-6">
            <strong className="block text-xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {metric.value}
            </strong>
            <span className="mt-1 block text-xs font-medium text-slate-500 sm:text-sm">
              {metric.label}
            </span>
          </Card>
        ))}
      </section>

      <section aria-labelledby="features-title">
        <p className="text-xs font-bold tracking-[0.18em] text-brand-600 uppercase">
          Khám phá dữ liệu
        </p>
        <h2
          id="features-title"
          className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
        >
          Bạn muốn bắt đầu từ đâu?
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {shortcuts.map(({ icon: Icon, ...shortcut }) => (
            <Link
              key={shortcut.to}
              to={shortcut.to}
              className="group focus-visible:outline-2"
            >
              <Card className="h-full p-5 transition duration-200 group-hover:-translate-y-0.5 group-hover:border-brand-200 group-hover:shadow-lg">
                <span
                  className={`grid size-11 place-items-center rounded-xl ${shortcut.tone}`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-bold text-slate-950">
                  {shortcut.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {shortcut.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                  Mở chức năng
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
