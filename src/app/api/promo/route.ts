import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { code, subtotal } = await req.json();
  if (!code || typeof subtotal !== "number") {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }
  const promo = await prisma.promotion.findUnique({
    where: { code: String(code).toUpperCase() },
  });
  if (!promo || !promo.active) {
    return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
  }
  const now = new Date();
  if (promo.startsAt && now < promo.startsAt) {
    return NextResponse.json({ error: "Promo not active yet" }, { status: 400 });
  }
  if (promo.endsAt && now > promo.endsAt) {
    return NextResponse.json({ error: "Promo expired" }, { status: 400 });
  }
  let discount = 0;
  if (promo.type === "PERCENT") discount = Math.round((subtotal * promo.value) / 100);
  if (promo.type === "FIXED") {
    if (promo.code === "NIGHT5" && subtotal < 40000) {
      return NextResponse.json({ error: "Spend ₦40,000 to use NIGHT5" }, { status: 400 });
    }
    discount = Math.min(promo.value, subtotal);
  }
  return NextResponse.json({ discount, description: promo.description, code: promo.code });
}
