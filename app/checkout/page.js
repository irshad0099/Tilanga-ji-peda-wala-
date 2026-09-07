"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatRupees } from "@/lib/format";
import { estimateDelivery } from "@/lib/shipping";
import { generateOrderId, saveOrder } from "@/lib/orders";

const paymentOptions = [
  { id: "cod", label: "Cash on Delivery" },
  { id: "upi", label: "UPI QR" },
  { id: "razorpay", label: "Pay Online (Razorpay)" },
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart, hydrated } = useCart();

  const [form, setForm] = useState({ name: "", phone: "", address: "", pincode: "" });
  const [payment, setPayment] = useState("cod");
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(null);

  const deliveryFee = subtotal > 0 && subtotal < 599 ? 79 : 0;
  const total = subtotal + deliveryFee;
  const estimate = form.pincode.length === 6 ? estimateDelivery(form.pincode) : null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "pincode" ? value.replace(/\D/g, "") : value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = "Enter a valid 10-digit phone number.";
    if (!form.address.trim()) next.address = "Enter your delivery address.";
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = "Enter a valid 6-digit pincode.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handlePlaceOrder(e) {
    e.preventDefault();
    if (!validate()) return;

    const order = {
      id: generateOrderId(),
      items,
      subtotal,
      deliveryFee,
      total,
      payment,
      status: "Placed",
      date: new Date().toISOString(),
      customer: { ...form },
    };
    saveOrder(order);
    clearCart();
    setOrderPlaced(order);
  }

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-teal">Order placed!</h1>
        <p className="mt-3 text-[15px] text-ink/75">
          Your order has been recorded with the ID below. This is a design
          preview, so no payment has actually been charged.
        </p>
        <p className="mt-6 inline-block rounded-lg border border-gold/40 bg-cream-dark/40 px-6 py-3 font-display text-xl text-teal">
          {orderPlaced.id}
        </p>
        <p className="mt-4 text-sm text-ink/60">
          Total: {formatRupees(orderPlaced.total)} · Paying via{" "}
          {paymentOptions.find((p) => p.id === orderPlaced.payment)?.label}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/track-order" className="rounded-lg bg-teal px-6 py-3 text-[15px] font-semibold text-cream hover:bg-teal-dark">
            Track this order
          </Link>
          <Link href="/menu" className="rounded-lg border-2 border-teal px-6 py-3 text-[15px] font-semibold text-teal hover:bg-teal hover:text-cream">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-3xl text-teal">Nothing to check out</h1>
        <p className="mt-3 text-[15px] text-ink/70">Your cart is empty right now.</p>
        <Link href="/menu" className="mt-6 inline-block rounded-lg bg-teal px-6 py-3 text-[15px] font-semibold text-cream hover:bg-teal-dark">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl text-teal">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handlePlaceOrder} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-ink/80">Full name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal"
            />
            {errors.name && <p className="mt-1 text-sm text-maroon">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-ink/80">Phone number</label>
            <input
              name="phone"
              inputMode="numeric"
              maxLength={10}
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))}
              className="mt-1 w-full rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal"
            />
            {errors.phone && <p className="mt-1 text-sm text-maroon">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-ink/80">Delivery address</label>
            <textarea
              name="address"
              rows={3}
              value={form.address}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal"
            />
            {errors.address && <p className="mt-1 text-sm text-maroon">{errors.address}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-ink/80">Pincode</label>
            <input
              name="pincode"
              inputMode="numeric"
              maxLength={6}
              value={form.pincode}
              onChange={handleChange}
              className="mt-1 w-full max-w-[10rem] rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal"
            />
            {errors.pincode && <p className="mt-1 text-sm text-maroon">{errors.pincode}</p>}
            {!errors.pincode && estimate && (
              <p className="mt-1 text-sm text-teal">
                {estimate.zone}: estimated delivery in {estimate.days}.
              </p>
            )}
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-ink/80">Payment method</legend>
            <div className="mt-2 space-y-2">
              {paymentOptions.map((option) => (
                <label key={option.id} className="flex items-center gap-3 rounded-lg border border-teal/20 px-4 py-2.5">
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={payment === option.id}
                    onChange={() => setPayment(option.id)}
                  />
                  <span className="text-[15px]">{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button type="submit" className="w-full rounded-lg bg-maroon py-3 text-[15px] font-semibold text-cream hover:bg-maroon/90">
            Place order · {formatRupees(total)}
          </button>
          <p className="text-center text-xs text-ink/50">Preview checkout — no real payment is processed yet.</p>
        </form>

        <div className="h-fit rounded-xl border border-gold/30 bg-cream-dark/30 p-6">
          <h2 className="font-display text-lg text-teal">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.slug} className="flex justify-between text-sm">
                <span>{item.name} × {item.qty}</span>
                <span>{formatRupees(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-gold/30 pt-4 text-[15px]">
            <div className="flex justify-between">
              <span className="text-ink/70">Subtotal</span>
              <span>{formatRupees(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/70">Shipping</span>
              <span>{deliveryFee === 0 ? "Free" : formatRupees(deliveryFee)}</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold text-teal">
              <span>Total</span>
              <span>{formatRupees(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
