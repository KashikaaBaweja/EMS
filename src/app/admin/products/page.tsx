import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteProduct } from "@/app/admin/products/actions";
import { getSession } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-light text-[var(--eggshell)]">Products</h1>
        <Link
          href="/admin/products/new"
          className="btn-editorial rounded-sm bg-[var(--eggshell)] px-4 py-2 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--ink-black)] hover:bg-[var(--dusty-denim)]"
        >
          Add product
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-sm border border-[var(--blue-slate)] bg-[var(--deep-space-blue)]/50">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="font-mono-ems text-[10px] uppercase tracking-widest text-[var(--dusty-denim)]">
              <th className="px-4 py-3 font-normal">Image</th>
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Category</th>
              <th className="px-4 py-3 font-normal">Price</th>
              <th className="px-4 py-3 font-normal">Stock</th>
              <th className="px-4 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr
                key={p.id}
                className={`font-[family-name:var(--font-outfit)] text-[var(--eggshell)] ${
                  i % 2 === 0 ? "bg-[var(--ink-black)]/15" : "bg-transparent"
                }`}
              >
                <td className="px-4 py-3">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt=""
                      className="h-12 w-12 rounded-sm object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[var(--ink-black)]/40 font-mono-ems text-xs text-[var(--dusty-denim)]">
                      —
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-normal">{p.name}</td>
                <td className="px-4 py-3 text-[var(--eggshell)]/75">{p.category}</td>
                <td className="px-4 py-3 font-mono-ems">{formatPrice(Number(p.price))}</td>
                <td className="px-4 py-3 text-[var(--eggshell)]/75">{p.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3 font-mono-ems text-xs uppercase tracking-widest">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-[var(--dusty-denim)] hover:text-[var(--eggshell)]"
                    >
                      Edit
                    </Link>
                    <form action={deleteProduct.bind(null, p.id)}>
                      <button
                        type="submit"
                        className="text-red-400/90 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
