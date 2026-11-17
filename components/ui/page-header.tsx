import { TextLink } from "./text-link";

/**
 * The top of every page: optional back link, eyebrow, display title,
 * description and actions. Keeps page titles the same size everywhere.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  back,
  actions,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex max-w-3xl flex-col gap-3">
        {back && (
          <TextLink arrow="back" className="label-caps" href={back.href}>
            {back.label}
          </TextLink>
        )}
        {eyebrow && <p className="label-caps text-muted">{eyebrow}</p>}
        <h1 className="type-display text-balance text-6xl leading-[0.85] sm:text-8xl">{title}</h1>
        {description && <p className="max-w-xl text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
