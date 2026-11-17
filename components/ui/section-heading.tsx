import NextLink from "next/link";

/** Small uppercase eyebrow, display-font title and an optional link. */
export function SectionHeading({
  eyebrow,
  title,
  action,
  as: Heading = "h2",
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  action?: { href: string; label: string };
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-separator pb-4">
      <div>
        {eyebrow && <p className="label-caps text-muted">{eyebrow}</p>}
        <Heading className="mt-1 font-display text-3xl sm:text-4xl">{title}</Heading>
      </div>
      {action && (
        <NextLink
          className="shrink-0 text-sm text-muted transition-colors hover:text-foreground"
          href={action.href}
        >
          {action.label} <span aria-hidden="true">→</span>
        </NextLink>
      )}
    </div>
  );
}
