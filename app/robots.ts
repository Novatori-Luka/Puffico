import { MetadataRoute } from "next";

const BASE_URL = "https://puffico.ge";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/cart", "/checkout", "/order-success"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
