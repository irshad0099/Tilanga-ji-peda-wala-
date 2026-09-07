import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";

export const metadata = {
  title: "Tilanga Ji Ka Mashahur Peda Dukan - Since 1975",
  description:
    "Bihar's famous peda since 1975, from Sakaddi on the Ara-Patna highway. Order pure khoya peda, kesar peda, barfi and gift boxes online, shipped fresh across India.",
  openGraph: {
    title: "Tilanga Ji Ka Mashahur Peda Dukan - Since 1975",
    description:
      "Bihar's famous peda since 1975, from Sakaddi on the Ara-Patna highway. Order online, shipped fresh across India.",
    siteName: "Tilanga Ji Ka Mashahur Peda Dukan",
    type: "website",
  },
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
        </CartProvider>
      </body>
    </html>
  );
}
