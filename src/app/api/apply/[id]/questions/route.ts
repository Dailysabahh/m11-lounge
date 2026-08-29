import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJson } from "@/lib/format";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: { jobRole: true },
  });
  if (!application || application.status !== "DRAFT") {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const general = await prisma.jobRole.findFirst({
    where: { isGeneral: true },
    include: { questions: { orderBy: { number: "asc" } } },
  });
  const roleQs = await prisma.question.findMany({
    where: { jobRoleId: application.jobRoleId },
    orderBy: { number: "asc" },
  });

  function publicQ(q: { id: string; number: number; prompt: string; optionsJson: string }) {
    return {
      id: q.id,
      number: q.number,
      prompt: q.prompt,
      options: parseJson<{ key: string; text: string }[]>(q.optionsJson, []),
    };
  }

  return NextResponse.json({
    name: application.name,
    role: application.jobRole.name,
    general: {
      title: "Section A — General Screening",
      description:
        "Given to every candidate. Numerical reasoning, logic, attention to detail, and integrity.",
      questions: (general?.questions ?? []).map(publicQ),
    },
    roleSection: {
      title: `Section ${application.jobRole.sectionKey} — ${application.jobRole.name}`,
      description: application.jobRole.focus,
      questions: roleQs.map(publicQ),
    },
  });
}
