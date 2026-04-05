import Link from "next/link";
import { FooterNewsletter } from "@/components/features/FooterNewsletter";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--blue-slate)] bg-[var(--deep-space-blue)]">
      <div
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
        aria-hidden
      >
        <span className="font-display text-[min(22vw,280px)] font-light leading-none tracking-tight text-[var(--eggshell)] opacity-[0.06]">
          EMS STORE
        </span>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-3 md:items-start">
        <div>
          <p className="font-[family-name:var(--font-outfit)] text-sm font-light leading-relaxed text-[var(--eggshell)]/90">
            Demo store for testing flows—shipping rules, stock counts, and receipts included.
          </p>
        </div>

        <nav className="flex flex-col items-center gap-3 text-center">
          <Link
            href="/"
            className="nav-link-underline font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--eggshell)]"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="nav-link-underline font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--eggshell)]"
          >
            Products
          </Link>
          <Link
            href="/#about"
            className="nav-link-underline font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--eggshell)]"
          >
            About
          </Link>
        </nav>

        <div className="md:text-right">
          <FooterNewsletter />
        </div>
      </div>

      <div className="relative border-t border-[var(--blue-slate)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 sm:flex-row">
          <p className="font-mono-ems text-[11px] text-[var(--dusty-denim)]">
            © {new Date().getFullYear()} EMS Store
          </p>
          <p className="font-mono-ems text-[11px] text-[var(--dusty-denim)]">
            Crafted with precision
          </p>
        </div>
      </div>
    </footer>
  );
}
