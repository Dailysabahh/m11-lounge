import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim().slice(0, 80);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const phone = String(body?.phone ?? "").trim().slice(0, 30);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  await prisma.openingReminder.upsert({
    where: { email },
    create: { email, name: name || null, phone: phone || null },
    update: { name: name || undefined, phone: phone || undefined },
  });

  return NextResponse.json({ ok: true });
}
