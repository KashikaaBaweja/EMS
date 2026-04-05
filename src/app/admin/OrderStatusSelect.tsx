"use client";

import type { OrderStatus } from "@/generated/prisma/enums";
import { updateOrderStatus } from "@/app/admin/actions";

const OPTIONS: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
];

type Props = {
  orderId: string;
  status: OrderStatus;
};

export function OrderStatusSelect({ orderId, status }: Props) {
  return (
    <select
      aria-label="Update order status"
      className="w-full max-w-[160px] rounded-sm border border-[var(--blue-slate)] bg-[var(--ink-black)]/40 px-2 py-1.5 font-mono-ems text-xs text-[var(--eggshell)] focus:border-[var(--dusty-denim)] focus:outline-none"
      defaultValue={status}
      onChange={(e) => {
        const next = e.target.value as OrderStatus;
        void updateOrderStatus(orderId, next);
      }}
    >
      {OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
