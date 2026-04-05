import Link from "next/link";
import { ProductCard } from "@/components/features/ProductCard";
import { toCartProduct } from "@/lib/product-map";
import { prisma } from "@/lib/prisma";

const SHOP_CATEGORIES = ["Electronics", "Clothing", "Books", "Home"] as const;

export default async function Home() {
  const featured = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full">
      <section className="relative flex min-h-[calc(100vh-72px)] flex-col justify-center overflow-hidden bg-[var(--ink-black)] px-6 py-20 md:px-12">
        <div className="grain-overlay" aria-hidden />
        <div className="hero-diagonal" aria-hidden>
          <svg viewBox="0 0 800 600" preserveAspectRatio="none">
            <line x1="0" y1="600" x2="800" y2="0" />
            <line x1="120" y1="600" x2="800" y2="80" opacity="0.5" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <h1 className="font-display text-5xl font-light leading-[1.1] text-[var(--eggshell)] md:text-6xl lg:text-7xl">
            Curated for the
            <span className="mt-2 block font-light italic text-[var(--dusty-denim)]">
              Discerning Eye
            </span>
          </h1>
          <p className="mt-8 max-w-lg font-[family-name:var(--font-outfit)] text-lg font-light leading-relaxed text-[var(--eggshell)]/85 md:text-xl">
            Hardware, clothes, books, and kitchen stuff—listed the way we&apos;d write it in
            the notes app, not a press release.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="btn-editorial inline-flex items-center justify-center rounded-sm bg-[var(--eggshell)] px-8 py-3 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--ink-black)] hover:bg-[var(--dusty-denim)] hover:text-[var(--ink-black)]"
            >
              Explore Collection
            </Link>
            <Link
              href="/#about"
              className="btn-editorial inline-flex items-center justify-center rounded-sm border border-[var(--eggshell)] px-8 py-3 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--eggshell)] hover:bg-[var(--eggshell)]/10"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <p className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]">
          Featured
        </p>
        <h2 className="font-display mt-3 text-4xl font-light text-[var(--eggshell)] md:text-[48px]">
          New in stock
        </h2>
        <ul className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <li key={p.id}>
              <ProductCard product={toCartProduct(p)} staggerIndex={i} />
            </li>
          ))}
        </ul>
        {featured.length === 0 && (
          <p className="mt-8 font-[family-name:var(--font-outfit)] text-[var(--dusty-denim)]">
            No products yet. Run{" "}
            <code className="font-mono-ems rounded-sm bg-[var(--deep-space-blue)] px-2 py-1 text-xs text-[var(--eggshell)]">
              npx prisma db seed
            </code>
            .
          </p>
        )}
      </section>

      <section
        id="about"
        className="border-t border-[var(--blue-slate)] bg-[var(--deep-space-blue)]/40 px-4 py-24 md:px-6"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-light text-[var(--eggshell)] md:text-4xl">
            What this is
          </h2>
          <p className="mt-6 font-[family-name:var(--font-outfit)] text-base font-light leading-relaxed text-[var(--eggshell)]/80">
            EMS Store is a full-stack shop demo: cart, checkout, orders, admin—built to behave
            like production software. The inventory below is fake, but the copy is written like
            real product pages.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <p className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]">
          Categories
        </p>
        <h2 className="font-display mt-3 text-3xl font-light text-[var(--eggshell)]">
          Shop by focus
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {SHOP_CATEGORIES.map((c, i) => (
            <Link
              key={c}
              href={`/products?category=${encodeURIComponent(c)}`}
              className="animate-fade-up group flex flex-col items-center justify-center border border-[var(--blue-slate)] bg-[var(--deep-space-blue)] px-4 py-12 text-center transition hover:border-[var(--dusty-denim)] hover:shadow-[0_12px_40px_rgba(13,19,33,0.35)]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="font-[family-name:var(--font-outfit)] text-sm font-normal uppercase tracking-widest text-[var(--eggshell)]">
                {c}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
