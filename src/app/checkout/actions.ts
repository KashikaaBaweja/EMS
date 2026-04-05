"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth";
import { getShippingCostDollars } from "@/lib/shipping";
import { prisma } from "@/lib/prisma";

export type CheckoutLineInput = {
  productId: string;
  quantity: number;
};

export type ShippingInput = {
  fullName: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
};

export async function createOrder(
  lines: CheckoutLineInput[],
  shipping: ShippingInput,
): Promise<{ error: string } | never> {
  const session = await getSession();
  if (!session?.user?.id) {
    return { error: "You must be signed in to place an order." };
  }

  if (!lines.length) {
    return { error: "Your cart is empty." };
  }

  const trimmed = {
    fullName: shipping.fullName.trim(),
    email: shipping.email.trim(),
    address1: shipping.address1.trim(),
    address2: shipping.address2?.trim() || undefined,
    city: shipping.city.trim(),
    state: shipping.state.trim(),
    zip: shipping.zip.trim(),
  };

  if (
    !trimmed.fullName ||
    !trimmed.email ||
    !trimmed.address1 ||
    !trimmed.city ||
    !trimmed.state ||
    !trimmed.zip
  ) {
    return { error: "Please fill in all required shipping fields." };
  }

  for (const line of lines) {
    if (!line.productId || line.quantity < 1) {
      return { error: "Invalid cart line." };
    }
  }

  let orderId: string;
  try {
    orderId = await prisma.$transaction(async (tx) => {
      const productIds = [...new Set(lines.map((l) => l.productId))];
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new Error("One or more products are no longer available.");
      }

      let subtotal = new Prisma.Decimal(0);
      const pricedLines: { productId: string; quantity: number; price: Prisma.Decimal }[] =
        [];

      for (const line of lines) {
        const product = products.find((p) => p.id === line.productId)!;
        if (product.stock < line.quantity) {
          throw new Error(`Not enough stock for "${product.name}".`);
        }
        subtotal = subtotal.add(product.price.mul(line.quantity));
        pricedLines.push({
          productId: product.id,
          quantity: line.quantity,
          price: product.price,
        });
      }

      const shippingUsd = getShippingCostDollars(Number(subtotal));
      const shipping = new Prisma.Decimal(shippingUsd.toFixed(2));
      const total = subtotal.add(shipping);

      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          subtotal,
          shipping,
          total,
          shipName: trimmed.fullName,
          shipEmail: trimmed.email,
          shipAddress1: trimmed.address1,
          shipAddress2: trimmed.address2,
          shipCity: trimmed.city,
          shipState: trimmed.state,
          shipZip: trimmed.zip,
          items: {
            create: pricedLines.map((l) => ({
              productId: l.productId,
              quantity: l.quantity,
              price: l.price,
            })),
          },
        },
      });

      for (const line of lines) {
        await tx.product.update({
          where: { id: line.productId },
          data: { stock: { decrement: line.quantity } },
        });
      }

      return order.id;
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not create order.";
    return { error: message };
  }

  redirect(`/orders/${orderId}/confirmation`);
}
