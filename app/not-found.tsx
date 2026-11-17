import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-24">
      <p className="label-caps text-muted">404</p>
      <h1 className="font-display text-5xl">Not in the archive.</h1>
      <p className="text-muted">
        This page doesn&apos;t exist, or the item was removed.
      </p>
      <Link
        className="rounded-md bg-foreground px-4 py-2 text-sm text-background"
        href="/items"
      >
        Browse the catalog
      </Link>
    </div>
  );
}
