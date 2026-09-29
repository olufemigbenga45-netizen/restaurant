"use client";

import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { DELIVERY_FEE, TAX_RATE, formatMoney } from "@/lib/restaurant";

export default function CartDrawer() {
  const { lines, isOpen, closeCart, setQuantity, removeItem, subtotalCents } =
    useCart();

  const tax = Math.round(subtotalCents * TAX_RATE);
  const total = subtotalCents + tax;

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-ink-2 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="font-display text-2xl">Your order</p>
            <p className="text-xs uppercase tracking-[0.2em] text-cream/50">
              Pickup &amp; delivery
            </p>
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full border border-white/15 px-3 py-1 text-sm text-cream/70 transition hover:bg-white/10"
          >
            Close
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {lines.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="font-display text-3xl text-cream/80">Nothing yet</p>
              <p className="mt-3 text-sm text-cream/50">
                Add a dish from the menu and it will land here.
              </p>
              <Link
                href="/menu"
                onClick={closeCart}
                className="mt-8 inline-block rounded-full bg-ember px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] transition hover:bg-ember-2"
              >
                Browse menu
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={line.imageUrl}
                      alt={line.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-lg leading-tight">
                      {line.name}
                    </p>
                    <p className="text-sm text-cream/55">
                      {formatMoney(line.priceCents)}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center gap-2 rounded-full border border-white/15 px-2 py-1">
                        <button
                          aria-label={`Decrease ${line.name}`}
                          onClick={() =>
                            setQuantity(line.id, line.quantity - 1)
                          }
                          className="px-1 text-cream/70 hover:text-ember"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-sm">
                          {line.quantity}
                        </span>
                        <button
                          aria-label={`Increase ${line.name}`}
                          onClick={() =>
                            setQuantity(line.id, line.quantity + 1)
                          }
                          className="px-1 text-cream/70 hover:text-ember"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(line.id)}
                        className="text-xs uppercase tracking-widest text-cream/40 hover:text-ember"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-display text-lg">
                    {formatMoney(line.priceCents * line.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 ? (
          <footer className="border-t border-white/10 px-6 py-6">
            <dl className="space-y-2 text-sm text-cream/70">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatMoney(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Tax</dt>
                <dd>{formatMoney(tax)}</dd>
              </div>
              <div className="flex justify-between text-cream/50">
                <dt>Delivery</dt>
                <dd>{formatMoney(DELIVERY_FEE)} on delivery</dd>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3 font-display text-xl text-cream">
                <dt>Total</dt>
                <dd>{formatMoney(total)}</dd>
              </div>
            </dl>
            <Link
              href="/order"
              onClick={closeCart}
              className="mt-6 block rounded-full bg-ember px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.2em] transition hover:bg-ember-2"
            >
              Checkout
            </Link>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
