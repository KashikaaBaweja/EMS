"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home"] as const;

async function requireAdmin() {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/");
  }
}

export type ProductFormState = { error?: string };

export async function createProduct(
  _prev: ProductFormState | undefined,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const priceRaw = String(formData.get("price") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const stockRaw = String(formData.get("stock") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim() || null;

  if (!name || !priceRaw || !category || !stockRaw) {
    return { error: "Name, price, category, and stock are required." };
  }

  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { error: "Invalid category." };
  }

  const price = new Prisma.Decimal(priceRaw);
  if (price.lessThanOrEqualTo(0)) {
    return { error: "Price must be greater than zero." };
  }

  const stock = Number.parseInt(stockRaw, 10);
  if (!Number.isFinite(stock) || stock < 0) {
    return { error: "Stock must be a non-negative integer." };
  }

  await prisma.product.create({
    data: {
      name,
      description,
      price,
      category,
      stock,
      image,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function updateProduct(
  productId: string,
  _prev: ProductFormState | undefined,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const priceRaw = String(formData.get("price") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const stockRaw = String(formData.get("stock") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim() || null;

  if (!name || !priceRaw || !category || !stockRaw) {
    return { error: "Name, price, category, and stock are required." };
  }

  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { error: "Invalid category." };
  }

  const price = new Prisma.Decimal(priceRaw);
  if (price.lessThanOrEqualTo(0)) {
    return { error: "Price must be greater than zero." };
  }

  const stock = Number.parseInt(stockRaw, 10);
  if (!Number.isFinite(stock) || stock < 0) {
    return { error: "Stock must be a non-negative integer." };
  }

  await prisma.product.update({
    where: { id: productId },
    data: { name, description, price, category, stock, image },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  redirect("/admin/products");
}
