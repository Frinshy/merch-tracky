import { redirect } from "next/navigation";

/** Old URL of the add tool. */
export default function AddMerchRedirect() {
  redirect("/dev/items/new");
}
