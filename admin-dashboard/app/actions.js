"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import { SESSION_COOKIE, SESSION_DAYS, checkCredentials, createSessionToken } from "@/lib/session";
import { SETTABLE_STATUSES } from "@/lib/orders";
import { SHOP_URL, refreshShop } from "@/lib/shop";

// ---- Session --------------------------------------------------------------

export async function login(_prev, formData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  if (!checkCredentials(email, password)) {
    // A short pause makes password guessing slow.
    await new Promise((r) => setTimeout(r, 900));
    return { error: "Email or password is wrong." };
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(email.trim().toLowerCase()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 3600,
  });
  const next = String(formData.get("next") || "/");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}

// ---- Orders ---------------------------------------------------------------

export async function updateOrderStatus(formData) {
  const by = await requireAdmin();
  const id = String(formData.get("id") || "").toUpperCase();
  const status = String(formData.get("status") || "");
  if (!id || !SETTABLE_STATUSES.includes(status)) return;
  const now = new Date().toISOString();
  const db = await getDb();
  await db.collection("orders").updateOne(
    { _id: id, status: { $ne: status } },
    {
      $set: { status, updatedAt: now, ...(status === "Delivered" ? { deliveredAt: now } : {}), ...(status === "Cancelled" ? { cancelledAt: now } : {}) },
      $push: { statusHistory: { status, at: now, by } },
    }
  );
  revalidatePath("/", "layout");
}

export async function setCodCollected(formData) {
  const by = await requireAdmin();
  const id = String(formData.get("id") || "").toUpperCase();
  const collected = formData.get("collected") === "1";
  const now = new Date().toISOString();
  const db = await getDb();
  await db.collection("orders").updateOne(
    { _id: id, payment: "cod" },
    {
      $set: { codCollected: collected, codCollectedAt: collected ? now : null, updatedAt: now },
      $push: { statusHistory: { status: collected ? "Cash collected" : "Cash marked not collected", at: now, by } },
    }
  );
  revalidatePath(`/orders/${id}`);
}

export async function addOrderNote(_prev, formData) {
  const by = await requireAdmin();
  const id = String(formData.get("id") || "").toUpperCase();
  const text = String(formData.get("text") || "").trim().slice(0, 1000);
  if (!text) return { error: "Write a note first." };
  const db = await getDb();
  await db.collection("orders").updateOne({ _id: id }, { $push: { notes: { text, at: new Date().toISOString(), by } } });
  revalidatePath(`/orders/${id}`);
  return { ok: true, at: Date.now() };
}

// ---- Products -------------------------------------------------------------

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
}

export async function saveProduct(_prev, formData) {
  await requireAdmin();
  const slug = String(formData.get("slug") || "");
  const price = num(formData.get("price"));
  const mrp = num(formData.get("mrp"));
  if (!slug) return { error: "Missing product." };
  if (!price) return { error: "Price must be more than 0." };
  if (mrp && mrp < price) return { error: "MRP can't be lower than the price." };

  const db = await getDb();
  const res = await db.collection("products").updateOne(
    { _id: slug },
    {
      $set: {
        name: String(formData.get("name") || "").trim(),
        hindiName: String(formData.get("hindiName") || "").trim(),
        tagline: String(formData.get("tagline") || "").trim(),
        weight: String(formData.get("weight") || "").trim(),
        badge: String(formData.get("badge") || "").trim(),
        price,
        mrp: mrp || price,
        inStock: formData.get("inStock") === "on",
        deliverable: formData.get("deliverable") === "on",
        updatedAt: new Date().toISOString(),
      },
    }
  );
  if (!res.matchedCount) return { error: "Product not found." };
  const live = await refreshShop(["products"]);
  revalidatePath("/products");
  return { ok: true, live, at: Date.now() };
}

/** First run: copy the shop's current menu into the database so it can be edited. */
export async function importProducts() {
  await requireAdmin();
  const db = await getDb();
  if ((await db.collection("products").estimatedDocumentCount()) > 0) return;
  const res = await fetch(`${SHOP_URL}/api/products`, { cache: "no-store" });
  const { products = [] } = res.ok ? await res.json() : {};
  if (!products.length) return;
  await db.collection("products").insertMany(products.map((p, i) => ({ ...p, _id: p.slug, _order: i })));
  await refreshShop(["products"]);
  revalidatePath("/products");
}

// ---- Settings -------------------------------------------------------------

export async function saveSettings(_prev, formData) {
  await requireAdmin();
  const get = (k) => String(formData.get(k) || "").trim();
  const whatsapp = get("whatsapp").replace(/\D/g, "");
  if (whatsapp && !/^91[6-9]\d{9}$/.test(whatsapp)) {
    return { error: "WhatsApp number should be 91 followed by the 10-digit mobile number." };
  }
  const gstin = get("gstin").toUpperCase();
  if (gstin && !/^\d{2}[A-Z0-9]{13}$/.test(gstin)) return { error: "GSTIN should be 15 characters." };

  const db = await getDb();
  const current = (await db.collection("settings").findOne({ _id: "shop" })) || {};
  await db.collection("settings").updateOne(
    { _id: "shop" },
    {
      $set: {
        shop: {
          ...(current.shop || {}),
          legalName: get("legalName"),
          shortName: get("shortName"),
          address: get("address"),
          hours: get("hours"),
          gstin,
          email: get("email"),
          googleMapsUrl: get("googleMapsUrl"),
        },
        whatsapp: { ...(current.whatsapp || {}), number: whatsapp },
        phones: [get("phone1"), get("phone2")].filter(Boolean),
        retail: {
          ...(current.retail || {}),
          freeShippingAbove: num(formData.get("freeShippingAbove")),
          flatShippingFee: num(formData.get("flatShippingFee")),
        },
        updatedAt: new Date().toISOString(),
      },
    },
    { upsert: true }
  );
  const live = await refreshShop(["settings"]);
  revalidatePath("/settings");
  return { ok: true, live, at: Date.now() };
}
