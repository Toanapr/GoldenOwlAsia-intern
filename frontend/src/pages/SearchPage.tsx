import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search, SearchX } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { ErrorState, LoadingState } from "../components/ui/AsyncState";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { ApiError } from "../lib/api/client";
import { getScore } from "../lib/api/scores";
import type { ScoreLookupData } from "../lib/api/types";

const REGISTRATION_NUMBER_PATTERN = /^\d{8}$/;

function ScoreResult({ result }: { result: ScoreLookupData }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [result.registrationNumber]);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-5 sm:flex sm:items-center sm:justify-between sm:px-7">
        <div>
          <p className="text-[10px] font-bold tracking-[0.12em] text-slate-500 uppercase">
            Kết quả điểm thi
          </p>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="mt-2 font-mono text-2xl font-bold tracking-wider text-slate-950 focus:outline-none"
          >
            {result.registrationNumber}
          </h2>
        </div>
        {result.foreignLanguageCode && (
          <span className="mt-3 inline-flex border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 sm:mt-0">
            Ngoại ngữ: {result.foreignLanguageCode}
          </span>
        )}
      </div>
      <dl className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-3">
        {result.scores.map((subject) => (
          <div
            key={subject.subjectCode}
            className="bg-white px-4 py-5 transition-colors hover:bg-blue-50/50 sm:px-7 sm:py-6"
          >
            <dt className="text-[10px] font-extrabold tracking-[0.12em] text-slate-400 uppercase">
              {subject.subjectName}
            </dt>
            <dd className="mt-3 font-mono text-2xl font-bold tabular-nums text-[#11162f]">
              {subject.score === null ? (
                <span aria-label="Không có điểm" className="text-slate-300">
                  —
                </span>
              ) : (
                subject.score.toLocaleString("vi-VN", {
                  maximumFractionDigits: 2,
                })
              )}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function NotFoundState({ registrationNumber }: { registrationNumber: string }) {
  const alertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    alertRef.current?.focus();
  }, []);

  return (
    <Card
      ref={alertRef}
      tabIndex={-1}
      className="border-amber-200 bg-amber-50/70 p-10 text-center focus:outline-none"
      role="alert"
    >
      <SearchX className="mx-auto size-9 text-amber-600" aria-hidden="true" />
      <h2 className="mt-3 font-bold text-slate-950">Không tìm thấy kết quả</h2>
      <p className="mt-1 text-sm text-slate-600">
        Không có dữ liệu cho số báo danh <strong>{registrationNumber}</strong>.
        Hãy kiểm tra và thử lại.
      </p>
    </Card>
  );
}

export function SearchPage() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const valid = REGISTRATION_NUMBER_PATTERN.test(registrationNumber);

  const query = useQuery({
    queryKey: ["score", submittedNumber],
    queryFn: () => getScore(submittedNumber!),
    enabled: submittedNumber !== null,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (!valid) return;
    setSubmittedNumber(registrationNumber);
  }

  function handleChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    setRegistrationNumber(digits);
    setSubmittedNumber(null);
    if (touched) setTouched(true);
  }

  const notFound =
    query.error instanceof ApiError && query.error.code === "SCORE_NOT_FOUND";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tra cứu điểm"
        title="Tra cứu theo số báo danh"
        description="Nhập chính xác 8 chữ số trên giấy báo dự thi để xem kết quả đầy đủ của chín môn."
      />

      <Card className="p-5 sm:p-7">
        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="registration-number"
            className="text-[11px] font-extrabold tracking-[0.12em] text-slate-600 uppercase"
          >
            Số báo danh
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <div className="min-w-0 flex-1">
              <input
                id="registration-number"
                name="registrationNumber"
                inputMode="numeric"
                autoComplete="off"
                value={registrationNumber}
                onChange={(event) => handleChange(event.target.value)}
                onBlur={() => setTouched(true)}
                aria-describedby="registration-hint registration-error"
                aria-invalid={touched && !valid}
                placeholder="Ví dụ: 01000001"
                className="h-13 w-full border border-slate-300 bg-white px-4 font-mono text-lg font-semibold tracking-[0.12em] text-slate-950 placeholder:font-sans placeholder:text-sm placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-blue-100 focus:outline-none aria-invalid:border-rose-400"
              />
              <p
                id="registration-hint"
                className="mt-1.5 text-xs text-slate-500"
              >
                Chỉ gồm 8 chữ số, bao gồm cả số 0 ở đầu.
              </p>
              <p
                id="registration-error"
                className="mt-1 min-h-5 text-xs font-medium text-rose-600"
              >
                {touched && !valid ? "Số báo danh phải gồm đúng 8 chữ số." : ""}
              </p>
            </div>
            <button
              type="submit"
              disabled={!valid || query.isFetching}
              className="group inline-flex h-13 shrink-0 items-center justify-center gap-3 bg-brand-700 px-6 text-sm font-bold text-white transition-colors hover:bg-brand-800 focus-visible:outline-2 disabled:cursor-not-allowed disabled:bg-slate-300 sm:self-start"
            >
              <Search className="size-4" aria-hidden="true" />
              {query.isFetching ? "Đang tìm…" : "Tra cứu"}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          </div>
        </form>
      </Card>

      <section aria-live="polite" aria-label="Kết quả tra cứu">
        {!submittedNumber && (
          <Card className="border-dashed border-slate-300 bg-white/50 p-10 text-center sm:p-14">
            <span className="mx-auto grid size-12 place-items-center border border-slate-300 text-brand-700">
              <Search className="size-6" aria-hidden="true" />
            </span>
            <p className="mt-4 text-sm font-bold text-slate-600">
              Kết quả sẽ xuất hiện tại đây sau khi bạn tra cứu.
            </p>
          </Card>
        )}
        {submittedNumber && query.isPending && (
          <LoadingState label="Đang tra cứu điểm" />
        )}
        {submittedNumber && query.isError && notFound && (
          <NotFoundState registrationNumber={submittedNumber} />
        )}
        {submittedNumber && query.isError && !notFound && (
          <ErrorState
            message={query.error.message}
            onRetry={() => void query.refetch()}
          />
        )}
        {submittedNumber && query.data && (
          <ScoreResult result={query.data.data} />
        )}
      </section>
    </div>
  );
}
