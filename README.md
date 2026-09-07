# Tilanga Ji Ka Mashahur Peda Dukan — Website

Fully responsive Next.js website for Tilanga Ji Ka Mashahur Peda Dukan
(Sakaddi, Ara-Patna highway, Bhojpur, Bihar — famous for pure khoya peda
since 1975). Built with Next.js App Router + Tailwind CSS v4, same font
and colour system as the Swad-e-Bihar project (Yatra One + Hind,
cream/teal/maroon/gold).

## Ismein kya hai (What's included)

- Home (hero, legacy stats, menu preview, "how it's made" process, why
  choose us, gallery preview, delivery estimate, location, testimonials,
  FAQ), Menu (search + category filter), Product detail, Cart, Checkout,
  Track Order, Gallery, Login, Privacy/Terms/Refund policy pages
- **17 original AI-illustrated graphics** — real customer/shop photos were
  NOT used (privacy + copyright); instead custom SVG illustrations were
  made for the hero, legacy/artisan scene, shop stall, 4 process steps,
  2 gallery scenes, and all 8 product cards
- Cart aur orders **localStorage** mein save hote hain (koi database
  nahi hai abhi)
- Checkout mein **pan-India shipping** — pincode ke basis par delivery
  estimate dikhta hai (`lib/shipping.js`), koi hard block nahi (jaise
  Swad-e-Bihar mein local-only tha, ye ek "famous shop" hai isliye
  nationwide shipping model rakha hai)
- Payment abhi **mock/UI-only** hai (COD / UPI / Razorpay options
  dikhte hain, par asli payment charge nahi hota)
- Product catalog `lib/products.js` mein hai — naam, price, weight,
  description sab yahin se edit hoga
- Original monogram logo (`app/icon.svg`, `components/LogoBadge.js`) —
  agar real logo design karwana ho to isse replace kar sakte ho

## Local mein chalane ke liye (Run locally)

```bash
npm install
npm run dev
```

Browser mein http://localhost:3000 kholo.

## Production build

```bash
npm run build
npm run start
```

## Aage kya karna hai (Next steps before going live)

1. Real product photos daalo (`public/images/products/`) agar illustrations
   ki jagah asli photos chahiye
2. Real Razorpay/UPI integration wire karo (`app/checkout/page.js`)
3. Ek real backend/database lagao taaki orders sirf browser tak limited
   na rahe
4. Contact numbers, address, hours verify/update karo
   (`components/Footer.js`, `components/LocationSection.js`)
5. Privacy/Terms/Refund policy pages ka placeholder text finalize karo
6. Chaho to real logo design karwa ke `LogoBadge.js` aur `app/icon.svg`
   replace kar dena
