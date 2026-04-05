"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createOrder, type ShippingInput } from "@/app/checkout/actions";
import { FloatingLabelInput } from "@/components/features/FloatingLabelInput";
import { FREE_SHIPPING_MIN, getShippingCostDollars } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="mb-12 flex items-center justify-center gap-0">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border font-mono-ems text-sm ${
          step === 1
            ? "border-[var(--eggshell)] bg-[var(--eggshell)] text-[var(--ink-black)]"
            : "border-[var(--blue-slate)] text-[var(--dusty-denim)]"
        }`}
      >
        1
      </div>
      <div className="mx-2 h-px w-16 bg-[var(--blue-slate)] sm:w-24" />
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border font-mono-ems text-sm ${
          step === 2
            ? "border-[var(--eggshell)] bg-[var(--eggshell)] text-[var(--ink-black)]"
            : "border-[var(--blue-slate)] text-[var(--dusty-denim)]"
        }`}
      >
        2
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const items = useCartStore((s) => s.items);
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [shipping, setShipping] = useState<ShippingInput>({
    fullName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
  });

  /* eslint-disable react-hooks/set-state-in-effect -- hydrate shipping fields when session becomes available */
  useEffect(() => {
    if (!session?.user) return;
    setShipping((s) => ({
      ...s,
      fullName: s.fullName || session.user?.name || "",
      email: s.email || session.user?.email || "",
    }));
  }, [session]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items],
  );
  const shippingCost = useMemo(
    () => getShippingCostDollars(subtotal),
    [subtotal],
  );
  const total = subtotal + shippingCost;

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="font-[family-name:var(--font-outfit)] text-[var(--dusty-denim)]">
          Loading…
        </p>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <h1 className="font-display text-3xl font-light text-[var(--eggshell)]">
          Checkout
        </h1>
        <p className="mt-4 font-[family-name:var(--font-outfit)] text-[var(--dusty-denim)]">
          <Link
            href="/login?callbackUrl=/checkout"
            className="text-[var(--eggshell)] underline decoration-[var(--blue-slate)] underline-offset-4 hover:decoration-[var(--dusty-denim)]"
          >
            Sign in
          </Link>{" "}
          to complete your order.
        </p>
      </main>
    );
  }

  if (!items.length) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
        <h1 className="font-display text-3xl font-light text-[var(--eggshell)]">
          Checkout
        </h1>
        <p className="mt-4 font-[family-name:var(--font-outfit)] text-[var(--dusty-denim)]">
          Your cart is empty.
        </p>
        <Link
          href="/products"
          className="btn-editorial mt-8 inline-flex rounded-sm bg-[var(--eggshell)] px-6 py-3 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--ink-black)]"
        >
          Continue shopping
        </Link>
      </main>
    );
  }

  async function handlePlaceOrder() {
    setError(null);
    setPending(true);
    const result = await createOrder(
      items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      shipping,
    );
    setPending(false);
    if (result?.error) {
      setError(result.error);
    }
  }

  const summaryCard = (
    <div className="border border-[var(--blue-slate)] bg-[var(--deep-space-blue)] p-8">
      <h2 className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]">
        Summary
      </h2>
      <ul className="mt-6 space-y-3">
        {items.map((line) => (
          <li
            key={line.product.id}
            className="flex justify-between gap-4 font-[family-name:var(--font-outfit)] text-sm text-[var(--eggshell)]"
          >
            <span className="min-w-0">
              {line.product.name}{" "}
              <span className="font-mono-ems text-[var(--dusty-denim)]">
                × {line.quantity}
              </span>
            </span>
            <span className="shrink-0 font-mono-ems">
              {formatPrice(line.product.price * line.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-6 space-y-2 border-t border-[var(--blue-slate)] pt-4 font-mono-ems text-sm text-[var(--eggshell)]">
        <div className="flex justify-between">
          <span className="text-[var(--dusty-denim)]">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--dusty-denim)]">Shipping</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-emerald-400/90">Free</span>
            ) : (
              formatPrice(shippingCost)
            )}
          </span>
        </div>
        {subtotal < FREE_SHIPPING_MIN && (
          <p className="font-[family-name:var(--font-outfit)] text-xs font-light text-[var(--dusty-denim)]">
            Add {formatPrice(FREE_SHIPPING_MIN - subtotal)} more for free shipping (orders{" "}
            {formatPrice(FREE_SHIPPING_MIN)}+).
          </p>
        )}
        <div className="flex justify-between pt-2 text-base">
          <span className="text-[var(--dusty-denim)]">Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <StepIndicator step={step} />

      <h1 className="font-display text-center text-4xl font-light text-[var(--eggshell)]">
        Checkout
      </h1>

      {error && (
        <p
          className="mt-6 rounded-sm border border-red-900/50 bg-red-950/40 px-4 py-3 font-[family-name:var(--font-outfit)] text-sm text-red-200"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="mt-12 lg:grid lg:grid-cols-[1fr_360px] lg:items-start lg:gap-12">
        <div className="min-w-0">
          {step === 1 && (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <FloatingLabelInput
                  label="Full name"
                  name="fullName"
                  required
                  autoComplete="name"
                  className="sm:col-span-2"
                  value={shipping.fullName}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, fullName: e.target.value }))
                  }
                />
                <FloatingLabelInput
                  label="Email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="sm:col-span-2"
                  value={shipping.email}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, email: e.target.value }))
                  }
                />
                <FloatingLabelInput
                  label="Address line 1"
                  name="address1"
                  required
                  autoComplete="address-line1"
                  className="sm:col-span-2"
                  value={shipping.address1}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, address1: e.target.value }))
                  }
                />
                <FloatingLabelInput
                  label="Address line 2 (optional)"
                  name="address2"
                  autoComplete="address-line2"
                  className="sm:col-span-2"
                  value={shipping.address2}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, address2: e.target.value }))
                  }
                />
                <FloatingLabelInput
                  label="City"
                  name="city"
                  required
                  autoComplete="address-level2"
                  value={shipping.city}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, city: e.target.value }))
                  }
                />
                <FloatingLabelInput
                  label="State"
                  name="state"
                  required
                  autoComplete="address-level1"
                  value={shipping.state}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, state: e.target.value }))
                  }
                />
                <FloatingLabelInput
                  label="ZIP"
                  name="zip"
                  required
                  autoComplete="postal-code"
                  className="sm:col-span-2"
                  value={shipping.zip}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, zip: e.target.value }))
                  }
                />
              </div>
              <button
                type="submit"
                className="btn-editorial rounded-sm bg-[var(--eggshell)] px-8 py-3 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--ink-black)] hover:bg-[var(--ink-black)] hover:text-[var(--eggshell)] hover:ring-1 hover:ring-[var(--eggshell)]"
              >
                Continue to payment
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-10">
              <section className="border border-[var(--blue-slate)] bg-[var(--deep-space-blue)]/60 p-6">
                <h2 className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]">
                  Cart
                </h2>
                <ul className="mt-4 divide-y divide-[var(--blue-slate)]/60">
                  {items.map((line) => (
                    <li
                      key={line.product.id}
                      className="flex justify-between gap-4 py-3 font-[family-name:var(--font-outfit)] text-sm text-[var(--eggshell)]"
                    >
                      <span>
                        {line.product.name}{" "}
                        <span className="font-mono-ems text-[var(--dusty-denim)]">
                          × {line.quantity}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono-ems">
                        {formatPrice(line.product.price * line.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="border border-[var(--blue-slate)] bg-[var(--ink-black)]/40 p-6">
                <h2 className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]">
                  Ship to
                </h2>
                <p className="mt-3 font-[family-name:var(--font-outfit)] text-sm leading-relaxed text-[var(--eggshell)]/90">
                  {shipping.fullName}
                  <br />
                  {shipping.email}
                  <br />
                  {shipping.address1}
                  {shipping.address2 && (
                    <>
                      <br />
                      {shipping.address2}
                    </>
                  )}
                  <br />
                  {shipping.city}, {shipping.state} {shipping.zip}
                </p>
              </section>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-sm border border-[var(--blue-slate)] px-5 py-2.5 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--eggshell)] hover:border-[var(--dusty-denim)]"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={pending}
                  className="btn-editorial rounded-sm bg-[var(--eggshell)] px-6 py-2.5 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--ink-black)] hover:bg-[var(--ink-black)] hover:text-[var(--eggshell)] hover:ring-1 hover:ring-[var(--eggshell)] disabled:opacity-50"
                  onClick={() => void handlePlaceOrder()}
                >
                  {pending ? "Placing order…" : "Place order"}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="mt-12 lg:sticky lg:top-28 lg:mt-0">{summaryCard}</aside>
      </div>
    </main>
  );
}
