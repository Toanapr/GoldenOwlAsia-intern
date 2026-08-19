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
  { key: "gte_8", label: "Từ 8 điểm", color: "#2563eb" },
  { key: "gte_6_lt_8", label: "Từ 6 đến dưới 8", color: "#14b8a6" },
  { key: "gte_4_lt_6", label: "Từ 4 đến dưới 6", color: "#f59e0b" },
  { key: "lt_4", label: "Dưới 4 điểm", color: "#f97316" },
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
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
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
    <details className="mt-5 border-t border-slate-100 pt-4">
      <summary className="cursor-pointer text-sm font-semibold text-brand-700 focus-visible:outline-2">
        Xem bảng số liệu chi tiết
      </summary>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">Bảng phân bố điểm theo chín môn</caption>
          <thead className="bg-slate-50 text-xs font-bold text-slate-600">
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
              <tr key={subject.subjectCode}>
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
    <div className="space-y-7">
      <PageHeader
        eyebrow="Báo cáo"
        title="Phân bố điểm theo môn"
        description="Mỗi thanh thể hiện số thí sinh trong bốn khoảng điểm. Di chuột hoặc chạm để xem số lượng chính xác."
      />

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
        <Card className="p-4 sm:p-6">
          <div
            className="flex flex-wrap gap-x-5 gap-y-2"
            aria-label="Chú giải khoảng điểm"
          >
            {bands.map((band) => (
              <span
                key={band.key}
                className="inline-flex items-center gap-2 text-xs font-medium text-slate-600"
              >
                <span
                  className="size-2.5 rounded-sm"
                  style={{ backgroundColor: band.color }}
                  aria-hidden="true"
                />
                {band.label}
              </span>
            ))}
          </div>

          <div
            className="mt-5 h-[520px] w-full min-w-0"
            aria-label="Biểu đồ phân bố điểm"
            role="img"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 8, right: 12, bottom: 8, left: 8 }}
              >
                <CartesianGrid stroke="#e2e8f0" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(value: number) =>
                    compactFormatter.format(value)
                  }
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="subjectName"
                  width={92}
                  tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
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
                    radius={index === bands.length - 1 ? [0, 4, 4, 0] : 0}
                    isAnimationActive={false}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <DistributionTable subjects={subjects} />
        </Card>
      )}
    </div>
  );
}
