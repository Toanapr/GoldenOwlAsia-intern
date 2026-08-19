import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";

export function NotFoundPage() {
  return (
    <Card className="border-t-4 border-t-brand-700 p-10 text-center sm:p-16">
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
        className="mt-7 inline-flex items-center gap-2 bg-brand-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-800 focus-visible:outline-2"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Về trang tổng quan
      </Link>
    </Card>
  );
}
