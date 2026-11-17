import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

const DEV_TOOLBAR = "@/components/layout/dev-toolbar";
const DEV_TOOLBAR_STUB = "./components/layout/dev-toolbar.stub.tsx";

/**
 * Keeps all development tooling out of production builds:
 *
 * - Routes for the /dev admin and /api/dev endpoints use the `.dev.tsx` /
 *   `.dev.ts` extension. Those extensions are only registered for `next dev`,
 *   so `next build` doesn't see the routes: they aren't compiled or bundled,
 *   and everything only they import (components/admin, lib/admin) is left out.
 * - The floating dev toolbar import is aliased to an empty stub outside
 *   `next dev`, so its code isn't shipped either.
 *
 * @param {string} phase
 * @returns {import('next').NextConfig}
 */
export default function nextConfig(phase) {
  const isDevServer = phase === PHASE_DEVELOPMENT_SERVER;

  if (isDevServer) {
    return { pageExtensions: ["dev.tsx", "dev.ts", "tsx", "ts"] };
  }

  return {
    pageExtensions: ["tsx", "ts"],
    turbopack: { resolveAlias: { [DEV_TOOLBAR]: DEV_TOOLBAR_STUB } },
  };
}
