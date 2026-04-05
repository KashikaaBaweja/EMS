"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";

type Props = {
  product: Product;
  quantity?: number;
};

export function AddToCartButton({ product, quantity = 1 }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="btn-editorial w-full rounded-sm bg-[var(--eggshell)] py-4 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--ink-black)] hover:bg-[var(--ink-black)] hover:text-[var(--eggshell)] hover:ring-1 hover:ring-[var(--eggshell)]"
      onClick={() => {
        addItem(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }}
    >
      {added ? "Added" : "Add to Cart"}
    </button>
  );
}
