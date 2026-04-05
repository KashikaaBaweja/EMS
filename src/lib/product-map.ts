import type { Product as DbProduct } from "@/generated/prisma/client";
import type { Product } from "@/types";

export function toCartProduct(p: DbProduct): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? undefined,
    price: Number(p.price),
    imageUrl: p.image ?? undefined,
    category: p.category,
  };
}
