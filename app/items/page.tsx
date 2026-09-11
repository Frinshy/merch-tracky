import { Button, Card, ComboBox, Input, Label, ListBox } from "@heroui/react";
import Image from "next/image";

export default function Items() {
  return (
    <div className="flex h-full w-full flex-row items-start gap-4">
      <div className="min-w-60 flex h-full flex-col gap-5 rounded bg-surface p-5">
        <TypeSelector />
        <EraSelector />
        <Button className="self-end" type="submit">
          Submit
        </Button>
      </div>
      <div className="min-w-0 flex-1 bg-surface rounded p-4 sm:p-5">
        <div className="grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 10 }, (_, index) => (
            <ItemCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ItemCard() {
  return (
    <Card className="group relative h-70 w-full overflow-hidden rounded-3xl shadow-md transition duration-500 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl focus-within:-translate-y-1 focus-within:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none">
      <Image
        alt="NEO Home Robot"
        className="object-contain transition duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none"
        fill
        sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
        src="/items/test.jpeg"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/85 transition duration-500 group-hover:from-black/15 group-hover:to-black/75 motion-reduce:transition-none" />

      <Card.Header className="absolute inset-x-4 top-4 z-10 w-fit rounded-full border border-default bg-surface/80 px-4 py-2 text-surface-foreground backdrop-blur-md">
        <Card.Title className="text-xs font-semibold tracking-[0.08em] text-surface-foreground">
          Very nice item
        </Card.Title>
      </Card.Header>

      <Card.Footer className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 px-5 pb-5 pt-14 text-white">
        <Button
          className="pointer-events-none ml-auto shrink-0 opacity-0 shadow-lg transition-[opacity,transform] duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:scale-105 motion-reduce:transition-none"
          size="sm"
          variant="primary"
        >
          More
        </Button>
      </Card.Footer>
    </Card>
  );
}

export function TypeSelector() {
  return (
    <ComboBox className="w-full">
      <Label>Type of item</Label>
      <ComboBox.InputGroup>
        <Input
          className="border border-default bg-content1"
          placeholder="Select type..."
        />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          <ListBox.Item id="aardvark" textValue="Aardvark">
            Aardvark
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="cat" textValue="Cat">
            Cat
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="dog" textValue="Dog">
            Dog
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="kangaroo" textValue="Kangaroo">
            Kangaroo
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="panda" textValue="Panda">
            Panda
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="snake" textValue="Snake">
            Snake
            <ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
}

export function EraSelector() {
  return (
    <ComboBox className="w-full">
      <Label>Era of item</Label>
      <ComboBox.InputGroup>
        <Input
          className="border border-default bg-content1"
          placeholder="Select era..."
        />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          <ListBox.Item id="aardvark" textValue="Aardvark">
            Aardvark
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="cat" textValue="Cat">
            Cat
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="dog" textValue="Dog">
            Dog
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="kangaroo" textValue="Kangaroo">
            Kangaroo
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="panda" textValue="Panda">
            Panda
            <ListBox.ItemIndicator />
          </ListBox.Item>
          <ListBox.Item id="snake" textValue="Snake">
            Snake
            <ListBox.ItemIndicator />
          </ListBox.Item>
        </ListBox>
      </ComboBox.Popover>
    </ComboBox>
  );
}
