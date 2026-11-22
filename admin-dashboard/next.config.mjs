/** @type {import('next').NextConfig} */
const nextConfig = {
  // Product photos are served by the shop site.
  images: { remotePatterns: [{ protocol: "https", hostname: "tilangaji.com" }] },
};

export default nextConfig;
