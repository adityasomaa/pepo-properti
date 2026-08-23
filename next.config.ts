import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel Image Optimization quota on this account is exhausted. With the
  // optimizer enabled every image would 402 and production would render blank,
  // so images are served exactly as they are authored.
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
