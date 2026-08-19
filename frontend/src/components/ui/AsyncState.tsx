import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import { Card } from "./Card";

export function LoadingState({
  label = "Đang tải dữ liệu",
}: {
  label?: string;
}) {
  return (
    <Card className="p-7" role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
      <div className="animate-pulse space-y-4" aria-hidden="true">
        <div className="h-5 w-44 rounded-lg bg-blue-100" />
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-4/5 rounded bg-slate-100" />
        <div className="h-28 rounded-2xl bg-slate-100" />
      </div>
    </Card>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card
      className="border-rose-200 bg-rose-50/70 p-8 text-center"
      role="alert"
    >
      <AlertCircle
        className="mx-auto size-8 text-rose-600"
        aria-hidden="true"
      />
      <h2 className="mt-3 font-semibold text-slate-950">
        Không thể tải dữ liệu
      </h2>
      <p className="mx-auto mt-1 max-w-lg text-sm text-slate-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0b1026] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-900 focus-visible:outline-2"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Thử lại
        </button>
      )}
    </Card>
  );
}

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Card className="border-dashed border-slate-300 p-10 text-center">
      <Inbox className="mx-auto size-8 text-slate-400" aria-hidden="true" />
      <h2 className="mt-3 font-semibold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{message}</p>
    </Card>
  );
}
