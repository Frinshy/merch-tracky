/** A label + big number pair. Render inside a <dl>. */
export function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col-reverse">
      <dt className="label-caps text-muted">{label}</dt>
      <dd className="type-display text-4xl leading-none">{value}</dd>
    </div>
  );
}
