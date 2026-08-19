import { useQuery } from "@tanstack/react-query";
import { Award, Medal, Trophy } from "lucide-react";
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
      <PageHeader
        eyebrow="Xếp hạng"
        title="Top 10 thí sinh khối A"
        description="Xếp hạng theo tổng điểm Toán, Vật lý và Hóa học. Các tiêu chí phụ được áp dụng để kết quả luôn ổn định."
      />

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-y border-slate-200 py-3 text-[11px] font-semibold text-slate-500">
        {["Đủ 3 môn", "Tổng điểm giảm dần", "SBD tăng dần khi đồng điểm"].map(
          (rule) => (
            <span key={rule} className="inline-flex items-center gap-1.5">
              <span className="size-1 bg-[#c33149]" aria-hidden="true" /> {rule}
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
        <RankingTable students={students} />
      )}
    </div>
  );
}
