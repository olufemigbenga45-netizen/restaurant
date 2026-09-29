import Link from "next/link";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { orderItems } from "@/db/schema";
import {
  AvailabilityToggle,
  OrderStatusSelect,
  ReservationActions,
} from "@/components/admin-controls";
import {
  getDashboardStats,
  getMenu,
  getOrders,
  getReservations,
} from "@/lib/queries";
import { formatDateLong, formatMoney, formatSlotTime } from "@/lib/restaurant";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kitchen — G-Bite's",
  description: "Service dashboard: reservations, online orders and menu availability.",
};

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "reservations", label: "Reservations" },
  { key: "orders", label: "Orders" },
  { key: "menu", label: "Menu" },
];

function Badge({ value }: { value: string }) {
  const tone =
    {
      confirmed: "border-emerald-400/40 text-emerald-300",
      seated: "border-sky-400/40 text-sky-300",
      pending: "border-amber-400/40 text-amber-300",
      cancelled: "border-red-400/40 text-red-300",
      received: "border-amber-400/40 text-amber-300",
      preparing: "border-orange-400/40 text-orange-300",
      ready: "border-emerald-400/40 text-emerald-300",
      out_for_delivery: "border-sky-400/40 text-sky-300",
      completed: "border-white/20 text-cream/60",
    }[value] ?? "border-white/20 text-cream/60";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.16em] ${tone}`}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active = TABS.find((t) => t.key === tab)?.key ?? "overview";

  const [stats, reservations, orders, menu] = await Promise.all([
    getDashboardStats(),
    getReservations(),
    getOrders(50),
    getMenu(),
  ]);

  const orderIds = orders.map((order) => order.id);
  const items = orderIds.length
    ? await db
        .select()
        .from(orderItems)
        .where(inArray(orderItems.orderId, orderIds))
    : [];

  const openOrders = orders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled",
  );
  const upcoming = reservations.filter(
    (r) => r.status === "pending" || r.status === "confirmed",
  );

  return (
    <>
      <section className="border-b border-white/10 bg-ink-2">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-10">
          <p className="text-xs uppercase tracking-[0.34em] text-ember">
            Service dashboard
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1]">
            Kitchen &amp; front of house
          </h1>

          <nav className="mt-10 flex flex-wrap gap-3">
            {TABS.map((item) => (
              <Link
                key={item.key}
                href={`/admin?tab=${item.key}`}
                className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.16em] transition ${
                  active === item.key
                    ? "border-ember bg-ember text-white"
                    : "border-white/15 text-cream/60 hover:border-cream/50 hover:text-cream"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-10">
        {active === "overview" ? (
          <div className="space-y-10">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Covers tonight",
                  value: stats.todayCovers,
                  hint: "Guests on the book today",
                },
                {
                  label: "Reservations",
                  value: stats.reservations.total,
                  hint: `${stats.reservations.pending} awaiting confirmation`,
                },
                {
                  label: "Open orders",
                  value: stats.orders.open,
                  hint: `${stats.orders.total} all time`,
                },
                {
                  label: "Online revenue",
                  value: formatMoney(stats.orders.revenue),
                  hint: "Pickup + delivery",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/10 bg-ink-2 p-6"
                >
                  <p className="text-[10px] uppercase tracking-[0.22em] text-cream/45">
                    {card.label}
                  </p>
                  <p className="mt-3 font-display text-4xl text-ember">
                    {card.value}
                  </p>
                  <p className="mt-2 text-xs text-cream/45">{card.hint}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-ink-2 p-6">
                <div className="flex items-center justify-between">
                  <p className="font-display text-2xl">Next arrivals</p>
                  <Link
                    href="/admin?tab=reservations"
                    className="text-xs uppercase tracking-[0.16em] text-ember"
                  >
                    All
                  </Link>
                </div>
                <ul className="mt-5 divide-y divide-white/5">
                  {upcoming.slice(0, 6).map((reservation) => (
                    <li
                      key={reservation.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div>
                        <p className="text-sm">{reservation.guestName}</p>
                        <p className="text-xs text-cream/45">
                          {formatDateLong(reservation.slotDate)} ·{" "}
                          {formatSlotTime(reservation.slotTime)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-cream/55">
                          {reservation.partySize} pax
                        </span>
                        <Badge value={reservation.status} />
                      </div>
                    </li>
                  ))}
                  {upcoming.length === 0 ? (
                    <li className="py-6 text-sm text-cream/45">
                      Nothing on the book yet.
                    </li>
                  ) : null}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-ink-2 p-6">
                <div className="flex items-center justify-between">
                  <p className="font-display text-2xl">Live tickets</p>
                  <Link
                    href="/admin?tab=orders"
                    className="text-xs uppercase tracking-[0.16em] text-ember"
                  >
                    All
                  </Link>
                </div>
                <ul className="mt-5 divide-y divide-white/5">
                  {openOrders.slice(0, 6).map((order) => (
                    <li
                      key={order.id}
                      className="flex items-center justify-between gap-3 py-3"
                    >
                      <div>
                        <p className="text-sm">{order.customerName}</p>
                        <p className="text-xs text-cream/45">
                          {order.code} · {order.fulfillment}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-cream/70">
                          {formatMoney(order.totalCents)}
                        </span>
                        <Badge value={order.status} />
                      </div>
                    </li>
                  ))}
                  {openOrders.length === 0 ? (
                    <li className="py-6 text-sm text-cream/45">
                      No open tickets. Kitchen is clear.
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
        ) : null}

        {active === "reservations" ? (
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-ink-2 text-[10px] uppercase tracking-[0.18em] text-cream/45">
                <tr>
                  <th className="px-5 py-4">Code</th>
                  <th className="px-5 py-4">Guest</th>
                  <th className="px-5 py-4">When</th>
                  <th className="px-5 py-4">Party</th>
                  <th className="px-5 py-4">Seating</th>
                  <th className="px-5 py-4">Notes</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-ink-2/40">
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-5 py-4 font-display tracking-[0.12em] text-ember">
                      {reservation.code}
                    </td>
                    <td className="px-5 py-4">
                      <p>{reservation.guestName}</p>
                      <p className="text-xs text-cream/45">{reservation.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p>{formatDateLong(reservation.slotDate)}</p>
                      <p className="text-xs text-cream/45">
                        {formatSlotTime(reservation.slotTime)}
                      </p>
                    </td>
                    <td className="px-5 py-4">{reservation.partySize}</td>
                    <td className="px-5 py-4 capitalize text-cream/70">
                      {reservation.seating.replace("-", " ")}
                    </td>
                    <td className="max-w-[220px] px-5 py-4 text-xs text-cream/55">
                      {reservation.occasion ? (
                        <span className="block text-cream/70">
                          {reservation.occasion}
                        </span>
                      ) : null}
                      {reservation.notes || "—"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge value={reservation.status} />
                    </td>
                    <td className="px-5 py-4">
                      <ReservationActions
                        id={reservation.id}
                        status={reservation.status}
                      />
                    </td>
                  </tr>
                ))}
                {reservations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-5 py-10 text-center text-cream/45"
                    >
                      No reservations yet — they will appear here the moment a
                      guest books online.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        ) : null}

        {active === "orders" ? (
          <div className="space-y-5">
            {orders.map((order) => {
              const lines = items.filter((item) => item.orderId === order.id);
              return (
                <article
                  key={order.id}
                  className="rounded-2xl border border-white/10 bg-ink-2 p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="font-display text-2xl tracking-[0.1em] text-ember">
                        {order.code}
                      </p>
                      <p className="mt-1 text-xs text-cream/45">
                        {order.createdAt.toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}{" "}
                        · {order.fulfillment} · ETA {order.etaMinutes} min
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge value={order.status} />
                      <OrderStatusSelect id={order.id} status={order.status} />
                    </div>
                  </div>

                  <div className="grid gap-6 py-5 sm:grid-cols-[1.4fr_1fr]">
                    <ul className="space-y-2">
                      {lines.map((line) => (
                        <li
                          key={line.id}
                          className="flex items-baseline justify-between gap-3 text-sm"
                        >
                          <span className="text-cream/80">
                            <span className="text-ember">{line.quantity}×</span>{" "}
                            {line.name}
                          </span>
                          <span className="text-cream/55">
                            {formatMoney(line.unitPriceCents * line.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-sm">
                      <p className="text-cream/80">{order.customerName}</p>
                      <p className="text-xs text-cream/50">{order.phone}</p>
                      {order.address ? (
                        <p className="mt-2 text-xs text-cream/50">
                          {order.address}
                        </p>
                      ) : null}
                      {order.notes ? (
                        <p className="mt-2 rounded-lg border border-white/10 bg-ink p-3 text-xs text-cream/60">
                          {order.notes}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-sm">
                    <p className="text-cream/50">
                      Subtotal {formatMoney(order.subtotalCents)} · Tax{" "}
                      {formatMoney(order.taxCents)} · Tip{" "}
                      {formatMoney(order.tipCents)}
                    </p>
                    <p className="font-display text-2xl text-ember">
                      {formatMoney(order.totalCents)}
                    </p>
                  </div>
                </article>
              );
            })}
            {orders.length === 0 ? (
              <p className="rounded-2xl border border-white/10 bg-ink-2 p-10 text-center text-cream/45">
                No online orders yet.
              </p>
            ) : null}
          </div>
        ) : null}

        {active === "menu" ? (
          <div className="space-y-8">
            {menu.map((category) => (
              <div
                key={category.id}
                className="rounded-2xl border border-white/10 bg-ink-2 p-6"
              >
                <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-4">
                  <h2 className="font-display text-2xl">
                    {category.icon} {category.name}
                  </h2>
                  <p className="text-xs text-cream/45">
                    {category.items.length} dishes
                  </p>
                </div>
                <ul className="mt-4 divide-y divide-white/5">
                  {category.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-4 py-3"
                    >
                      <div className="min-w-[220px] flex-1">
                        <p className="text-sm">{item.name}</p>
                        <p className="text-xs text-cream/45">
                          {item.prepMinutes} min · {item.tags.join(" · ") || "—"}
                        </p>
                      </div>
                      <span className="text-sm text-cream/70">
                        {formatMoney(item.priceCents)}
                      </span>
                      <AvailabilityToggle
                        id={item.id}
                        isAvailable={item.isAvailable}
                        name={item.name}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}
