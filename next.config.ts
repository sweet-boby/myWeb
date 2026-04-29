import type { NextConfig } from "next";

const repoName = 'myWeb'
const isDev = process.env.NODE_ENV === 'development'
const basePath = isDev ? '' : `/${repoName}`

const nextConfig: NextConfig = {
  ...(isDev ? {} : { output: 'export' as const }),
  ...(isDev ? {} : { basePath }),
  ...(isDev ? {} : { assetPrefix: `${basePath}/` }),
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
