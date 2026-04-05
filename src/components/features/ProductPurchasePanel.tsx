"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { AddToCartButton } from "@/components/features/AddToCartButton";

type Props = {
  product: Product;
  maxStock: number;
};

export function ProductPurchasePanel({ product, maxStock }: Props) {
  const maxSelectable = Math.min(10, Math.max(1, maxStock));
  const [qty, setQty] = useState(1);

  const safeQty = useMemo(
    () => Math.min(Math.max(1, qty), maxSelectable),
    [qty, maxSelectable],
  );

  if (maxStock <= 0) {
    return (
      <p className="font-[family-name:var(--font-outfit)] text-sm text-[var(--dusty-denim)]">
        Out of stock
      </p>
    );
  }

  function bump(delta: number) {
    setQty((q) => {
      const next = q + delta;
      return Math.min(Math.max(1, next), maxSelectable);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]">
          Quantity
        </p>
        <div className="mt-3 inline-flex items-center gap-4 font-mono-ems text-lg text-[var(--eggshell)]">
          <button
            type="button"
            className="rounded-full px-2 py-1 text-2xl leading-none text-[var(--dusty-denim)] hover:text-[var(--eggshell)] disabled:opacity-40"
            aria-label="Decrease quantity"
            disabled={safeQty <= 1}
            onClick={() => bump(-1)}
          >
            —
          </button>
          <span className="min-w-[2ch] text-center tabular-nums">{safeQty}</span>
          <button
            type="button"
            className="rounded-full px-2 py-1 text-2xl leading-none text-[var(--dusty-denim)] hover:text-[var(--eggshell)] disabled:opacity-40"
            aria-label="Increase quantity"
            disabled={safeQty >= maxSelectable}
            onClick={() => bump(1)}
          >
            +
          </button>
        </div>
      </div>
      <AddToCartButton product={product} quantity={safeQty} />
    </div>
  );
}
