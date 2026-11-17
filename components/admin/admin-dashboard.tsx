import { PlusIcon } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Era, MerchItem } from "@/lib/catalog/types";

import { EraEditor } from "./era-editor";
import { ItemTable } from "./item-table";

export function AdminDashboard({ items, eras }: { items: MerchItem[]; eras: Era[] }) {
  const sortedEras = [...eras].sort((a, b) => a.year - b.year);

  return (
    <div className="flex flex-col gap-14">
      <PageHeader
        actions={
          <ButtonLink href="/dev/items/new">
            <PlusIcon size={16} />
            Add item
          </ButtonLink>
        }
        description={
          <>
            Changes are written to <code>data/</code> and <code>public/items/</code>. Commit and
            push to publish them.
          </>
        }
        eyebrow="Local only · not deployed"
        title="Admin"
      />

      <ItemTable eras={eras} items={items} />

      <section className="flex scroll-mt-20 flex-col gap-4" id="eras">
        <SectionHeading
          description="Era URLs never change once created, so links to them stay valid."
          eyebrow={`${eras.length} eras`}
          title="Eras"
        />
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
