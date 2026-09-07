"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatRupees } from "@/lib/format";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, hydrated } = useCart();

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-teal">Your cart is empty</h1>
        <p className="mt-3 text-[15px] text-ink/70">Add a few sweets from the menu and they will show up here.</p>
        <Link href="/menu" className="mt-6 inline-block rounded-lg bg-teal px-6 py-3 text-[15px] font-semibold text-cream hover:bg-teal-dark">
          Browse the menu
        </Link>
      </div>
    );
  }

  const deliveryFee = subtotal > 0 && subtotal < 599 ? 79 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-teal">Your Cart</h1>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div key={item.slug} className="flex items-center gap-4 rounded-xl border border-gold/30 bg-cream-dark/30 p-4">
            <Image src={item.image} alt={item.name} width={80} height={80} className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20" />
            <div className="flex-1">
              <Link href={`/product/${item.slug}`} className="font-display text-teal hover:text-maroon">
                {item.name}
              </Link>
              <p className="text-sm text-ink/60">{item.weight}</p>
              <p className="mt-1 text-sm font-semibold text-maroon">{formatRupees(item.price)}</p>
            </div>
            <div className="flex items-center rounded-lg border border-teal/30">
              <button onClick={() => updateQty(item.slug, item.qty - 1)} className="px-2.5 py-1.5 text-teal" aria-label={`Decrease ${item.name} quantity`}>
                −
              </button>
              <span className="w-7 text-center text-sm">{item.qty}</span>
              <button onClick={() => updateQty(item.slug, item.qty + 1)} className="px-2.5 py-1.5 text-teal" aria-label={`Increase ${item.name} quantity`}>
                +
              </button>
            </div>
            <button onClick={() => removeItem(item.slug)} className="ml-2 text-sm text-maroon/80 hover:text-maroon" aria-label={`Remove ${item.name} from cart`}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 ml-auto max-w-sm rounded-xl border border-gold/30 bg-cream-dark/30 p-6">
        <div className="flex justify-between text-[15px]">
          <span className="text-ink/70">Subtotal</span>
          <span>{formatRupees(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-[15px]">
          <span className="text-ink/70">Shipping</span>
          <span>{deliveryFee === 0 ? "Free" : formatRupees(deliveryFee)}</span>
        </div>
        {deliveryFee > 0 && <p className="mt-1 text-xs text-ink/50">Free shipping above Rs. 599</p>}
        <div className="mt-3 flex justify-between border-t border-gold/30 pt-3 text-base font-semibold text-teal">
          <span>Total</span>
          <span>{formatRupees(total)}</span>
        </div>
        <Link href="/checkout" className="mt-5 block rounded-lg bg-maroon py-3 text-center text-[15px] font-semibold text-cream hover:bg-maroon/90">
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
