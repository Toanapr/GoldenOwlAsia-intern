import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import { Card } from "./Card";

export function LoadingState({
  label = "Đang tải dữ liệu",
}: {
  label?: string;
}) {
  return (
    <Card className="p-6" role="status" aria-label={label}>
      <span className="sr-only">{label}</span>
      <div className="animate-pulse space-y-4" aria-hidden="true">
        <div className="h-5 w-44 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-4/5 rounded bg-slate-100" />
        <div className="h-28 rounded-xl bg-slate-100" />
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
      className="border-rose-200 bg-rose-50/60 p-6 text-center"
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
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-2"
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
    <Card className="border-dashed p-8 text-center">
      <Inbox className="mx-auto size-8 text-slate-400" aria-hidden="true" />
      <h2 className="mt-3 font-semibold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{message}</p>
    </Card>
  );
}
