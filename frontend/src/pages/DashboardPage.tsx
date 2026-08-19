import { ArrowRight, BarChart3, Medal, Search } from "lucide-react";
import { Link } from "react-router-dom";

const functions = [
  {
    to: "/search",
    title: "Tra cứu điểm thi",
    description: "Nhập số báo danh để xem điểm của từng môn.",
    icon: Search,
  },
  {
    to: "/reports",
    title: "Xem phổ điểm",
    description: "So sánh bốn khoảng điểm trên chín môn thi.",
    icon: BarChart3,
  },
  {
    to: "/top-students",
    title: "Xếp hạng khối A",
    description: "Danh sách thí sinh có tổng Toán, Lý, Hóa cao nhất.",
    icon: Medal,
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-10">
      <section className="border-t-4 border-brand-700 bg-white">
        <div className="grid border-x border-b border-slate-200 lg:grid-cols-[1fr_310px]">
          <div className="px-6 py-10 sm:px-9 sm:py-12 lg:px-12 lg:py-16">
            <p className="text-xs font-bold tracking-[0.12em] text-brand-700 uppercase">
              Kỳ thi tốt nghiệp THPT · 2024
            </p>
            <h1 className="mt-5 max-w-2xl text-4xl leading-[1.08] font-extrabold tracking-[-0.045em] text-slate-950 sm:text-6xl">
              Điểm thi trên toàn quốc, trong một trang.
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-slate-600">
              Tra cứu kết quả theo số báo danh, xem phân bố điểm từng môn và
              danh sách thí sinh dẫn đầu khối A.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <Link
                to="/search"
                className="inline-flex items-center gap-3 bg-brand-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-800 focus-visible:outline-2"
              >
                Tra cứu điểm{" "}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/reports"
                className="inline-flex items-center border-b border-slate-400 py-2 text-sm font-bold text-slate-800 hover:border-brand-700 hover:text-brand-700 focus-visible:outline-2"
              >
                Xem số liệu tổng hợp
              </Link>
            </div>
          </div>

          <dl className="grid border-t border-slate-200 bg-[#f1f4fb] lg:border-t-0 lg:border-l">
            <div className="flex items-end justify-between border-b border-slate-200 px-6 py-6 lg:block lg:px-8 lg:py-8">
              <dt className="text-xs font-semibold text-slate-500">
                Số thí sinh
              </dt>
              <dd className="font-mono text-2xl font-bold tracking-tight text-slate-950 lg:mt-3 lg:text-3xl">
                1.061.605
              </dd>
            </div>
            <div className="flex items-end justify-between border-b border-slate-200 px-6 py-6 lg:block lg:px-8 lg:py-8">
              <dt className="text-xs font-semibold text-slate-500">
                Số môn thi
              </dt>
              <dd className="font-mono text-2xl font-bold text-slate-950 lg:mt-3 lg:text-3xl">
                09
              </dd>
            </div>
            <div className="flex items-end justify-between px-6 py-6 lg:block lg:px-8 lg:py-8">
              <dt className="text-xs font-semibold text-slate-500">
                Năm dữ liệu
              </dt>
              <dd className="font-mono text-2xl font-bold text-slate-950 lg:mt-3 lg:text-3xl">
                2024
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="functions-title">
        <div className="grid gap-3 border-b-2 border-slate-900 pb-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-xs font-bold text-[#c33149]">03 CHỨC NĂNG</p>
            <h2
              id="functions-title"
              className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950"
            >
              Bạn cần xem thông tin nào?
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Dữ liệu được tổng hợp từ kết quả kỳ thi năm 2024.
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {functions.map(({ icon: Icon, ...item }, index) => (
            <Link
              key={item.to}
              to={item.to}
              className="group grid gap-4 py-6 transition-colors hover:bg-white sm:grid-cols-[48px_1fr_auto] sm:items-center sm:px-4 focus-visible:outline-2"
            >
              <span className="font-mono text-sm text-slate-400">
                0{index + 1}
              </span>
              <span className="flex items-start gap-4">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center border border-slate-300 text-brand-700 group-hover:border-brand-700">
                  <Icon
                    className="size-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </span>
                <span>
                  <strong className="block text-base font-bold text-slate-950">
                    {item.title}
                  </strong>
                  <span className="mt-1 block text-sm text-slate-500">
                    {item.description}
                  </span>
                </span>
              </span>
              <ArrowRight
                className="ml-auto hidden size-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-700 sm:block"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
