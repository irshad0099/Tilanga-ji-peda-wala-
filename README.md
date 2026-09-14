# Tilanga Ji Ka Mashahur Peda Dukan — Website

Fully responsive Next.js website for Tilanga Ji Ka Mashahur Peda Dukan
(Sakaddi, Ara-Patna highway, Bhojpur, Bihar — famous for pure khoya peda
since 1975). Next.js App Router + Tailwind CSS v4, Yatra One + Hind fonts,
champagne-sand / maroon / saffron palette.

## Ismein kya hai (What's included)

- Home, Menu (search + category filter), Product detail, Cart, Checkout,
  **Bulk / Wholesale order**, Track Order, **Invoice**, Gallery, Login,
  Privacy/Terms/Refund pages
- **Real HD photos** in `public/images/photos/` (Indian-mithai stock
  photography). Swap any file — keep the filename — with the shop's own
  photo and it updates everywhere.
- **UPI payment** — checkout and bulk-order advance show named buttons for
  **PhonePe, Google Pay, Paytm** (each opens that app directly with the
  amount filled in) plus a generic "Other UPI app" button, a scannable QR,
  and the bank UPI ID for manual entry (`lib/upi.js`,
  `components/UpiQrPayment.js`). Customer enters the UPI reference number;
  the shop confirms it manually. No payment gateway account needed.
- **Invoice** — every order gets an on-screen invoice preview and a
  downloadable PDF (`/invoice/<order-id>`, also linked from Track Order).
- **WhatsApp order relay** — after placing an order the customer taps
  "Send order on WhatsApp" and the full order lands in the shop's chat, so
  orders are received even without a backend.
- **Bulk orders** — order the Classic Khoya Peda by the kilo at a wholesale
  rate, minimum 3 kg, home delivery, 25% advance online + balance on
  delivery.
- **Menu is split — only ONE item ships pan-India.** Every product carries a
  `deliverable` flag in `lib/products.js`; only `classic-khoya-peda` is
  `true`. Everything else (other peda flavours, both gift boxes, mawa barfi,
  rasgulla, milk cake, litti-chokha, kulhad chai) is `deliverable: false` →
  shown on the menu with an "At the shop only" badge, no Add-to-cart —
  customers must visit the restaurant for those. Flip a product's flag to
  change what ships.
