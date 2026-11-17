import { ButtonLink } from "@/components/ui/button-link";
import { PageHeader } from "@/components/ui/page-header";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-6 py-24">
      <PageHeader
        description="This page doesn't exist, or the item was removed."
        eyebrow="404"
        title="Not in the archive."
      />
      <ButtonLink href="/items">Browse the catalog</ButtonLink>
    </div>
  );
}
