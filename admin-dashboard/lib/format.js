// Formatting shared by the dashboard. All dates are shown in India time.

export function formatRupees(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

const IST_OFFSET = 5.5 * 3600 * 1000;

/** YYYY-MM-DD of a date in India time. */
export function istDay(date = new Date()) {
  return new Date(new Date(date).getTime() + IST_OFFSET).toISOString().slice(0, 10);
}

/** UTC ISO string for 00:00 India time on the given YYYY-MM-DD. */
export function istDayStart(day) {
  return new Date(new Date(`${day}T00:00:00Z`).getTime() - IST_OFFSET).toISOString();
}

/** YYYY-MM-DD `n` days before `day`. */
export function shiftDay(day, n) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDay(day) {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString("en-IN", { timeZone: "UTC", day: "numeric", month: "short" });
}

export function timeAgo(iso) {
  const s = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hr ago`;
  return `${Math.floor(s / 86400)} d ago`;
}
