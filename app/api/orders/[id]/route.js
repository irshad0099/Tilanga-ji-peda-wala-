import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/mongodb";
import { getOrder, updateOrder } from "@/lib/db/orders.server";
import { requireAdmin } from "@/lib/adminAuth";

// Fetch one order by its human-readable id (e.g. TJ-482913). Public — the
// order id itself is the "password" a customer uses to track their order,
// same trust model the old localStorage-only version had.
export async function GET(_req, { params }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const { id } = await params;
  const order = await getOrder(id.trim().toUpperCase());
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}

// Update delivery status / payment verification — shop-admin only.
export async function PATCH(req, { params }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  let patch;
  try {
    patch = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const order = await updateOrder(id.trim().toUpperCase(), patch);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}
