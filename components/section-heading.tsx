import Link from "next/link";

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-separator pb-4">
      <div>
        <p className="label-caps text-muted">{eyebrow}</p>
        <h2 className="mt-1 font-display text-3xl sm:text-4xl">{title}</h2>
      </div>
      {action && (
        <Link
          className="shrink-0 text-sm text-muted transition hover:text-foreground"
          href={action.href}
        >
          {action.label} <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
