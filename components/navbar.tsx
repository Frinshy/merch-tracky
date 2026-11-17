"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon, Logo, SearchIcon } from "@/components/icons";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="fixed top-0 z-40 w-full border-b border-separator bg-background/80 backdrop-blur-lg">
      <header className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <NextLink
            className="flex items-center gap-2"
            href="/"
            onClick={() => setIsMenuOpen(false)}
          >
            <Logo size={26} />
            <span className="font-display text-xl leading-none">
              Merch Tracky
            </span>
          </NextLink>
          <ul className="hidden gap-6 sm:flex">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <NextLink
                  className={clsx(
                    "text-sm transition-colors hover:text-foreground",
                    isActive(item.href)
                      ? "font-medium text-foreground"
                      : "text-muted",
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-1">
          <NextLink
            aria-label="Search the catalog"
            className="grid size-9 place-items-center rounded-md text-muted transition-colors hover:bg-surface-secondary hover:text-foreground"
            href="/items?focus=1"
          >
            <SearchIcon className="size-[18px]" />
          </NextLink>
          <a
            aria-label="GitHub"
            className="hidden size-9 place-items-center rounded-md text-muted transition-colors hover:bg-surface-secondary hover:text-foreground sm:grid"
            href={siteConfig.links.github}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GithubIcon size={20} />
          </a>
          <div className="grid size-9 place-items-center">
            <ThemeSwitch />
          </div>
          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="grid size-9 place-items-center rounded-md text-muted sm:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="size-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d={
                  isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 7h16M4 12h16M4 17h16"
                }
                strokeLinecap="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <ul className="flex flex-col border-t border-separator px-4 py-2 sm:hidden">
          {siteConfig.navItems.map((item) => (
            <li key={item.href}>
              <NextLink
                className="block py-3 text-lg"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NextLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};
