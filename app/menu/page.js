import { Suspense } from "react";
import Image from "next/image";
import MenuGrid from "@/components/MenuGrid";
import { getMenuProducts } from "@/lib/db/products.server";

export const metadata = {
  title: "Menu - Tilanga Ji Ka Mashahur Peda Dukan",
  description: "Order our Classic Khoya Peda online — delivered fresh across Bihar.",
};

export default async function MenuPage({ searchParams }) {
  const [products, params] = await Promise.all([getMenuProducts(), searchParams]);

  return (
    <div>
      {/* Banner */}
      <section className="relative overflow-hidden bg-leaf-dark">
        <Image
          src="/images/peda/brass-tray-dark.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-[kenburns_18s_ease-in-out_infinite_alternate] object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-leaf-dark via-leaf-dark/80 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="font-display text-2xl font-bold text-haldi sm:text-3xl">
            Har dibbe mein <span className="italic">50 saal</span> ki
          </p>
          <h1 className="mt-1 font-display text-5xl font-black leading-[1.05] text-cream sm:text-7xl">
            Mithas &amp;
            <br />
            Parampara
          </h1>
          <span className="mt-5 block h-1 w-56 border-b-[3px] border-dotted border-haldi" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6">
        <h2 className="text-center font-display text-4xl font-black text-ink sm:text-5xl">All Products</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-[15px] text-ink/70">
          Our <span className="font-bold text-leaf">Classic Khoya Peda</span>, packed fresh at the shop in
          Sakaddi and delivered across Bihar.
        </p>
        <div className="mt-10">
          <Suspense>
            <MenuGrid key={JSON.stringify(params)} products={products} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
