import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * The signed-in admin's email. Pages and every server action call this:
 * proxy.js already guards page loads, but server actions are their own
 * endpoints and must check for themselves.
 */
export async function requireAdmin() {
  const store = await cookies();
  const email = verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!email) redirect("/login");
  return email;
}
