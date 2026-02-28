import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // Required for Docker production build
  // Disable image optimization for standalone mode
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
