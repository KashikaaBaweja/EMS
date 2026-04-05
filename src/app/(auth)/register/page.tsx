"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import {
  registerUser,
  type RegisterState,
} from "@/app/(auth)/register/actions";
import { FloatingLabelInput } from "@/components/features/FloatingLabelInput";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-editorial w-full rounded-sm bg-[var(--eggshell)] py-3 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--ink-black)] hover:bg-[var(--dusty-denim)] disabled:opacity-50"
    >
      {pending ? "Creating account…" : "Create account"}
    </button>
  );
}

export default function RegisterPage() {
  const [state, action] = useFormState<RegisterState | undefined, FormData>(
    registerUser,
    undefined,
  );

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md border border-[var(--blue-slate)] bg-[var(--deep-space-blue)] px-8 py-12">
        <div className="text-center">
          <p className="font-display text-3xl font-light tracking-[0.15em] text-[var(--eggshell)]">
            EMS
          </p>
          <p className="font-mono-ems mt-1 text-[10px] uppercase tracking-widest text-[var(--dusty-denim)]">
            Store
          </p>
        </div>

        <h1 className="font-display mt-10 text-center text-3xl font-light text-[var(--eggshell)]">
          Create account
        </h1>
        <p className="mt-2 text-center font-[family-name:var(--font-outfit)] text-sm text-[var(--dusty-denim)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--eggshell)] underline decoration-[var(--blue-slate)] underline-offset-4 hover:decoration-[var(--dusty-denim)]"
          >
            Log in
          </Link>
        </p>

        {state?.error && (
          <p
            className="mt-6 rounded-sm border border-red-900/50 bg-red-950/40 px-4 py-3 font-[family-name:var(--font-outfit)] text-sm text-red-200"
            role="alert"
          >
            {state.error}
          </p>
        )}

        <form action={action} className="mt-10 space-y-8">
          <FloatingLabelInput label="Name" name="name" autoComplete="name" required />
          <FloatingLabelInput
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <FloatingLabelInput
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <FloatingLabelInput
            label="Confirm password"
            name="confirm"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <SubmitButton />
        </form>
      </div>
    </main>
  );
}
