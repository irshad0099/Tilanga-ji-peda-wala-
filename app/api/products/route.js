import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/db/products.server";
import { isDbConfigured } from "@/lib/mongodb";

// Public — the full menu, DB-backed (falls back to defaults automatically).
// Products are edited in the separate admin dashboard (Telanga-admin-dashboard).
export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json({ products, dbConfigured: isDbConfigured() });
}
