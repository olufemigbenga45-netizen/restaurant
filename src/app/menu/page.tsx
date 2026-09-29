import Link from "next/link";
import MenuExplorer from "@/components/menu-explorer";
import { getMenu } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Menu — G-Bite's",
  description:
    "Authentic Nigerian menu: smoky party jollof, charcoal suya, rich soups and swallow, grills and drinks. Filter and order online.",
};

export default async function MenuPage() {
  const menu = await getMenu();
  const itemCount = menu.reduce((n, c) => n + c.items.length, 0);

  return (
    <>
      <section className="border-b border-white/10 bg-ink-2">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
          <p className="text-xs uppercase tracking-[0.34em] text-ember">
            The menu
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl leading-[1] sm:text-6xl">
            Cooked over charcoal, served the Naija way
          </h1>
          <p className="mt-6 max-w-2xl text-cream/70">
            {itemCount} dishes across {menu.length} sections — from smoky party
            jollof to rich egusi and suya that bites back. Everything is
            available for dine-in, pickup or delivery.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/order"
              className="rounded-full bg-ember px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] transition hover:bg-ember-2"
            >
              Start an order
            </Link>
            <Link
              href="/book"
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] transition hover:border-cream"
            >
              Book a table
            </Link>
          </div>
        </div>
      </section>

      <MenuExplorer menu={menu} />
    </>
  );
}
