import Link from "next/link";
import { RESTAURANT } from "@/lib/restaurant";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <p className="font-display text-3xl">{RESTAURANT.name}</p>
          <p className="mt-3 max-w-sm text-sm text-cream/60">
            {RESTAURANT.story}
          </p>
          <div className="mt-6 flex gap-3">
            {["Instagram", "WhatsApp", "Newsletter"].map((social) => (
              <span
                key={social}
                className="rounded-full border border-white/15 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-cream/60"
              >
                {social}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-ember">Visit</p>
          <p className="mt-4 text-sm text-cream/70">{RESTAURANT.address}</p>
          <a
            href={`tel:${RESTAURANT.phoneHref}`}
            className="mt-2 block text-sm text-cream/70 hover:text-ember"
          >
            {RESTAURANT.phone}
          </a>
          <a
            href={`mailto:${RESTAURANT.email}`}
            className="mt-1 block text-sm text-cream/70 hover:text-ember"
          >
            {RESTAURANT.email}
          </a>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-ember">Hours</p>
          <ul className="mt-4 space-y-1.5 text-sm text-cream/70">
            {RESTAURANT.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span className="text-cream/50">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            ©2026 GbengaDevs, all rights reserved
          </p>
          <div className="flex gap-6">
            <Link href="/menu" className="hover:text-cream">Menu</Link>
            <Link href="/book" className="hover:text-cream">Reservations</Link>
            <Link href="/order" className="hover:text-cream">Order online</Link>
            <Link href="/admin" className="hover:text-cream">Kitchen</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
