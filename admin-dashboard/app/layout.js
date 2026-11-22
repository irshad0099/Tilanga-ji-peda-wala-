import "./globals.css";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

export const metadata = {
  title: { default: "Admin · Tilangaji", template: "%s · Tilangaji Admin" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
