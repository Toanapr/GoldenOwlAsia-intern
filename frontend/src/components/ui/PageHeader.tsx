interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="relative">
      <p className="flex items-center gap-2 text-[11px] font-extrabold tracking-[0.2em] text-brand-700 uppercase">
        <span className="h-px w-7 bg-brand-500" aria-hidden="true" /> {eyebrow}
      </p>
      <h1 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-[-0.045em] text-[#11162f] sm:text-5xl sm:leading-[1.08]">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-[15px]">
        {description}
      </p>
    </header>
  );
}
