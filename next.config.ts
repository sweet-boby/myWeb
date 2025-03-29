import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com', 'assets.aceternity.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // experimental: {
  //   nodeMiddleware: true // 显式启用中间件的 Node.js 运行时
  // }
  // auth: {
  //   trustHost: true, // 开发环境快速修复（仅限测试）
  //   // 生产环境应指定具体域名：
  //   trustedDomains: ["localhost:3000"]
  // }
  experimental: {
    // 关闭 Turbopack
    // turbo: false,
    // 强制使用 Webpack 服务端绑定
    serverComponentsExternalPackages: ["react-server-dom-webpack"],
  },
};

export default nextConfig;
