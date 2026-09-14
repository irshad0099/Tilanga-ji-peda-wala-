// Lightweight admin gate for the order API + /admin dashboard. There is no
// user-account system on this site, so "admin" is just a shared secret
// (ADMIN_KEY env var) sent as the `x-admin-key` header. Good enough for one
// shop owner; replace with real auth if more people need staff access.

import { NextResponse } from "next/server";

export function requireAdmin(req) {
  const key = process.env.ADMIN_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Admin access isn't configured (ADMIN_KEY missing)." },
      { status: 503 }
    );
  }
  if (req.headers.get("x-admin-key") !== key) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
