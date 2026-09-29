import { eq } from "drizzle-orm";
import { db } from "@/db";
import { reservations } from "@/db/schema";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "confirmed", "seated", "cancelled"] as const;

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const reservationId = Number(id);
  if (!Number.isInteger(reservationId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status = STATUSES.find((s) => s === body.status);
  if (!status) {
    return Response.json({ error: "Unknown status" }, { status: 400 });
  }

  const [updated] = await db
    .update(reservations)
    .set({ status })
    .where(eq(reservations.id, reservationId))
    .returning();

  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ reservation: updated });
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const reservationId = Number(id);
  if (!Number.isInteger(reservationId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }
  await db.delete(reservations).where(eq(reservations.id, reservationId));
  return Response.json({ ok: true });
}
