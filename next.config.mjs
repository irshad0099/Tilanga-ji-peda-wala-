/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF is ~20–30% smaller than WebP for the same photo; browsers that
    // can't show it get WebP.
    formats: ["image/avif", "image/webp"],
    // Optimised photos rarely change, so let browsers/CDN keep them a month.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
