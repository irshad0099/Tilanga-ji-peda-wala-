# Tilangaji — admin dashboard

A separate Next.js app for running the shop at tilangaji.com. It reads and
writes the shop's MongoDB Atlas database directly, so new orders appear here
the moment a customer checks out.

- **Dashboard** — today's and this month's sales, orders still to pack and
  deliver, unfinished online payments, a daily sales chart (7/14/30/90 days),
  online vs cash-on-delivery split, top pincodes and the latest orders.
- **Orders** — search by order ID, name, phone or pincode; filter by status,
  payment and date; change status from the list; export to CSV.
- **Order page** — items and totals, customer with one-tap call/WhatsApp,
  repeat-customer badge, Razorpay payment link, "cash collected" for COD, a
  timeline of every status change (with who made it) and private notes, and
  the invoice.
- **Customers** — everyone who has ordered, grouped by phone, with order
  count, total spent and last order.
- **Products** — price, MRP, weight, badge, in stock / sold out, shown or
  hidden. Live on the shop as soon as you save.
- **Settings** — shop name, GSTIN, address, hours, phones, WhatsApp, delivery
  charges.

Order statuses: Placed → Preparing → Out for Delivery → Delivered, or
Cancelled (the shop's Track Order page shows a cancelled notice).

## Run locally

```bash
cd admin-dashboard
npm install
cp .env.example .env.local   # fill it in — see below
npm run dev                  # http://localhost:3100
```

## Environment variables

| Name | What |
|---|---|
| `MONGODB_URI`, `MONGODB_DB` | The **same** values as the shop site. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | The admin login. |
| `SESSION_SECRET` | Any long random string; signs the login cookie. Changing it signs everyone out. |
| `SHOP_URL` | `https://tilangaji.com` |
| `REVALIDATE_SECRET` | Same value as `REVALIDATE_SECRET` on the shop's Vercel project, so product and settings edits show on the shop immediately (otherwise within 5 minutes). |

## Deploy (Vercel)

This folder is its own Vercel project (the shop's project ignores it via
`/.vercelignore`):

```bash
cd admin-dashboard
npx vercel link      # create a new project, e.g. "tilangaji-admin"
npx vercel env add …  # the variables above, for Production
npx vercel --prod
npx vercel domains add admin.tilangaji.com
```

Then add a DNS record at the domain registrar: **CNAME** `admin` →
`cname.vercel-dns.com`.
