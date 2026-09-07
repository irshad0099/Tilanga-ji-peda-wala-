import Link from "next/link";
import LogoBadge from "@/components/LogoBadge";

export default function Footer() {
  return (
    <footer className="border-t border-gold/40 bg-teal text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <LogoBadge size={44} />
            <span className="font-display text-lg">Tilanga Ji</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-cream/80">
            Bihar's mashahur peda since 1975 — pure khoya, hand-shaped daily,
            shipped fresh across India.
          </p>
          <p className="mt-3 text-sm text-cream/70">
            Sakaddi Bazaar, Ara–Patna Highway, Bhojpur, Bihar 802160
          </p>
        </div>

        <div>
          <h3 className="font-display text-base">Shop</h3>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li><Link href="/menu" className="hover:text-gold">Menu</Link></li>
            <li><Link href="/gallery" className="hover:text-gold">Gallery</Link></li>
            <li><Link href="/cart" className="hover:text-gold">Cart</Link></li>
            <li><Link href="/track-order" className="hover:text-gold">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base">Policies</h3>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li><Link href="/privacy" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold">Terms</Link></li>
            <li><Link href="/refund-policy" className="hover:text-gold">Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li><a href="tel:+919431055263" className="hover:text-gold">+91 94310 55263</a></li>
            <li><a href="tel:+919576456473" className="hover:text-gold">+91 95764 56473</a></li>
            <li>
              <a href="https://wa.me/919431055263" className="hover:text-gold" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li>Open daily, 7 AM – 9:30 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15 px-4 py-4 text-center text-xs text-cream/60 sm:px-6">
        © {new Date().getFullYear()} Tilanga Ji Ka Mashahur Peda Dukan. All rights reserved.
      </div>
    </footer>
  );
}
