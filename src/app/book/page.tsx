import BookingForm from "@/components/booking-form";
import { RESTAURANT } from "@/lib/restaurant";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Book a table — G-Bite's",
  description:
    "Reserve a table at G-Bite's in Ogun State. Live availability, seating choices and instant confirmation.",
};

export default function BookPage() {
  return (
    <>
      <section className="border-b border-white/10 bg-ink-2">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center lg:px-10">
          <p className="text-xs uppercase tracking-[0.34em] text-ember">
            Reservations
          </p>
          <h1 className="mt-5 font-display text-5xl leading-[1] sm:text-6xl">
            Pull up a chair
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-cream/70">
            Tables are released 60 days ahead. Pick a slot below and we&apos;ll
            confirm instantly — no phone tag, no waiting.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.6fr_1fr] lg:px-10">
        <BookingForm />

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-ink-2 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-ember">
              Good to know
            </p>
            <ul className="mt-4 space-y-3 text-sm text-cream/70">
              <li>• Tables are held for 15 minutes past your slot.</li>
              <li>• Parties of 6+ include a service charge.</li>
              <li>• The private party room seats up to 20 guests.</li>
              <li>• Live music on Friday and Saturday nights.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-2 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-ember">
              Finding us
            </p>
            <p className="mt-4 text-sm text-cream/70">{RESTAURANT.address}</p>
            <a
              href={RESTAURANT.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block border-b border-ember pb-1 text-xs uppercase tracking-[0.2em] text-ember"
            >
              Open in maps
            </a>
            <p className="mt-6 text-sm text-cream/70">
              Easy to find in the heart of {RESTAURANT.shortAddress}, with ample
              parking on-site.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink-2 p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-ember">
              Rather talk to us?
            </p>
            <p className="mt-4 font-display text-2xl">{RESTAURANT.phone}</p>
            <p className="mt-2 text-sm text-cream/60">
              Host stand open daily from 10am. You can also reach us on
              WhatsApp.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
