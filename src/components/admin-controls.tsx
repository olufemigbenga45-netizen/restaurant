"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

function useRefresh() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const refresh = () => startTransition(() => router.refresh());
  return { refresh, pending };
}

export function ReservationActions({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  const { refresh, pending } = useRefresh();
  const [busy, setBusy] = useState(false);

  async function update(next: string) {
    setBusy(true);
    await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    refresh();
  }

  async function remove() {
    setBusy(true);
    await fetch(`/api/reservations/${id}`, { method: "DELETE" });
    setBusy(false);
    refresh();
  }

  const disabled = busy || pending;

  return (
    <div className="flex flex-wrap gap-2">
      {status !== "confirmed" ? (
        <button
          disabled={disabled}
          onClick={() => update("confirmed")}
          className="rounded-full border border-emerald-400/40 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-emerald-300 transition hover:bg-emerald-400/10 disabled:opacity-40"
        >
          Confirm
        </button>
      ) : null}
      {status !== "seated" ? (
        <button
          disabled={disabled}
          onClick={() => update("seated")}
          className="rounded-full border border-sky-400/40 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-sky-300 transition hover:bg-sky-400/10 disabled:opacity-40"
        >
          Seat
        </button>
      ) : null}
      {status !== "cancelled" ? (
        <button
          disabled={disabled}
          onClick={() => update("cancelled")}
          className="rounded-full border border-amber-400/40 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-amber-300 transition hover:bg-amber-400/10 disabled:opacity-40"
        >
          Cancel
        </button>
      ) : null}
      <button
        disabled={disabled}
        onClick={remove}
        className="rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-cream/40 transition hover:text-red-300 disabled:opacity-40"
      >
        Delete
      </button>
    </div>
  );
}

const ORDER_STATUSES = [
  "received",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
];

export function OrderStatusSelect({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  const { refresh, pending } = useRefresh();
  const [busy, setBusy] = useState(false);

  async function update(next: string) {
    setBusy(true);
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    refresh();
  }

  return (
    <select
      value={status}
      disabled={busy || pending}
      onChange={(e) => update(e.target.value)}
      className="rounded-full border border-white/15 bg-ink px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-cream/80 focus:border-ember focus:outline-none"
    >
      {ORDER_STATUSES.map((option) => (
        <option key={option} value={option}>
          {option.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}

export function AvailabilityToggle({
  id,
  isAvailable,
  name,
}: {
  id: number;
  isAvailable: boolean;
  name: string;
}) {
  const { refresh, pending } = useRefresh();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !isAvailable }),
    });
    setBusy(false);
    refresh();
  }

  return (
    <button
      aria-label={`Toggle availability for ${name}`}
      disabled={busy || pending}
      onClick={toggle}
      className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] transition disabled:opacity-40 ${
        isAvailable
          ? "border border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10"
          : "border border-red-400/40 text-red-300 hover:bg-red-400/10"
      }`}
    >
      {isAvailable ? "Available" : "86'd"}
    </button>
  );
}
