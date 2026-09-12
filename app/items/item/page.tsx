import { Button, Card } from "@heroui/react";

export default function Item() {
  return (
    <div className="min-h-screen w-full">
      <div className="flex w-full flex-col gap-4 rounded bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold leading-none tracking-tight">
              Item Name
            </h1>
            <p className="text-sm text-muted-foreground">
              Item description goes here.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-separator bg-surface p-5 shadow-sm">
            <p className="text-sm font-medium text-muted">Type</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              Example Type
            </p>
          </Card>
          <Card className="border border-separator bg-surface p-5 shadow-sm">
            <p className="text-sm font-medium text-muted">Era</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              Example Era
            </p>
          </Card>
          <Card className="border border-separator bg-surface p-5 shadow-sm">
            <p className="text-sm font-medium text-muted">Status</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">Active</p>
          </Card>
          <Card className="border border-separator bg-surface p-5 shadow-sm">
            <p className="text-sm font-medium text-muted">Quantity</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">42</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
