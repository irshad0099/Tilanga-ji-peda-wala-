"use client";

import { useEffect, useState } from "react";
import OrdersTab from "@/components/admin/OrdersTab";
import ProductsTab from "@/components/admin/ProductsTab";
import SettingsTab from "@/components/admin/SettingsTab";

const SESSION_KEY = "tilanga_admin_key";
const TABS = [
  { id: "orders", label: "Orders" },
  { id: "products", label: "Menu / Products" },
  { id: "settings", label: "Settings" },
];

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [authedKey, setAuthedKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("orders");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? sessionStorage.getItem(SESSION_KEY) : null;
    if (saved) login(saved);
  }, []);

  async function login(candidateKey) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", { headers: { "x-admin-key": candidateKey } });
      if (res.status === 401) {
        setError("Wrong admin key.");
        setLoading(false);
        return;
      }
      if (res.status === 503) {
        setError("Admin access isn't configured yet — set ADMIN_KEY in the server's environment variables.");
        setLoading(false);
        return;
      }
      setAuthedKey(candidateKey);
      sessionStorage.setItem(SESSION_KEY, candidateKey);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    }
    setLoading(false);
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthedKey(null);
    setKey("");
  }

  if (!authedKey) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24 sm:px-6">
        <h1 className="font-display text-2xl text-teal">Shop Admin</h1>
        <p className="mt-2 text-sm text-ink/70">Enter the admin key to view and manage the shop.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login(key);
          }}
          className="mt-5 space-y-3"
        >
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Admin key"
            className="w-full rounded-lg border border-teal/30 bg-cream px-4 py-2.5 text-[15px] outline-none focus:border-teal"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal py-2.5 text-sm font-semibold text-cream hover:bg-teal-dark disabled:opacity-60"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-maroon">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/30 pb-4">
        <nav className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                tab === t.id ? "bg-teal text-cream" : "text-teal hover:bg-cream-dark"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <button
          onClick={logout}
          className="rounded-lg border-2 border-maroon/50 px-4 py-2 text-sm font-semibold text-maroon hover:bg-maroon hover:text-cream"
        >
          Log out
        </button>
      </div>

      <div className="mt-6">
        {tab === "orders" && <OrdersTab adminKey={authedKey} />}
        {tab === "products" && <ProductsTab adminKey={authedKey} />}
        {tab === "settings" && <SettingsTab adminKey={authedKey} />}
      </div>
    </div>
  );
}
