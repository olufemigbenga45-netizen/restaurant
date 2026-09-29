import { eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { menuItems, orderItems, orders } from "@/db/schema";
import { DELIVERY_FEE, TAX_RATE } from "@/lib/restaurant";

export const dynamic = "force-dynamic";

type IncomingLine = { id: number; quantity: number };

function code() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return `ORD-${out}`;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const str = (key: string) =>
    typeof body[key] === "string" ? (body[key] as string).trim() : "";

  const fulfillment = str("fulfillment") === "delivery" ? "delivery" : "pickup";
  const customerName = str("customerName");
  const email = str("email");
  const phone = str("phone");
  const address = str("address");
  const notes = str("notes").slice(0, 500);
  const tipPct = Number.isFinite(Number(body.tipPct)) ? Number(body.tipPct) : 0;
  const lines = Array.isArray(body.lines) ? (body.lines as IncomingLine[]) : [];

  if (!customerName || !phone) {
    return Response.json(
      { error: "Name and phone number are required." },
      { status: 400 },
    );
  }
  if (fulfillment === "delivery" && address.length < 6) {
    return Response.json(
      { error: "Please provide a delivery address." },
      { status: 400 },
    );
  }
  if (lines.length === 0) {
    return Response.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const cleanLines = lines
    .map((line) => ({
      id: Number(line.id),
      quantity: Math.max(1, Math.min(20, Math.floor(Number(line.quantity) || 1))),
    }))
    .filter((line) => Number.isInteger(line.id) && line.id > 0);

  const found = await db
    .select()
    .from(menuItems)
    .where(
      inArray(
        menuItems.id,
        cleanLines.map((line) => line.id),
      ),
    );

  const unavailable = found.filter((item) => !item.isAvailable);
  if (unavailable.length) {
    return Response.json(
      { error: `${unavailable[0].name} just sold out. Please remove it to continue.` },
      { status: 409 },
    );
  }

  const priced = cleanLines
    .map((line) => {
      const item = found.find((f) => f.id === line.id);
      return item ? { ...item, quantity: line.quantity } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (priced.length === 0) {
    return Response.json({ error: "No valid items in the cart." }, { status: 400 });
  }

  const subtotalCents = priced.reduce(
    (sum, line) => sum + line.priceCents * line.quantity,
    0,
  );
  const deliveryFeeCents = fulfillment === "delivery" ? DELIVERY_FEE : 0;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const tipCents = Math.round((subtotalCents * Math.max(0, tipPct)) / 100);
  const totalCents = subtotalCents + deliveryFeeCents + taxCents + tipCents;
  const etaMinutes =
    fulfillment === "delivery"
      ? 35 + Math.min(40, priced.reduce((m, l) => Math.max(m, l.prepMinutes), 0))
      : Math.min(60, 15 + Math.max(...priced.map((l) => l.prepMinutes)));

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = code();
    const existing = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.code, candidate))
      .limit(1);
    if (existing.length) continue;

    const [created] = await db
      .insert(orders)
      .values({
        code: candidate,
        fulfillment,
        status: "received",
        customerName,
        email,
        phone,
        address,
        notes,
        subtotalCents,
        deliveryFeeCents,
        taxCents,
        tipCents,
        totalCents,
        etaMinutes,
      })
      .returning();

    await db.insert(orderItems).values(
      priced.map((line) => ({
        orderId: created.id,
        menuItemId: line.id,
        name: line.name,
        unitPriceCents: line.priceCents,
        quantity: line.quantity,
      })),
    );

    return Response.json({ order: created }, { status: 201 });
  }

  return Response.json({ error: "Could not place the order." }, { status: 500 });
}
