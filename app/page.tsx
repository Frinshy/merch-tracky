import { Button, Card, Chip, ProgressBar } from "@heroui/react";

const metrics = [
  { label: "Lorem ipsum", value: "24,892", detail: "Dolor sit amet" },
  { label: "Consectetur", value: "1,284", detail: "Adipiscing elit" },
  { label: "Sed do eiusmod", value: "86.4%", detail: "Tempor incididunt" },
  { label: "Ut labore", value: "7.8k", detail: "Et dolore magna" },
];

const collections = [
  {
    title: "Lorem ipsum",
    copy: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel sem at nisi luctus.",
    tag: "Ipsum",
    accent: "bg-accent",
  },
  {
    title: "Dolor sit amet",
    copy: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim.",
    tag: "Dolor",
    accent: "bg-success",
  },
  {
    title: "Amet consectetur",
    copy: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    tag: "Amet",
    accent: "bg-warning",
  },
];

const activity = [
  ["Lorem ipsum dolor", "Consectetur adipiscing elit", "2 min ago"],
  ["Sed do eiusmod", "Tempor incididunt ut labore", "18 min ago"],
  ["Ut enim ad minim", "Veniam quis nostrud", "42 min ago"],
  ["Duis aute irure", "Dolor in reprehenderit", "1 hr ago"],
];

export default function Home() {
  return (
    <section className="flex flex-col gap-6 pb-16 pt-4 md:gap-8 md:pt-8">
      <Card className="overflow-hidden border border-separator bg-surface shadow-lg">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.4fr_0.6fr] lg:p-10">
          <div className="flex flex-col items-start justify-center gap-5">
            <Chip color="accent" variant="soft">
              Lorem ipsum
            </Chip>
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
                Lorem ipsum dolor sit amet consectetur.
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted sm:text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Curabitur pretium, nunc at commodo tincidunt, nunc lorem
                tincidunt ipsum, vitae facilisis enim justo sed arcu.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="primary">
                Lorem
              </Button>
              <Button size="lg" variant="secondary">
                Ipsum
              </Button>
            </div>
          </div>
          <div className="relative flex min-h-64 items-end overflow-hidden rounded-lg bg-accent p-6 text-accent-foreground sm:min-h-80">
            <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full border-[24px] border-accent-foreground/15" />
            <div className="absolute right-10 top-12 h-24 w-24 rounded-full border border-accent-foreground/25" />
            <div className="relative space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.18em] opacity-70">
                01 / 04
              </p>
              <p className="max-w-xs text-2xl font-semibold">
                Consectetur adipiscing elit.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            className="border border-separator bg-surface p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-muted">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {metric.value}
            </p>
            <p className="mt-2 text-sm text-success">{metric.detail}</p>
          </Card>
        ))}
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent">Dolor section</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Nonsense blocks
          </h2>
        </div>
        <Button className="hidden sm:flex" variant="tertiary">
          View more
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {collections.map((collection, index) => (
          <Card
            key={collection.title}
            className="group border border-separator bg-surface shadow-sm transition-transform hover:-translate-y-1"
          >
            <div className={`h-2 ${collection.accent}`} />
            <Card.Header className="gap-3 p-6">
              <div className="flex items-center justify-between gap-3">
                <Chip size="sm" variant="soft">
                  0{index + 1}
                </Chip>
                <Chip
                  size="sm"
                  color={index === 0 ? "accent" : "default"}
                  variant="soft"
                >
                  {collection.tag}
                </Chip>
              </div>
              <Card.Title className="pt-5 text-xl">
                {collection.title}
              </Card.Title>
              <Card.Description className="text-sm leading-6">
                {collection.copy}
              </Card.Description>
            </Card.Header>
            <Card.Footer className="flex items-center justify-between border-t border-separator p-6">
              <span className="text-sm text-muted">Lorem · 12</span>
              <Button size="sm" variant="tertiary">
                More
              </Button>
            </Card.Footer>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="border border-separator bg-surface p-6 shadow-sm sm:p-8">
          <Card.Header className="p-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Card.Title className="text-xl">Dolor sit amet</Card.Title>
                <Card.Description className="mt-2">
                  Aenean commodo ligula eget dolor. Aenean massa.
                </Card.Description>
              </div>
              <Chip color="success" variant="soft">
                Ipsum
              </Chip>
            </div>
          </Card.Header>
          <div className="mt-8 space-y-6">
            <div className="flex items-end justify-between">
              <span className="text-sm text-muted">Lorem ipsum</span>
              <span className="font-semibold">72%</span>
            </div>
            <ProgressBar aria-label="Lorem ipsum bar" value={72} />
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                ["24", "Ipsum"],
                ["08", "Dolor"],
                ["04", "Amet"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-lg bg-surface-secondary p-4"
                >
                  <p className="text-xl font-semibold">{value}</p>
                  <p className="mt-1 text-xs text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="border border-separator bg-surface p-6 shadow-sm sm:p-8">
          <Card.Header className="p-0">
            <Card.Title className="text-xl">Quick lorem</Card.Title>
            <Card.Description className="mt-2">
              Nunc nonummy metus. Donec elit libero.
            </Card.Description>
          </Card.Header>
          <div className="mt-6 flex flex-col gap-3">
            <Button className="w-full" variant="primary">
              Lorem
            </Button>
            <Button variant="secondary" className="w-full">
              Dolor
            </Button>
            <Button variant="tertiary" className="w-full">
              Amet
            </Button>
          </div>
        </Card>
      </div>

      <Card className="border border-separator bg-surface shadow-sm">
        <Card.Header className="flex-row items-center justify-between gap-4 border-b border-separator p-6">
          <div>
            <Card.Title className="text-xl">Lorem sequence</Card.Title>
            <Card.Description className="mt-1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Card.Description>
          </div>
          <Button size="sm" variant="tertiary">
            Again
          </Button>
        </Card.Header>
        <div className="divide-y divide-separator px-6">
          {activity.map(([title, detail, time]) => (
            <div
              key={title}
              className="flex flex-col gap-2 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div>
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-sm text-muted">{detail}</p>
              </div>
              <span className="shrink-0 text-sm text-muted">{time}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border border-accent/30 bg-accent/10 p-6 sm:p-8">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold">
              Lorem ipsum, dolor sit amet.
            </h2>
            <p className="mt-2 max-w-xl text-muted">
              Praesent egestas neque eu enim. In hac habitasse platea dictumst.
            </p>
          </div>
          <Button variant="primary">Continue</Button>
        </div>
      </Card>
    </section>
  );
}
