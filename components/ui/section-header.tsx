import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({ eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <header className={cn("space-y-2", className)}>
      {eyebrow ? <p className="text-xs uppercase tracking-[0.22em] text-rose-300/80">{eyebrow}</p> : null}
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-50">{title}</h2>
      {description ? <p className="max-w-sm text-sm leading-6 text-zinc-300">{description}</p> : null}
    </header>
  );
}