- **Database: MongoDB Atlas.** Orders (retail + bulk), the **menu/products**
  and **shop settings** all live in Atlas, not in code:
  - Orders: `/api/orders` (`lib/db/orders.server.js`) — Track Order / Invoice
    work from *any* device once `MONGODB_URI` is set.
  - Products: `/api/products` (`lib/db/products.server.js`) — every price,
    MRP, badge, category, `deliverable` flag and `inStock` flag ("Sold out
    today") is editable from `/admin` with no redeploy.
  - Settings: `/api/settings` (`lib/db/settings.server.js`) — UPI ID, payee
    name, WhatsApp number, phones, shop address/hours/GSTIN, retail shipping
    rule and bulk-order rule, also editable from `/admin`.

  `/admin` (password = `ADMIN_KEY`) has three tabs: **Orders**, **Products**,
  **Settings**. `lib/products.js` and `lib/config.js` are now only the
  *offline fallback* (used automatically if Atlas is unreachable) and the
  *seed data* (`scripts/seed-db.mjs`) — not the live source of truth anymore.
  Cart still lives in the browser's localStorage, with a local copy of orders
  kept too as an instant/offline mirror.

## Set it up for the real shop — from `/admin`, no code needed

Once MongoDB Atlas is configured (below), log into **`/admin`** → **Settings**
tab and fill in:

| Field | What to put |
|---|---|
| UPI ID (VPA) | The shop's real UPI ID, e.g. `tilangaji@okhdfcbank` |
| Payee name | Name registered on that UPI ID |
| WhatsApp number | Digits only with country code, e.g. `919431055263` |
| GSTIN | Optional — printed on invoices when set |

Per-kg bulk prices (per product, in the **Products** tab), advance %,
delivery fees and retail shipping rules are all editable there too — changes
are live immediately, no redeploy. Until the UPI ID is real, the payment QR
still renders but UPI apps will reject the payment.

Before Atlas is set up (or if you'd rather edit code than use `/admin`), the
same fields live in [`lib/config.js`](lib/config.js) (settings) and
[`lib/products.js`](lib/products.js) (menu) as the fallback/seed data.

## Swap in real photos

Drop the shop's own photos into `public/images/photos/` using these names:

- Products: `peda-platter.jpg`, `kesar-golden.jpg`, `besan-laddu.jpg`,
  `til-box.jpg`, `gur-peda.jpg`, `barfi.jpg`, `milk-cake.jpg`,
  `rasgulla.jpg`, `litti-chokha.jpg`, `kulhad-chai.jpg`,
  `shop-display.jpg`, `festive-thali.jpg` (mapping is in `lib/products.js`).
  `gur-peda.jpg`, `milk-cake.jpg`, `litti-chokha.jpg`, `kulhad-chai.jpg`
  are the shop's own photos; the rest are stock placeholders.
- Gallery / home: `shop-counter.jpg`, `halwai-packing.jpg`, `laddu.jpg`
  (mapping is in `components/GalleryGrid.js` and `app/page.js`)

Roughly square or portrait, ideally 1200px+ on the short side.

## Set up MongoDB Atlas (so orders sync across devices + `/admin` works)

1. **Create a free cluster** — [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) →
   create a project → "Build a Database" → the free **M0** tier → pick any
   region close to India (e.g. Mumbai) → Create.
2. **Create a database user** — Atlas prompts for this during setup (or
   Database Access → Add New Database User). Save the username + password.
3. **Allow network access** — Network Access → Add IP Address → "Allow
   Access from Anywhere" (`0.0.0.0/0`). Vercel's servers use rotating IPs, so
   this is the simplest option for a small site like this.
4. **Get the connection string** — Database → Connect → Drivers → Node.js.
   Copy the `mongodb+srv://...` string and put your database user's
   username/password into it.
5. **Set the environment variables**:
   - Locally: copy [`.env.local.example`](.env.local.example) to `.env.local`
     and fill in `MONGODB_URI` (and pick your own `ADMIN_KEY` password).
   - On Vercel: Project → Settings → Environment Variables → add `MONGODB_URI`
     and `ADMIN_KEY` (Production + Preview + Development) → redeploy.

Until this is done, the site still works fully — orders just stay in each
browser's localStorage instead of syncing to Atlas, and `/admin` shows an
"admin access isn't configured" message.

Once it's set, run the one-time seed so `/admin` has the current menu and
settings to edit:

```bash
node scripts/seed-db.mjs
```

It's idempotent — safe to re-run any time; it only fills in collections that
are still empty, never overwrites edits already made from `/admin`.

Then visit **`/admin`** and log in with your `ADMIN_KEY` to see every order,
edit the menu, edit shop settings, mark UPI payments as verified, and move
orders through Placed → Preparing → Out for Delivery → Delivered.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Production build

```bash
npm run build
npm run start
```

## Aage kya karna hai (Next steps before going fully live)

1. Set up MongoDB Atlas (above), run the seed script, then set the real UPI
   ID, payee name, WhatsApp number and shop hours from `/admin` → Settings
2. Replace the stock photos in `public/images/photos/` with real ones
3. Finalise the Privacy / Terms / Refund policy placeholder text
4. Optionally get a real logo and replace `LogoBadge.js` + `app/icon.svg`
5. For fully automatic payment verification (no manual UPI-reference check),
   a Razorpay/Cashfree gateway integration would replace the current
   scan-and-confirm flow — a bigger, separate piece of work
6. Product photo upload isn't built into `/admin` yet — a new menu item
   still needs its photo added to `public/images/photos/` by hand
