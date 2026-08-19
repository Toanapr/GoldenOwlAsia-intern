interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="border-t-4 border-accent pt-5">
      <p className="text-xs font-bold tracking-[0.12em] text-accent uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-[-0.025em] text-foreground sm:text-5xl sm:leading-[1.08]">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
        {description}
      </p>
    </header>
  );
}
