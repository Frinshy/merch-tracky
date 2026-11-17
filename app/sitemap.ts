import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { eras, items } from "@/lib/catalog/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteConfig.url).toString();

  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/eras"), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/items"), changeFrequency: "weekly", priority: 0.8 },
    ...eras.map((era) => ({ url: url(`/eras/${era.slug}`), priority: 0.7 })),
    ...items.map((item) => ({
      url: url(`/items/${item.id}`),
      lastModified: item.addedAt,
      priority: 0.5,
    })),
  ];
}
