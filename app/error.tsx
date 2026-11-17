"use client";

import { Button } from "@heroui/react";
import { useEffect } from "react";

import { ButtonLink } from "@/components/ui/button-link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
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
        <Button onPress={reset}>Try again</Button>
        <ButtonLink href="/" variant="secondary">
          Go home
        </ButtonLink>
      </div>
    </div>
  );
}
