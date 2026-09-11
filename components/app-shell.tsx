"use client";

import { usePathname } from "next/navigation";

import { Navbar } from "@/components/navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isItemsRoute = pathname === "/items";

  if (isItemsRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto flex-grow max-w-7xl px-6 pt-16">
        {children}
      </main>
      <footer className="flex w-full items-center justify-center py-3">
        <a
          className="flex items-center gap-1 text-current no-underline"
          href="https://heroui.com?utm_source=next-app-template"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="text-muted">Powered by</span>
          <p className="text-accent">HeroUI</p>
        </a>
      </footer>
    </div>
  );
}
