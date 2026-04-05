import Link from "next/link";
import { redirect } from "next/navigation";
import { OrderStatusSelect } from "@/app/admin/OrderStatusSelect";
import { getSession } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [orderCount, revenueAgg, productCount, userCount, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { email: true } },
          items: true,
        },
      }),
    ]);

  const revenue = Number(revenueAgg._sum.total ?? 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-light text-[var(--eggshell)]">Admin</h1>
        <Link
          href="/admin/products/new"
          className="btn-editorial rounded-sm bg-[var(--eggshell)] px-4 py-2 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--ink-black)] hover:bg-[var(--dusty-denim)]"
        >
          Add product
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Orders" value={String(orderCount)} />
        <StatCard label="Revenue" value={formatPrice(revenue)} />
        <StatCard label="Products" value={String(productCount)} />
        <StatCard label="Users" value={String(userCount)} />
      </div>

      <section className="mt-14">
        <h2 className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]">
          Recent orders
        </h2>
        <div className="mt-4 overflow-x-auto rounded-sm border border-[var(--blue-slate)] bg-[var(--deep-space-blue)]/50">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="font-mono-ems text-[10px] uppercase tracking-widest text-[var(--dusty-denim)]">
                <th className="px-4 py-3 font-normal">Order ID</th>
                <th className="px-4 py-3 font-normal">Customer</th>
                <th className="px-4 py-3 font-normal">Items</th>
                <th className="px-4 py-3 font-normal">Total</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o, i) => (
                <tr
                  key={o.id}
                  className={`font-[family-name:var(--font-outfit)] text-[var(--eggshell)] ${
                    i % 2 === 0 ? "bg-[var(--ink-black)]/15" : "bg-transparent"
                  }`}
                >
                  <td className="px-4 py-3 font-mono-ems text-xs text-[var(--dusty-denim)]">
                    {o.id.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3">{o.user.email}</td>
                  <td className="px-4 py-3 text-[var(--eggshell)]/80">{o.items.length}</td>
                  <td className="px-4 py-3 font-mono-ems">{formatPrice(Number(o.total))}</td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect orderId={o.id} status={o.status} />
                  </td>
                  <td className="px-4 py-3 text-[var(--eggshell)]/70">
                    {o.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[var(--blue-slate)] bg-[var(--deep-space-blue)] px-6 py-6">
      <p className="font-[family-name:var(--font-outfit)] text-[12px] font-normal text-[var(--dusty-denim)]">
        {label}
      </p>
      <p className="font-mono-ems mt-2 text-4xl text-[var(--eggshell)]">{value}</p>
    </div>
  );
}
