import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/mongodb";
import { getOrder } from "@/lib/db/orders.server";

// Fetch one order by its human-readable id (e.g. TJ-482913). Public — the
// order id itself is the "password" a customer uses to track their order.
// Orders are updated from the separate admin dashboard (admin-dashboard/).
export async function GET(_req, { params }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const { id } = await params;
  const order = await getOrder(id.trim().toUpperCase());
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ order });
}
