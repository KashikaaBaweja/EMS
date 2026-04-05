"use client";

import Link from "next/link";
import { Fragment } from "react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useCartStore } from "@/store/cartStore";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/products", label: "PRODUCTS" },
  { href: "/#about", label: "ABOUT" },
] as const;

export function Navbar() {
  const { data: session, status } = useSession();
  const itemCount = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.quantity, 0),
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isAdmin = session?.user?.role === "ADMIN";

  const initials = useMemo(() => {
    const n = session?.user?.name || session?.user?.email || "?";
    return n.slice(0, 2).toUpperCase();
  }, [session?.user?.email, session?.user?.name]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 h-[72px] border-b border-[var(--blue-slate)] transition-[background-color,backdrop-filter] duration-200 ${
        scrolled
          ? "bg-[var(--ink-black)]/85 backdrop-blur-md"
          : "bg-[var(--ink-black)]"
      }`}
    >
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-[28px] font-light tracking-[0.2em] text-[var(--eggshell)]">
            EMS
          </span>
          <span className="font-mono-ems mt-0.5 text-[11px] tracking-widest text-[var(--dusty-denim)]">
            STORE
          </span>
        </Link>

        <nav
          className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-4 md:pointer-events-auto md:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link, i) => (
            <Fragment key={link.href}>
              {i > 0 && (
                <span className="text-[10px] text-[var(--dusty-denim)]/80" aria-hidden>
                  ·
                </span>
              )}
              <Link
                href={link.href}
                className="nav-link-underline font-[family-name:var(--font-outfit)] text-[12px] font-normal uppercase tracking-widest text-[var(--eggshell)]/90"
              >
                {link.label}
              </Link>
            </Fragment>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded border border-[var(--blue-slate)] text-[var(--eggshell)] md:hidden"
            aria-expanded={mobileOpen}
            aria-label="Open menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="font-mono-ems text-xs">{mobileOpen ? "×" : "≡"}</span>
          </button>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded text-[var(--eggshell)] hover:text-[var(--dusty-denim)]"
            aria-label="Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {itemCount > 0 && (
              <span className="font-mono-ems absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--eggshell)] px-1 text-[10px] font-medium text-[var(--ink-black)]">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          {status === "loading" ? (
            <span className="font-mono-ems text-xs text-[var(--dusty-denim)]">…</span>
          ) : session ? (
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded border border-[var(--blue-slate)] px-2 py-1.5 font-[family-name:var(--font-outfit)] text-sm text-[var(--eggshell)] hover:border-[var(--dusty-denim)]"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--blue-slate)] font-mono-ems text-[10px] font-medium text-[var(--eggshell)]">
                  {initials}
                </span>
                <span className="hidden max-w-[120px] truncate lg:inline">
                  {session.user?.name || session.user?.email}
                </span>
              </button>
              {menuOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default"
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-1 w-52 border border-[var(--blue-slate)] bg-[var(--deep-space-blue)] py-1 shadow-xl">
                    <Link
                      href="/orders"
                      className="block px-4 py-2 font-[family-name:var(--font-outfit)] text-sm text-[var(--eggshell)] hover:bg-[var(--ink-black)]/40"
                      onClick={() => setMenuOpen(false)}
                    >
                      My orders
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 font-[family-name:var(--font-outfit)] text-sm text-[var(--eggshell)] hover:bg-[var(--ink-black)]/40"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-left font-[family-name:var(--font-outfit)] text-sm text-red-400 hover:bg-[var(--ink-black)]/40"
                      onClick={() => {
                        setMenuOpen(false);
                        void signOut({ callbackUrl: "/" });
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/register"
                className="hidden font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--dusty-denim)] hover:text-[var(--eggshell)] sm:inline"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="btn-editorial rounded border border-[var(--eggshell)] px-3 py-2 font-[family-name:var(--font-outfit)] text-xs font-normal uppercase tracking-widest text-[var(--eggshell)] hover:bg-[var(--eggshell)] hover:text-[var(--ink-black)]"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--blue-slate)] bg-[var(--ink-black)] px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link-underline font-[family-name:var(--font-outfit)] text-[12px] font-normal uppercase tracking-widest text-[var(--eggshell)]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
