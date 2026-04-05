import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ClearCartOnMount } from "@/components/features/ClearCartOnMount";
import { addBusinessDays } from "@/lib/dates";
import { getSession } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ id: string }> };

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
    },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  const delivery = addBusinessDays(order.createdAt, 5);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16 md:px-6">
      <ClearCartOnMount />
      <div className="flex flex-col items-center text-center">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--blue-slate)] bg-[var(--deep-space-blue)] font-mono-ems text-2xl text-[var(--eggshell)]"
          aria-hidden
        >
          ✓
        </div>
        <h1 className="font-display mt-8 text-4xl font-light text-[var(--eggshell)]">
          Order confirmed!
        </h1>
        <p className="mt-3 font-mono-ems text-xs text-[var(--dusty-denim)]">
          Order ID: <span className="text-[var(--eggshell)]">{order.id}</span>
        </p>
      </div>

      <section className="mt-12 border border-[var(--blue-slate)] bg-[var(--deep-space-blue)]/50 p-6 text-left">
        <h2 className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]">
          Items
        </h2>
        <ul className="mt-4 divide-y divide-[var(--blue-slate)]/50">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between gap-4 py-3 font-[family-name:var(--font-outfit)] text-sm text-[var(--eggshell)]"
            >
              <span>
                {item.product.name}{" "}
                <span className="font-mono-ems text-[var(--dusty-denim)]">
                  × {item.quantity}
                </span>
              </span>
              <span className="shrink-0 font-mono-ems">
                {formatPrice(Number(item.price) * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 border-t border-[var(--blue-slate)]/50 pt-4 text-right font-mono-ems text-lg text-[var(--eggshell)]">
          Total {formatPrice(Number(order.total))}
        </p>
      </section>

      <p className="mt-8 text-center font-[family-name:var(--font-outfit)] text-sm text-[var(--dusty-denim)]">
        Estimated delivery by{" "}
        <time dateTime={delivery.toISOString()}>
          {delivery.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
      </p>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link
          href="/products"
          className="btn-editorial rounded-sm bg-[var(--eggshell)] px-5 py-2.5 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--ink-black)] hover:bg-[var(--ink-black)] hover:text-[var(--eggshell)] hover:ring-1 hover:ring-[var(--eggshell)]"
        >
          Continue shopping
        </Link>
        <Link
          href="/orders"
          className="rounded-sm border border-[var(--blue-slate)] px-5 py-2.5 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--eggshell)] hover:border-[var(--dusty-denim)]"
        >
          View all orders
        </Link>
      </div>
    </main>
  );
}
