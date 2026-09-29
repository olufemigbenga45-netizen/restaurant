"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { RESTAURANT } from "@/lib/restaurant";

const NAV = [
  { href: "/menu", label: "Menu" },
  { href: "/book", label: "Book a table" },
  { href: "/order", label: "Order online" },
  { href: "/admin", label: "Kitchen" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ember/60 font-display text-lg text-ember">
            G
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl tracking-tight">
              {RESTAURANT.name}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.28em] text-cream/45">
              {RESTAURANT.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm uppercase tracking-[0.16em] transition ${
                  active ? "text-ember" : "text-cream/70 hover:text-cream"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${RESTAURANT.phoneHref}`}
            className="hidden text-sm text-cream/60 transition hover:text-cream md:block"
          >
            {RESTAURANT.phone}
          </a>
          <button
            onClick={openCart}
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm transition hover:border-ember hover:text-ember"
          >
            <span aria-hidden>🧺</span>
            <span>Cart</span>
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ember px-1.5 text-xs font-semibold text-white">
              {count}
            </span>
          </button>
          <Link
            href="/book"
            className="hidden rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-ember hover:text-white md:block"
          >
            Reserve
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="rounded-full border border-white/15 px-3 py-2 text-lg lg:hidden"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav className="border-t border-white/10 bg-ink-2 px-5 py-4 lg:hidden">
          <ul className="space-y-3">
            {NAV.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-lg font-display"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
