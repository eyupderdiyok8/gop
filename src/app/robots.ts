import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ["Googlebot", "Bingbot", "YandexBot", "Applebot"],
        disallow: ["/api/", "/_next/"],
      },
      {
        userAgent: "*",
        allow: ["/", "/api/og"],
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: "https://www.suaritmaservis34.com/sitemap.xml",
  };
}
