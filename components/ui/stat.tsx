/** A label + big number pair. Render inside a <dl>. */
export function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="label-caps opacity-70">{label}</dt>
      <dd className="font-display text-3xl">{value}</dd>
    </div>
  );
}
