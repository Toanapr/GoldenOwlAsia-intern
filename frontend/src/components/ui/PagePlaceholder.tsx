interface PagePlaceholderProps {
  description: string;
  eyebrow: string;
  title: string;
}

export function PagePlaceholder({
  description,
  eyebrow,
  title,
}: PagePlaceholderProps) {
  return (
    <section aria-labelledby="page-title">
      <p className="text-sm font-semibold tracking-wide text-brand-600 uppercase">
        {eyebrow}
      </p>
      <h1
        id="page-title"
        className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
      >
        {title}
      </h1>
      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
        <p className="max-w-2xl text-slate-600">{description}</p>
      </div>
    </section>
  );
}
