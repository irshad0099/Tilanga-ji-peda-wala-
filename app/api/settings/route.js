import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/db/settings.server";
import { isDbConfigured } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/adminAuth";
import { isRazorpayConfigured } from "@/lib/razorpay.server";

// Public — checkout, invoices and the footer read live settings this way
// (WhatsApp number, shipping rule, which payment methods are on). No secrets.
export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    settings: { ...settings, payments: { online: isRazorpayConfigured(), cod: true } },
    dbConfigured: isDbConfigured(),
  });
}

// Update shop settings — shop-admin only.
export async function PATCH(req) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  let patch;
  try {
    patch = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const settings = await updateSettings(patch);
  return NextResponse.json({ settings });
}
