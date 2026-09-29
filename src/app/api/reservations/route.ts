import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { reservations } from "@/db/schema";

export const dynamic = "force-dynamic";

const SLOTS = [
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
];

const SLOT_CAPACITY = 24;

function code() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return `RES-${out}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date");
  if (!date) return Response.json({ error: "date is required" }, { status: 400 });

  const rows = await db
    .select({
      slotTime: reservations.slotTime,
      covers: sql<number>`coalesce(sum(${reservations.partySize}), 0)::int`,
    })
    .from(reservations)
    .where(
      and(
        eq(reservations.slotDate, date),
        sql`${reservations.status} in ('pending','confirmed','seated')`,
      ),
    )
    .groupBy(reservations.slotTime);

  const taken = new Map(rows.map((r) => [r.slotTime, r.covers]));
  const availability = SLOTS.map((time) => {
    const used = taken.get(time) ?? 0;
    const remaining = Math.max(0, SLOT_CAPACITY - used);
    return { time, used, remaining, full: remaining === 0 };
  });

  return Response.json({ date, availability });
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
  const guestName = str("guestName");
  const email = str("email");
  const phone = str("phone");
  const slotDate = str("slotDate");
  const slotTime = str("slotTime");
  const seating = str("seating") || "dining-room";
  const occasion = str("occasion");
  const notes = str("notes").slice(0, 500);
  const partySize = Number(body.partySize);

  if (!guestName || !email || !slotDate || !slotTime) {
    return Response.json(
      { error: "Name, email, date and time are required." },
      { status: 400 },
    );
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "Please provide a valid email." }, { status: 400 });
  }
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > 12) {
    return Response.json(
      { error: "Party size must be between 1 and 12 guests." },
      { status: 400 },
    );
  }
  if (!SLOTS.includes(slotTime)) {
    return Response.json({ error: "Please pick a valid seating time." }, { status: 400 });
  }

  const [agg] = await db
    .select({
      covers: sql<number>`coalesce(sum(${reservations.partySize}), 0)::int`,
    })
    .from(reservations)
    .where(
      and(
        eq(reservations.slotDate, slotDate),
        eq(reservations.slotTime, slotTime),
        sql`${reservations.status} in ('pending','confirmed','seated')`,
      ),
    );

  const used = agg?.covers ?? 0;
  if (used + partySize > SLOT_CAPACITY) {
    return Response.json(
      {
        error: `Only ${Math.max(0, SLOT_CAPACITY - used)} seats left at ${slotTime}. Please choose another time.`,
      },
      { status: 409 },
    );
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = code();
    const existing = await db
      .select({ id: reservations.id })
      .from(reservations)
      .where(eq(reservations.code, candidate))
      .limit(1);
    if (existing.length) continue;
    const [created] = await db
      .insert(reservations)
      .values({
        code: candidate,
        guestName,
        email,
        phone,
        partySize,
        slotDate,
        slotTime,
        seating,
        occasion,
        notes,
        status: "pending",
      })
      .returning();
    return Response.json({ reservation: created }, { status: 201 });
  }

  return Response.json({ error: "Could not create reservation." }, { status: 500 });
}
