import { deleteEra } from "@/lib/admin/eras";
import { adminRoute } from "@/lib/admin/guard";

type Context = { params: Promise<{ slug: string }> };

/** Delete an era that no items use. Development only. */
export const DELETE = adminRoute(async (_request: Request, { params }: Context) =>
  deleteEra((await params).slug),
);
