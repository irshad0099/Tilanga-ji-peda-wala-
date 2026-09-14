import { NextResponse } from "next/server";
import { getAllProducts, upsertProduct } from "@/lib/db/products.server";
import { isDbConfigured } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";

// Public — the full menu, DB-backed (falls back to defaults automatically).
export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json({ products, dbConfigured: isDbConfigured() });
}

// Create a new menu item — shop-admin only.
export async function POST(req) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!data?.slug || !data?.name) {
    return NextResponse.json({ error: "slug and name are required" }, { status: 400 });
  }
  const product = await upsertProduct(data.slug, data);
  return NextResponse.json({ product }, { status: 201 });
}
