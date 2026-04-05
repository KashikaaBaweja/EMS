import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchasePanel } from "@/components/features/ProductPurchasePanel";
import { toCartProduct } from "@/lib/product-map";
import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const ui = toCartProduct(product);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <nav className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]">
        <Link href="/" className="hover:text-[var(--eggshell)]">
          Home
        </Link>
        <span className="mx-2 text-[var(--blue-slate)]">/</span>
        <Link href="/products" className="hover:text-[var(--eggshell)]">
          Products
        </Link>
        <span className="mx-2 text-[var(--blue-slate)]">/</span>
        <span className="text-[var(--eggshell)]/80">{product.name}</span>
      </nav>

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-sm border border-[var(--blue-slate)] bg-[var(--deep-space-blue)] lg:sticky lg:top-24 lg:self-start">
          {product.image ? (
            <Image
              src={product.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center font-mono-ems text-[var(--dusty-denim)]">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0">
          <span className="inline-block rounded-full border border-[var(--blue-slate)] px-3 py-1 font-mono-ems text-[10px] uppercase tracking-widest text-[var(--dusty-denim)]">
            {product.category}
          </span>

          <h1 className="font-display mt-6 text-4xl font-light leading-tight text-[var(--eggshell)] md:text-[52px]">
            {product.name}
          </h1>

          <p className="font-mono-ems mt-6 text-[32px] text-[var(--eggshell)]">
            {formatPrice(ui.price)}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                product.stock > 0 ? "bg-emerald-500" : "bg-red-500"
              }`}
              aria-hidden
            />
            <span
              className={`font-mono-ems text-xs uppercase tracking-widest ${
                product.stock > 0 ? "text-emerald-400/90" : "text-red-400/90"
              }`}
            >
              {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
            </span>
          </div>

          <div className="my-10 h-px bg-[var(--blue-slate)]" />

          {product.description && (
            <>
              <p className="font-[family-name:var(--font-outfit)] text-base font-light leading-relaxed text-[var(--eggshell)]/85">
                {product.description}
              </p>
              <div className="mt-10 h-px bg-[var(--blue-slate)]" />
            </>
          )}

          <div className="mt-10">
            <ProductPurchasePanel product={ui} maxStock={product.stock} />
          </div>
        </div>
      </div>
    </main>
  );
}
