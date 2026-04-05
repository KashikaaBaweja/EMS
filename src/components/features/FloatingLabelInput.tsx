"use client";

import type { InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  className?: string;
};

export function FloatingLabelInput({ label, id, name, className = "", ...props }: Props) {
  const inputId = id ?? (name as string | undefined) ?? label.replace(/\s/g, "-").toLowerCase();

  return (
    <div className={`relative pt-1 ${className}`}>
      <input
        id={inputId}
        name={name}
        className="peer w-full border-0 border-b border-[var(--blue-slate)] bg-transparent px-0 py-3 font-[family-name:var(--font-outfit)] text-[var(--eggshell)] placeholder-transparent focus:border-[var(--dusty-denim)] focus:outline-none focus:ring-0"
        placeholder=" "
        {...props}
      />
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute left-0 top-4 origin-left font-[family-name:var(--font-outfit)] text-sm text-[var(--dusty-denim)] transition-all duration-200 peer-focus:-translate-y-5 peer-focus:scale-[0.85] peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-[0.85]"
      >
        {label}
      </label>
    </div>
  );
}
