// Read-side queries for the dashboard pages. Writes live in app/actions.js.

import { getDb } from "@/lib/mongodb";
import { SALE_FILTER, OPEN_STATUSES } from "@/lib/orders";
import { istDay, istDayStart, shiftDay } from "@/lib/format";

const PAGE_SIZE = 25;

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ---- Dashboard ------------------------------------------------------------

export async function getDashboard(rangeDays = 14) {
  const db = await getDb();
  const orders = db.collection("orders");
  const today = istDay();
  const firstDay = shiftDay(today, rangeDays - 1);
  const monthStart = `${today.slice(0, 7)}-01`;
  const since = istDayStart(firstDay < monthStart ? firstDay : monthStart);

  const [sales, openCounts, awaitingPayment, recent] = await Promise.all([
    orders
      .find({ ...SALE_FILTER, date: { $gte: since } }, { projection: { date: 1, total: 1, payment: 1, items: 1, "customer.pincode": 1 } })
      .toArray(),
    orders.aggregate([{ $match: { status: { $in: OPEN_STATUSES } } }, { $group: { _id: "$status", n: { $sum: 1 } } }]).toArray(),
    orders.countDocuments({ paymentStatus: { $in: ["awaiting_payment", "failed"] }, date: { $gte: istDayStart(shiftDay(today, 6)) } }),
    orders.find({}).sort({ date: -1 }).limit(8).toArray(),
  ]);

  const byDay = Object.fromEntries(Array.from({ length: rangeDays }, (_, i) => [shiftDay(today, rangeDays - 1 - i), { revenue: 0, orders: 0 }]));
  let todayRevenue = 0, todayOrders = 0, monthRevenue = 0, monthOrders = 0, rangeRevenue = 0, rangeOrders = 0;
  let online = 0, cod = 0, boxes = 0;
  const pincodes = {};

  for (const o of sales) {
    const day = istDay(o.date);
    const total = Number(o.total) || 0;
    if (day === today) { todayRevenue += total; todayOrders++; }
    if (day >= monthStart) { monthRevenue += total; monthOrders++; }
    if (byDay[day]) {
      byDay[day].revenue += total;
      byDay[day].orders++;
      rangeRevenue += total;
      rangeOrders++;
      if (o.payment === "cod") cod += total; else online += total;
      boxes += (o.items || []).reduce((n, i) => n + (Number(i.boxes) || 1) * (Number(i.qty) || 0), 0);
      const pin = o.customer?.pincode;
      if (pin) pincodes[pin] = (pincodes[pin] || 0) + 1;
    }
  }

  return {
    today: { revenue: todayRevenue, orders: todayOrders },
    month: { revenue: monthRevenue, orders: monthOrders },
    range: {
      days: rangeDays,
      revenue: rangeRevenue,
      orders: rangeOrders,
      avgOrder: rangeOrders ? Math.round(rangeRevenue / rangeOrders) : 0,
      boxes,
      online,
      cod,
    },
    series: Object.entries(byDay).map(([day, v]) => ({ day, ...v })),
    open: Object.fromEntries(OPEN_STATUSES.map((s) => [s, openCounts.find((c) => c._id === s)?.n || 0])),
    awaitingPayment,
    topPincodes: Object.entries(pincodes).sort((a, b) => b[1] - a[1]).slice(0, 5),
    recent,
  };
}

// ---- Orders ---------------------------------------------------------------

function orderQuery({ q, status, payment, from, to }) {
  const query = {};
  if (status) query.status = status;
  if (payment) query.paymentStatus = payment;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = istDayStart(from);
    if (to) query.date.$lt = istDayStart(shiftDay(to, -1));
  }
  if (q) {
    const term = q.trim();
    const rx = new RegExp(escapeRegex(term), "i");
    query.$or = [{ _id: term.toUpperCase() }, { "customer.name": rx }, { "customer.phone": rx }, { "customer.pincode": rx }];
  }
  return query;
}

export async function listOrders(filters = {}) {
  const db = await getDb();
  const page = Math.max(1, Number(filters.page) || 1);
  const query = orderQuery(filters);
  const [orders, total, sum] = await Promise.all([
    db.collection("orders").find(query).sort({ date: -1 }).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).toArray(),
    db.collection("orders").countDocuments(query),
    db.collection("orders").aggregate([{ $match: { $and: [query, SALE_FILTER] } }, { $group: { _id: null, revenue: { $sum: "$total" } } }]).toArray(),
  ]);
  return { orders, total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)), revenue: sum[0]?.revenue || 0 };
}

/** Every order matching the filters, for the CSV export. */
export async function exportOrders(filters = {}) {
  const db = await getDb();
  return db.collection("orders").find(orderQuery(filters)).sort({ date: -1 }).limit(5000).toArray();
}

export async function getOrder(id) {
  const db = await getDb();
  return db.collection("orders").findOne({ _id: String(id).toUpperCase() });
}

export async function getCustomerOrderCount(phone) {
  if (!phone) return 0;
  const db = await getDb();
  return db.collection("orders").countDocuments({ "customer.phone": phone, ...SALE_FILTER });
}

// ---- Customers ------------------------------------------------------------

/** Customers grouped by phone number from their orders. */
export async function listCustomers({ q } = {}) {
  const db = await getDb();
  const match = { ...SALE_FILTER, "customer.phone": { $exists: true, $ne: "" } };
  if (q) {
    const rx = new RegExp(escapeRegex(q.trim()), "i");
    match.$or = [{ "customer.name": rx }, { "customer.phone": rx }, { "customer.pincode": rx }];
  }
  return db
    .collection("orders")
    .aggregate([
      { $match: match },
      { $sort: { date: -1 } },
      {
        $group: {
          _id: "$customer.phone",
          name: { $first: "$customer.name" },
          pincode: { $first: "$customer.pincode" },
          address: { $first: "$customer.address" },
          orders: { $sum: 1 },
          spent: { $sum: "$total" },
          lastOrder: { $first: "$date" },
          lastOrderId: { $first: "$_id" },
        },
      },
      { $sort: { lastOrder: -1 } },
      { $limit: 500 },
    ])
    .toArray();
}

// ---- Products & settings --------------------------------------------------

export async function listProducts() {
  const db = await getDb();
  return db.collection("products").find({}).sort({ deliverable: -1, name: 1 }).toArray();
}

export async function getShopSettings() {
  const db = await getDb();
  return db.collection("settings").findOne({ _id: "shop" });
}
