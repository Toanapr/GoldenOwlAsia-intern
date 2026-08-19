import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  Medal,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const shortcuts = [
  {
    to: "/search",
    title: "Tra cứu điểm",
    description: "Kết quả đầy đủ 9 môn chỉ từ một số báo danh.",
    icon: Search,
    accent: "bg-brand-400 text-blue-950",
    number: "01",
  },
  {
    to: "/reports",
    title: "Khám phá phổ điểm",
    description: "Nhìn toàn cảnh hơn một triệu kết quả theo từng môn.",
    icon: BarChart3,
    accent: "bg-indigo-400 text-indigo-950",
    number: "02",
  },
  {
    to: "/top-students",
    title: "Top khối A",
    description: "Bảng vàng Toán · Lý · Hóa với cách xếp hạng minh bạch.",
    icon: Medal,
    accent: "bg-amber-300 text-amber-950",
    number: "03",
  },
];

const metrics = [
  {
    value: "1.061.605",
    label: "Hồ sơ thí sinh",
    note: "Toàn quốc",
    icon: Database,
  },
  { value: "09", label: "Môn thi", note: "Đủ dữ liệu", icon: CheckCircle2 },
  {
    value: "2024",
    label: "Kỳ thi THPT",
    note: "Dataset mới nhất",
    icon: TrendingUp,
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-7 sm:space-y-9">
      <section className="grid-noise relative overflow-hidden rounded-[30px] bg-[#0b1026] px-6 py-9 text-white shadow-[0_28px_70px_rgba(11,16,38,0.18)] sm:px-10 sm:py-12 lg:min-h-[430px] lg:px-12">
        <div className="pointer-events-none absolute -top-36 -right-28 size-[380px] rounded-full bg-brand-400/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[8%] bottom-[-30%] size-64 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-300/20 bg-brand-300/10 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.14em] text-brand-200 uppercase">
              <Sparkles className="size-3.5" aria-hidden="true" />
              National exam intelligence
            </div>
            <h1 className="mt-6 max-w-2xl text-[2.55rem] leading-[1.02] font-extrabold tracking-[-0.06em] sm:text-6xl lg:text-[4rem]">
              Dữ liệu điểm thi,
              <span className="mt-1 block text-brand-300">nay đã dễ hiểu.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-blue-50/65 sm:text-[15px]">
              Tra cứu nhanh, đọc phổ điểm trực quan và khám phá những thí sinh
              dẫn đầu từ hơn một triệu bản ghi kỳ thi THPT 2024.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/search"
                className="group inline-flex items-center gap-3 rounded-2xl bg-brand-400 px-5 py-3.5 text-sm font-extrabold text-blue-950 shadow-[0_12px_35px_rgba(96,165,250,0.22)] transition hover:-translate-y-0.5 hover:bg-brand-300 focus-visible:outline-2 focus-visible:outline-white"
              >
                Tra cứu kết quả
                <span className="grid size-7 place-items-center rounded-lg bg-blue-950/10">
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
              <Link
                to="/reports"
                className="text-sm font-bold text-white/70 transition hover:text-white focus-visible:outline-2"
              >
                Xem báo cáo <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>

          <div
            className="relative mx-auto hidden w-full max-w-[330px] lg:block"
            aria-hidden="true"
          >
            <div className="absolute -inset-8 rounded-full border border-white/[0.06]" />
            <div className="absolute -inset-16 rounded-full border border-white/[0.04]" />
            <div className="relative rotate-[-2deg] rounded-[28px] border border-white/15 bg-white/[0.09] p-5 shadow-2xl backdrop-blur-md [animation:float_5s_ease-in-out_infinite]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold tracking-[0.2em] text-blue-100/45 uppercase">
                    Candidate profile
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold">01000001</p>
                </div>
                <span className="rounded-full bg-brand-300/15 px-2.5 py-1 text-[9px] font-bold text-brand-200">
                  VERIFIED
                </span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  ["TOÁN", "8.4"],
                  ["VĂN", "6.75"],
                  ["ANH", "8.0"],
                ].map(([subject, score]) => (
                  <div key={subject} className="rounded-2xl bg-black/15 p-3">
                    <p className="text-[8px] font-bold text-blue-100/40">
                      {subject}
                    </p>
                    <p className="mt-2 font-mono text-xl font-bold text-white">
                      {score}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-brand-400 p-4 text-blue-950">
                <TrendingUp className="size-5" />
                <div className="flex-1">
                  <p className="text-[9px] font-bold uppercase opacity-60">
                    Khối A
                  </p>
                  <p className="text-sm font-extrabold">Nhóm điểm khá</p>
                </div>
                <span className="font-mono text-xl font-bold">19.65</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="Thông tin dữ liệu"
        className="grid gap-3 sm:grid-cols-3"
      >
        {metrics.map(({ icon: Icon, ...metric }) => (
          <div
            key={metric.label}
            className="group flex items-center gap-4 rounded-[22px] border border-slate-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-950/5 sm:p-5"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-brand-700 transition-colors group-hover:bg-brand-400 group-hover:text-blue-950">
              <Icon className="size-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <strong className="block font-mono text-xl font-bold tracking-[-0.04em] text-[#11162f] sm:text-2xl">
                {metric.value}
              </strong>
              <span className="block truncate text-xs font-bold text-slate-600">
                {metric.label}
              </span>
            </div>
            <span className="ml-auto hidden text-[9px] font-bold tracking-wider text-slate-400 uppercase xl:block">
              {metric.note}
            </span>
          </div>
        ))}
      </section>

      <section aria-labelledby="features-title" className="pt-2">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.2em] text-brand-700 uppercase">
              <span className="h-px w-6 bg-brand-500" /> Khám phá dữ liệu
            </p>
            <h2
              id="features-title"
              className="mt-3 text-2xl font-extrabold tracking-[-0.04em] text-[#11162f] sm:text-3xl"
            >
              Bắt đầu với một góc nhìn.
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-xs leading-5 text-slate-500 sm:block">
            Ba công cụ, một bộ dữ liệu — được thiết kế để tìm câu trả lời thật
            nhanh.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {shortcuts.map(({ icon: Icon, ...item }) => (
            <Link
              key={item.to}
              to={item.to}
              className="group relative overflow-hidden rounded-[26px] border border-slate-200/70 bg-white p-6 shadow-[0_10px_35px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_45px_rgba(15,23,42,0.09)] focus-visible:outline-2"
            >
              <span className="absolute top-5 right-5 font-mono text-[10px] font-bold text-slate-300">
                /{item.number}
              </span>
              <span
                className={`grid size-12 place-items-center rounded-2xl ${item.accent}`}
              >
                <Icon className="size-5" strokeWidth={2.2} aria-hidden="true" />
              </span>
              <h3 className="mt-8 text-lg font-extrabold tracking-[-0.025em] text-[#11162f]">
                {item.title}
              </h3>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                {item.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-brand-700">
                Khám phá{" "}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
