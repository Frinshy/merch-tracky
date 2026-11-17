"use client";

import { Button } from "@heroui/react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Both icons are rendered and toggled with the `dark:` variant, so the
 * button never needs a client-only "mounted" check and doesn't flash.
 */
export function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      isIconOnly
      aria-label="Toggle dark mode"
      size="sm"
      variant="ghost"
      onPress={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <SunIcon className="dark:hidden" size={18} />
      <MoonIcon className="hidden dark:block" size={18} />
    </Button>
  );
}
