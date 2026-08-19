import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/ui/AsyncState";
import { Activity, Layers3 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { getScoreDistribution } from "../lib/api/reports";
import type {
  DistributionBandKey,
  SubjectDistribution,
} from "../lib/api/types";

const numberFormatter = new Intl.NumberFormat("vi-VN");
const compactFormatter = new Intl.NumberFormat("vi-VN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const bands = [
  { key: "gte_8", label: "Từ 8 điểm", color: "#3b82f6" },
  { key: "gte_6_lt_8", label: "Từ 6 đến dưới 8", color: "#6366f1" },
  { key: "gte_4_lt_6", label: "Từ 4 đến dưới 6", color: "#f59e0b" },
  { key: "lt_4", label: "Dưới 4 điểm", color: "#f43f5e" },
] as const satisfies readonly {
  key: DistributionBandKey;
  label: string;
  color: string;
}[];

function toChartRow(subject: SubjectDistribution) {
  const counts = Object.fromEntries(
    subject.bands.map((band) => [band.key, band.count]),
  ) as Record<DistributionBandKey, number>;
  return {
    subjectName: subject.subjectName,
    totalWithScore: subject.totalWithScore,
    ...counts,
  };
}

interface TooltipEntry {
  key: string;
  value: number;
}

function DistributionTooltip({
  active,
  label,
  entries,
}: {
  active?: boolean;
  label?: string;
  entries: TooltipEntry[];
}) {
  if (!active || entries.length === 0) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-blue-950/10">
      <p className="text-sm font-bold text-slate-950">{label}</p>
      <div className="mt-2 space-y-1.5">
        {entries.map((entry) => {
          const band = bands.find((item) => item.key === entry.key);
          return (
            <div
              key={entry.key}
              className="flex items-center justify-between gap-6 text-xs"
            >
              <span className="flex items-center gap-2 text-slate-600">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: band?.color }}
                />
                {band?.label}
              </span>
              <strong className="tabular-nums text-slate-950">
                {numberFormatter.format(entry.value)}
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DistributionTable({ subjects }: { subjects: SubjectDistribution[] }) {
  return (
    <details className="mt-6 border-t border-slate-100 pt-5">
      <summary className="cursor-pointer text-sm font-extrabold text-brand-700 focus-visible:outline-2">
        Xem bảng số liệu chi tiết
      </summary>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">Bảng phân bố điểm theo chín môn</caption>
          <thead className="bg-[#0b1026] text-[10px] font-extrabold tracking-wider text-blue-50/70 uppercase">
            <tr>
              <th className="px-4 py-3">Môn</th>
              {bands.map((band) => (
                <th key={band.key} className="px-4 py-3 text-right">
                  {band.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Có điểm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subjects.map((subject) => (
              <tr
                key={subject.subjectCode}
                className="transition-colors hover:bg-blue-50/50"
              >
                <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-800">
                  {subject.subjectName}
                </th>
                {bands.map((band) => (
                  <td
                    key={band.key}
                    className="px-4 py-3 text-right tabular-nums text-slate-600"
                  >
                    {numberFormatter.format(
                      subject.bands.find((item) => item.key === band.key)
                        ?.count ?? 0,
                    )}
                  </td>
                ))}
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-900">
                  {numberFormatter.format(subject.totalWithScore)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function ReportsPage() {
  const query = useQuery({
    queryKey: ["score-distribution"],
    queryFn: getScoreDistribution,
  });
  const subjects = query.data?.data.subjects ?? [];
  const chartData = subjects.map(toChartRow);

  return (
    <div className="space-y-8">
      <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
        <PageHeader
          eyebrow="Báo cáo / 03"
          title="Dữ liệu kể câu chuyện gì?"
          description="Mỗi thanh thể hiện số thí sinh trong bốn khoảng điểm. Di chuột hoặc chạm để xem số lượng chính xác."
        />
        <div className="hidden gap-3 lg:flex">
          <span className="grid size-12 place-items-center rounded-2xl border border-indigo-200 bg-indigo-50 text-indigo-600">
            <Layers3 className="size-5" />
          </span>
          <div>
            <p className="font-mono text-lg font-bold text-[#11162f]">
              4 bands
            </p>
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Score segmentation
            </p>
          </div>
        </div>
      </div>

      {query.isPending && <LoadingState label="Đang tải phổ điểm" />}
      {query.isError && (
        <ErrorState
          message={query.error.message}
          onRetry={() => void query.refetch()}
        />
      )}
      {query.isSuccess && subjects.length === 0 && (
        <EmptyState
          title="Chưa có dữ liệu phổ điểm"
          message="Hãy import dữ liệu và thử lại."
        />
      )}
      {query.isSuccess && subjects.length > 0 && (
        <Card className="overflow-hidden p-0">
          <div className="flex flex-col gap-5 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-brand-700">
                <Activity className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-[#11162f]">
                  Phân bổ theo khoảng điểm
                </h2>
                <p className="text-[10px] font-semibold text-slate-400">
                  9 môn thi · dữ liệu toàn quốc
                </p>
              </div>
            </div>
            <div
              className="flex flex-wrap gap-x-4 gap-y-2"
              aria-label="Chú giải khoảng điểm"
            >
              {bands.map((band) => (
                <span
                  key={band.key}
                  className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-500"
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: band.color }}
                    aria-hidden="true"
                  />
                  {band.label}
                </span>
              ))}
            </div>
          </div>

          <div
            className="h-[540px] w-full min-w-0 px-2 py-6 sm:px-5"
            aria-label="Biểu đồ phân bố điểm"
            role="img"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 8, right: 12, bottom: 8, left: 8 }}
              >
                <CartesianGrid
                  stroke="#e8eeeb"
                  horizontal={false}
                  strokeDasharray="4 4"
                />
                <XAxis
                  type="number"
                  tickFormatter={(value: number) =>
                    compactFormatter.format(value)
                  }
                  tick={{
                    fill: "#7b8b84",
                    fontSize: 10,
                    fontFamily: "JetBrains Mono Variable",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="subjectName"
                  width={92}
                  tick={{ fill: "#30483f", fontSize: 11, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f0fdf7" }}
                  content={(props) => (
                    <DistributionTooltip
                      active={props.active}
                      label={String(props.label ?? "")}
                      entries={(props.payload ?? []).map((entry) => ({
                        key: String(entry.dataKey),
                        value: Number(entry.value),
                      }))}
                    />
                  )}
                />
                {bands.map((band, index) => (
                  <Bar
                    key={band.key}
                    dataKey={band.key}
                    stackId="scores"
                    fill={band.color}
                    radius={index === bands.length - 1 ? [0, 6, 6, 0] : 0}
                    isAnimationActive
                    animationDuration={700}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="px-5 pb-6 sm:px-7">
            <DistributionTable subjects={subjects} />
          </div>
        </Card>
      )}
    </div>
  );
}
