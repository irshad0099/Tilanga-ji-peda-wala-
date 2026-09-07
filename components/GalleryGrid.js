import Image from "next/image";

const galleryImages = [
  { src: "/images/illustrations/shop-stall.svg", caption: "Our shop on the Ara–Patna highway" },
  { src: "/images/illustrations/gallery-counter.svg", caption: "Fresh peda on the counter every morning" },
  { src: "/images/illustrations/legacy-artisan.svg", caption: "Hand-stirred khoya, the old way" },
  { src: "/images/illustrations/process-shaping.svg", caption: "Shaped by hand, one at a time" },
  { src: "/images/illustrations/gallery-highway.svg", caption: "A regular stop for highway travellers" },
  { src: "/images/illustrations/process-packing.svg", caption: "Packed fresh before it ships" },
];

export default function GalleryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {galleryImages.map((img) => (
        <figure key={img.src} className="overflow-hidden rounded-xl border border-gold/30 bg-cream-dark/40">
          <Image src={img.src} alt={img.caption} width={400} height={300} className="h-48 w-full object-cover" />
          <figcaption className="p-3 text-sm text-ink/70">{img.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
