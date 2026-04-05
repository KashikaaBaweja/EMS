import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { OrderStatus } from "@/generated/prisma/enums";
import { getSession } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

const TIMELINE: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
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

  const rawIndex = TIMELINE.indexOf(order.status);
  const currentIndex = rawIndex === -1 ? 0 : rawIndex;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6">
      <Link
        href="/orders"
        className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)] hover:text-[var(--eggshell)]"
      >
        ← All orders
      </Link>
      <h1 className="font-display mt-6 text-4xl font-light text-[var(--eggshell)]">
        Order details
      </h1>
      <p className="font-mono-ems mt-2 text-xs text-[var(--dusty-denim)]">{order.id}</p>
      <p className="mt-1 font-[family-name:var(--font-outfit)] text-sm text-[var(--eggshell)]/75">
        Placed{" "}
        {order.createdAt.toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </p>

      <section className="mt-12">
        <h2 className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]">
          Status
        </h2>
        <ol className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {TIMELINE.map((step, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            return (
              <li
                key={step}
                className={`flex items-center gap-2 rounded-sm border px-3 py-2 font-mono-ems text-xs uppercase tracking-widest ${
                  active
                    ? "border-[var(--eggshell)] bg-[var(--eggshell)]/10 text-[var(--eggshell)]"
                    : done
                      ? "border-[var(--blue-slate)] text-[var(--dusty-denim)]"
                      : "border-[var(--blue-slate)]/60 text-[var(--dusty-denim)]/70"
                }`}
              >
                <span className="hidden sm:inline">
                  {done ? "✓ " : ""}
                  {step.charAt(0) + step.slice(1).toLowerCase()}
                </span>
                <span className="sm:hidden">
                  {done ? "✓ " : active ? "● " : "○ "}
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-10 border border-[var(--blue-slate)] bg-[var(--deep-space-blue)]/50 p-6">
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
        <div className="mt-4 space-y-2 border-t border-[var(--blue-slate)]/50 pt-4 font-mono-ems text-sm text-[var(--eggshell)]">
          <div className="flex justify-between text-[var(--dusty-denim)]">
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-[var(--dusty-denim)]">
            <span>Shipping</span>
            <span>{formatPrice(Number(order.shipping))}</span>
          </div>
          <div className="flex justify-between pt-2 text-base text-[var(--eggshell)]">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </section>

      <section className="mt-8 border border-[var(--blue-slate)] bg-[var(--ink-black)]/40 p-6">
        <h2 className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]">
          Shipping address
        </h2>
        <p className="mt-3 font-[family-name:var(--font-outfit)] text-sm leading-relaxed text-[var(--eggshell)]/90">
          {order.shipName}
          <br />
          {order.shipEmail}
          <br />
          {order.shipAddress1}
          {order.shipAddress2 && (
            <>
              <br />
              {order.shipAddress2}
            </>
          )}
          <br />
          {order.shipCity}, {order.shipState} {order.shipZip}
        </p>
      </section>
    </main>
  );
}
