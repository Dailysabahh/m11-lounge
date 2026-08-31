import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUpload } from "@/lib/storage";

const ALLOWED = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const phone = String(form.get("phone") || "").trim();
    const slug = String(form.get("slug") || "").trim();
    const cv = form.get("cv");

    if (!name || !email || !phone || !slug) {
      return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
    }
    if (!(cv instanceof File) || cv.size === 0) {
      return NextResponse.json({ error: "Please upload your CV." }, { status: 400 });
    }
    if (cv.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: "CV must be under 4MB." }, { status: 400 });
    }
    const typeOk = ALLOWED.has(cv.type) || /\.(pdf|doc|docx)$/i.test(cv.name);
    if (!typeOk) {
      return NextResponse.json({ error: "CV must be PDF or Word." }, { status: 400 });
    }

    const role = await prisma.jobRole.findFirst({
      where: { slug, isGeneral: false, isOpen: true },
    });
    if (!role) {
      return NextResponse.json({ error: "That role is not open." }, { status: 400 });
    }

    const saved = await saveUpload(cv, "cvs");
    const application = await prisma.application.create({
      data: {
        name,
        email,
        phone,
        cvPath: saved.kind === "url" ? saved.url : "database",
        cvName: cv.name,
        cvMime: cv.type || "application/octet-stream",
        cvData: saved.kind === "bytes" ? saved.data : undefined,
        jobRoleId: role.id,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ applicationId: application.id });
  } catch (error) {
    console.error("apply/start", error);
    return NextResponse.json(
      { error: "Could not save your application. Please try again." },
      { status: 500 },
    );
  }
}
