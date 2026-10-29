"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatRupees } from "@/lib/format";
import { estimateDelivery } from "@/lib/shipping";
import { rememberOrder } from "@/lib/orders";
import { useSettings } from "@/lib/useSettings";
import { retailOrderWhatsappLink } from "@/lib/whatsapp";
import PaymentLogos from "@/components/PaymentLogos";
import InvoicePreview from "@/components/InvoicePreview";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart, hydrated } = useCart();
  const { settings } = useSettings();
  const { retail, whatsapp, shop, payments } = settings;

  const [form, setForm] = useState({ name: "", phone: "", address: "", pincode: "" });
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState("online");
  const [busy, setBusy] = useState(""); // "" | "placing" | "opening" | "verifying" | "switching"
  const [formError, setFormError] = useState("");
  // An online order that exists on the server but isn't paid yet.
  const [pending, setPending] = useState(null); // { order, razorpay, error }
  const [placed, setPlaced] = useState(null);

  // If Razorpay isn't set up on the server, cash on delivery is the only way.
  const method = payments.online ? payment : "cod";
  const deliveryFee = subtotal > 0 && subtotal < retail.freeShippingAbove ? retail.flatShippingFee : 0;
  const total = subtotal + deliveryFee;
  const estimate = form.pincode.length === 6 ? estimateDelivery(form.pincode) : null;

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Enter your name.";
    if (!/^[6-9]\d{9}$/.test(form.phone)) next.phone = "Enter a valid 10-digit mobile number.";
    if (form.address.trim().length < 10) next.address = "Enter your full address — house, street, area, city.";
    if (!/^[1-9]\d{5}$/.test(form.pincode)) next.pincode = "Enter a valid 6-digit pincode.";
    setErrors(next);
    const firstBad = Object.keys(next)[0];
    if (firstBad) {
      // The pay button sits below the form on phones — bring the problem into view.
      const el = document.querySelector(`[data-field="${firstBad}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.querySelector("input, textarea")?.focus({ preventScroll: true });
    }
    return !firstBad;
  }

  function finish(order) {
    rememberOrder(order);
    clearCart();
    setPending(null);
    setPlaced(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function openRazorpay({ order, razorpay }) {
    setBusy("opening");
    const ok = await loadRazorpay();
    if (!ok) {
      setBusy("");
      setPending({ order, razorpay, error: "Couldn't load the payment window. Check your internet and try again." });
      return;
    }

    let failure = "";
    const rzp = new window.Razorpay({
      key: razorpay.keyId,
      order_id: razorpay.orderId,
      amount: razorpay.amount,
      currency: razorpay.currency,
      name: shop.shortName,
      description: `Order ${order.id}`,
      image: `${window.location.origin}/apple-icon.png`,
      prefill: { name: order.customer.name, contact: `+91${order.customer.phone}` },
      notes: { orderId: order.id },
      theme: { color: "#6E1E2B" },
      handler: async (response) => {
        setBusy("verifying");
        const { ok: verified, data } = await postJson("/api/checkout/verify", { orderId: order.id, ...response });
        setBusy("");
        if (verified && data.order) {
          finish(data.order);
        } else {
          // Money has moved but our check failed (network, etc.). The
          // Razorpay webhook will still mark the order paid on our side.
          finish({ ...order, paymentStatus: "paid", razorpayPaymentId: response.razorpay_payment_id, verifyPending: true });
        }
      },
      modal: {
        ondismiss: () => {
          setBusy("");
          setPending({ order, razorpay, error: failure || "The payment window was closed before paying." });
        },
      },
    });
    rzp.on("payment.failed", (resp) => {
      failure = resp?.error?.description || "The payment didn't go through.";
    });
    setPending({ order, razorpay, error: "" });
    rzp.open();
    setBusy("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (!validate()) return;

    setBusy("placing");
    const { ok, data } = await postJson("/api/checkout", {
      items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
      customer: form,
      payment: method,
    });
    if (!ok) {
      setBusy("");
      if (data.fieldErrors) setErrors(data.fieldErrors);
      setFormError(data.error || "Something went wrong. Please try again.");
      return;
    }
    if (method === "cod") {
      setBusy("");
      finish(data.order);
    } else {
      await openRazorpay(data);
    }
  }

  async function switchToCod() {
    setBusy("switching");
    const { ok, data } = await postJson("/api/checkout/cod", { orderId: pending.order.id });
    setBusy("");
    if (ok && data.order) finish(data.order);
    else setPending((p) => ({ ...p, error: data.error || "Couldn't switch to cash on delivery. Please call the shop." }));
  }

  // ---- Order placed ---------------------------------------------------------
  if (placed) {
    return <OrderPlaced order={placed} whatsapp={whatsapp} />;
  }

  // ---- Empty cart -------------------------------------------------------------
  if (hydrated && items.length === 0 && !pending) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-4xl text-maroon">कार्ट खाली है</h1>
        <p className="mt-3 text-[15px] text-ink/70">Add a box of peda from the menu to check out.</p>
        <Link href="/menu" className="mt-7 inline-block rounded-md bg-maroon px-6 py-3 text-[15px] font-semibold text-cream hover:bg-maroon-dark">
          Browse the menu
        </Link>
      </div>
    );
  }

  const locked = Boolean(pending) || Boolean(busy);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6">
      <Steps current={1} />
      <h1 className="mt-6 font-display text-4xl text-maroon sm:text-5xl">ऑर्डर पूरा करें</h1>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_24rem] lg:gap-14">
        <form onSubmit={handleSubmit} noValidate className="space-y-10">
          {/* 1 — Address */}
          <section>
            <SectionTitle n="1" title="कहाँ भेजें?" sub="Delivery address" />
            <fieldset disabled={locked} className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field name="name" label="Full name" error={errors.name}>
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  autoComplete="name"
                  className={inputClass(errors.name)}
                />
              </Field>
              <Field name="phone" label="Mobile number" error={errors.phone} hint="For delivery updates">
                <div className={`flex items-stretch overflow-hidden ${inputClass(errors.phone, true)}`}>
                  <span className="flex items-center border-r border-maroon/20 bg-cream-dark/50 px-3 text-[15px] text-ink/60">+91</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    className="w-full bg-transparent px-3 py-3 text-[15px] outline-none"
                  />
                </div>
              </Field>
              <Field name="address" label="Address" error={errors.address} full>
                <textarea
                  rows={3}
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                  autoComplete="street-address"
                  placeholder="House no., street, area, landmark, city"
                  className={inputClass(errors.address)}
                />
              </Field>
              <Field name="pincode" label="Pincode" error={errors.pincode}>
                <input
                  value={form.pincode}
                  onChange={(e) => setField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  className={inputClass(errors.pincode)}
                />
              </Field>
              <div className="flex items-end pb-3 text-sm">
                {estimate && !errors.pincode && (
                  <p className="text-maroon">
                    <span className="font-semibold">{estimate.days}</span>
                    <span className="text-ink/60"> · {estimate.zone}</span>
                  </p>
                )}
              </div>
            </fieldset>
          </section>

          {/* 2 — Payment */}
          <section>
            <SectionTitle n="2" title="पेमेंट कैसे करेंगे?" sub="Payment method" />
            <fieldset disabled={locked} className="mt-5 space-y-3">
              <PayOption
                checked={method === "online"}
                disabled={!payments.online}
                onSelect={() => setPayment("online")}
                title="Pay online"
                badge={payments.online ? "Instant confirmation" : "Not available right now"}
                body={
                  <>
                    <PaymentLogos />
                    <p className="mt-2.5 text-xs text-ink/55">
                      UPI, debit/credit card, netbanking or wallet — secured by Razorpay.
                    </p>
                  </>
                }
              />
              <PayOption
                checked={method === "cod"}
                onSelect={() => setPayment("cod")}
                title="Cash on Delivery"
                body={<p className="text-sm text-ink/65">Pay in cash when the box reaches you.</p>}
              />
            </fieldset>
          </section>

          {/* Pay / place */}
          {pending ? (
            <PaymentIncomplete
              pending={pending}
              busy={busy}
              onRetry={() => openRazorpay(pending)}
              onCod={switchToCod}
              onEdit={() => setPending(null)}
            />
          ) : (
            <div>
              {formError && (
                <p className="mb-4 rounded-md border border-saffron/40 bg-saffron/5 px-4 py-3 text-sm text-saffron">{formError}</p>
              )}
              <button
                type="submit"
                disabled={Boolean(busy) || !hydrated}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-saffron px-6 py-4 text-base font-semibold text-cream shadow-[0_3px_0_var(--maroon-dark)] transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-70"
              >
                {busy ? (
                  <>
                    <Spinner /> {busy === "placing" ? "Placing your order…" : "Opening payment…"}
                  </>
                ) : method === "online" ? (
                  <>Pay {formatRupees(total)} securely →</>
                ) : (
                  <>Place order · {formatRupees(total)}</>
                )}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink/55">
                <LockIcon />
                {method === "online"
                  ? "Payment happens on Razorpay's secure page. We never see your card or UPI PIN."
                  : "No advance needed. Keep the exact amount ready if you can."}
              </p>
            </div>
          )}
        </form>

        <OrderSummary items={items} pending={pending} subtotal={subtotal} deliveryFee={deliveryFee} total={total} retail={retail} />
      </div>

      {busy === "verifying" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-6 backdrop-blur-sm">
          <div className="max-w-sm rounded-md bg-cream p-8 text-center shadow-xl">
            <Spinner large />
            <p className="mt-4 font-display text-2xl text-maroon">पेमेंट कन्फर्म हो रहा है</p>
            <p className="mt-2 text-sm text-ink/70">Please don&apos;t close or refresh this page.</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function Steps({ current }) {
  const steps = ["Cart", "Details & payment", "Done"];
  return (
    <ol className="flex items-center gap-2 text-xs font-semibold sm:text-sm">
      {steps.map((label, i) => (
        <li key={label} className="flex items-center gap-2">
          {i > 0 && <span className="h-px w-5 bg-gold sm:w-10" aria-hidden="true" />}
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
              i < current ? "bg-maroon text-cream" : i === current ? "bg-saffron text-cream" : "border border-ink/25 text-ink/45"
            }`}
          >
            {i < current ? "✓" : i + 1}
          </span>
          <span className={i === current ? "text-maroon" : "text-ink/55"}>{label}</span>
        </li>
      ))}
    </ol>
  );
}

