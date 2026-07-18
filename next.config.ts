import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
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
