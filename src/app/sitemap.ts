import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://example.com"; // поменяйте на ваш домен
  const routes = ["","/request","/how-it-works","/about","/faq","/contacts","/privacy"];
  return routes.map(r => ({
    url: base + r,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
}
