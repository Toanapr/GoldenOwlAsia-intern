import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="border-t-4 border-accent bg-white"
    >
      <div className="grid border-x border-b border-slate-200 lg:grid-cols-[1fr_310px]">
        <div className="px-6 py-10 sm:px-9 sm:py-12 lg:px-12 lg:py-16">
          <h1
            id="not-found-title"
            className="mt-5 max-w-2xl text-4xl leading-[1.08] font-bold tracking-[-0.035em] text-foreground sm:text-5xl"
          >
            Không tìm thấy trang
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">
            Đường dẫn bạn vừa truy cập không tồn tại hoặc đã được thay đổi.
            Hãy quay về trang tổng quan để tiếp tục tra cứu.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex min-h-11 items-center gap-3 rounded-lg bg-accent px-6 py-3 text-base font-bold text-white transition-colors duration-200 hover:bg-brand-800 focus-visible:outline-2"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Về trang tổng quan
          </Link>
        </div>

        <div
          aria-hidden="true"
          className="grid min-h-44 place-items-center border-t border-slate-200 bg-muted px-6 py-10 lg:min-h-full lg:border-t-0 lg:border-l"
        >
          <span className="font-mono text-7xl font-bold tracking-[-0.06em] text-slate-300 tabular-nums sm:text-8xl">
            404
          </span>
        </div>
      </div>
    </section>
  );
}
