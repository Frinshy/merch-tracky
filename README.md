# Merch Tracky

Merch Tracky is a public archive for browsing an artist's merchandise by release, format, and era. The app provides a home dashboard, a catalog view, and detail pages with image galleries for individual items.

## Features

- Browse recently added merchandise from the home page.
- Search and sort the catalog.
- Narrow the catalog by item type and era.
- Open a dedicated detail page for each item.
- View multiple images in an item gallery when they are available.
- Switch between light and dark themes.

## Managing merchandise data

The catalog is stored in [`data/merch-items.json`](data/merch-items.json). Add or update an entry in the `MerchItems` array using this shape:

```json
{
  "id": "unique-item-id",
  "name": "Item name",
  "description": "Short description",
  "type": "CD",
  "era": "Release era",
  "images": [
    {
      "src": "/items/item-image.jpeg",
      "alt": "Accessible image description",
      "author": "Contributor name"
    }
  ]
}
```

Place referenced image files in `public/items/`. The `id` is used to build the detail route at `/items/<id>`.

## License

This project is licensed under the [MIT License](LICENSE).
