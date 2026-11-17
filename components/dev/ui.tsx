import clsx from "clsx";

/** Shared form primitives for the /dev admin pages. */

export const inputClass =
  "h-10 w-full rounded-md border border-separator bg-surface px-3 text-sm outline-none transition placeholder:text-muted focus:border-foreground/50";

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label className={clsx("flex flex-col gap-1.5", className)}>
      <span className="label-caps text-muted">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  return (
    <button
      className={clsx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-foreground text-background hover:opacity-90",
        variant === "secondary" &&
          "border border-separator hover:border-foreground/40",
        variant === "danger" && "text-danger hover:bg-danger/10",
        variant === "ghost" && "text-muted hover:text-foreground",
        className,
      )}
      type="button"
      {...props}
    />
  );
}

export function Notice({
  tone,
  children,
}: {
  tone: "success" | "error";
  children: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "rounded-md border px-4 py-3 text-sm",
        tone === "success"
          ? "border-success/40 bg-success/10"
          : "border-danger/40 bg-danger/10",
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
