"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { FloatingLabelInput } from "@/components/features/FloatingLabelInput";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setPending(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

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
          Log in
        </h1>
        <p className="mt-2 text-center font-[family-name:var(--font-outfit)] text-sm text-[var(--dusty-denim)]">
          New here?{" "}
          <Link
            href="/register"
            className="text-[var(--eggshell)] underline decoration-[var(--blue-slate)] underline-offset-4 hover:decoration-[var(--dusty-denim)]"
          >
            Create an account
          </Link>
        </p>

        {registered && (
          <p className="mt-6 rounded-sm border border-emerald-900/40 bg-emerald-950/30 px-4 py-3 font-[family-name:var(--font-outfit)] text-sm text-emerald-200">
            Account created. You can log in now.
          </p>
        )}

        {error && (
          <p
            className="mt-6 rounded-sm border border-red-900/50 bg-red-950/40 px-4 py-3 font-[family-name:var(--font-outfit)] text-sm text-red-200"
            role="alert"
          >
            {error}
          </p>
        )}

        <form onSubmit={(e) => void onSubmit(e)} className="mt-10 space-y-8">
          <FloatingLabelInput
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FloatingLabelInput
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={pending}
            className="btn-editorial w-full rounded-sm bg-[var(--eggshell)] py-3 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--ink-black)] hover:bg-[var(--dusty-denim)] disabled:opacity-50"
          >
            {pending ? "Signing in…" : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <p className="py-24 text-center font-[family-name:var(--font-outfit)] text-[var(--dusty-denim)]">
          Loading…
        </p>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
