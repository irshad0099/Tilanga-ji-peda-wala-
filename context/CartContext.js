"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "tilanga_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Ignore corrupted/blocked storage — cart just starts empty.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be unavailable (private mode, quota) — fail silently.
    }
  }, [items, hydrated]);

  function addItem(product, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          weight: product.weight,
          image: product.image,
          qty,
        },
      ];
    });
  }

  function updateQty(slug, qty) {
    if (qty < 1) return removeItem(slug);
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty } : i)));
  }

  function removeItem(slug) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [items]
  );

  const value = {
    items,
    hydrated,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
