"use client";

import { useMemo, useState } from "react";
import AddToCartButton from "@/components/add-to-cart-button";
import type { MenuCategory } from "@/lib/queries";
import { DIETARY_FILTERS, formatMoney } from "@/lib/restaurant";

export default function MenuExplorer({ menu }: { menu: MenuCategory[] }) {
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState(menu[0]?.slug ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menu
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          const matchesQuery =
            !q ||
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q);
          const matchesDiet =
            diet.length === 0 || diet.every((d) => item.tags.includes(d));
          return matchesQuery && matchesDiet;
        }),
      }))
      .filter((category) => category.items.length > 0);
  }, [menu, query, diet]);

  const totalItems = filtered.reduce((n, c) => n + c.items.length, 0);

  return (
    <div>
      {/* Filter bar */}
      <div className="sticky top-[81px] z-30 border-b border-white/10 bg-ink/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-5 py-4 lg:px-10">
          <div className="flex flex-wrap items-center gap-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu…"
              className="w-full max-w-xs rounded-full border border-white/15 bg-ink-2 px-5 py-2.5 text-sm text-cream placeholder:text-cream/35 focus:border-ember focus:outline-none"
            />
            <div className="flex flex-wrap gap-2">
              {DIETARY_FILTERS.map((filter) => {
                const active = diet.includes(filter.value);
                return (
                  <button
                    key={filter.value}
                    onClick={() =>
                      setDiet((prev) =>
                        prev.includes(filter.value)
                          ? prev.filter((v) => v !== filter.value)
                          : [...prev, filter.value],
                      )
                    }
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] transition ${
                      active
                        ? "border-ember bg-ember text-white"
                        : "border-white/15 text-cream/60 hover:border-cream/50 hover:text-cream"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="no-scrollbar mt-4 flex gap-6 overflow-x-auto">
            {menu.map((category) => (
              <a
                key={category.slug}
                href={`#${category.slug}`}
                onClick={() => setActiveCategory(category.slug)}
                className={`whitespace-nowrap pb-1 text-xs uppercase tracking-[0.2em] transition ${
                  activeCategory === category.slug
                    ? "border-b border-ember text-ember"
                    : "text-cream/50 hover:text-cream"
                }`}
              >
                {category.icon} {category.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {totalItems === 0 ? (
        <div className="mx-auto max-w-7xl px-5 py-24 text-center lg:px-10">
          <p className="font-display text-3xl">Nothing matches that yet</p>
          <p className="mt-3 text-cream/55">
            Try another search or clear your filters.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setDiet([]);
            }}
            className="mt-8 rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-[0.2em] hover:border-ember hover:text-ember"
          >
            Reset filters
          </button>
        </div>
      ) : null}

      {filtered.map((category) => (
        <section
          key={category.slug}
          id={category.slug}
          className="mx-auto max-w-7xl scroll-mt-48 px-5 py-14 lg:px-10"
        >
          <div className="flex items-baseline gap-4 border-b border-white/10 pb-5">
            <h2 className="font-display text-3xl sm:text-4xl">{category.name}</h2>
            <p className="text-sm text-cream/45">{category.tagline}</p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {category.items.map((item) => (
              <article
                key={item.id}
                className={`flex gap-5 rounded-2xl border border-white/10 bg-ink-2/60 p-5 transition hover:border-ember/40 ${
                  item.isAvailable ? "" : "opacity-55"
                }`}
              >
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-ink-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                  {item.isChefPick ? (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-ember px-2 py-0.5 text-[9px] uppercase tracking-widest text-white">
                      Pick
                    </span>
                  ) : null}
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl leading-tight">
                      {item.name}
                    </h3>
                    <span className="shrink-0 font-display text-lg text-ember">
                      {formatMoney(item.priceCents)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-cream/60">
                    {item.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-cream/50"
                      >
                        {tag.replace("-", " ")}
                      </span>
                    ))}
                    <span className="text-[10px] uppercase tracking-[0.14em] text-cream/35">
                      {item.prepMinutes} min
                    </span>
                    {item.spiceLevel > 0 ? (
                      <span className="text-[10px] tracking-widest text-ember">
                        {"🌶".repeat(item.spiceLevel)}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-auto pt-4">
                    <AddToCartButton
                      id={item.id}
                      slug={item.slug}
                      name={item.name}
                      priceCents={item.priceCents}
                      imageUrl={item.imageUrl}
                      disabled={!item.isAvailable}
                      variant={item.isAvailable ? "solid" : "ghost"}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
