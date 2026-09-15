import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import MobileOrderBar from "@/components/MobileOrderBar";

// Footer (and several pages) read live product/settings data from MongoDB
// on every render. Force the whole app to render per-request rather than
// being statically prerendered at build time, so /admin edits (price,
// stock, UPI ID, WhatsApp number, ...) show up immediately everywhere
// instead of only after the next deploy.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tilanga Ji Ka Mashahur Peda Dukan - Since 1975",
  description:
    "Bihar's famous peda since 1975, from Sakaddi on the Ara-Patna highway. Order our Classic Khoya Peda online, shipped fresh pan-India. Visit the shop for litti-chokha, sweets and chai.",
  openGraph: {
    title: "Tilanga Ji Ka Mashahur Peda Dukan - Since 1975",
    description:
      "Bihar's famous peda since 1975, from Sakaddi on the Ara-Patna highway. Order our Classic Khoya Peda online, shipped fresh pan-India.",
    siteName: "Tilanga Ji Ka Mashahur Peda Dukan",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tilanga Ji",
  },
};

export const viewport = {
  themeColor: "#6E1E2B",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Yatra+One&family=Hind:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloatButton />
          <MobileOrderBar />
        </CartProvider>
      </body>
    </html>
  );
}
