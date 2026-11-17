export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Merch Tracky",
  description:
    "An unofficial fan archive of Louis Tomlinson merchandise — every release, from every era.",
  navItems: [
    { label: "Eras", href: "/eras" },
    { label: "Catalog", href: "/items" },
  ],
  links: {
    github: "https://github.com/frinshy/merch-tracky",
  },
};
