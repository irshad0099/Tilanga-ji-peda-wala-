export default function manifest() {
  return {
    name: "Tilanga Ji Ka Mashahur Peda Dukan",
    short_name: "Tilanga Ji",
    description: "Bihar's famous peda since 1975 — order online, shipped fresh pan-India.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF3E5",
    theme_color: "#6E1E2B",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
