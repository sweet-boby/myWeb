import type { NextConfig } from "next";

const repoName = 'myWeb'
const basePath = `/${repoName}`

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  assetPrefix: `${basePath}/`,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'assets.aceternity.com' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
