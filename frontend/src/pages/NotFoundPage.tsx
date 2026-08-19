import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";

export function NotFoundPage() {
  return (
    <Card className="relative overflow-hidden bg-[#0b1026] p-10 text-center text-white sm:p-16">
      <div className="absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-brand-400/20 blur-3xl" />
      <p className="relative font-mono text-7xl font-extrabold tracking-[-0.08em] text-brand-300">
        404
      </p>
      <h1 className="relative mt-3 text-2xl font-extrabold text-white">
        Không tìm thấy trang
      </h1>
      <p className="relative mt-2 text-sm text-blue-50/60">
        Đường dẫn này không tồn tại hoặc đã được thay đổi.
      </p>
      <Link
        to="/"
        className="relative mt-7 inline-flex items-center gap-2 rounded-2xl bg-brand-400 px-5 py-3 text-sm font-extrabold text-blue-950 transition hover:-translate-y-0.5 hover:bg-brand-300 focus-visible:outline-2"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Về trang tổng quan
      </Link>
    </Card>
  );
}
