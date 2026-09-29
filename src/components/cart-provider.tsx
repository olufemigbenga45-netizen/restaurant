"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  id: number;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "gbites-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = useCallback(
    (item: Omit<CartLine, "quantity">, quantity = 1) => {
      setLines((prev) => {
        const existing = prev.find((line) => line.id === item.id);
        if (existing) {
          return prev.map((line) =>
            line.id === item.id
              ? { ...line, quantity: line.quantity + quantity }
              : line,
          );
        }
        return [...prev, { ...item, quantity }];
      });
      setIsOpen(true);
    },
    [],
  );

  const setQuantity = useCallback((id: number, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((line) => line.id !== id)
        : prev.map((line) => (line.id === id ? { ...line, quantity } : line)),
    );
  }, []);

  const removeItem = useCallback((id: number) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotalCents = lines.reduce(
      (sum, line) => sum + line.priceCents * line.quantity,
      0,
    );
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    return {
      lines,
      count,
      subtotalCents,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      setQuantity,
      removeItem,
      clear,
    };
  }, [lines, isOpen, addItem, setQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
