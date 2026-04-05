"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItem as CartLine } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

type Props = {
  line: CartLine;
};

export function CartItem({ line }: Props) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { product, quantity } = line;

  return (
    <li className="flex flex-wrap items-start gap-4 border-b border-[var(--blue-slate)]/50 py-8 last:border-0">
      <Link
        href={`/products/${product.id}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-[var(--deep-space-blue)]"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono-ems text-xs text-[var(--dusty-denim)]">
            —
          </div>
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/products/${product.id}`}
          className="font-[family-name:var(--font-outfit)] text-base font-normal text-[var(--eggshell)] hover:text-[var(--dusty-denim)]"
        >
          {product.name}
        </Link>
        <p className="font-mono-ems mt-1 text-sm text-[var(--dusty-denim)]">
          {formatPrice(product.price)} each
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="inline-flex items-center gap-3 rounded-full bg-[var(--deep-space-blue)] px-2 py-1 font-mono-ems text-sm text-[var(--eggshell)]">
            <button
              type="button"
              className="px-2 py-0.5 text-lg leading-none text-[var(--dusty-denim)] hover:text-[var(--eggshell)]"
              aria-label="Decrease quantity"
              onClick={() =>
                updateQuantity(product.id, Math.max(1, quantity - 1))
              }
            >
              —
            </button>
            <span className="min-w-[2ch] text-center tabular-nums">{quantity}</span>
            <button
              type="button"
              className="px-2 py-0.5 text-lg leading-none text-[var(--dusty-denim)] hover:text-[var(--eggshell)]"
              aria-label="Increase quantity"
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="font-mono-ems text-xs uppercase tracking-widest text-red-400/90 hover:text-red-300"
            onClick={() => removeItem(product.id)}
          >
            Remove
          </button>
        </div>
      </div>
      <div className="text-right font-mono-ems text-base text-[var(--eggshell)]">
        {formatPrice(product.price * quantity)}
      </div>
    </li>
  );
}
