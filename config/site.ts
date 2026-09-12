export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Merch Tracky",
  description: "A simple app to track merchandise items and their details.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Items",
      href: "/items",
    },
  ],
  links: {
    github: "https://github.com/frinshy/merch-tracky",
    twitter: "https://twitter.com/hero_ui",
    discord: "https://discord.gg/9b6yyZKmH4",
  },
};
