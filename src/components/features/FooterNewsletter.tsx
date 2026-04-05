"use client";

import { useState } from "react";

export function FooterNewsletter() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="flex flex-col gap-3 sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <label htmlFor="footer-email" className="sr-only">
        Newsletter email
      </label>
      <input
        id="footer-email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="Email address"
        className="w-full max-w-sm border-b border-[var(--blue-slate)] bg-transparent py-2 font-[family-name:var(--font-outfit)] text-sm text-[var(--eggshell)] placeholder:text-[var(--dusty-denim)]/60 focus:border-[var(--dusty-denim)] focus:outline-none sm:text-right"
      />
      <button
        type="submit"
        className="btn-editorial w-full max-w-sm rounded-sm border border-[var(--blue-slate)] px-4 py-2 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--eggshell)] hover:border-[var(--dusty-denim)] hover:bg-[var(--ink-black)]/30"
      >
        {submitted ? "Subscribed" : "Subscribe"}
      </button>
    </form>
  );
}
