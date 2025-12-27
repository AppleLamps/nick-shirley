import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external images from common sources
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.youtube.com',
      },
      {
        protocol: 'https',
        hostname: '**.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.twimg.com',
      },
    ],
  },
};

export default nextConfig;
