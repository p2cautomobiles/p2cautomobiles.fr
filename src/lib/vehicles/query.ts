import type { CatalogFilters } from "./filters";

/** Construit l'URL du catalogue. Sans dépendance, pour rester léger côté navigateur. */
export function filtersToQuery(f: CatalogFilters): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) {
    if (v === undefined || v === null || (Array.isArray(v) && v.length === 0)) continue;
    if (k === "page" && v === 1) continue;
    if (k === "tri" && v === "recent") continue;
    p.set(k, Array.isArray(v) ? v.join(",") : String(v));
  }
  const s = p.toString().replaceAll("%2C", ",");
  return s ? `?${s}` : "";
}

export function catalogHref(f: CatalogFilters): string {
  return `/vehicules${filtersToQuery(f)}`;
}
