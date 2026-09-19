import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://happy-truffles-cafe.vercel.app";

  const staticPages = [
    "",
    "/#menu",
    "/about",
    "/gallery",
    "/testimonials",
    "/blog",
    "/reservations",
    "/orders",
    "/cart",
    "/profile",
    "/wishlist",
    "/loyalty",
    "/gift-cards",
    "/referrals",
    "/events",
    "/qr",
    "/virtual-tour",
    "/tracking",
    "/display",
    "/barcode-menu",
    "/tables-qr",
    "/catering",
    "/corporate",
    "/jobs",
    "/login",
    "/register",
    "/whatsapp",
    "/checkout",
  ];

  const staticSitemap = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticSitemap];
}
