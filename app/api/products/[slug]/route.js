import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/db/products.server";

export async function GET(_req, { params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}
