// Server-only order persistence in MongoDB Atlas. Only import this from
// route handlers (app/api/**), never from client components.

import { getDb } from "@/lib/mongodb";

const COLLECTION = "orders";

function newOrderId() {
  return `TJ-${Math.floor(100000 + Math.random() * 900000)}`;
}

/** Insert a new order under a fresh TJ-XXXXXX id (retries on the rare clash). */
export async function createOrder(order) {
  const db = await getDb();
  for (let attempt = 0; attempt < 5; attempt++) {
    const id = newOrderId();
    const now = new Date().toISOString();
    const doc = { ...order, _id: id, id, date: now, createdAt: now };
    try {
      await db.collection(COLLECTION).insertOne(doc);
      return doc;
    } catch (err) {
      if (err?.code !== 11000) throw err;
    }
  }
  throw new Error("Could not allocate an order id");
}

export async function getOrder(id) {
  const db = await getDb();
  return db.collection(COLLECTION).findOne({ _id: id });
}

export async function getOrderByRazorpayOrderId(razorpayOrderId) {
  const db = await getDb();
  return db.collection(COLLECTION).findOne({ razorpayOrderId });
}

export async function listOrders({ limit = 100 } = {}) {
  const db = await getDb();
  return db
    .collection(COLLECTION)
    .find({})
    .sort({ date: -1 })
    .limit(Math.min(limit, 200))
    .toArray();
}

export async function updateOrder(id, patch) {
  const db = await getDb();
  const { _id, ...safePatch } = patch; // never let the client overwrite the id
  await db
    .collection(COLLECTION)
    .updateOne({ _id: id }, { $set: { ...safePatch, updatedAt: new Date().toISOString() } });
  return getOrder(id);
}

/**
 * Mark an online order paid. Idempotent — the verify call and the webhook
 * both land here, in either order, and only the first one changes anything.
 */
export async function markOrderPaid(id, { razorpayPaymentId, method }) {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.collection(COLLECTION).updateOne(
    { _id: id, paymentStatus: { $ne: "paid" } },
    {
      $set: {
        paymentStatus: "paid",
        status: "Placed",
        razorpayPaymentId,
        ...(method ? { paymentMethodDetail: method } : {}),
        paidAt: now,
        updatedAt: now,
      },
    }
  );
  return getOrder(id);
}

/** Record a failed attempt — never downgrades an order that's already paid. */
export async function markPaymentFailed(id, reason) {
  const db = await getDb();
  await db.collection(COLLECTION).updateOne(
    { _id: id, paymentStatus: "awaiting_payment" },
    { $set: { paymentStatus: "failed", paymentError: reason || "", updatedAt: new Date().toISOString() } }
  );
}

/** Customer gave up on paying online and chose cash on delivery instead. */
export async function switchOrderToCod(id) {
  const db = await getDb();
  const res = await db.collection(COLLECTION).updateOne(
    { _id: id, paymentStatus: { $in: ["awaiting_payment", "failed"] } },
    { $set: { payment: "cod", paymentStatus: "cod", status: "Placed", updatedAt: new Date().toISOString() } }
  );
  return res.matchedCount ? getOrder(id) : null;
}
