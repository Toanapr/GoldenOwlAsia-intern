import { useQuery } from "@tanstack/react-query";
import { Award, Crown, Medal, Sparkles, Trophy } from "lucide-react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/ui/AsyncState";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { getTopGroupA } from "../lib/api/reports";
import type { GroupAStudent } from "../lib/api/types";

const scoreFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 2,
});

const podiumStyles = {
  1: { className: "bg-amber-300 text-amber-950 ring-amber-300", icon: Trophy },
  2: { className: "bg-slate-100 text-slate-600 ring-slate-200", icon: Medal },
  3: { className: "bg-orange-50 text-orange-700 ring-orange-200", icon: Award },
} as const;

function Position({ position }: { position: number }) {
  const podium = podiumStyles[position as keyof typeof podiumStyles];
  if (!podium) {
    return (
      <span className="font-semibold tabular-nums text-slate-500">
        {position}
      </span>
    );
  }
  const Icon = podium.icon;
  return (
    <span
      className={`inline-flex size-8 items-center justify-center rounded-full ring-1 ${podium.className}`}
      aria-label={`Hạng ${position}`}
    >
      <Icon className="size-4" aria-hidden="true" />
    </span>
  );
}

function RankingTable({ students }: { students: GroupAStudent[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <caption className="sr-only">Top 10 thí sinh khối A</caption>
          <thead className="sticky top-0 z-10 bg-[#0b1026] text-[10px] font-extrabold tracking-[0.12em] text-blue-50/60 uppercase">
            <tr>
              <th className="w-20 px-5 py-3.5 text-center">Hạng</th>
              <th className="px-5 py-3.5">Số báo danh</th>
              <th className="px-5 py-3.5 text-right">Toán</th>
              <th className="px-5 py-3.5 text-right">Vật lý</th>
              <th className="px-5 py-3.5 text-right">Hóa học</th>
              <th className="px-5 py-3.5 text-right">Tổng điểm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
              <tr
                key={student.registrationNumber}
                className={
                  student.position <= 3
                    ? "bg-amber-50/25 hover:bg-amber-50/60"
                    : "hover:bg-blue-50/50"
                }
              >
                <td className="px-5 py-4 text-center">
                  <Position position={student.position} />
                </td>
                <th
                  scope="row"
                  className="px-5 py-4 font-mono font-bold tracking-wider text-slate-900"
                >
                  {student.registrationNumber}
                </th>
                <td className="px-5 py-4 text-right tabular-nums text-slate-600">
                  {scoreFormatter.format(student.math)}
                </td>
                <td className="px-5 py-4 text-right tabular-nums text-slate-600">
                  {scoreFormatter.format(student.physics)}
                </td>
                <td className="px-5 py-4 text-right tabular-nums text-slate-600">
                  {scoreFormatter.format(student.chemistry)}
                </td>
                <td className="px-5 py-4 text-right font-mono text-base font-extrabold tabular-nums text-brand-700">
                  {scoreFormatter.format(student.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function TopStudentsPage() {
  const query = useQuery({ queryKey: ["top-group-a"], queryFn: getTopGroupA });
  const students = query.data?.data.students ?? [];

  return (
    <div className="space-y-8">
      <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
        <PageHeader
          eyebrow="Xếp hạng / 04"
          title="Bảng vàng khối A."
          description="Xếp hạng theo tổng điểm Toán, Vật lý và Hóa học. Các tiêu chí phụ được áp dụng để kết quả luôn ổn định."
        />
        <div className="hidden items-center gap-3 rounded-2xl bg-amber-300 px-4 py-3 text-amber-950 lg:flex">
          <Crown className="size-5" aria-hidden="true" />
          <div>
            <p className="font-mono text-base font-extrabold">30.00 MAX</p>
            <p className="text-[9px] font-extrabold tracking-wider uppercase opacity-60">
              Group A benchmark
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-[10px] font-extrabold tracking-wide text-slate-500 uppercase">
        {["Đủ 3 môn", "Tổng điểm giảm dần", "SBD tăng dần khi đồng điểm"].map(
          (rule) => (
            <span
              key={rule}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm"
            >
              <Sparkles className="size-3 text-brand-600" aria-hidden="true" />{" "}
              {rule}
            </span>
          ),
        )}
      </div>

      {query.isPending && <LoadingState label="Đang tải bảng xếp hạng" />}
      {query.isError && (
        <ErrorState
          message={query.error.message}
          onRetry={() => void query.refetch()}
        />
      )}
      {query.isSuccess && students.length === 0 && (
        <EmptyState
          title="Chưa có bảng xếp hạng"
          message="Chưa có thí sinh đủ điểm ba môn khối A."
        />
      )}
      {query.isSuccess && students.length > 0 && (
        <>
          <section
            aria-label="Ba thí sinh dẫn đầu"
            className="grid gap-3 md:grid-cols-3"
          >
            {students.slice(0, 3).map((student, index) => {
              const Icon = index === 0 ? Trophy : index === 1 ? Medal : Award;
              const tones = [
                "bg-[#0b1026] text-white",
                "bg-white text-[#11162f]",
                "bg-white text-[#11162f]",
              ];
              return (
                <div
                  key={student.registrationNumber}
                  className={`relative overflow-hidden rounded-[24px] border border-slate-200/70 p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] ${tones[index]}`}
                >
                  {index === 0 && (
                    <div className="absolute -top-16 -right-12 size-36 rounded-full bg-amber-300/20 blur-2xl" />
                  )}
                  <div className="relative flex items-center justify-between">
                    <span
                      className={`grid size-10 place-items-center rounded-2xl ${index === 0 ? "bg-amber-300 text-amber-950" : index === 1 ? "bg-slate-100 text-slate-600" : "bg-orange-50 text-orange-700"}`}
                    >
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[10px] font-bold opacity-40">
                      RANK / 0{student.position}
                    </span>
                  </div>
                  <p className="relative mt-6 font-mono text-sm font-bold tracking-wider opacity-70">
                    {student.registrationNumber}
                  </p>
                  <div className="relative mt-2 flex items-end justify-between">
                    <p className="font-mono text-3xl font-extrabold tracking-[-0.06em]">
                      {scoreFormatter.format(student.total)}
                    </p>
                    <p className="pb-1 text-[9px] font-bold tracking-wider uppercase opacity-45">
                      Tổng điểm
                    </p>
                  </div>
                </div>
              );
            })}
          </section>
          <RankingTable students={students} />
        </>
      )}
    </div>
  );
}
