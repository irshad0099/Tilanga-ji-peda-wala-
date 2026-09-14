// Server-only order persistence in MongoDB Atlas. Only import this from
// route handlers (app/api/**), never from client components.

import { getDb } from "@/lib/mongodb";

const COLLECTION = "orders";

export async function insertOrder(order) {
  const db = await getDb();
  const doc = { ...order, _id: order.id, createdAt: new Date().toISOString() };
  await db.collection(COLLECTION).insertOne(doc);
  return doc;
}

export async function getOrder(id) {
  const db = await getDb();
  return db.collection(COLLECTION).findOne({ _id: id });
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
