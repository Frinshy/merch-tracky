"use client";

import { RouterProvider, Toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

export function Providers({
  children,
  themeProps,
}: {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}) {
  const router = useRouter();

  return (
    // Lets HeroUI links (Breadcrumbs, Link, …) use client-side navigation.
    <RouterProvider navigate={router.push}>
      <NuqsAdapter>
        <ThemeProvider {...themeProps}>
          {children}
          <Toast.Provider placement="bottom end" />
        </ThemeProvider>
      </NuqsAdapter>
    </RouterProvider>
  );
}
