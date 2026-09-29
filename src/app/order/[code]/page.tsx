import Link from "next/link";
import OrderStatusTracker from "@/components/order-status-tracker";
import { getOrderWithItems } from "@/lib/queries";
import { formatMoney } from "@/lib/restaurant";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const result = await getOrderWithItems(code);

  if (!result) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-32 text-center lg:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-ember">
          Order not found
        </p>
        <h1 className="mt-5 font-display text-5xl">
          We can&apos;t find that code
        </h1>
        <p className="mt-4 text-cream/60">
          Double-check the confirmation code we sent you, or give the kitchen a
          ring.
        </p>
        <Link
          href="/order"
          className="mt-10 inline-block rounded-full bg-ember px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] transition hover:bg-ember-2"
        >
          Start a new order
        </Link>
      </section>
    );
  }

  const { order, items } = result;

  return (
    <>
      <section className="border-b border-white/10 bg-ink-2">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-10">
          <p className="text-xs uppercase tracking-[0.34em] text-ember">
            {order.fulfillment === "delivery" ? "Delivery" : "Pickup"} ·{" "}
            {order.code}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1] sm:text-6xl">
            {order.status === "cancelled"
              ? "This order was cancelled"
              : `Thanks, ${order.customerName.split(" ")[0]} — we're on it.`}
          </h1>
          <p className="mt-5 max-w-2xl text-cream/70">
            Estimated{" "}
            {order.fulfillment === "delivery" ? "arrival" : "ready"} in about{" "}
            <span className="text-cream">{order.etaMinutes} minutes</span>.
            {order.fulfillment === "pickup"
              ? " We'll text you when it's boxed up."
              : " Our rider will call on arrival."}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1fr_1fr] lg:px-10">
        <OrderStatusTracker
          code={order.code}
          fulfillment={order.fulfillment}
          initialStatus={order.status}
        />

        <div className="rounded-3xl border border-white/10 bg-ink-2 p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-cream/50">
            Order summary
          </p>
          <ul className="mt-6 space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-baseline justify-between gap-4 border-b border-white/5 pb-4"
              >
                <div>
                  <p className="font-display text-lg">
                    <span className="text-ember">{item.quantity}×</span>{" "}
                    {item.name}
                  </p>
                  <p className="text-xs text-cream/45">
                    {formatMoney(item.unitPriceCents)} each
                  </p>
                </div>
                <span className="font-display text-lg">
                  {formatMoney(item.unitPriceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between text-cream/70">
              <dt>Subtotal</dt>
              <dd>{formatMoney(order.subtotalCents)}</dd>
            </div>
            {order.deliveryFeeCents > 0 ? (
              <div className="flex justify-between text-cream/70">
                <dt>Delivery</dt>
                <dd>{formatMoney(order.deliveryFeeCents)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between text-cream/70">
              <dt>Tax</dt>
              <dd>{formatMoney(order.taxCents)}</dd>
            </div>
            <div className="flex justify-between text-cream/70">
              <dt>Tip</dt>
              <dd>{formatMoney(order.tipCents)}</dd>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-3 font-display text-2xl">
              <dt>Paid</dt>
              <dd className="text-ember">
                {formatMoney(order.totalCents)}
              </dd>
            </div>
          </dl>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-ink p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">
                {order.fulfillment === "delivery" ? "Deliver to" : "Pickup at"}
              </p>
              <p className="mt-2 text-sm text-cream/80">
                {order.fulfillment === "delivery"
                  ? order.address || "—"
                  : "G-Bite's, Ogun State, Nigeria"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40">
                Contact
              </p>
              <p className="mt-2 text-sm text-cream/80">{order.phone}</p>
              {order.email ? (
                <p className="text-sm text-cream/60">{order.email}</p>
              ) : null}
            </div>
          </div>

          {order.notes ? (
            <p className="mt-6 rounded-2xl border border-white/10 bg-ink p-4 text-sm text-cream/70">
              <span className="text-xs uppercase tracking-[0.2em] text-cream/40">
                Notes
              </span>
              <br />
              {order.notes}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="rounded-full bg-cream px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-ink transition hover:bg-ember hover:text-white"
            >
              Order something else
            </Link>
            <Link
              href="/book"
              className="rounded-full border border-white/20 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition hover:border-cream"
            >
              Book a table
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
