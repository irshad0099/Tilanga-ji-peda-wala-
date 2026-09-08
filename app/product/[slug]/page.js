import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProductBySlug } from "@/lib/products";
import { formatRupees } from "@/lib/format";
import AddToCartPanel from "@/components/AddToCartPanel";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} - Tilanga Ji Ka Mashahur Peda Dukan`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-ink/60">
        <Link href="/menu" className="hover:text-maroon">Menu</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border-2 border-gold/40">
          <Image
            src={product.image}
            alt={product.name}
            width={900}
            height={900}
            className="aspect-square w-full object-cover"
            priority
          />
        </div>

        <div>
          {product.badge && (
            <span className="w-fit rounded-full bg-maroon/10 px-2.5 py-0.5 text-xs font-semibold text-maroon">
              {product.badge}
            </span>
          )}
          <h1 className="mt-2 font-display text-3xl text-teal">{product.name}</h1>
          <p className="text-base text-ink/60">{product.hindiName}</p>
          <p className="mt-3 text-[15px] text-ink/60">{product.weight}</p>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-maroon">{formatRupees(product.price)}</span>
            {product.mrp > product.price && (
              <span className="text-base text-ink/40 line-through">{formatRupees(product.mrp)}</span>
            )}
          </div>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/80">{product.description}</p>

          <div className="mt-7">
            <AddToCartPanel product={product} />
          </div>

          <ul className="mt-8 space-y-2 text-sm text-ink/70">
            <li>Made fresh in small batches, same-day dispatch</li>
            <li>Cash on delivery, UPI QR and online payment supported</li>
            <li>Shipped across India — local Bhojpur orders arrive fastest</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
