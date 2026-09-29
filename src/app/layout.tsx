import type { Metadata } from "next";
import type { ReactNode } from "react";
import CartDrawer from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "G-Bite's — Nigerian kitchen & grill",
  description:
    "Authentic Nigerian food in Ogun State. Smoky party jollof, charcoal suya, rich soups and more — dine in, book a table, or order online for pickup and delivery.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
