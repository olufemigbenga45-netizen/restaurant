import { eq } from "drizzle-orm";
import { db } from "@/db";
import { menuItems } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: { isAvailable?: boolean };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body.isAvailable !== "boolean") {
    return Response.json({ error: "isAvailable boolean required" }, { status: 400 });
  }

  const [updated] = await db
    .update(menuItems)
    .set({ isAvailable: body.isAvailable })
    .where(eq(menuItems.id, itemId))
    .returning();

  if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ item: updated });
}
