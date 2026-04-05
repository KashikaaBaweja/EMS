"use client";

import Link from "next/link";
import { CartItem } from "@/components/features/CartItem";
import { FREE_SHIPPING_MIN, getShippingCostDollars } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useMemo } from "react";

export default function CartPage() {
  const items = useCartStore((s) => s.items);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items],
  );
  const shipping = useMemo(
    () => getShippingCostDollars(subtotal),
    [subtotal],
  );
  const orderTotal = subtotal + shipping;

  if (!items.length) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-24 text-center md:px-6">
        <h1 className="font-display text-4xl font-light text-[var(--eggshell)]">
          Your cart
        </h1>
        <p className="mt-4 font-[family-name:var(--font-outfit)] text-[var(--dusty-denim)]">
          Your cart is empty.
        </p>
        <Link
          href="/products"
          className="btn-editorial mt-10 inline-flex rounded-sm bg-[var(--eggshell)] px-8 py-3 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--ink-black)] hover:bg-[var(--dusty-denim)]"
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
      <h1 className="font-display text-4xl font-light text-[var(--eggshell)]">
        Your cart
      </h1>

      <div className="mt-12 lg:grid lg:grid-cols-[1fr_380px] lg:items-start lg:gap-14">
        <ul className="min-w-0">
          {items.map((line) => (
            <CartItem key={line.product.id} line={line} />
          ))}
        </ul>

        <aside className="mt-12 h-fit border border-[var(--blue-slate)] bg-[var(--deep-space-blue)] p-8 lg:sticky lg:top-28 lg:mt-0">
          <h2 className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]">
            Order summary
          </h2>
          <dl className="mt-6 space-y-3">
            <div className="flex justify-between font-mono-ems text-sm text-[var(--eggshell)]">
              <dt className="text-[var(--dusty-denim)]">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between font-mono-ems text-sm text-[var(--eggshell)]">
              <dt className="text-[var(--dusty-denim)]">Shipping</dt>
              <dd>
                {shipping === 0 ? (
                  <span className="text-emerald-400/90">Free</span>
                ) : (
                  formatPrice(shipping)
                )}
              </dd>
            </div>
            {subtotal < FREE_SHIPPING_MIN && (
              <p className="font-[family-name:var(--font-outfit)] text-xs font-light text-[var(--dusty-denim)]">
                Add {formatPrice(FREE_SHIPPING_MIN - subtotal)} more for free shipping on
                orders {formatPrice(FREE_SHIPPING_MIN)}+.
              </p>
            )}
            <div className="flex justify-between border-t border-[var(--blue-slate)] pt-4 font-mono-ems text-base text-[var(--eggshell)]">
              <dt>Total</dt>
              <dd>{formatPrice(orderTotal)}</dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="btn-editorial mt-8 block w-full rounded-sm bg-[var(--eggshell)] py-4 text-center font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--ink-black)] hover:bg-[var(--ink-black)] hover:text-[var(--eggshell)] hover:ring-1 hover:ring-[var(--eggshell)]"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </main>
  );
}
