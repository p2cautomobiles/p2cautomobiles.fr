import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/garage";

export default function robots(): MetadataRoute.Robots {
  // Tant que le site n'est pas en production (NEXT_PUBLIC_ALLOW_INDEXING absent), on bloque l'indexation.
  const allow = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
  return {
    rules: allow ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
