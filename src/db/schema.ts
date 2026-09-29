import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const reservationStatus = pgEnum("reservation_status", [
  "pending",
  "confirmed",
  "seated",
  "cancelled",
]);

export const orderStatus = pgEnum("order_status", [
  "received",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
]);

export const fulfillmentType = pgEnum("fulfillment_type", [
  "pickup",
  "delivery",
]);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  tagline: text("tagline").notNull().default(""),
  icon: varchar("icon", { length: 8 }).notNull().default("🍽️"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const menuItems = pgTable(
  "menu_items",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    description: text("description").notNull().default(""),
    priceCents: integer("price_cents").notNull(),
    imageUrl: text("image_url").notNull().default(""),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    spiceLevel: integer("spice_level").notNull().default(0),
    prepMinutes: integer("prep_minutes").notNull().default(15),
    isChefPick: boolean("is_chef_pick").notNull().default(false),
    isAvailable: boolean("is_available").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("menu_items_category_idx").on(table.categoryId)],
);

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 12 }).notNull().unique(),
  guestName: varchar("guest_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull().default(""),
  partySize: integer("party_size").notNull(),
  slotDate: varchar("slot_date", { length: 10 }).notNull(),
  slotTime: varchar("slot_time", { length: 5 }).notNull(),
  seating: varchar("seating", { length: 24 }).notNull().default("dining-room"),
  occasion: varchar("occasion", { length: 60 }).notNull().default(""),
  notes: text("notes").notNull().default(""),
  status: reservationStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 12 }).notNull().unique(),
  fulfillment: fulfillmentType("fulfillment").notNull().default("pickup"),
  status: orderStatus("status").notNull().default("received"),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  email: varchar("email", { length: 200 }).notNull().default(""),
  phone: varchar("phone", { length: 40 }).notNull().default(""),
  address: text("address").notNull().default(""),
  notes: text("notes").notNull().default(""),
  subtotalCents: integer("subtotal_cents").notNull(),
  deliveryFeeCents: integer("delivery_fee_cents").notNull().default(0),
  taxCents: integer("tax_cents").notNull().default(0),
  tipCents: integer("tip_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  etaMinutes: integer("eta_minutes").notNull().default(30),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: integer("menu_item_id"),
  name: varchar("name", { length: 160 }).notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  quantity: integer("quantity").notNull(),
  notes: text("notes").notNull().default(""),
});

export type Category = typeof categories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type Reservation = typeof reservations.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
