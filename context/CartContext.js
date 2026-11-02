"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { cartKey, findPack, packLabel } from "@/lib/packs";

const CartContext = createContext(null);
const STORAGE_KEY = "tilanga_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // Carts saved before pack sizes existed are single boxes.
      if (raw) setItems(JSON.parse(raw).map((i) => ({ boxes: 1, key: cartKey(i.slug, i.boxes || 1), ...i })));
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

  // `boxes` picks a pack size (see lib/packs.js); `qty` is how many packs.
  function addItem(product, qty = 1, boxes = 1) {
    // Dine-in only items (litti-chokha, fresh sweets, chai) can't be shipped,
    // and a sold-out item can't be added even if it's normally deliverable.
    if (product.deliverable === false || product.inStock === false) return;
    const pack = findPack(product, boxes);
    if (!pack) return;
    const key = cartKey(product.slug, pack.boxes);
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          key,
          slug: product.slug,
          boxes: pack.boxes,
          name: product.name,
          price: pack.price,
          weight: pack.boxes === 1 ? product.weight : `${packLabel(pack.boxes)} × ${product.weight}`,
          image: product.image,
          qty,
        },
      ];
    });
  }

  function updateQty(key, qty) {
    if (qty < 1) return removeItem(key);
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((i) => i.key !== key));
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
