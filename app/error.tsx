"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-start gap-4 py-24">
      <p className="label-caps text-muted">Error</p>
      <h1 className="font-display text-5xl">Something went wrong.</h1>
      <div className="flex gap-3">
        <button
          className="rounded-md bg-foreground px-4 py-2 text-sm text-background"
          onClick={() => reset()}
        >
          Try again
        </button>
        <Link
          className="rounded-md border border-separator px-4 py-2 text-sm"
          href="/"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
