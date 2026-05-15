import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/istanbul/bayramspasa',
        destination: '/istanbul/bayrampasa',
        permanent: true,
      },
      {
        source: '/istanbul/bayramspasa/:path*',
        destination: '/istanbul/bayrampasa/:path*',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
