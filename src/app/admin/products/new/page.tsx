"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import {
  createProduct,
  type ProductFormState,
} from "@/app/admin/products/actions";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home"] as const;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-editorial rounded-sm bg-[var(--eggshell)] px-5 py-2.5 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--ink-black)] hover:bg-[var(--dusty-denim)] disabled:opacity-50"
    >
      {pending ? "Saving…" : "Create product"}
    </button>
  );
}

const field =
  "mt-2 w-full border-0 border-b border-[var(--blue-slate)] bg-transparent py-2 font-[family-name:var(--font-outfit)] text-[var(--eggshell)] focus:border-[var(--dusty-denim)] focus:outline-none";
const label = "font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)]";

export default function NewProductPage() {
  const [state, action] = useFormState<
    ProductFormState | undefined,
    FormData
  >(createProduct, undefined);

  return (
    <main className="mx-auto max-w-lg px-4 py-10 md:px-8">
      <Link
        href="/admin/products"
        className="font-mono-ems text-[11px] uppercase tracking-widest text-[var(--dusty-denim)] hover:text-[var(--eggshell)]"
      >
        ← Products
      </Link>
      <h1 className="font-display mt-6 text-3xl font-light text-[var(--eggshell)]">
        New product
      </h1>

      {state && "error" in state && state.error && (
        <p className="mt-4 rounded-sm border border-red-900/50 bg-red-950/40 px-4 py-3 font-[family-name:var(--font-outfit)] text-sm text-red-200">
          {state.error}
        </p>
      )}

      <form action={action} className="mt-10 space-y-8">
        <label className="block">
          <span className={label}>Name</span>
          <input required name="name" className={field} />
        </label>
        <label className="block">
          <span className={label}>Description</span>
          <textarea name="description" rows={3} className={`${field} resize-y`} />
        </label>
        <label className="block">
          <span className={label}>Price (USD)</span>
          <input
            required
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            className={field}
          />
        </label>
        <label className="block">
          <span className={label}>Category</span>
          <select required name="category" className={`${field} bg-[var(--deep-space-blue)]`}>
            <option value="">Select…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={label}>Stock</span>
          <input
            required
            name="stock"
            type="number"
            min="0"
            step="1"
            className={field}
          />
        </label>
        <label className="block">
          <span className={label}>Image URL</span>
          <input name="image" type="url" className={field} placeholder="https://…" />
        </label>
        <SubmitButton />
      </form>
    </main>
  );
}
