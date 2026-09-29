import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  menuItems,
  orderItems,
  orders,
  reservations,
} from "@/db/schema";

export type MenuItemRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  tags: string[];
  spiceLevel: number;
  prepMinutes: number;
  isChefPick: boolean;
  isAvailable: boolean;
};

export type MenuCategory = {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  icon: string;
  items: MenuItemRow[];
};

export async function getMenu(): Promise<MenuCategory[]> {
  const rows = await db
    .select()
    .from(categories)
    .leftJoin(menuItems, eq(menuItems.categoryId, categories.id))
    .orderBy(asc(categories.sortOrder), asc(menuItems.sortOrder));

  const map = new Map<number, MenuCategory>();
  for (const row of rows) {
    const cat = row.categories;
    if (!map.has(cat.id)) {
      map.set(cat.id, {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        tagline: cat.tagline,
        icon: cat.icon,
        items: [],
      });
    }
    const item = row.menu_items;
    if (item) {
      map.get(cat.id)!.items.push({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description,
        priceCents: item.priceCents,
        imageUrl: item.imageUrl,
        tags: item.tags ?? [],
        spiceLevel: item.spiceLevel,
        prepMinutes: item.prepMinutes,
        isChefPick: item.isChefPick,
        isAvailable: item.isAvailable,
      });
    }
  }
  return [...map.values()];
}

export async function getChefPicks(limit = 3): Promise<MenuItemRow[]> {
  const rows = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.isChefPick, true))
    .orderBy(asc(menuItems.sortOrder))
    .limit(limit);
  return rows.map((r) => ({ ...r, tags: r.tags ?? [] }));
}

export type ReservationRow = {
  id: number;
  code: string;
  guestName: string;
  email: string;
  phone: string;
  partySize: number;
  slotDate: string;
  slotTime: string;
  seating: string;
  occasion: string;
  notes: string;
  status: string;
  createdAt: Date;
};

export async function getReservations(): Promise<ReservationRow[]> {
  return db
    .select()
    .from(reservations)
    .orderBy(asc(reservations.slotDate), asc(reservations.slotTime));
}

export type OrderRow = {
  id: number;
  code: string;
  fulfillment: string;
  status: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  subtotalCents: number;
  deliveryFeeCents: number;
  taxCents: number;
  tipCents: number;
  totalCents: number;
  etaMinutes: number;
  createdAt: Date;
};

export async function getOrders(limit = 50): Promise<OrderRow[]> {
  return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit);
}

export async function getOrderWithItems(code: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.code, code.toUpperCase()))
    .limit(1);
  if (!order) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));
  return { order, items };
}

export async function getDashboardStats() {
  const [resAgg] = await db
    .select({
      total: sql<number>`count(*)::int`,
      covers: sql<number>`coalesce(sum(${reservations.partySize}), 0)::int`,
      pending: sql<number>`count(*) filter (where ${reservations.status} = 'pending')::int`,
    })
    .from(reservations);

  const [orderAgg] = await db
    .select({
      total: sql<number>`count(*)::int`,
      revenue: sql<number>`coalesce(sum(${orders.totalCents}), 0)::int`,
      open: sql<number>`count(*) filter (where ${orders.status} in ('received','preparing','ready','out_for_delivery'))::int`,
    })
    .from(orders);

  const [todayAgg] = await db
    .select({
      covers: sql<number>`coalesce(sum(${reservations.partySize}), 0)::int`,
    })
    .from(reservations)
    .where(eq(reservations.slotDate, new Date().toISOString().slice(0, 10)));

  return {
    reservations: resAgg ?? { total: 0, covers: 0, pending: 0 },
    orders: orderAgg ?? { total: 0, revenue: 0, open: 0 },
    todayCovers: todayAgg?.covers ?? 0,
  };
}
