"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { MenuCategory } from "@/lib/queries";
import {
  DELIVERY_FEE,
  TAX_RATE,
  formatMoney,
} from "@/lib/restaurant";

type Props = { menu: MenuCategory[] };

const TIP_OPTIONS = [0, 15, 18, 20, 25];

export default function OrderExperience({ menu }: Props) {
  const router = useRouter();
  const { lines, addItem, setQuantity, removeItem, subtotalCents, clear } =
    useCart();

  const [activeCat, setActiveCat] = useState(menu[0]?.slug ?? "");
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [tipPct, setTipPct] = useState(18);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deliveryFee = fulfillment === "delivery" ? DELIVERY_FEE : 0;
  const tax = Math.round(subtotalCents * TAX_RATE);
  const tip = Math.round((subtotalCents * tipPct) / 100);
  const total = subtotalCents + deliveryFee + tax + tip;

  const activeItems = useMemo(
    () => menu.find((c) => c.slug === activeCat)?.items ?? [],
    [menu, activeCat],
  );

  async function submit() {
    setError(null);
    if (lines.length === 0) {
      setError("Add at least one dish to your basket.");
      return;
    }
    if (!customerName.trim() || !phone.trim()) {
      setError("Please add your name and phone number.");
      return;
    }
    if (fulfillment === "delivery" && address.trim().length < 6) {
      setError("Please add a delivery address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillment,
          customerName,
          phone,
          email,
          address,
          notes,
          tipPct,
          lines: lines.map((line) => ({ id: line.id, quantity: line.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not place the order.");
        return;
      }
      const code: string = data.order.code;
      clear();
      router.push(`/order/${code}`);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.35fr_1fr] lg:px-10">
      {/* Menu picker */}
      <div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-3">
          {menu.map((category) => (
            <button
              key={category.slug}
              onClick={() => setActiveCat(category.slug)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] transition ${
                activeCat === category.slug
                  ? "border-ember bg-ember text-white"
                  : "border-white/15 text-cream/60 hover:border-cream/50 hover:text-cream"
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-cream/45">
          {menu.find((c) => c.slug === activeCat)?.tagline}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {activeItems.map((item) => {
            const inCart = lines.find((line) => line.id === item.id);
            return (
              <div
                key={item.id}
                className={`flex gap-4 rounded-2xl border border-white/10 bg-ink-2/60 p-4 transition ${
                  item.isAvailable
                    ? "hover:border-ember/40"
                    : "opacity-50"
                }`}
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-ink-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-display text-lg leading-tight">
                      {item.name}
                    </p>
                    <span className="shrink-0 text-sm text-ember">
                      {formatMoney(item.priceCents)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-cream/55">
                    {item.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-cream/35">
                      {item.prepMinutes} min
                    </span>
                    {inCart ? (
                      <div className="flex items-center gap-2 rounded-full border border-ember/60 px-2 py-1">
                        <button
                          aria-label="Remove one"
                          onClick={() => setQuantity(item.id, inCart.quantity - 1)}
                          className="px-1 text-sm hover:text-ember"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-sm">
                          {inCart.quantity}
                        </span>
                        <button
                          aria-label="Add one"
                          onClick={() => setQuantity(item.id, inCart.quantity + 1)}
                          className="px-1 text-sm hover:text-ember"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        disabled={!item.isAvailable}
                        onClick={() =>
                          addItem({
                            id: item.id,
                            slug: item.slug,
                            name: item.name,
                            priceCents: item.priceCents,
                            imageUrl: item.imageUrl,
                          })
                        }
                        className="rounded-full bg-cream px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition hover:bg-ember hover:text-white disabled:opacity-40"
                      >
                        {item.isAvailable ? "Add" : "Sold out"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkout */}
      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <div className="rounded-3xl border border-white/10 bg-ink-2 p-7">
          <h2 className="font-display text-3xl">Your basket</h2>

          {lines.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-cream/60">No dishes yet.</p>
              <Link
                href="/menu"
                className="mt-4 inline-block rounded-full border border-white/20 px-5 py-2.5 text-xs uppercase tracking-[0.18em] hover:border-ember hover:text-ember"
              >
                Browse the menu
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {lines.map((line) => (
                <li key={line.id} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-ink-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={line.imageUrl}
                      alt={line.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{line.name}</p>
                    <p className="text-xs text-cream/45">
                      {formatMoney(line.priceCents)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-white/15 px-2 py-1">
                    <button
                      aria-label="Decrease"
                      onClick={() => setQuantity(line.id, line.quantity - 1)}
                      className="px-1 text-sm text-cream/70 hover:text-ember"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-sm">
                      {line.quantity}
                    </span>
                    <button
                      aria-label="Increase"
                      onClick={() => setQuantity(line.id, line.quantity + 1)}
                      className="px-1 text-sm text-cream/70 hover:text-ember"
                    >
                      +
                    </button>
                  </div>
                  <button
                    aria-label={`Remove ${line.name}`}
                    onClick={() => removeItem(line.id)}
                    className="text-cream/35 hover:text-ember"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-7 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-ink p-1.5">
            {(["pickup", "delivery"] as const).map((option) => (
              <button
                key={option}
                onClick={() => setFulfillment(option)}
                className={`rounded-xl px-3 py-2.5 text-xs uppercase tracking-[0.16em] transition ${
                  fulfillment === option
                    ? "bg-ember text-white"
                    : "text-cream/60 hover:text-cream"
                }`}
              >
                {option === "pickup" ? "Pickup · 25 min" : "Delivery · 45 min"}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-cream/50">
              Tip your kitchen
            </p>
            <div className="mt-3 flex gap-2">
              {TIP_OPTIONS.map((pct) => (
                <button
                  key={pct}
                  onClick={() => setTipPct(pct)}
                  className={`flex-1 rounded-lg border py-2 text-xs transition ${
                    tipPct === pct
                      ? "border-ember bg-ember/15 text-ember"
                      : "border-white/15 text-cream/60 hover:border-cream/50"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <dl className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
            <div className="flex justify-between text-cream/70">
              <dt>Subtotal</dt>
              <dd>{formatMoney(subtotalCents)}</dd>
            </div>
            {fulfillment === "delivery" ? (
              <div className="flex justify-between text-cream/70">
                <dt>Delivery</dt>
                <dd>{formatMoney(deliveryFee)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between text-cream/70">
              <dt>Tax</dt>
              <dd>{formatMoney(tax)}</dd>
            </div>
            <div className="flex justify-between text-cream/70">
              <dt>Tip</dt>
              <dd>{formatMoney(tip)}</dd>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-3 font-display text-2xl">
              <dt>Total</dt>
              <dd className="text-ember">{formatMoney(total)}</dd>
            </div>
          </dl>

          <div className="mt-6 space-y-3">
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Name *"
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm focus:border-ember focus:outline-none"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone *"
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm focus:border-ember focus:outline-none"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (for receipt)"
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm focus:border-ember focus:outline-none"
            />
            {fulfillment === "delivery" ? (
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery address *"
                className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm focus:border-ember focus:outline-none"
              />
            ) : null}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, gate codes, extra napkins…"
              rows={2}
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm focus:border-ember focus:outline-none"
            />
          </div>

          {error ? (
            <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button
            onClick={submit}
            disabled={submitting || lines.length === 0}
            className="mt-6 w-full rounded-full bg-ember px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition hover:bg-ember-2 disabled:opacity-50"
          >
            {submitting ? "Sending to the kitchen…" : "Place my order"}
          </button>
          <p className="mt-3 text-center text-[11px] text-cream/40">
            {fulfillment === "pickup"
              ? "Ready in about 25 minutes at G-Bite's, Ogun State."
              : "Delivered by our own riders within 3 miles."}
          </p>
        </div>
      </aside>
    </div>
  );
}
