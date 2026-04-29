import type { NextConfig } from "next";
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/myWeb',
  assetPrefix: '/myWeb/',
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'assets.aceternity.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      enforce: 'pre',
      use: [
        {
          loader: join(__dirname, 'scripts', 'img-path-loader.mjs'),
        },
      ],
    })
    return config
  },
};

export default nextConfig;
