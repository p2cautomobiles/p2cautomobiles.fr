import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/garage";
import { getPublicVehicles } from "@/lib/vehicles/service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/vehicules", "/qui-sommes-nous", "/services", "/reprise", "/contact", "/mentions-legales", "/confidentialite"];
  // Les exemples de démonstration et les véhicules vendus ne sont pas proposés aux moteurs de recherche.
  const vehicles = (await getPublicVehicles()).filter((v) => v.source !== "demo" && v.status !== "sold");
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}` })),
    ...vehicles.map((v) => ({ url: `${SITE_URL}/vehicules/${v.slug}`, lastModified: v.updatedAt })),
  ];
}
