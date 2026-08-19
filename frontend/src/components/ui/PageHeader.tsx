interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="border-t-4 border-brand-700 pt-5">
      <p className="text-[11px] font-bold tracking-[0.12em] text-brand-700 uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-[-0.035em] text-slate-950 sm:text-5xl sm:leading-[1.08]">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-[15px]">
        {description}
      </p>
    </header>
  );
}
