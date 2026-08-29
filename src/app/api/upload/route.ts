import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { canManageContent } from "@/lib/site";
import { saveUpload } from "@/lib/storage";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || !canManageContent(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const url = await saveUpload(file, "menu");
  return NextResponse.json({ url });
}
