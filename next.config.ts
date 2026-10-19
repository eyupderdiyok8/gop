import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare quick tunnel ile lokal önizleme paylaşımı (sadece dev)
  allowedDevOrigins: ["*.trycloudflare.com"],
  images: {
    // Supabase Storage already serves WebP images. Bypass Vercel's metered
    // Image Optimization endpoint so quota exhaustion cannot hide site images.
    unoptimized: true,
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
      },
      {
        source: '/istanbul/eyup/silahtraga',
        destination: '/istanbul/eyup/silahtaraga',
        permanent: true,
      },
      // 3.2 Prada tanıtım sayfası kalıcı adresine taşındı
      { source: '/3-2-v2', destination: '/3-2-su-aritma-cihazi', permanent: true },
      { source: '/3-2-prada-su-aritma-cihazi', destination: '/3-2-su-aritma-cihazi', permanent: true },
      // 028: tekrar eden mahalle kayıtları resmi adlı kayıtlarla birleştirildi
      ...[
        ['/istanbul/gaziosmanpasa/barbaros', '/istanbul/gaziosmanpasa/barbaros-hayrettinpasa'],
        ['/istanbul/eyup/eyup', '/istanbul/eyup/eyupsultan-merkez'],
        ['/istanbul/eyup/rami', '/istanbul/eyup/rami-cuma'],
      ].flatMap(([source, destination]) => [
        { source, destination, permanent: true },
        { source: `${source}/:path*`, destination: `${destination}/:path*`, permanent: true },
      ]),
    ]
  }
};

export default nextConfig;
