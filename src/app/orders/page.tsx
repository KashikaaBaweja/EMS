import Link from "next/link";
import { redirect } from "next/navigation";
import type { OrderStatus } from "@/generated/prisma/enums";
import { getSession } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

function statusClass(status: OrderStatus): string {
  switch (status) {
    case "PENDING":
      return "border-[var(--blue-slate)] text-[var(--dusty-denim)]";
    case "PROCESSING":
      return "border-[var(--dusty-denim)] text-[var(--eggshell)]";
    case "SHIPPED":
      return "border-[var(--eggshell)]/40 text-[var(--eggshell)]";
    case "DELIVERED":
      return "border-emerald-700/60 text-emerald-300/90";
    default:
      return "border-[var(--blue-slate)] text-[var(--eggshell)]";
  }
}

export default async function OrdersPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6">
      <h1 className="font-display text-4xl font-light text-[var(--eggshell)]">
        Your orders
      </h1>

      {orders.length === 0 ? (
        <div className="mt-12 border border-dashed border-[var(--blue-slate)] bg-[var(--deep-space-blue)]/40 px-6 py-16 text-center">
          <p className="font-[family-name:var(--font-outfit)] text-[var(--dusty-denim)]">
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/products"
            className="btn-editorial mt-6 inline-block font-mono-ems text-xs uppercase tracking-widest text-[var(--eggshell)] underline decoration-[var(--blue-slate)] underline-offset-4 hover:decoration-[var(--dusty-denim)]"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex flex-col gap-4 border border-[var(--blue-slate)] bg-[var(--deep-space-blue)]/50 p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-mono-ems text-xs text-[var(--dusty-denim)]">
                  {order.id.slice(0, 8)}…
                </p>
                <p className="mt-1 font-[family-name:var(--font-outfit)] text-sm text-[var(--eggshell)]/75">
                  {order.createdAt.toLocaleDateString("en-US", {
                    dateStyle: "medium",
                  })}
                </p>
                <span
                  className={`mt-3 inline-block rounded-full border px-3 py-1 font-mono-ems text-[10px] uppercase tracking-widest ${statusClass(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-[family-name:var(--font-outfit)] text-sm text-[var(--dusty-denim)]">
                  {order.items.length} item{order.items.length === 1 ? "" : "s"}
                </p>
                <p className="font-mono-ems mt-1 text-lg text-[var(--eggshell)]">
                  {formatPrice(Number(order.total))}
                </p>
                <Link
                  href={`/orders/${order.id}`}
                  className="btn-editorial mt-3 inline-block font-mono-ems text-xs uppercase tracking-widest text-[var(--dusty-denim)] hover:text-[var(--eggshell)]"
                >
                  View details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
