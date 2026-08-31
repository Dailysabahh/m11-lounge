import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const application = await prisma.application.findUnique({ where: { id } });
    if (!application || application.status !== "DRAFT") {
      return NextResponse.json({ error: "This application cannot be submitted." }, { status: 400 });
    }

    const body = (await req.json().catch(() => null)) as {
      answers?: Record<string, string>;
    } | null;
    const answers = body?.answers ?? {};

    const general = await prisma.jobRole.findFirst({
      where: { isGeneral: true },
      include: { questions: true },
    });
    const roleQuestions = await prisma.question.findMany({
      where: { jobRoleId: application.jobRoleId },
    });
    const all = [...(general?.questions ?? []), ...roleQuestions];

    if (all.some((q) => !answers[q.id])) {
      return NextResponse.json({ error: "Please answer every question." }, { status: 400 });
    }

    let generalScore = 0;
    let roleScore = 0;
    for (const q of general?.questions ?? []) {
      if (String(answers[q.id]).toUpperCase() === q.correctKey) generalScore += 1;
    }
    for (const q of roleQuestions) {
      if (String(answers[q.id]).toUpperCase() === q.correctKey) roleScore += 1;
    }

    const generalMax = general?.questions.length ?? 0;
    const roleMax = roleQuestions.length;
    const totalScore = generalScore + roleScore;
    const totalMax = generalMax + roleMax;

    await prisma.application.update({
      where: { id },
      data: {
        status: "SUBMITTED",
        answersJson: JSON.stringify(answers),
        generalScore,
        generalMax,
        roleScore,
        roleMax,
        totalScore,
        totalMax,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({
      totalScore,
      totalMax,
      generalScore,
      generalMax,
      roleScore,
      roleMax,
    });
  } catch (error) {
    console.error("apply/submit", error);
    return NextResponse.json(
      { error: "Could not submit. Please try again." },
      { status: 500 },
    );
  }
}

