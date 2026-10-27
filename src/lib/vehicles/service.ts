import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { GARAGE } from "@/config/garage";
import { getVehicleProvider } from "./providers";
import { toPublicVehicles } from "./visibility";
import type { PublicVehicle } from "./types";

/**
 * Stock public, mis en cache quelques minutes. Toutes les pages lisent les véhicules par ici,
 * jamais directement le fournisseur.
 */
export async function getPublicVehicles(): Promise<PublicVehicle[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("vehicles");
  const provider = getVehicleProvider();
  const all = await provider.listVehicles();
  return toPublicVehicles(all, new Date(), GARAGE);
}

export async function getVehicleBySlug(slug: string): Promise<PublicVehicle | undefined> {
  return (await getPublicVehicles()).find((v) => v.slug === slug);
}

export async function isDemoStock(): Promise<boolean> {
  return getVehicleProvider().id === "demo";
}
