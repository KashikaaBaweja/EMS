/** Subtotal at or above this (USD) gets free shipping. */
export const FREE_SHIPPING_MIN = 50;

export const SHIPPING_FLAT = 9.99;

export function getShippingCostDollars(subtotal: number): number {
  if (!Number.isFinite(subtotal) || subtotal < 0) return SHIPPING_FLAT;
  return subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FLAT;
}
