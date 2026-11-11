import ZoomableImage from "@/components/ZoomableImage";

// The shop's peda photos live in /public/images/peda/, the rest of the menu
// in /public/images/photos/. Most are 4:5 portraits with text near the top,
// so the tiles keep that shape instead of cropping it off.
const galleryImages = [
  { src: "/images/peda/team-making-pedas.jpg", caption: "Our team, hand-rolling pedas for you" },
  { src: "/images/peda/handcrafted-fresh.jpg", caption: "Handcrafted fresh, every single day" },
  { src: "/images/peda/khoya-desi-ghee.jpg", caption: "Khoya and pure desi ghee — nothing else" },
  { src: "/images/peda/sakaddi-ka-mashahur.jpg", caption: "Sakaddi ka mashahur taste, since 1975" },
  { src: "/images/peda/peda-highlights.jpg", caption: "Rich khoya, melt-in-mouth texture" },
  { src: "/images/peda/peda-box-diya.jpg", caption: "The Classic Khoya Peda 500g box" },
  { src: "/images/peda/festive-gifting-tray.jpg", caption: "Perfect for festivals and gifting" },
  { src: "/images/peda/khoya-goodness.jpg", caption: "Traditional taste, premium quality" },
  { src: "/images/peda/hand-placing-peda.jpg", caption: "Every peda pressed by hand" },
  { src: "/images/photos/kulhad-chai.jpg", caption: "Kulhad chai — where the shop began in 1975" },
  { src: "/images/photos/litti-chokha.jpg", caption: "Litti-chokha with ghugni, straight off the coals" },
  { src: "/images/photos/shop-display.jpg", caption: "Fresh peda, milk cake and mithai every morning" },
];

export default function GalleryGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {galleryImages.map((img) => (
        <figure key={img.src} className="overflow-hidden rounded-xl border border-gold/30 bg-cream-dark/40">
          <ZoomableImage
            src={img.src}
            alt={img.caption}
            width={800}
            height={1000}
            className="aspect-[4/5] w-full object-cover"
          />
          <figcaption className="p-3 text-sm text-ink/70">{img.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
