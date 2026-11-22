"use client";

import { useActionState } from "react";
import { saveProduct } from "@/app/actions";
import SaveStatus from "@/components/SaveStatus";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-ink/55">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Toggle({ name, label, hint, defaultChecked }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-cream px-3 py-2.5">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-ink/20 transition after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-leaf peer-checked:after:translate-x-4" />
      <span>
        <span className="block text-sm font-bold">{label}</span>
        <span className="block text-xs text-ink/55">{hint}</span>
      </span>
    </label>
  );
}

export default function ProductForm({ product, image }) {
  const [state, action, pending] = useActionState(saveProduct, null);
  const off = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <form action={action} className="card overflow-hidden">
      <input type="hidden" name="slug" value={product._id} />
      <div className="flex items-center gap-4 border-b border-ink/5 bg-cream/60 px-5 py-4">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="h-16 w-14 rounded-xl object-cover" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-black text-leaf-dark">{product.name}</p>
          <p className="font-mono text-xs text-ink/50">/{product._id}</p>
        </div>
        {!product.deliverable ? (
          <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-bold text-stone-600">Hidden</span>
        ) : product.inStock === false ? (
          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">Sold out</span>
        ) : (
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">On sale{off ? ` · ${off}% off` : ""}</span>
        )}
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Name"><input name="name" defaultValue={product.name} required className="field" /></Field>
        <Field label="Hindi name"><input name="hindiName" defaultValue={product.hindiName} className="field" /></Field>
        <Field label="Price (₹, one box)"><input name="price" type="number" min="1" defaultValue={product.price} required className="field" /></Field>
        <Field label="MRP (₹, shown struck out)"><input name="mrp" type="number" min="0" defaultValue={product.mrp} className="field" /></Field>
        <Field label="Weight / pack"><input name="weight" defaultValue={product.weight} placeholder="500g Box" className="field" /></Field>
        <Field label="Badge"><input name="badge" defaultValue={product.badge} placeholder="e.g. Delivers in Bihar" className="field" /></Field>
        <div className="sm:col-span-2">
          <Field label="Tagline"><input name="tagline" defaultValue={product.tagline} className="field" /></Field>
        </div>
        <Toggle name="inStock" label="In stock" hint="Turn off on a day you've sold out — customers can't order it." defaultChecked={product.inStock !== false} />
        <Toggle name="deliverable" label="Show on the shop" hint="Off hides it from the menu and product pages." defaultChecked={!!product.deliverable} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/5 px-5 py-4">
        <SaveStatus state={state} />
        <button disabled={pending} className="btn ml-auto bg-leaf-dark px-6 text-cream hover:bg-leaf">
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
