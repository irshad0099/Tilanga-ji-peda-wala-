import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Called by the admin dashboard after it saves products or settings, so the
// shop drops its cached copy at once instead of within 5 minutes.
// Header x-revalidate-secret must equal REVALIDATE_SECRET (set the same value
// on both Vercel projects).
const TAGS = ["products", "settings"];

export async function POST(req) {
  const secret = process.env.REVALIDATE_SECRET || "";
  const given = req.headers.get("x-revalidate-secret") || "";
  const ok = secret && given.length === secret.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { tags = [] } = await req.json().catch(() => ({}));
  const done = tags.filter((t) => TAGS.includes(t));
  for (const tag of done) revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: done });
}
