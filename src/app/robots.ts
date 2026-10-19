import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/musteri"],
      },
    ],
    // Sitemap index; parçalar src/app/sitemaps/sitemap.ts içinde üretilir.
    sitemap: "https://www.suaritmaservis34.com/sitemap.xml",
  };
}
