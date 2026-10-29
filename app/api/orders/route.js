import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/mongodb";
import { listOrders } from "@/lib/db/orders.server";
import { requireAdmin } from "@/lib/adminAuth";

// Orders are created only through /api/checkout, which prices them on the
// server. This route just lists recent orders — shop-admin only.
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
