"use client";

import { useCart } from "@/components/cart-provider";
import { formatMoney } from "@/lib/restaurant";

type Props = {
  id: number;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  disabled?: boolean;
  variant?: "solid" | "ghost" | "pill";
};

export default function AddToCartButton({
  id,
  slug,
  name,
  priceCents,
  imageUrl,
  disabled = false,
  variant = "solid",
}: Props) {
  const { addItem } = useCart();

  const base =
    "text-xs font-semibold uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-40";
  const styles = {
    solid: "bg-ember px-4 py-2.5 text-white hover:bg-ember-2",
    ghost:
      "border border-white/20 px-4 py-2.5 text-cream/80 hover:border-ember hover:text-ember",
    pill: "rounded-full bg-cream px-5 py-3 text-ink hover:bg-ember hover:text-white",
  }[variant];

  return (
    <button
      disabled={disabled}
      onClick={() => addItem({ id, slug, name, priceCents, imageUrl })}
      className={`${base} ${styles} rounded-full`}
    >
      {disabled ? "Sold out" : `Add · ${formatMoney(priceCents)}`}
    </button>
  );
}
