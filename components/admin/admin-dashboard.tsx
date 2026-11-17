import { ButtonLink } from "@/components/ui/button-link";
import type { Era, MerchItem } from "@/lib/catalog/types";

import { EraEditor } from "./era-editor";
import { ItemTable } from "./item-table";

export function AdminDashboard({ items, eras }: { items: MerchItem[]; eras: Era[] }) {
  const sortedEras = [...eras].sort((a, b) => a.year - b.year);

  return (
    <div className="flex flex-col gap-14">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps text-muted">Local only · not deployed</p>
          <h1 className="font-display text-5xl">Admin</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Changes are written to <code>data/</code> and <code>public/items/</code>. Commit and
            push to publish them.
          </p>
        </div>
        <ButtonLink href="/dev/items/new">+ Add item</ButtonLink>
      </header>

      <ItemTable eras={eras} items={items} />

      <section className="flex scroll-mt-20 flex-col gap-4" id="eras">
        <div>
          <h2 className="font-display text-3xl">Eras ({eras.length})</h2>
          <p className="text-sm text-muted">
            Era URLs never change once created, so links to them stay valid.
          </p>
        </div>
        {sortedEras.map((era) => {
          const eraItems = items.filter((i) => i.era === era.slug);
          const photos = Array.from(new Set(eraItems.flatMap((i) => i.images.map((x) => x.src))));
          // Keyed on the saved values so the editor remounts fresh after saving.
          const key = JSON.stringify(era);

          return <EraEditor key={key} era={era} itemCount={eraItems.length} itemPhotos={photos} />;
        })}
        <EraEditor />
      </section>
    </div>
  );
}
