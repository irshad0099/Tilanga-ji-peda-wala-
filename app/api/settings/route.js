import { NextResponse } from "next/server";
import { getSettings } from "@/lib/db/settings.server";
import { isDbConfigured } from "@/lib/mongodb";
import { isRazorpayConfigured } from "@/lib/razorpay.server";

// Public — checkout, invoices and the footer read live settings this way
// (WhatsApp number, shipping rule, which payment methods are on). No secrets.
// Settings are edited in the separate admin dashboard (Telanga-admin-dashboard).
export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({
    settings: { ...settings, payments: { online: isRazorpayConfigured(), cod: true } },
    dbConfigured: isDbConfigured(),
  });
}
