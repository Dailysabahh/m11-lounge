import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const app = await prisma.application.findUnique({ where: { id } });
  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (app.cvData && app.cvData.length > 0) {
    return new NextResponse(Buffer.from(app.cvData), {
      headers: {
        "Content-Type": app.cvMime || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${app.cvName.replace(/"/g, "")}"`,
      },
    });
  }

  if (app.cvPath && app.cvPath !== "database") {
    if (app.cvPath.startsWith("http")) {
      return NextResponse.redirect(app.cvPath);
    }
    const host = _req.headers.get("x-forwarded-host") || _req.headers.get("host");
    const proto = _req.headers.get("x-forwarded-proto") || "https";
    if (host) {
      return NextResponse.redirect(`${proto}://${host}${app.cvPath}`);
    }
  }

  return NextResponse.json({ error: "No CV on file." }, { status: 404 });
}
