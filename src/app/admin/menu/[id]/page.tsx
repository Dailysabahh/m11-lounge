import { ProductForm } from "../product-form";
import { requireAdmin } from "@/lib/admin-guard";
import { canManageContent } from "@/lib/site";
import { redirect } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAdmin();
  if (!canManageContent(user.role)) redirect("/admin");
  const { id } = await params;
  return <ProductForm id={id} />;
}
