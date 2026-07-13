import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(),
  },
  async redirects() {
    return [
      {
        source: '/index',
        destination: '/programmes',
        permanent: true,
      },
      {
        source: '/index/:slug',
        destination: '/programmes/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
