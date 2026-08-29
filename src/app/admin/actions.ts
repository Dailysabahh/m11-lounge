"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canManageContent, canManageUsers } from "@/lib/site";
import type { ApplicationStatus, OrderStatus, Role } from "@prisma/client";

async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return session.user;
}

async function requireContent() {
  const user = await requireUser();
  if (!canManageContent(user.role)) throw new Error("Forbidden");
  return user;
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/admin",
  });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}

export async function saveProduct(formData: FormData) {
  await requireContent();
  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name")),
    slug: String(formData.get("slug")),
    description: String(formData.get("description")),
    ingredients: JSON.stringify(
      String(formData.get("ingredients") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
    price: Number(formData.get("price")),
    image: String(formData.get("image")),
    available: formData.get("available") === "on",
    featured: formData.get("featured") === "on",
    allowsExtras: formData.get("allowsExtras") === "on",
    sortOrder: Number(formData.get("sortOrder") || 0),
    categoryId: String(formData.get("categoryId")),
  };
  if (id) {
    await prisma.product.update({ where: { id }, data: payload });
  } else {
    await prisma.product.create({ data: payload });
  }
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
  redirect("/admin/menu");
}

export async function deleteProduct(id: string) {
  await requireContent();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

export async function saveCategory(formData: FormData) {
  await requireContent();
  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name")),
    slug: String(formData.get("slug")),
    description: String(formData.get("description") || ""),
    image: String(formData.get("image") || ""),
    sortOrder: Number(formData.get("sortOrder") || 0),
  };
  if (id) await prisma.category.update({ where: { id }, data: payload });
  else await prisma.category.create({ data: payload });
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}

export async function deleteCategory(id: string) {
  await requireContent();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/menu");
}

export async function saveExtra(formData: FormData) {
  await requireContent();
  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name")),
    price: Number(formData.get("price")),
    image: String(formData.get("image") || ""),
    available: formData.get("available") === "on",
    sortOrder: Number(formData.get("sortOrder") || 0),
  };
  if (id) await prisma.extra.update({ where: { id }, data: payload });
  else await prisma.extra.create({ data: payload });
  revalidatePath("/admin/menu");
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await requireUser();
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function savePromotion(formData: FormData) {
  await requireContent();
  const id = String(formData.get("id") || "");
  const payload = {
    code: String(formData.get("code")).toUpperCase(),
    description: String(formData.get("description")),
    type: String(formData.get("type")),
    value: Number(formData.get("value")),
    active: formData.get("active") === "on",
    featured: formData.get("featured") === "on",
  };
  if (id) await prisma.promotion.update({ where: { id }, data: payload });
  else await prisma.promotion.create({ data: payload });
  revalidatePath("/admin/promotions");
  revalidatePath("/");
}

export async function deletePromotion(id: string) {
  await requireContent();
  await prisma.promotion.delete({ where: { id } });
  revalidatePath("/admin/promotions");
}

export async function saveSettings(formData: FormData) {
  await requireContent();
  const hours = [
    {
      day: "Monday – Thursday",
      hours: String(formData.get("hoursWeekday") || "4:00 PM – 2:00 AM"),
    },
    {
      day: "Friday – Sunday",
      hours: String(formData.get("hoursWeekend") || "2:00 PM – 3:00 AM"),
    },
  ];
  await prisma.siteSetting.upsert({
    where: { id: "site" },
    create: {
      id: "site",
      restaurantName: String(formData.get("restaurantName")),
      tagline: String(formData.get("tagline")),
      phone: String(formData.get("phone")),
      email: String(formData.get("email")),
      address: String(formData.get("address")),
      instagram: String(formData.get("instagram")),
      tiktok: String(formData.get("tiktok")),
      hoursJson: JSON.stringify(hours),
      heroTitle: String(formData.get("heroTitle")),
      heroSubtitle: String(formData.get("heroSubtitle")),
      aboutText: String(formData.get("aboutText")),
      bannerText: String(formData.get("bannerText") || "") || null,
    },
    update: {
      restaurantName: String(formData.get("restaurantName")),
      tagline: String(formData.get("tagline")),
      phone: String(formData.get("phone")),
      email: String(formData.get("email")),
      address: String(formData.get("address")),
      instagram: String(formData.get("instagram")),
      tiktok: String(formData.get("tiktok")),
      hoursJson: JSON.stringify(hours),
      heroTitle: String(formData.get("heroTitle")),
      heroSubtitle: String(formData.get("heroSubtitle")),
      aboutText: String(formData.get("aboutText")),
      bannerText: String(formData.get("bannerText") || "") || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidatePath("/contact");
  revalidatePath("/about");
}

export async function saveTestimonial(formData: FormData) {
  await requireContent();
  const id = String(formData.get("id") || "");
  const payload = {
    name: String(formData.get("name")),
    quote: String(formData.get("quote")),
    rating: Number(formData.get("rating") || 5),
    sortOrder: Number(formData.get("sortOrder") || 0),
    published: formData.get("published") === "on",
  };
  if (id) await prisma.testimonial.update({ where: { id }, data: payload });
  else await prisma.testimonial.create({ data: payload });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function deleteTestimonial(id: string) {
  await requireContent();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function saveUser(formData: FormData) {
  const current = await requireUser();
  if (!canManageUsers(current.role)) throw new Error("Forbidden");
  const id = String(formData.get("id") || "");
  const password = String(formData.get("password") || "");
  const data: {
    email: string;
    name: string;
    role: Role;
    passwordHash?: string;
  } = {
    email: String(formData.get("email")).toLowerCase(),
    name: String(formData.get("name")),
    role: String(formData.get("role")) as Role,
  };
  if (password) data.passwordHash = await bcrypt.hash(password, 10);
  if (id) {
    await prisma.user.update({
      where: { id },
      data,
    });
  } else {
    if (!password) throw new Error("Password required");
    await prisma.user.create({
      data: { ...data, passwordHash: data.passwordHash! },
    });
  }
  revalidatePath("/admin/users");
}

export async function deleteUser(id: string) {
  const current = await requireUser();
  if (!canManageUsers(current.role)) throw new Error("Forbidden");
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus) {
  await requireUser();
  await prisma.application.update({ where: { id }, data: { status } });
  revalidatePath("/admin/applications");
  revalidatePath(`/admin/applications/${id}`);
}

export async function saveApplicationNotes(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id"));
  await prisma.application.update({
    where: { id },
    data: { adminNotes: String(formData.get("adminNotes") || "") },
  });
  revalidatePath(`/admin/applications/${id}`);
}
