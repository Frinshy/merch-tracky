import { Card } from "@heroui/react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemGallery } from "@/components/item-gallery";
import MerchItems from "@/data/merch-items.json";

export default async function Item({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = MerchItems.MerchItems.find((merchItem) => merchItem.id === id);

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full">
      <nav aria-label="Item navigation" className="mb-4">
        <Link
          className="group inline-flex items-center gap-2 rounded-md px-1 py-1 text-sm font-medium text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          href="/items"
        >
          <span
            aria-hidden="true"
            className="text-base transition-transform group-hover:-translate-x-0.5"
          >
            &#8592;
          </span>
          Back to search
        </Link>
      </nav>
      <div className="grid w-full gap-6 rounded-lg border border-separator bg-surface p-4 shadow-sm sm:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:items-start lg:gap-10">
        <ItemGallery item={item} />
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-3 border-b border-separator pb-6">
            {/* <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Item details
            </p> */}
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {item.name}
            </h1>
            <p className="max-w-prose text-sm leading-6 text-muted-foreground">
              {item.description}
            </p>
          </div>
          {/* <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Inventory snapshot</h2>
            <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
              Active
            </span>
          </div> */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ItemInfoCard label="Type" text={item.type} />
            <ItemInfoCard label="Era" text={item.era} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemInfoCard({ label, text }: { label: string; text: string }) {
  return (
    <Card className="border border-separator bg-surface-secondary p-4 shadow-none transition hover:border-accent/50">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
        {text}
      </p>
    </Card>
  );
}
