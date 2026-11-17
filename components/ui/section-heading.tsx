import { TextLink } from "./text-link";

/** Display-type title over a heavy print rule, with an optional count and link or controls. */
export function SectionHeading({
  eyebrow,
  title,
  count,
  description,
  action,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  /** Shown next to the title, e.g. "4 items". */
  count?: React.ReactNode;
  description?: React.ReactNode;
  action?: { href: string; label: string };
  /** Controls shown on the right instead of (or next to) the link. */
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-foreground pb-3">
      <div className="flex flex-col gap-1">
        {eyebrow && <p className="label-caps text-muted">{eyebrow}</p>}
        <h2 className="flex items-start gap-2 text-4xl sm:text-5xl">
          <span className="type-display leading-[0.85]">{title}</span>
          {count && <span className="label-caps mt-1 text-muted">{count}</span>}
        </h2>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      {(action || children) && (
        <div className="flex shrink-0 items-center gap-3">
          {children}
          {action && (
            <TextLink arrow="forward" className="text-sm" href={action.href}>
              {action.label}
            </TextLink>
          )}
        </div>
      )}
    </div>
  );
}
