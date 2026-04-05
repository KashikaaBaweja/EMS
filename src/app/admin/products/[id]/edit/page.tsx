import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EditProductForm } from "@/app/admin/products/[id]/edit/EditProductForm";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <main className="mx-auto max-w-lg px-4 py-10 md:px-8">
      <Link
        href="/admin/products"
        className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)] hover:text-[var(--eggshell)]"
      >
        ← Products
      </Link>
      <h1 className="font-display mt-6 text-3xl font-light text-[var(--eggshell)]">
        Edit product
      </h1>
      <EditProductForm product={product} />
    </main>
  );
}
