import { z } from "zod";
import type { PublicVehicle } from "./types";

/** Filtres du catalogue, tels qu'ils apparaissent dans l'URL (/vehicules?marque=Peugeot,Renault&prix_max=15000). */
const list = z
  .string()
  .transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean))
  .pipe(z.array(z.string().max(60)).max(30));
const int = z.coerce.number().int().nonnegative().max(10_000_000);

export const SORTS = {
  recent: "Nouveautés",
  "prix-asc": "Prix croissant",
  "prix-desc": "Prix décroissant",
  "km-asc": "Kilométrage croissant",
  "annee-desc": "Année décroissante",
} as const;
export type SortKey = keyof typeof SORTS;

const filtersSchema = z.object({
  marque: list.optional().catch(undefined),
  modele: list.optional().catch(undefined),
  carburant: list.optional().catch(undefined),
  boite: list.optional().catch(undefined),
  carrosserie: list.optional().catch(undefined),
  prix_min: int.optional().catch(undefined),
  prix_max: int.optional().catch(undefined),
  km_max: int.optional().catch(undefined),
  annee_min: int.optional().catch(undefined),
  annee_max: int.optional().catch(undefined),
  puissance_min: int.optional().catch(undefined),
  tri: z.enum(Object.keys(SORTS) as [SortKey, ...SortKey[]]).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(1000).optional().catch(undefined),
});
export type CatalogFilters = z.infer<typeof filtersSchema>;

/** Champs à choix multiples et le champ du véhicule correspondant. */
export const MULTI_FIELDS = {
  marque: "brand",
  modele: "model",
  carburant: "fuel",
  boite: "gearbox",
  carrosserie: "body",
} as const satisfies Record<string, keyof PublicVehicle>;
export type MultiField = keyof typeof MULTI_FIELDS;

type RawParams = Record<string, string | string[] | undefined>;

export function parseFilters(raw: RawParams): CatalogFilters {
  const flat = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v.join(",") : v]),
  );
  return filtersSchema.parse(flat);
}

export { filtersToQuery } from "./query";

export function matches(v: PublicVehicle, f: CatalogFilters, skip?: MultiField): boolean {
  if (f.prix_min !== undefined && v.priceEur < f.prix_min) return false;
  if (f.prix_max !== undefined && v.priceEur > f.prix_max) return false;
  if (f.km_max !== undefined && v.mileageKm > f.km_max) return false;
  if (f.annee_min !== undefined && v.year < f.annee_min) return false;
  if (f.annee_max !== undefined && v.year > f.annee_max) return false;
  if (f.puissance_min !== undefined && (v.powerHp ?? 0) < f.puissance_min) return false;
  for (const [param, field] of Object.entries(MULTI_FIELDS) as [MultiField, keyof PublicVehicle][]) {
    if (param === skip) continue;
    const wanted = f[param];
    if (wanted?.length && !wanted.includes(String(v[field] ?? ""))) return false;
  }
  return true;
}

const COMPARE: Record<SortKey, (a: PublicVehicle, b: PublicVehicle) => number> = {
  recent: (a, b) => b.createdAt.localeCompare(a.createdAt),
  "prix-asc": (a, b) => a.priceEur - b.priceEur,
  "prix-desc": (a, b) => b.priceEur - a.priceEur,
  "km-asc": (a, b) => a.mileageKm - b.mileageKm,
  "annee-desc": (a, b) => b.year - a.year || a.mileageKm - b.mileageKm,
};

export const PAGE_SIZE = 12;

export function applyFilters(all: PublicVehicle[], f: CatalogFilters) {
  const list = all.filter((v) => matches(v, f)).sort(COMPARE[f.tri ?? "recent"]);
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const page = Math.min(f.page ?? 1, pages);
  return { total: list.length, pages, page, items: list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) };
}

export type Facet = { value: string; count: number };

/** Options proposées dans les filtres : uniquement les valeurs présentes dans le stock, avec leur nombre. */
export function facets(all: PublicVehicle[], f: CatalogFilters): Record<MultiField, Facet[]> {
  const out = {} as Record<MultiField, Facet[]>;
  for (const [param, field] of Object.entries(MULTI_FIELDS) as [MultiField, keyof PublicVehicle][]) {
    const pool = param === "modele" && f.marque?.length ? all.filter((v) => f.marque!.includes(v.brand)) : all;
    const values = [...new Set(pool.map((v) => v[field]).filter(Boolean).map(String))].sort((a, b) => a.localeCompare(b, "fr"));
    const counts = new Map<string, number>();
    for (const v of pool) if (matches(v, f, param)) counts.set(String(v[field]), (counts.get(String(v[field])) ?? 0) + 1);
    out[param] = values.map((value) => ({ value, count: counts.get(value) ?? 0 }));
  }
  if (!f.marque?.length) out.modele = [];
  return out;
}

/** Retire les modèles qui n'appartiennent plus aux marques choisies. */
export function pruneModels(f: CatalogFilters, all: PublicVehicle[]): CatalogFilters {
  if (!f.modele?.length) return f;
  const ok = f.modele.filter((m) => all.some((v) => v.model === m && (!f.marque?.length || f.marque.includes(v.brand))));
  return { ...f, modele: ok.length ? ok : undefined };
}

export function similarVehicles(all: PublicVehicle[], v: PublicVehicle, n = 3): PublicVehicle[] {
  return all
    .filter((o) => o.externalId !== v.externalId && o.status === "available")
    .map((o) => ({
      o,
      score: Math.abs(o.priceEur - v.priceEur) / 1000 - (o.body === v.body ? 4 : 0) - (o.brand === v.brand ? 2 : 0) - (o.fuel === v.fuel ? 1 : 0),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, n)
    .map((x) => x.o);
}
