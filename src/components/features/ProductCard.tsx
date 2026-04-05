"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

type Props = {
  product: Product;
  staggerIndex?: number;
};

export function ProductCard({ product, staggerIndex = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const delay = `${staggerIndex * 0.1}s`;

  return (
    <article
      className="animate-fade-up group flex h-full min-h-[380px] flex-col overflow-hidden rounded-sm border border-transparent bg-[var(--deep-space-blue)] shadow-none transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-1 hover:border-[var(--blue-slate)] hover:shadow-[0_20px_50px_rgba(13,19,33,0.45)]"
      style={{ animationDelay: delay }}
    >
      <div className="relative flex min-h-0 flex-[3] flex-col overflow-hidden">
        <div className="relative h-full min-h-[220px] flex-1">
          <Link href={`/products/${product.id}`} className="relative block h-full min-h-[220px] w-full">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt=""
                fill
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full min-h-[220px] items-center justify-center bg-[var(--ink-black)]/40 font-mono-ems text-xs text-[var(--dusty-denim)]">
                No image
              </div>
            )}
          </Link>
          {/* Hover: soft vignette — no sliding “curtain” */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--ink-black)] via-[var(--ink-black)]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
          {/* Editorial CTA dock: fades + rises slightly; container ignores pointer events except the button */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center px-4 pb-5 pt-16">
            <button
              type="button"
              className="pointer-events-auto flex translate-y-3 items-center gap-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
              onClick={() => addItem(product, 1)}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--eggshell)]/90 text-[var(--eggshell)] transition-colors duration-200 hover:bg-[var(--eggshell)] hover:text-[var(--ink-black)]"
                aria-hidden
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path
                    d="M7 1v12M1 7h12"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="flex flex-col items-start border-l border-[var(--blue-slate)] pl-3 text-left">
                <span className="font-mono-ems text-[9px] uppercase tracking-[0.2em] text-[var(--dusty-denim)]">
                  Quick add
                </span>
                <span className="font-[family-name:var(--font-outfit)] text-[11px] font-normal uppercase tracking-[0.18em] text-[var(--eggshell)]">
                  Add to bag
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-[2] flex-col justify-between p-5">
        <Link href={`/products/${product.id}`} className="block">
          <p className="font-mono-ems text-[10px] uppercase tracking-widest text-[var(--dusty-denim)]">
            {product.category ?? "—"}
          </p>
          <h2 className="mt-2 line-clamp-2 font-[family-name:var(--font-outfit)] text-base font-normal text-[var(--eggshell)]">
            {product.name}
          </h2>
          <p className="mt-3 font-mono-ems text-base text-[var(--eggshell)]">
            {formatPrice(product.price)}
          </p>
        </Link>
      </div>
    </article>
  );
}
