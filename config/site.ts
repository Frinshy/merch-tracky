export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Merch Tracky",
  tagline: "Louis Tomlinson merch archive",
  description:
    "An unofficial fan archive of Louis Tomlinson merchandise — every release, from every era.",
  /** Public URL, used for metadata, sitemap and social previews. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  navItems: [
    { label: "Eras", href: "/eras" },
    { label: "Catalog", href: "/items" },
  ],
  links: {
    github: "https://github.com/frinshy/merch-tracky",
  },
};
