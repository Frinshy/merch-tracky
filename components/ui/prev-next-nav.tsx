import NextLink from "next/link";

type Target = { href: string; label: string };

/** "← Previous / Next →" links at the end of a page. */
export function PrevNextNav({
  prev,
  next,
  label,
  prevCaption = "Previous",
  nextCaption = "Next",
  large = false,
}: {
  prev?: Target;
  next?: Target;
  label: string;
  prevCaption?: string;
  nextCaption?: string;
  large?: boolean;
}) {
  if (!prev && !next) return null;
  const title = large ? "font-display text-2xl text-foreground" : "line-clamp-1 text-foreground";

  return (
    <nav aria-label={label} className="grid grid-cols-2 gap-4 text-sm">
      {prev ? (
        <NextLink className="text-muted hover:text-foreground" href={prev.href}>
          <span className="label-caps block">← {prevCaption}</span>
          <span className={title}>{prev.label}</span>
        </NextLink>
      ) : (
        <span />
      )}
      {next && (
        <NextLink className="text-right text-muted hover:text-foreground" href={next.href}>
          <span className="label-caps block">{nextCaption} →</span>
          <span className={title}>{next.label}</span>
        </NextLink>
      )}
    </nav>
  );
}
