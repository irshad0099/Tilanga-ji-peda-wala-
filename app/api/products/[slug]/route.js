import { NextResponse } from "next/server";
import { getProductBySlug, patchProduct, seedProductsIfEmpty } from "@/lib/db/products.server";
import { isDbConfigured } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(_req, { params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

// Update price / stock / badge / etc — shop-admin only.
export async function PATCH(req, { params }) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  await seedProductsIfEmpty(); // first admin edit ever auto-seeds from defaults

  const { slug } = await params;
  let patch;
  try {
    patch = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const product = await patchProduct(slug, patch);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}
