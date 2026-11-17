import { adminRoute } from "@/lib/admin/guard";
import { createItem } from "@/lib/admin/items";

/** Create an item (multipart: item, images, files). Development only. */
export const POST = adminRoute(async (request: Request) => createItem(await request.formData()));
