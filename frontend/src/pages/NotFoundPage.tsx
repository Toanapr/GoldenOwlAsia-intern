import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";

export function NotFoundPage() {
  return (
    <Card className="p-10 text-center">
      <p className="text-6xl font-black tracking-tight text-brand-100">404</p>
      <h1 className="mt-3 text-2xl font-bold text-slate-950">
        Không tìm thấy trang
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Đường dẫn này không tồn tại hoặc đã được thay đổi.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700 focus-visible:outline-2"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Về trang tổng quan
      </Link>
    </Card>
  );
}
