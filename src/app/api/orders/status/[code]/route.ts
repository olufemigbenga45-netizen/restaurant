import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.code, code.toUpperCase()))
    .limit(1);
  if (!order) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ order });
}
