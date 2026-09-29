import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";

export const dynamic = "force-dynamic";

const STATUSES = [
  "received",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
] as const;

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) {
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
    .update(orders)
    .set({ status })
    .where(eq(orders.id, orderId))
    .returning();

  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ order: updated });
}
