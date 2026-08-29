import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

type Q = {
  number: number;
  prompt: string;
  options: { key: string; text: string }[];
  correctKey: string;
};

type Role = {
  key: string;
  name: string;
  slug: string;
  focus: string;
  questions: Q[];
};

type Data = { general: Role; roles: Role[] };

export async function seedJobs() {
  const roleCount = await prisma.jobRole.count().catch(() => 0);
  if (roleCount > 0 && process.env.FORCE_SEED !== "1") {
    console.log("Job questionnaires already seeded — skipping.");
    return;
  }

  const raw = readFileSync(
    path.join(process.cwd(), "prisma/questionnaire.json"),
    "utf8",
  );
  const data = JSON.parse(raw) as Data;

  await prisma.application.deleteMany();
  await prisma.question.deleteMany();
  await prisma.jobRole.deleteMany();

  async function createRole(role: Role, isGeneral: boolean, sortOrder: number) {
    const created = await prisma.jobRole.create({
      data: {
        name: role.name,
        slug: role.slug,
        sectionKey: role.key,
        description: role.focus
          ? role.focus
          : "Numerical reasoning, logic, attention to detail, and integrity.",
        focus: role.focus,
        isGeneral,
        isOpen: !isGeneral,
        sortOrder,
      },
    });
    for (const q of role.questions) {
      await prisma.question.create({
        data: {
          jobRoleId: created.id,
          number: q.number,
          prompt: q.prompt,
          optionsJson: JSON.stringify(q.options),
          correctKey: q.correctKey,
          sortOrder: q.number,
        },
      });
    }
    return created;
  }

  await createRole(data.general, true, 0);
  for (let i = 0; i < data.roles.length; i++) {
    await createRole(data.roles[i], false, i + 1);
  }
}

if (process.argv.some((arg) => arg.includes("seed-jobs.ts"))) {
  seedJobs()
    .then(async () => {
      console.log("Seeded job questionnaires.");
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
