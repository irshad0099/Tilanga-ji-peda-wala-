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
- **Database: MongoDB Atlas.** Orders (retail + bulk) are saved to Atlas via
  `/api/orders` (`lib/mongodb.js`, `lib/db/orders.server.js`) — set
  `MONGODB_URI` and Track Order / Invoice work from *any* device, and orders
  show up in a shop dashboard at **`/admin`** (password = `ADMIN_KEY`). Cart
  and a local copy of orders still live in the browser's localStorage too, as
  an instant/offline fallback — the site keeps working even before Atlas is
  configured, it just won't sync across devices yet.

## Set it up for the real shop — edit ONE file

Open [`lib/config.js`](lib/config.js) and set:

| Field | What to put |
|---|---|
| `upi.vpa` | The shop's real UPI ID / VPA, e.g. `tilangaji@okhdfcbank` |
| `upi.payeeName` | Name registered on that UPI ID |
| `whatsapp.number` | WhatsApp business number, digits only with country code, e.g. `919431055263` |
| `shop.gstin` | GSTIN (optional — printed on invoices when set) |

Per-kg bulk prices, advance %, delivery fees and retail shipping rules are
all in the same file. Until `upi.vpa` is a real VPA the QR still renders
but UPI apps will reject the payment.

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

Once it's set, visit **`/admin`** and log in with your `ADMIN_KEY` to see
every order, mark UPI payments as verified, and move orders through
Placed → Preparing → Out for Delivery → Delivered.

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

1. Set the real UPI ID, payee name and WhatsApp number in `lib/config.js`
2. Set up MongoDB Atlas (above) so orders sync across devices and `/admin` works
3. Replace the stock photos in `public/images/photos/` with real ones
4. Verify contact numbers, address, opening hours (`lib/config.js`,
   `components/LocationSection.js`)
5. Finalise the Privacy / Terms / Refund policy placeholder text
6. Optionally get a real logo and replace `LogoBadge.js` + `app/icon.svg`
7. For fully automatic payment verification (no manual UPI-reference check),
   a Razorpay/Cashfree gateway integration would replace the current
   scan-and-confirm flow — a bigger, separate piece of work
