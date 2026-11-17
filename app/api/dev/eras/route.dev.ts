import { saveEra } from "@/lib/admin/eras";
import { adminRoute } from "@/lib/admin/guard";

/** Create or update an era (multipart: era, coverFile?). Development only. */
export const POST = adminRoute(async (request: Request) => saveEra(await request.formData()));
