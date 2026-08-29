import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPaystack } from "@/lib/paystack";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { OR: [{ orderNumber: reference }, { paystackRef: reference }] },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "PENDING_PAYMENT") {
    return NextResponse.json({ status: order.status, orderNumber: order.orderNumber });
  }

  const data = await verifyPaystack(reference);
  if (data.status === "success") {
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", paidAt: new Date(), paystackRef: reference },
    });
    return NextResponse.json({ status: updated.status, orderNumber: updated.orderNumber });
  }

  return NextResponse.json({ status: order.status, orderNumber: order.orderNumber });
}
