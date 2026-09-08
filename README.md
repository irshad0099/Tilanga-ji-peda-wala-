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
- **UPI payment** — checkout and bulk-order advance are paid by scanning a
  UPI QR (or "Open in UPI app"). Customer enters the UPI reference number;
  the shop confirms it manually. No payment gateway account needed.
- **Invoice** — every order gets an on-screen invoice preview and a
  downloadable PDF (`/invoice/<order-id>`, also linked from Track Order).
- **WhatsApp order relay** — after placing an order the customer taps
  "Send order on WhatsApp" and the full order lands in the shop's chat, so
  orders are received even without a backend.
- **Bulk orders** — order peda by the kilo at per-kg rates, minimum
  3 kg, home delivery, 25% advance online + balance on delivery.
- **Menu is split** — peda and peda gift boxes are deliverable (cart +
  checkout + shipping). Litti-chokha, fresh sweets (mawa barfi, rasgulla,
  milk cake) and kulhad chai are `deliverable: false` in `lib/products.js`
  → shown on the menu with an "At the shop only" badge, no Add-to-cart.
  Flip the flag to change what ships.
- Cart and orders are saved in the browser's **localStorage** (no database
  yet). Track Order / Invoice only work on the device the order was placed.

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
2. Replace the stock photos in `public/images/photos/` with real ones
3. Add a real backend/database so orders and payment confirmation aren't
   limited to one browser (and so payments can be auto-verified via a
   gateway webhook instead of manually)
4. Verify contact numbers, address, opening hours (`lib/config.js`,
   `components/LocationSection.js`)
5. Finalise the Privacy / Terms / Refund policy placeholder text
6. Optionally get a real logo and replace `LogoBadge.js` + `app/icon.svg`
