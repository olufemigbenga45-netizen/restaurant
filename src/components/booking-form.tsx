"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  OCCASIONS,
  SEATING_OPTIONS,
  TIME_SLOTS,
  formatDateLong,
  formatSlotTime,
} from "@/lib/restaurant";

type Slot = { time: string; used: number; remaining: number; full: boolean };

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function BookingForm() {
  const [date, setDate] = useState(todayIso());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [partySize, setPartySize] = useState(2);
  const [slotTime, setSlotTime] = useState("19:30");
  const [seating, setSeating] = useState<string>("dining-room");
  const [occasion, setOccasion] = useState<string>("None");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{
    code: string;
    guestName: string;
    slotDate: string;
    slotTime: string;
    partySize: number;
    seating: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingSlots(true);
    fetch(`/api/reservations?date=${date}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const availability: Slot[] = Array.isArray(data.availability)
          ? data.availability
          : TIME_SLOTS.map((time) => ({
              time,
              used: 0,
              remaining: 24,
              full: false,
            }));
        setSlots(availability);
      })
      .catch(() => {
        if (!cancelled)
          setSlots(
            TIME_SLOTS.map((time) => ({
              time,
              used: 0,
              remaining: 24,
              full: false,
            })),
          );
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          email,
          phone,
          partySize,
          slotDate: date,
          slotTime,
          seating,
          occasion,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setConfirmation({
        code: data.reservation.code,
        guestName: data.reservation.guestName,
        slotDate: data.reservation.slotDate,
        slotTime: data.reservation.slotTime,
        partySize: data.reservation.partySize,
        seating: data.reservation.seating,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <div className="rounded-3xl border border-ember/40 bg-ink-2 p-8 sm:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-ember">
          Table requested
        </p>
        <h2 className="mt-4 font-display text-4xl sm:text-5xl">
          See you soon, {confirmation.guestName.split(" ")[0]}.
        </h2>
        <p className="mt-4 text-cream/70">
          We&apos;ve sent a confirmation to your inbox. Show this code at the
          door, or quote it if you need to change the booking.
        </p>
        <div className="mt-8 rounded-2xl border border-white/10 bg-ink p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-cream/45">
            Reservation code
          </p>
          <p className="mt-2 font-display text-4xl tracking-[0.15em] text-ember">
            {confirmation.code}
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-cream/45">
                When
              </dt>
              <dd className="mt-1">
                {formatDateLong(confirmation.slotDate)}
                <br />
                {formatSlotTime(confirmation.slotTime)}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-cream/45">
                Party
              </dt>
              <dd className="mt-1">
                {confirmation.partySize}{" "}
                {confirmation.partySize === 1 ? "guest" : "guests"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-cream/45">
                Seating
              </dt>
              <dd className="mt-1">
                {SEATING_OPTIONS.find((s) => s.value === confirmation.seating)
                  ?.label ?? confirmation.seating}
              </dd>
            </div>
          </dl>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/menu"
            className="rounded-full bg-cream px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ember hover:text-white"
          >
            Preview the menu
          </Link>
          <button
            onClick={() => {
              setConfirmation(null);
              setNotes("");
            }}
            className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] transition hover:border-cream"
          >
            Book another table
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-ink-2 p-8 sm:p-12"
    >
      <div className="grid gap-10 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs uppercase tracking-[0.24em] text-cream/50">
            Date
          </label>
          <input
            type="date"
            value={date}
            min={todayIso()}
            onChange={(e) => setDate(e.target.value)}
            className="mt-3 w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-cream focus:border-ember focus:outline-none"
          />
          <p className="mt-2 text-sm text-cream/45">
            {formatDateLong(date)} · we hold bar seating for walk-ins nightly.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs uppercase tracking-[0.24em] text-cream/50">
            Time
          </label>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {(slots.length ? slots : TIME_SLOTS.map((t) => ({ time: t, used: 0, remaining: 24, full: false }))).map(
              (slot) => {
                const tooSmall = slot.remaining < partySize;
                const disabled = slot.full || tooSmall;
                const active = slotTime === slot.time;
                return (
                  <button
                    type="button"
                    key={slot.time}
                    disabled={disabled}
                    onClick={() => setSlotTime(slot.time)}
                    className={`rounded-xl border px-2 py-2.5 text-sm transition ${
                      active
                        ? "border-ember bg-ember text-white"
                        : disabled
                          ? "border-white/5 text-cream/25 line-through"
                          : "border-white/15 text-cream/75 hover:border-cream"
                    }`}
                  >
                    {formatSlotTime(slot.time)}
                    <span className="mt-1 block text-[10px] uppercase tracking-widest opacity-60">
                      {loadingSlots ? "···" : disabled ? "full" : `${slot.remaining} left`}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.24em] text-cream/50">
            Guests
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setPartySize(n)}
                className={`h-11 w-11 rounded-full border text-sm transition ${
                  partySize === n
                    ? "border-ember bg-ember text-white"
                    : "border-white/15 text-cream/70 hover:border-cream"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-cream/40">
            Parties over 12: email hello@gbites.ng
          </p>
        </div>

        <div>
          <label
            htmlFor="seating"
            className="text-xs uppercase tracking-[0.24em] text-cream/50"
          >
            Seating
          </label>
          <select
            id="seating"
            value={seating}
            onChange={(e) => setSeating(e.target.value)}
            className="mt-3 w-full rounded-xl border border-white/15 bg-ink px-4 py-3 focus:border-ember focus:outline-none"
          >
            {SEATING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label
            htmlFor="occasion"
            className="mt-6 block text-xs uppercase tracking-[0.24em] text-cream/50"
          >
            Occasion
          </label>
          <select
            id="occasion"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="mt-3 w-full rounded-xl border border-white/15 bg-ink px-4 py-3 focus:border-ember focus:outline-none"
          >
            {OCCASIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="guestName"
            className="text-xs uppercase tracking-[0.24em] text-cream/50"
          >
            Name
          </label>
          <input
            id="guestName"
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Nadia Ferrante"
            className="mt-3 w-full rounded-xl border border-white/15 bg-ink px-4 py-3 focus:border-ember focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="text-xs uppercase tracking-[0.24em] text-cream/50"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-3 w-full rounded-xl border border-white/15 bg-ink px-4 py-3 focus:border-ember focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="text-xs uppercase tracking-[0.24em] text-cream/50"
          >
            Phone
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0704 166 3145"
            className="mt-3 w-full rounded-xl border border-white/15 bg-ink px-4 py-3 focus:border-ember focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="text-xs uppercase tracking-[0.24em] text-cream/50"
          >
            Anything we should know?
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Allergies, high chair, celebrating something…"
            rows={3}
            className="mt-3 w-full rounded-xl border border-white/15 bg-ink px-4 py-3 focus:border-ember focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          {error ? (
            <p className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-ember px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition hover:bg-ember-2 disabled:opacity-60"
          >
            {submitting ? "Holding your table…" : "Request the table"}
          </button>
          <p className="mt-4 text-center text-xs text-cream/40">
            We&apos;ll confirm by email within a few minutes. Free cancellation
            up to 2 hours before.
          </p>
        </div>
      </div>
    </form>
  );
}
