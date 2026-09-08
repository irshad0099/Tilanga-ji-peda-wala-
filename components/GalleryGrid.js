import Image from "next/image";

// Photos live in /public/images/photos/. Swap any file (keep the name) to
// use the shop's own pictures.
const galleryImages = [
  { src: "/images/photos/shop-counter.jpg", caption: "Our counter on the Ara–Patna highway" },
  { src: "/images/photos/shop-display.jpg", caption: "Fresh peda, barfi and mithai every morning" },
  { src: "/images/photos/peda-platter.jpg", caption: "Hand-shaped khoya peda, plated for gifting" },
  { src: "/images/photos/halwai-packing.jpg", caption: "Packed fresh before it ships" },
  { src: "/images/photos/laddu.jpg", caption: "Festival trays going out by the dozen" },
  { src: "/images/photos/festive-thali.jpg", caption: "A regular stop for travellers and families" },
];

export default function GalleryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {galleryImages.map((img) => (
        <figure key={img.src} className="overflow-hidden rounded-xl border border-gold/30 bg-cream-dark/40">
          <Image
            src={img.src}
            alt={img.caption}
            width={800}
            height={600}
            className="h-48 w-full object-cover"
          />
          <figcaption className="p-3 text-sm text-ink/70">{img.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
