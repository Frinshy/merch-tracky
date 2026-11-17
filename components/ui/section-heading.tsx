import { TextLink } from "./text-link";

/** Small uppercase eyebrow, display-font title and an optional link or controls. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: { href: string; label: string };
  /** Controls shown on the right instead of (or next to) the link. */
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-separator pb-4">
      <div className="flex flex-col gap-1">
        {eyebrow && <p className="label-caps text-muted">{eyebrow}</p>}
        <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
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
