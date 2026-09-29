import Link from "next/link";
import AddToCartButton from "@/components/add-to-cart-button";
import { getChefPicks } from "@/lib/queries";
import { RESTAURANT, formatMoney } from "@/lib/restaurant";

export const dynamic = "force-dynamic";

const HERO =
  "https://images.pexels.com/photos/13915043/pexels-photo-13915043.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";
const GALLERY = [
  {
    src: "https://images.pexels.com/photos/28736727/pexels-photo-28736727.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    caption: "Plating at the grill",
  },
  {
    src: "https://images.pexels.com/photos/28736731/pexels-photo-28736731.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    caption: "The weekend spread",
  },
  {
    src: "https://images.pexels.com/photos/36707697/pexels-photo-36707697.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    caption: "Jollof for a celebration",
  },
  {
    src: "https://images.pexels.com/photos/37968303/pexels-photo-37968303.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    caption: "Dinner by candlelight",
  },
];

export default async function HomePage() {
  const picks = await getChefPicks(3);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO}
          alt="Smoky Nigerian jollof rice with grilled chicken and fish"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/95 via-ink/75 to-ink" />
        <div className="absolute -left-24 top-1/3 h-72 w-72 animate-ember rounded-full bg-ember/40 blur-3xl" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 lg:px-10">
          <p className="animate-fade-up text-xs uppercase tracking-[0.34em] text-ember-2">
            {RESTAURANT.shortAddress} · Open daily from 10am
          </p>
          <h1 className="animate-fade-up mt-6 max-w-3xl font-display text-5xl leading-[0.95] sm:text-6xl lg:text-8xl">
            Naija food,
            <br />
            straight from the fire.
          </h1>
          <p className="animate-fade-up mt-6 max-w-xl text-lg text-cream/70">
            G-Bite&apos;s is an authentic Nigerian kitchen in{" "}
            {RESTAURANT.shortAddress} serving smoky party jollof, charcoal suya,
            rich soups and everything in between — for dine-in, pickup or
            delivery.
          </p>
          <div className="animate-fade-up mt-10 flex flex-wrap gap-4">
            <Link
              href="/book"
              className="rounded-full bg-ember px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition hover:bg-ember-2"
            >
              Book a table
            </Link>
            <Link
              href="/order"
              className="rounded-full border border-cream/30 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition hover:border-cream hover:bg-cream/10"
            >
              Order online
            </Link>
          </div>
          <dl className="animate-fade-up mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/15 pt-8 text-sm">
            <div>
              <dt className="text-cream/50">Kitchen</dt>
              <dd className="font-display text-xl">Charcoal &amp; fire</dd>
            </div>
            <div>
              <dt className="text-cream/50">Specialty</dt>
              <dd className="font-display text-xl">Party jollof</dd>
            </div>
            <div>
              <dt className="text-cream/50">Serves</dt>
              <dd className="font-display text-xl">Dine-in · pickup</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Marquee */}
      <div className="border-y border-white/10 bg-ink-2 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-5 text-xs uppercase tracking-[0.3em] text-cream/50 lg:px-10">
          {[
            "Smoky party jollof",
            "Charcoal suya",
            "Egusi & swallow",
            "Peppersoup",
            "Fresh zobo & chapman",
          ].map((item) => (
            <span key={item} className="flex items-center gap-10">
              {item} <span className="text-ember">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Story */}
      <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-2 lg:px-10">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ember">Our story</p>
          <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
            Cooked the way it&apos;s meant to be cooked — over fire, with
            patience and plenty of spice.
          </h2>
          <p className="mt-6 text-cream/70">
            {RESTAURANT.story} Chef Gbenga learned jollof at his mother&apos;s
            fire in {RESTAURANT.shortAddress} before opening G-Bite&apos;s.
            Every pot is built the old way — smoky, slow and generous.
          </p>
          <p className="mt-4 text-cream/70">
            The menu is rooted in home favourites, the suya is grilled to
            order, and every plate leaves the kitchen the way it should:
            hot, peppered and full of flavour.
          </p>
          <Link
            href="/menu"
            className="mt-8 inline-block border-b border-ember pb-1 text-sm uppercase tracking-[0.2em] text-ember transition hover:text-cream"
          >
            See the full menu
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            "https://images.pexels.com/photos/8166269/pexels-photo-8166269.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
            "https://images.pexels.com/photos/35305066/pexels-photo-35305066.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          ].map((src, idx) => (
            <div
              key={src}
              className={`relative overflow-hidden rounded-2xl ${
                idx === 0 ? "translate-y-6" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt="Authentic Nigerian cooking"
                className="aspect-3/4 w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Chef picks */}
      <section className="border-y border-white/10 bg-ink-2 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-ember">
                Tonight&apos;s picks
              </p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl">
                What the kitchen is proud of
              </h2>
            </div>
            <Link
              href="/order"
              className="rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.2em] transition hover:border-ember hover:text-ember"
            >
              Order these now
            </Link>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {picks.map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-ink"
              >
                <div className="relative aspect-4/3 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ember">
                    Chef&apos;s pick
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl">{item.name}</h3>
                    <span className="font-display text-xl text-ember">
                      {formatMoney(item.priceCents)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-cream/65">
                    {item.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-[0.16em] text-cream/40">
                      {item.prepMinutes} min ·{" "}
                      {item.tags.join(" · ") || "classic"}
                    </span>
                    <AddToCartButton
                      id={item.id}
                      slug={item.slug}
                      name={item.name}
                      priceCents={item.priceCents}
                      imageUrl={item.imageUrl}
                      disabled={!item.isAvailable}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-ember">
          The kitchen &amp; the vibe
        </p>
        <h2 className="mt-4 font-display text-4xl sm:text-5xl">
          Warm, loud and always full of flavour
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GALLERY.map((image) => (
            <figure
              key={image.src}
              className="group relative overflow-hidden rounded-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.src}
                alt={image.caption}
                className="aspect-square w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink to-transparent p-4 text-sm text-cream/80">
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Visit */}
      <section className="border-t border-white/10 bg-ink-2">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ember">Visit us</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl">
              Come hungry, leave happy
            </h2>
            <p className="mt-6 text-cream/70">{RESTAURANT.address}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="rounded-full bg-cream px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ember hover:text-white"
              >
                Reserve a table
              </Link>
              <a
                href={RESTAURANT.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] transition hover:border-cream"
              >
                Open in maps
              </a>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              <li className="rounded-xl border border-white/10 bg-ink p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-cream/45">
                  Walk-ins
                </p>
                <p className="mt-2 text-cream/80">
                  Lounge &amp; grill counter held daily
                </p>
              </li>
              <li className="rounded-xl border border-white/10 bg-ink p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-cream/45">
                  Owambe &amp; parties
                </p>
                <p className="mt-2 text-cream/80">
                  Private room seats up to 20 guests
                </p>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-ink p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-ember">Hours</p>
            <ul className="mt-6 divide-y divide-white/5">
              {RESTAURANT.hours.map((h) => (
                <li
                  key={h.day}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <span className="text-cream/80">{h.day}</span>
                  <span className="text-cream/50">{h.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-cream/40">
              Kitchen closes 30 minutes before closing. Weekend brunch plates
              until 3pm.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
