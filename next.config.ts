import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/myWeb',
  assetPrefix: '/myWeb/',
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com','assets.aceternity.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
