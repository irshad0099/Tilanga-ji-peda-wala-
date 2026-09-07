import GalleryGrid from "@/components/GalleryGrid";

export const metadata = { title: "Gallery - Tilanga Ji Ka Mashahur Peda Dukan" };

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold text-maroon">Gallery</p>
        <h1 className="mt-1 font-display text-4xl text-teal">A Look Inside The Shop</h1>
        <p className="mx-auto mt-3 max-w-lg text-[15px] text-ink/75">
          From the highway stall to the kadhai to the counter — a glimpse of
          how your peda gets made.
        </p>
      </div>
      <div className="mt-10">
        <GalleryGrid />
      </div>
    </div>
  );
}
