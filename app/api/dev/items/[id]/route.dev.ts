import { adminRoute } from "@/lib/admin/guard";
import { deleteItem, updateItem } from "@/lib/admin/items";

type Context = { params: Promise<{ id: string }> };

/** Update an item (multipart: item, images, files). Development only. */
export const PUT = adminRoute(async (request: Request, { params }: Context) =>
  updateItem((await params).id, await request.formData()),
);

/** Delete an item and photos nothing else uses. Development only. */
export const DELETE = adminRoute(async (_request: Request, { params }: Context) =>
  deleteItem((await params).id),
);
