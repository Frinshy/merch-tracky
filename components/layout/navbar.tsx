"use client";

import { Button } from "@heroui/react";
import clsx from "clsx";
import { MenuIcon, SearchIcon, XIcon } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ButtonLink } from "@/components/ui/button-link";
import { GithubIcon, Logo } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { ARTIST } from "@/lib/catalog/data";

import { ThemeSwitch } from "./theme-switch";

export function Navbar() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  // The mobile menu closes automatically when the route changes.
  const isMenuOpen = menuPath === pathname;

  return (
    <nav className="fixed top-0 z-40 w-full border-b border-separator bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6">
        <div className="flex items-center gap-8">
          <NextLink
            aria-label={`${ARTIST} merch archive, home`}
            className="flex items-center gap-2"
            href="/"
          >
            <Logo />
            <span className="flex flex-col">
              <span className="type-display whitespace-nowrap text-xl leading-none min-[360px]:text-2xl">
                {ARTIST}
              </span>
              <span className="label-caps text-[0.625rem] leading-none text-muted">
                Merch archive
              </span>
            </span>
          </NextLink>
          <ul className="hidden gap-6 sm:flex">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <NavLink active={pathname.startsWith(item.href)} href={item.href}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-1">
          <ButtonLink
            isIconOnly
            aria-label="Search the catalog"
            href="/items?focus=1"
            size="sm"
            variant="ghost"
          >
            <SearchIcon size={18} />
          </ButtonLink>
          <ButtonLink
            isIconOnly
            aria-label="GitHub repository"
            className="hidden sm:inline-flex"
            href={siteConfig.links.github}
            rel="noopener noreferrer"
            size="sm"
            target="_blank"
            variant="ghost"
          >
            <GithubIcon size={18} />
          </ButtonLink>
          <ThemeSwitch />
          <Button
            isIconOnly
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
            size="sm"
            variant="ghost"
            onPress={() => setMenuPath(isMenuOpen ? null : pathname)}
          >
            {isMenuOpen ? <XIcon size={18} /> : <MenuIcon size={18} />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <ul className="flex flex-col border-t border-separator px-4 py-2 sm:hidden">
          {siteConfig.navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                active={pathname.startsWith(item.href)}
                className="block py-3 text-lg"
                href={item.href}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

function NavLink({
  active,
  className,
  ...props
}: React.ComponentProps<typeof NextLink> & { active: boolean }) {
  return (
    <NextLink
      aria-current={active ? "page" : undefined}
      className={clsx(
        "type-display text-lg leading-none transition-colors hover:text-foreground",
        active ? "font-medium text-foreground" : "text-muted",
        className,
      )}
      {...props}
    />
  );
}
