import crypto from "node:crypto";

// Signed session cookie: "<email>.<expiry>.<hmac>". No database lookup is
// needed to check it, so proxy.js can verify it on every request.
// Env: ADMIN_EMAIL, ADMIN_PASSWORD (the one owner login) and SESSION_SECRET
// (any long random string; changing it signs everyone out).

export const SESSION_COOKIE = "tj_admin";
export const SESSION_DAYS = 7;

function sign(payload) {
  return crypto.createHmac("sha256", process.env.SESSION_SECRET || "").update(payload).digest("base64url");
}

function safeEqual(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function createSessionToken(email) {
  const exp = Date.now() + SESSION_DAYS * 24 * 3600 * 1000;
  const payload = `${Buffer.from(email).toString("base64url")}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

/** The signed-in email, or null if the token is missing, forged or expired. */
export function verifySessionToken(token) {
  if (!token || !process.env.SESSION_SECRET) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [emailB64, exp, mac] = parts;
  if (!safeEqual(mac, sign(`${emailB64}.${exp}`))) return null;
  if (!(Number(exp) > Date.now())) return null;
  return Buffer.from(emailB64, "base64url").toString();
}

export function checkCredentials(email, password) {
  const wantEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const wantPassword = process.env.ADMIN_PASSWORD || "";
  if (!wantEmail || !wantPassword) return false;
  // Compare both even when the email is wrong, so timing reveals nothing.
  const emailOk = safeEqual(String(email).trim().toLowerCase(), wantEmail);
  const passwordOk = safeEqual(String(password), wantPassword);
  return emailOk && passwordOk;
}
