import "@/styles/globals.css";

import clsx from "clsx";
import type { Metadata, Viewport } from "next";

import { DevToolbar } from "@/components/layout/dev-toolbar";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { fontDisplay, fontMono, fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";

import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: { icon: "/favicon.ico" },
  openGraph: { siteName: siteConfig.name, type: "website" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        className={clsx(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          fontSans.variable,
          fontMono.variable,
          fontDisplay.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl grow px-4 pt-16 sm:px-6">{children}</main>
            <Footer />
            {/* Statically false in production builds, so the toolbar is dropped from the bundle. */}
            {process.env.NODE_ENV === "development" && <DevToolbar />}
          </div>
        </Providers>
      </body>
    </html>
  );
}
