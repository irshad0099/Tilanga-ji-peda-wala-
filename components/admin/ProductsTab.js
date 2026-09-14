"use client";

import { useEffect, useState } from "react";

const EMPTY_NEW = {
  name: "",
  category: "Peda",
  price: "",
  mrp: "",
  weight: "",
  image: "/images/photos/shop-display.jpg",
  deliverable: false,
};

export default function ProductsTab({ adminKey }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingSlug, setSavingSlug] = useState("");
  const [savedSlug, setSavedSlug] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState(EMPTY_NEW);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data.products || []);
    }
    setLoading(false);
  }

  function updateLocal(slug, patch) {
    setProducts((prev) => prev.map((p) => (p.slug === slug ? { ...p, ...patch } : p)));
  }

  async function save(slug) {
    const p = products.find((x) => x.slug === slug);
    if (!p) return;
    setSavingSlug(slug);
    const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({
        name: p.name,
        price: Number(p.price) || 0,
        mrp: Number(p.mrp) || 0,
        badge: p.badge || "",
        category: p.category,
        weight: p.weight,
        deliverable: !!p.deliverable,
        inStock: !!p.inStock,
        pricePerKg: p.pricePerKg ? Number(p.pricePerKg) : undefined,
      }),
    });
    setSavingSlug("");
    if (res.ok) {
      setSavedSlug(slug);
      setTimeout(() => setSavedSlug(""), 1500);
    }
  }

  async function addProduct(e) {
    e.preventDefault();
    setAddError("");
    if (!draft.name.trim()) {
      setAddError("Enter a name.");
      return;
    }
    const slug = draft.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({
        slug,
        name: draft.name.trim(),
        hindiName: "",
        tagline: "",
        description: "",
        price: Number(draft.price) || 0,
        mrp: Number(draft.mrp) || 0,
        weight: draft.weight || "Per piece",
        category: draft.category,
        badge: "",
        featured: false,
        deliverable: draft.deliverable,
        inStock: true,
        image: draft.image,
      }),
    });
    if (res.ok) {
      setDraft(EMPTY_NEW);
      setShowAdd(false);
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      setAddError(data.error || "Couldn't add the item.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl text-teal">Menu items ({products.length})</h2>
        <div className="flex gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="rounded-lg border-2 border-teal px-4 py-2 text-sm font-semibold text-teal hover:bg-teal hover:text-cream disabled:opacity-60"
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="rounded-lg bg-maroon px-4 py-2 text-sm font-semibold text-cream hover:bg-maroon/90"
          >
            {showAdd ? "Cancel" : "+ Add item"}
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-ink/50">
        Prices, badges, delivery and stock update live on the site the moment you hit Save — no
        redeploy needed. New items need a photo added to <code>public/images/photos/</code>{" "}
        manually (upload isn&apos;t built in yet); pick an existing photo below for now.
      </p>

      {showAdd && (
        <form onSubmit={addProduct} className="mt-4 grid gap-3 rounded-xl border border-gold/30 bg-cream-dark/30 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <input
            placeholder="Name"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            className="rounded-lg border border-teal/30 bg-cream px-3 py-2 text-sm outline-none focus:border-teal"
          />
          <input
            placeholder="Category"
            value={draft.category}
            onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
            className="rounded-lg border border-teal/30 bg-cream px-3 py-2 text-sm outline-none focus:border-teal"
          />
          <input
            placeholder="Weight / serving"
            value={draft.weight}
            onChange={(e) => setDraft((d) => ({ ...d, weight: e.target.value }))}
            className="rounded-lg border border-teal/30 bg-cream px-3 py-2 text-sm outline-none focus:border-teal"
          />
          <input
            type="number"
            placeholder="Price ₹"
            value={draft.price}
            onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
            className="rounded-lg border border-teal/30 bg-cream px-3 py-2 text-sm outline-none focus:border-teal"
          />
          <input
            type="number"
            placeholder="MRP ₹ (optional)"
            value={draft.mrp}
            onChange={(e) => setDraft((d) => ({ ...d, mrp: e.target.value }))}
            className="rounded-lg border border-teal/30 bg-cream px-3 py-2 text-sm outline-none focus:border-teal"
          />
          <label className="flex items-center gap-2 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={draft.deliverable}
              onChange={(e) => setDraft((d) => ({ ...d, deliverable: e.target.checked }))}
            />
            Ships / deliverable
          </label>
          <button type="submit" className="rounded-lg bg-teal px-4 py-2 text-sm font-semibold text-cream hover:bg-teal-dark">
            Add to menu
          </button>
          {addError && <p className="text-sm text-maroon sm:col-span-2 lg:col-span-4">{addError}</p>}
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/30">
        <table className="w-full min-w-[68rem] text-sm">
          <thead>
            <tr className="bg-teal text-left text-cream">
              <th className="px-3 py-2.5 font-semibold">Name</th>
              <th className="px-3 py-2.5 font-semibold">Category</th>
              <th className="px-3 py-2.5 font-semibold">Price</th>
              <th className="px-3 py-2.5 font-semibold">MRP</th>
              <th className="px-3 py-2.5 font-semibold">Badge</th>
              <th className="px-3 py-2.5 font-semibold">Ships</th>
              <th className="px-3 py-2.5 font-semibold">In stock</th>
              <th className="px-3 py-2.5 font-semibold">₹ / kg</th>
              <th className="px-3 py-2.5 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.slug} className="border-t border-gold/20">
                <td className="px-3 py-2 align-top">
                  <input
                    value={p.name}
                    onChange={(e) => updateLocal(p.slug, { name: e.target.value })}
                    className="w-40 rounded border border-teal/20 bg-cream px-2 py-1 text-sm outline-none focus:border-teal"
                  />
                  <p className="mt-0.5 font-mono text-[11px] text-ink/40">{p.slug}</p>
                </td>
                <td className="px-3 py-2 align-top">{p.category}</td>
                <td className="px-3 py-2 align-top">
                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) => updateLocal(p.slug, { price: e.target.value })}
                    className="w-20 rounded border border-teal/20 bg-cream px-2 py-1 text-sm outline-none focus:border-teal"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    type="number"
                    value={p.mrp || 0}
                    onChange={(e) => updateLocal(p.slug, { mrp: e.target.value })}
                    className="w-20 rounded border border-teal/20 bg-cream px-2 py-1 text-sm outline-none focus:border-teal"
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  <input
                    value={p.badge || ""}
                    onChange={(e) => updateLocal(p.slug, { badge: e.target.value })}
                    placeholder="—"
                    className="w-24 rounded border border-teal/20 bg-cream px-2 py-1 text-sm outline-none focus:border-teal"
                  />
                </td>
                <td className="px-3 py-2 text-center align-top">
                  <input
                    type="checkbox"
                    checked={!!p.deliverable}
                    onChange={(e) => updateLocal(p.slug, { deliverable: e.target.checked })}
                  />
                </td>
                <td className="px-3 py-2 text-center align-top">
                  <input
                    type="checkbox"
                    checked={p.inStock !== false}
                    onChange={(e) => updateLocal(p.slug, { inStock: e.target.checked })}
                  />
                </td>
                <td className="px-3 py-2 align-top">
                  {p.deliverable ? (
                    <input
                      type="number"
                      value={p.pricePerKg || ""}
                      onChange={(e) => updateLocal(p.slug, { pricePerKg: e.target.value })}
                      placeholder="—"
                      className="w-20 rounded border border-teal/20 bg-cream px-2 py-1 text-sm outline-none focus:border-teal"
                    />
                  ) : (
                    <span className="text-ink/30">—</span>
                  )}
                </td>
                <td className="px-3 py-2 align-top">
                  <button
                    onClick={() => save(p.slug)}
                    disabled={savingSlug === p.slug}
                    className="rounded-lg bg-maroon px-3 py-1.5 text-xs font-semibold text-cream hover:bg-maroon/90 disabled:opacity-60"
                  >
                    {savingSlug === p.slug ? "Saving…" : savedSlug === p.slug ? "Saved ✓" : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
