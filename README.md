# Merch Tracky

An unofficial public archive of Louis Tomlinson merchandise, browsable by era, format and release.

## Features

- **Home** shows recently added items, a spotlight on the current era and a quick index by era and format.
- **Eras** (`/eras`) is a timeline of every era. Each era page (`/eras/<slug>`) groups its items by format and uses the era's colour.
- **Catalog** (`/items`) with instant search, multi-select era/format/source filters, sorting and a grid or list view. Filters are kept in the URL, so filtered views can be shared.
- **Item pages** with a photo gallery (with photo credits), release details, previous/next navigation and more items from the same era.
- Light and dark themes.
- Fully static. Every public page is pre-rendered at build time.

## Screenshots

> Screenshots in `docs/` show the previous design and need to be retaken.

## Managing the archive

Only the repository owner can add content. The public site is read-only, and content changes ship through git.

1. Run `pnpm dev` and open [`/dev`](http://localhost:3000/dev). You can also use the floating **Dev** toolbar.
2. Add, edit or delete items and eras. Photos are resized to max 2000px, converted to WebP and saved to `public/items/`.
3. Commit `data/` and `public/items/`, then push. The deployment rebuilds with the new content.

The `/dev` pages and `/api/dev/*` routes only work under `next dev`. In production they return 404.

## Development

```bash
pnpm dev         # start the dev server (includes the /dev admin)
pnpm check       # type-check + lint
pnpm lint:fix    # auto-fix lint and formatting (Prettier runs through ESLint)
pnpm build       # production build
```

Built with Next.js 16 (App Router), [HeroUI v3](https://heroui.com) and Tailwind CSS v4.
The HeroUI MCP server is configured in `opencode.json` for AI-assisted work on the UI.

### Project structure

```
app/                    Routes only: pages, layouts, metadata, sitemap/robots
  api/dev/              Admin API (thin handlers around lib/admin)
  dev/                  Admin pages (development only)
components/
  layout/               Navbar, footer, theme switch, dev toolbar
  ui/                   Small shared building blocks (ButtonLink, SectionHeading, icons…)
  items/ eras/          Domain components for the public site
  catalog/              Catalog page: toolbar + URL-synced filter hook
  admin/                Admin forms, table and dialogs
lib/
  catalog/              Types, read-only data access, formatting, pure filter/sort logic
  admin/                Server-side admin: guard, file store, image processing,
                        validation, services; plus a typed browser API client
config/                 Site config and fonts
data/                   The archive itself (JSON)
```

Conventions:

- Server Components by default. `"use client"` only where there is interaction.
- UI uses HeroUI components. Next.js links styled as buttons use `ButtonLink` (`buttonVariants`).
- Business logic lives in `lib/`, not in components or route handlers.
- Anything that writes to disk imports `server-only` and is guarded by `isAdminEnabled()`.

### Data files

`data/eras.json`:

```json
{ "slug": "walls", "name": "Walls", "year": 2020, "color": "#7d93b2", "description": "…", "cover": "/items/optional.webp" }
```

`data/merch-items.json` → `items[]`:

```json
{
  "id": "unique-item-id",
  "name": "Item name",
  "description": "Short description",
  "type": "Vinyl",
  "era": "walls",
  "addedAt": "2026-05-01",
  "releaseDate": "2020-01",
  "edition": "Signed",
  "source": "Official webstore",
  "region": "UK",
  "price": "£25",
  "limited": true,
  "tags": ["signed"],
  "images": [{ "src": "/items/item.webp", "alt": "Front cover", "author": "Photo credit" }]
}
```

Only `id`, `name`, `type`, `era`, `addedAt` and `images` are required. `era` must match a slug in `eras.json`. `releaseDate` accepts `YYYY`, `YYYY-MM` or `YYYY-MM-DD`.

## License

This project is licensed under the [MIT License](LICENSE).
