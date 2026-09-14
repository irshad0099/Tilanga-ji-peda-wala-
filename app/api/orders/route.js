import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/mongodb";
import { insertOrder, listOrders } from "@/lib/db/orders.server";
import { requireAdmin } from "@/lib/adminAuth";

// Create an order (called by checkout + bulk-order after payment).
export async function POST(req) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  let order;
  try {
    order = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!order?.id || !order?.customer) {
    return NextResponse.json({ error: "Order is missing required fields" }, { status: 400 });
  }
  try {
    const doc = await insertOrder(order);
    return NextResponse.json({ order: doc }, { status: 201 });
  } catch (err) {
    if (err?.code === 11000) {
      // Already saved (e.g. a retried request) — not an error for the client.
      return NextResponse.json({ order }, { status: 200 });
    }
    console.error("Failed to insert order", err);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}

// List recent orders — shop-admin only.
export async function GET(req) {
  if (!isDbConfigured()) {
    return NextResponse.json({ orders: [], dbConfigured: false });
  }
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get("limit")) || 100;
  const orders = await listOrders({ limit });
  return NextResponse.json({ orders, dbConfigured: true });
}
