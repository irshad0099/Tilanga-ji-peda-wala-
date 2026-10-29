import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/mongodb";
import { switchOrderToCod } from "@/lib/db/orders.server";

// The customer couldn't (or didn't want to) finish paying online and picked
// cash on delivery for the same order instead. Body: { orderId }.
export async function POST(req) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Orders are not available right now." }, { status: 503 });
  }
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const order = body?.orderId ? await switchOrderToCod(String(body.orderId)) : null;
  if (!order) {
    return NextResponse.json({ error: "This order can't be switched to cash on delivery." }, { status: 409 });
  }
  return NextResponse.json({ order });
}
