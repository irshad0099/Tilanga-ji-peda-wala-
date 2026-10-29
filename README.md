# Tilanga Ji Ka Mashahur Peda Dukan — Website

Fully responsive Next.js website for Tilanga Ji Ka Mashahur Peda Dukan
(Sakaddi, Ara-Patna highway, Bhojpur, Bihar — famous for pure khoya peda
since 1975). Next.js App Router + Tailwind CSS v4, Yatra One + Hind fonts,
champagne-sand / maroon / saffron palette.

## Ismein kya hai (What's included)

- Home, Menu (search + category filter), Product detail, Cart, Checkout,
  Track Order, **Invoice**, Gallery, Login,
  Privacy/Terms/Refund pages
- **Real HD photos** in `public/images/photos/` (Indian-mithai stock
  photography). Swap any file — keep the filename — with the shop's own
  photo and it updates everywhere.
- **Payments: Razorpay + cash on delivery.** Checkout offers "Pay online"
  (UPI, cards, netbanking, wallets through Razorpay Checkout) and "Cash on
  Delivery". The server prices every order from the live menu — the browser
  only sends product slugs and quantities — then creates a matching Razorpay
  order. After payment the signature is verified on the server
  (`/api/checkout/verify`) and the order is marked paid automatically; a
  Razorpay webhook (`/api/razorpay/webhook`) does the same as a backup if the
  customer closes the tab. If a payment fails or is cancelled, the customer
  can retry or switch that order to COD. See "Set up Razorpay" below.
- **Invoice** — every order gets an on-screen invoice preview and a
  downloadable PDF (`/invoice/<order-id>`, also linked from Track Order).
- **WhatsApp share** — after placing an order the customer can send the
  full order to the shop's WhatsApp.
- **Menu is split — only ONE item ships pan-India.** Every product carries a
  `deliverable` flag in `lib/products.js`; only `classic-khoya-peda` is
  `true`. Everything else (other peda flavours, both gift boxes, mawa barfi,
  rasgulla, milk cake, litti-chokha, kulhad chai) is `deliverable: false` →
  shown on the menu with an "At the shop only" badge, no Add-to-cart —
  customers must visit the restaurant for those. Flip a product's flag to
  change what ships.
- **Database: MongoDB Atlas.** Orders, the **menu/products**
  and **shop settings** all live in Atlas, not in code:
  - Orders: created only by `/api/checkout` (`lib/db/checkout.server.js`,
    `lib/db/orders.server.js`); Track Order / Invoice work from any device.
  - Products: `/api/products` (`lib/db/products.server.js`) — every price,
    MRP, badge, category, `deliverable` flag and `inStock` flag ("Sold out
    today") is editable from `/admin` with no redeploy.
  - Settings: `/api/settings` (`lib/db/settings.server.js`) — WhatsApp
    number, phones, shop address/hours/GSTIN and the retail shipping rule,
    also editable from `/admin`.

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
| WhatsApp number | Digits only with country code, e.g. `919431055263` |
| GSTIN | Optional — printed on invoices when set |

Retail shipping rules are editable there too — changes are live immediately,
no redeploy. Razorpay keys are secrets, so they are set as environment
variables instead (see "Set up Razorpay").

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

Until this is done, the menu and pages still work, but checkout can't place
orders and `/admin` shows an "admin access isn't configured" message.

Once it's set, run the one-time seed so `/admin` has the current menu and
settings to edit:

```bash
node scripts/seed-db.mjs
```

It's idempotent — safe to re-run any time; it only fills in collections that
are still empty, never overwrites edits already made from `/admin`.

Then visit **`/admin`** and log in with your `ADMIN_KEY` to see every order,
edit the menu, edit shop settings, and move orders through Placed →
Preparing → Out for Delivery → Delivered. Online payments are confirmed
automatically; orders whose online payment was never completed are greyed
out as "payment pending".

## Set up Razorpay (online payments)

1. **Create an account** at [razorpay.com](https://razorpay.com) and finish
   KYC (PAN, bank account, business details). Test Mode works straight away;
   Live Mode needs Razorpay to activate the account.
2. **API keys** — Dashboard → Account & Settings → API Keys → Generate Key.
   Put them in `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (`.env.local`
   locally; Vercel → Project → Settings → Environment Variables for the live
   site, then redeploy).
3. **Webhook** — Dashboard → Account & Settings → Webhooks → Add New
   Webhook. URL `https://<your-domain>/api/razorpay/webhook`, make up a
   secret and put the same value in `RAZORPAY_WEBHOOK_SECRET`, tick the
   events `payment.captured`, `payment.failed` and `order.paid`.
4. **Payment capture** — keep automatic capture on (Account & Settings →
   Payment Capture), so payments settle without anyone clicking "capture".
5. **Test** with Test Mode keys — Razorpay's test UPI ID `success@razorpay`
   or test card `4111 1111 1111 1111` — then swap in the Live keys.

Without the keys the checkout simply shows cash on delivery only.

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

1. Set up MongoDB Atlas (above), run the seed script, then set the real
   WhatsApp number and shop hours from `/admin` → Settings, and add the
   Razorpay keys (above)
2. Replace the stock photos in `public/images/photos/` with real ones
3. Finalise the Privacy / Terms / Refund policy placeholder text
4. Optionally get a real logo and replace `LogoBadge.js` + `app/icon.svg`
5. Product photo upload isn't built into `/admin` yet — a new menu item
   still needs its photo added to `public/images/photos/` by hand
