import { requireAdmin } from "@/lib/admin-guard";
import { ProductForm } from "../product-form";
import { canManageContent } from "@/lib/site";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
  const user = await requireAdmin();
  if (!canManageContent(user.role)) redirect("/admin");
  return <ProductForm />;
}
