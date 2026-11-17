import { EmptyState } from "@heroui/react";

/** Centered "nothing here" message with an optional action. */
export function EmptyMessage({
  title,
  description,
  action,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <EmptyState className="flex flex-col items-center gap-2 py-20 text-center">
      <p className="type-display text-3xl text-foreground">{title}</p>
      {description && <p>{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </EmptyState>
  );
}
