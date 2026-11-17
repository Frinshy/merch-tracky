"use client";

import { Button } from "@heroui/react";
import { useEffect } from "react";

import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";

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
    <div className="flex flex-col items-start gap-6 py-24">
      <PageHeader
        description="The page failed to load. Try again, or head back home."
        eyebrow="Error"
        title="Something went wrong."
      />
      <div className="flex gap-2">
        <Button onPress={reset}>Try again</Button>
        <ButtonLink href="/" variant="secondary">
          Go home
        </ButtonLink>
      </div>
    </div>
  );
}
