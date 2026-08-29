import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ApplyFlow } from "@/components/careers/ApplyFlow";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const role = await prisma.jobRole.findUnique({ where: { slug } });
  return { title: role ? `Apply — ${role.name}` : "Apply" };
}

export default async function RoleApplyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const role = await prisma.jobRole.findFirst({
    where: { slug, isGeneral: false, isOpen: true },
  });
  if (!role) notFound();

  return (
    <div className="px-4 py-12 md:px-6">
      <ApplyFlow slug={role.slug} roleName={role.name} focus={role.focus} />
    </div>
  );
}
