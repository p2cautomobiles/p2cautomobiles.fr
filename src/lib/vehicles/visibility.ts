import type { PublicVehicle, Vehicle } from "./types";

/**
 * Règles d'affichage public :
 * - un véhicule vendu reste visible `soldVisibleDays` jours avec le badge « VENDU », puis disparaît ;
 * - « Nouveau » pendant `newBadgeDays` jours après l'arrivée, uniquement s'il est disponible.
 */
export function toPublicVehicles(
  vehicles: Vehicle[],
  now: Date,
  opts: { soldVisibleDays: number; newBadgeDays: number },
): PublicVehicle[] {
  const day = 864e5;
  return vehicles
    .filter((v) => {
      if (v.status !== "sold") return true;
      if (!v.soldAt) return false;
      return now.getTime() - new Date(v.soldAt).getTime() <= opts.soldVisibleDays * day;
    })
    .map((v) => ({
      ...v,
      isNew: v.status === "available" && now.getTime() - new Date(v.createdAt).getTime() <= opts.newBadgeDays * day,
    }));
}
