"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatRupees } from "@/lib/format";
import { useSettings } from "@/lib/useSettings";
import PaymentLogos from "@/components/PaymentLogos";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, hydrated } = useCart();
  const { retail } = useSettings().settings;

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-leaf">Your cart is empty</h1>
        <p className="mt-3 text-[15px] text-ink/70">Add our peda from the menu and it will show up here.</p>
        <Link href="/menu" className="mt-6 inline-block rounded-lg bg-leaf px-6 py-3 text-[15px] font-semibold text-cream hover:bg-leaf-dark">
          Browse the menu
        </Link>
      </div>
    );
  }

  const deliveryFee = subtotal > 0 && subtotal < retail.freeShippingAbove ? retail.flatShippingFee : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-leaf">Your Cart</h1>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-4 rounded-xl border border-gold/30 bg-cream-dark/30 p-4">
            <Image src={item.image} alt={item.name} width={160} height={160} className="h-16 w-16 shrink-0 rounded-lg object-cover sm:h-20 sm:w-20" />
            <div className="flex-1">
              <Link href={`/product/${item.slug}`} className="font-display text-leaf hover:text-mustard">
                {item.name}
              </Link>
              <p className="text-sm text-ink/60">{item.weight}</p>
              <p className="mt-1 text-sm font-semibold text-mustard">{formatRupees(item.price)}</p>
            </div>
            <div className="flex items-center rounded-lg border border-leaf/30">
              <button onClick={() => updateQty(item.key, item.qty - 1)} className="px-2.5 py-1.5 text-leaf" aria-label={`Decrease ${item.name} quantity`}>
                −
              </button>
              <span className="w-7 text-center text-sm">{item.qty}</span>
              <button onClick={() => updateQty(item.key, item.qty + 1)} className="px-2.5 py-1.5 text-leaf" aria-label={`Increase ${item.name} quantity`}>
                +
              </button>
            </div>
            <button onClick={() => removeItem(item.key)} className="ml-2 text-sm text-mustard/80 hover:text-mustard" aria-label={`Remove ${item.name} from cart`}>
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
        {deliveryFee > 0 && (
          <p className="mt-1 text-xs text-ink/50">Free shipping above {formatRupees(retail.freeShippingAbove)}</p>
        )}
        <div className="mt-3 flex justify-between border-t border-gold/30 pt-3 text-base font-semibold text-leaf">
          <span>Total</span>
          <span>{formatRupees(total)}</span>
        </div>
        <Link href="/checkout" className="mt-5 block rounded-md bg-leaf py-3.5 text-center text-[15px] font-semibold text-cream btn-3d">
          Proceed to checkout →
        </Link>
        <div className="mt-4">
          <PaymentLogos height={16} />
          <p className="mt-2 text-xs text-ink/55">Pay online with Razorpay, or cash on delivery.</p>
        </div>
      </div>
    </div>
  );
}
