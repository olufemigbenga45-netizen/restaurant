import OrderExperience from "@/components/order-experience";
import { getMenu } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order online — G-Bite's",
  description:
    "Order authentic Nigerian food for pickup or delivery in Ogun State — smoky jollof, suya, soups and more.",
};

export default async function OrderPage() {
  const menu = await getMenu();
  return (
    <>
      <section className="border-b border-white/10 bg-ink-2">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
          <p className="text-xs uppercase tracking-[0.34em] text-ember">
            Pickup &amp; delivery
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1] sm:text-6xl">
            G-Bite&apos;s, at your place
          </h1>
          <p className="mt-5 max-w-2xl text-cream/70">
            Build a basket from the full menu. Packed in insulated boxes so the
            smoke and spice survive the ride.
          </p>
        </div>
      </section>
      <OrderExperience menu={menu} />
    </>
  );
}