function SectionTitle({ n, title, sub }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-gold/50 pb-3">
      <span className="font-display text-2xl text-gold">{n}</span>
      <h2 className="font-display text-2xl text-maroon">{title}</h2>
      <span className="ml-auto text-xs font-medium uppercase tracking-wider text-ink/45">{sub}</span>
    </div>
  );
}

function inputClass(error, wrapper = false) {
  const base = `w-full rounded-md border bg-cream ${error ? "border-saffron" : "border-maroon/25"} focus-within:border-maroon`;
  return wrapper ? base : `${base} px-4 py-3 text-[15px] outline-none focus:border-maroon disabled:opacity-60`;
}

function Field({ name, label, error, hint, full, children }) {
  return (
    <label data-field={name} className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="flex items-baseline justify-between text-sm font-medium text-ink/80">
        {label}
        {hint && <span className="text-xs font-normal text-ink/45">{hint}</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1.5 block text-sm text-saffron">{error}</span>}
    </label>
  );
}

function PayOption({ checked, disabled, onSelect, title, badge, body }) {
  return (
    <label
      className={`relative flex cursor-pointer gap-4 rounded-md border-2 p-5 transition-colors ${
        disabled
          ? "cursor-not-allowed border-ink/10 opacity-55"
          : checked
            ? "border-maroon bg-cream shadow-[0_8px_24px_rgba(58,42,28,0.10)]"
            : "border-maroon/15 hover:border-maroon/40"
      }`}
    >
      <input type="radio" name="payment" checked={checked} disabled={disabled} onChange={onSelect} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? "border-maroon" : "border-ink/30"
        } peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-saffron`}
      >
        {checked && <span className="h-2.5 w-2.5 rounded-full bg-maroon" />}
      </span>
      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-[16px] font-semibold text-ink">{title}</span>
          {badge && (
            <span className={`text-xs font-semibold ${disabled ? "text-ink/50" : "text-saffron"}`}>{badge}</span>
          )}
        </span>
        <span className="mt-2.5 block">{body}</span>
      </span>
    </label>
  );
}

function PaymentIncomplete({ pending, busy, onRetry, onCod, onEdit }) {
  return (
    <div className="rounded-md border-2 border-saffron/50 bg-saffron/5 p-6">
      <p className="font-display text-2xl text-maroon">पेमेंट पूरा नहीं हुआ</p>
      <p className="mt-1.5 text-sm text-ink/75">
        {pending.error || "Complete the payment in the Razorpay window."} No money has been taken for order{" "}
        <span className="font-mono font-semibold">{pending.order.id}</span> yet.
      </p>
      <p className="mt-1 text-xs text-ink/55">If money was deducted, don&apos;t pay again — it will show as paid within a few minutes.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onRetry}
          disabled={Boolean(busy)}
          className="flex items-center gap-2 rounded-md bg-saffron px-5 py-3 text-[15px] font-semibold text-cream hover:bg-saffron/90 disabled:opacity-60"
        >
          {busy === "opening" && <Spinner />} Try paying again · {formatRupees(pending.order.total)}
        </button>
        <button
          type="button"
          onClick={onCod}
          disabled={Boolean(busy)}
          className="flex items-center gap-2 rounded-md border-2 border-maroon px-5 py-3 text-[15px] font-semibold text-maroon hover:bg-maroon hover:text-cream disabled:opacity-60"
        >
          {busy === "switching" && <Spinner />} Switch to Cash on Delivery
        </button>
      </div>
      <button type="button" onClick={onEdit} disabled={Boolean(busy)} className="mt-4 text-sm text-ink/60 underline underline-offset-4 hover:text-maroon">
        Change address or cart
      </button>
    </div>
  );
}

function OrderSummary({ items, pending, subtotal, deliveryFee, total, retail }) {
  // Once an order exists, show the server's priced copy — that's what is charged.
  const o = pending?.order;
  const lines = o ? o.items : items;
  const sub = o ? o.subtotal : subtotal;
  const fee = o ? o.deliveryFee : deliveryFee;
  const tot = o ? o.total : total;
  const toFree = retail.freeShippingAbove - sub;

  return (
    <aside className="h-fit rounded-md bg-cream shadow-[0_10px_30px_rgba(58,42,28,0.12)] ring-1 ring-gold/30 lg:sticky lg:top-24">
      <div className="border-b border-dashed border-gold/60 p-6">
        <h2 className="font-display text-xl text-maroon">आपका ऑर्डर</h2>
        <ul className="mt-5 space-y-4">
          {lines.map((item) => (
            <li key={item.slug} className="flex items-center gap-3">
              <span className="relative shrink-0">
                <Image src={item.image} alt="" width={112} height={112} className="h-14 w-14 rounded-sm object-cover" />
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-maroon px-1 text-[11px] font-semibold text-cream">
                  {item.qty}
                </span>
              </span>
              <span className="flex-1 text-sm">
                <span className="block font-semibold text-ink">{item.name}</span>
                <span className="text-ink/55">{item.weight}</span>
              </span>
              <span className="text-sm font-semibold">{formatRupees(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>
        {!o && (
          <Link href="/cart" className="mt-4 inline-block text-xs font-semibold text-maroon underline decoration-gold underline-offset-4">
            Edit cart
          </Link>
        )}
      </div>
      <dl className="space-y-2 p-6 text-[15px]">
        <div className="flex justify-between">
          <dt className="text-ink/65">Subtotal</dt>
          <dd>{formatRupees(sub)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink/65">Delivery</dt>
          <dd>{fee === 0 ? <span className="font-semibold text-maroon">Free</span> : formatRupees(fee)}</dd>
        </div>
        {fee > 0 && toFree > 0 && (
          <p className="text-xs text-ink/55">Add {formatRupees(toFree)} more for free delivery.</p>
        )}
        <div className="flex items-baseline justify-between border-t border-gold/40 pt-3">
          <dt className="font-semibold text-maroon">Total</dt>
          <dd className="font-display text-3xl text-maroon">{formatRupees(tot)}</dd>
        </div>
      </dl>
      <ul className="space-y-1.5 border-t border-gold/30 bg-cream-dark/40 px-6 py-4 text-xs text-ink/65">
        <li>✦ Packed fresh the day it ships</li>
        <li>✦ Invoice with every order</li>
        <li>✦ Questions? WhatsApp the shop any time</li>
      </ul>
    </aside>
  );
}

function OrderPlaced({ order, whatsapp }) {
  const paid = order.paymentStatus === "paid";
  const estimate = estimateDelivery(order.customer?.pincode || "");
  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
      <Steps current={2} />

      <div className="mt-10 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-maroon text-cream shadow-[0_0_0_8px_var(--cream-dark)]">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h1 className="mt-6 font-display text-4xl text-maroon sm:text-5xl">ऑर्डर हो गया!</h1>
        <p className="mt-3 text-[16px] text-ink/75">
          Thank you, {order.customer?.name?.split(" ")[0]}. Your peda is in good hands.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-md border-2 border-dashed border-gold bg-cream px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">Order ID</p>
          <p className="mt-1 font-display text-3xl tracking-wide text-maroon">{order.id}</p>
          <p className="mt-3 text-sm">
            {paid ? (
              <span className="font-semibold text-maroon">✓ {formatRupees(order.total)} paid online</span>
            ) : (
              <span className="font-semibold text-saffron">{formatRupees(order.total)} to pay in cash on delivery</span>
            )}
          </p>
          {order.razorpayPaymentId && (
            <p className="mt-1 font-mono text-xs text-ink/50">Payment ID {order.razorpayPaymentId}</p>
          )}
          {order.verifyPending && (
            <p className="mt-2 text-xs text-ink/60">Your payment went through — it may take a few minutes to show as confirmed.</p>
          )}
        </div>
      </div>

      <ol className="mx-auto mt-12 grid max-w-2xl gap-6 sm:grid-cols-3">
        {[
          { t: "आज पैकिंग", d: "Packed fresh at the shop" },
          { t: "कूरियर", d: "Handed to the courier" },
          { t: "डिलीवरी", d: estimate ? `${estimate.days} · ${estimate.zone}` : "To your door" },
        ].map((s, i) => (
          <li key={s.t} className="flex gap-3 sm:block sm:text-center">
            <span className="font-display text-3xl leading-none text-gold">{i + 1}</span>
            <span>
              <span className="block font-display text-lg text-maroon sm:mt-2">{s.t}</span>
              <span className="text-sm text-ink/65">{s.d}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-wrap justify-center gap-3">
        <Link
          href="/track-order"
          className="rounded-md bg-maroon px-6 py-3 text-[15px] font-semibold text-cream hover:bg-maroon-dark"
        >
          Track this order
        </Link>
        <a
          href={retailOrderWhatsappLink(order, whatsapp)}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border-2 border-maroon px-6 py-3 text-[15px] font-semibold text-maroon hover:bg-maroon hover:text-cream"
        >
          Share on WhatsApp
        </a>
        <Link href="/menu" className="px-2 py-3 text-[15px] font-semibold text-maroon underline decoration-gold decoration-2 underline-offset-4">
          Continue shopping
        </Link>
      </div>

      <div className="mt-16">
        <InvoicePreview order={order} />
      </div>
    </div>
  );
}

function Spinner({ large }) {
  const size = large ? 36 : 18;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="mx-auto animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
