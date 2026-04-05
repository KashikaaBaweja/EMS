import Link from "next/link";
import { ProductCard } from "@/components/features/ProductCard";
import { toCartProduct } from "@/lib/product-map";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { category: categoryParam } = await searchParams;
  const category = categoryParam?.trim();

  const all = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const categories = [...new Set(all.map((p) => p.category))].sort();
  const products = category
    ? all.filter((p) => p.category === category)
    : all;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-14 md:px-6">
      <header className="text-left">
        <p className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]">
          Collection
        </p>
        <h1 className="font-display mt-2 text-4xl font-light text-[var(--eggshell)] md:text-5xl">
          All Products
        </h1>
      </header>

      <div className="mt-10 flex flex-wrap gap-2">
        <FilterLink active={!category} href="/products" label="All" />
        {categories.map((c) => (
          <FilterLink
            key={c}
            active={category === c}
            href={`/products?category=${encodeURIComponent(c)}`}
            label={c}
          />
        ))}
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p, i) => (
          <li key={p.id}>
            <ProductCard product={toCartProduct(p)} staggerIndex={i} />
          </li>
        ))}
      </ul>

      {products.length === 0 && (
        <p className="mt-16 text-center font-[family-name:var(--font-outfit)] text-[var(--dusty-denim)]">
          No products in this category.{" "}
          <Link href="/products" className="text-[var(--eggshell)] underline decoration-[var(--blue-slate)] underline-offset-4 hover:decoration-[var(--dusty-denim)]">
            View all
          </Link>
        </p>
      )}
    </main>
  );
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest transition ${
        active
          ? "border-[var(--eggshell)] bg-[var(--eggshell)] text-[var(--ink-black)]"
          : "border-[var(--blue-slate)] text-[var(--eggshell)] hover:border-[var(--dusty-denim)]"
      }`}
    >
      {label}
    </Link>
  );
}
