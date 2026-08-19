import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";

export function NotFoundPage() {
  return (
    <Card className="border-t-4 border-t-accent p-10 text-center sm:p-16">
      <p className="font-mono text-7xl font-extrabold tracking-[-0.08em] text-slate-200">
        404
      </p>
      <h1 className="mt-3 text-2xl font-extrabold text-slate-950">
        Không tìm thấy trang
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Đường dẫn này không tồn tại hoặc đã được thay đổi.
      </p>
      <Link
        to="/"
        className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg bg-accent px-5 py-3 text-base font-bold text-white transition-colors duration-200 hover:bg-brand-800 focus-visible:outline-2"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Về trang tổng quan
      </Link>
    </Card>
  );
}
