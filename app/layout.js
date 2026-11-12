import "./globals.css";
import { Hind, Nunito, Rozha_One } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import MobileOrderBar from "@/components/MobileOrderBar";
import PauseOffscreen from "@/components/PauseOffscreen";
import Splash from "@/components/Splash";

// Footer (and several pages) read live product/settings data from MongoDB
// on every render. Force the whole app to render per-request rather than
// being statically prerendered at build time, so /admin edits (price,
// stock, UPI ID, WhatsApp number, ...) show up immediately everywhere
// instead of only after the next deploy.
export const dynamic = "force-dynamic";

// Self-hosted by next/font: no render-blocking request to Google and no text
// jump when the font arrives. Nunito is the face of the whole site and is
// preloaded; Hind (Devanagari) and Rozha One (story headings) load on use.
// globals.css reads these through --font-display / --font-body / --font-story.
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const hind = Hind({ subsets: ["latin", "devanagari"], weight: ["400", "500", "600", "700"], variable: "--font-hind", display: "swap", preload: false });
const rozha = Rozha_One({ subsets: ["latin"], weight: "400", variable: "--font-rozha", display: "swap", preload: false });

export const metadata = {
  title: "Tilanga Ji Ka Mashahur Peda Dukan - Since 1975",
  description:
    "Bihar's famous peda since 1975, from Sakaddi on the Ara-Patna highway. Order our Classic Khoya Peda online, delivered fresh across Bihar.",
  openGraph: {
    title: "Tilanga Ji Ka Mashahur Peda Dukan - Since 1975",
    description:
      "Bihar's famous peda since 1975, from Sakaddi on the Ara-Patna highway. Order our Classic Khoya Peda online, delivered fresh across Bihar.",
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
  themeColor: "#2F4A1D",
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: the splash script tags <html> before React loads.
    <html lang="en" suppressHydrationWarning className={`h-full antialiased ${nunito.variable} ${hind.variable} ${rozha.variable}`}>
      <body className="flex min-h-full flex-col">
        <Splash />
        <CartProvider>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloatButton />
          <MobileOrderBar />
          <PauseOffscreen />
        </CartProvider>
      </body>
    </html>
  );
}
