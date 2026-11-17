"use client";

import { Button, SearchField, Table, toast } from "@heroui/react";
import { linkVariants } from "@heroui/styles";
import clsx from "clsx";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ButtonLink } from "@/components/ui/button-link";
import { EmptyMessage } from "@/components/ui/empty-message";
import { SectionHeading } from "@/components/ui/section-heading";
import { deleteItem } from "@/lib/admin/client";
import { newestFirst } from "@/lib/catalog/data";
import { pluralize } from "@/lib/catalog/format";
import type { Era, MerchItem } from "@/lib/catalog/types";

import { ConfirmDialog } from "./confirm-dialog";

export function ItemTable({ items, eras }: { items: MerchItem[]; eras: Era[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const eraName = (slug: string) => eras.find((e) => e.slug === slug)?.name ?? `⚠ ${slug}`;
  const visible = newestFirst(items).filter((item) =>
    `${item.name} ${item.id} ${item.type} ${eraName(item.era)}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  async function remove(item: MerchItem) {
    try {
      await deleteItem(item.id);
      toast.success(`Deleted “${item.name}”`);
      router.refresh();
    } catch (err) {
      toast.danger("Couldn't delete item", {
        description: err instanceof Error ? err.message : undefined,
      });
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading eyebrow={pluralize(items.length, "item")} title="Items">
        <SearchField aria-label="Filter items" className="w-72" value={query} onChange={setQuery}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Filter…" />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </SectionHeading>

      <Table variant="secondary">
        <Table.ScrollContainer>
          <Table.Content aria-label="Archived items" className="min-w-[640px]">
            <Table.Header>
              <Table.Column isRowHeader>Item</Table.Column>
              <Table.Column>Era</Table.Column>
              <Table.Column>Added</Table.Column>
              <Table.Column className="text-right">Actions</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <EmptyMessage description="Try a different filter." title="No items match" />
              )}
            >
              {visible.map((item) => (
                <Table.Row key={item.id} id={item.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-surface-secondary">
                        {item.images[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            alt=""
                            className="size-full object-contain"
                            src={item.images[0].src}
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <NextLink
                          className={clsx(linkVariants().base(), "text-foreground")}
                          href={`/items/${item.id}`}
                        >
                          {item.name}
                        </NextLink>
                        <p className="label-caps truncate text-muted">
                          {item.id} · {item.type} · {pluralize(item.images.length, "photo")}
                        </p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{eraName(item.era)}</Table.Cell>
                  <Table.Cell className="tabular-nums text-muted">{item.addedAt}</Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end gap-1">
                      <ButtonLink href={`/dev/items/${item.id}`} size="sm" variant="secondary">
                        Edit
                      </ButtonLink>
                      <ConfirmDialog
                        body={`“${item.name}” and photos only it uses will be deleted.`}
                        title="Delete item?"
                        trigger={(open) => (
                          <Button size="sm" variant="danger-soft" onPress={open}>
                            Delete
                          </Button>
                        )}
                        onConfirm={() => remove(item)}
                      />
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </section>
  );
}
