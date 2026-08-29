import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [products, users] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
    ]);

    if (users === 0) {
      const passwordHash = await bcrypt.hash("M11Admin2026!", 10);
      await prisma.user.createMany({
        data: [
          {
            email: "admin@m11lounge.com",
            name: "M11 Owner",
            passwordHash,
            role: "SUPER_ADMIN",
          },
          {
            email: "staff@m11lounge.com",
            name: "M11 Floor Staff",
            passwordHash,
            role: "STAFF",
          },
        ],
      });
    }

    return NextResponse.json({
      ok: true,
      products,
      users: users === 0 ? 2 : users,
      menuReady: products > 0,
      message:
        products > 0
          ? "Admin and menu are ready."
          : "Admin is ready. Redeploy on Vercel so the menu can load.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Setup failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
