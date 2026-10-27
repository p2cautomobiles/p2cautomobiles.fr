"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, useTransition, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { CatalogFilters, Facet, MultiField, SortKey } from "@/lib/vehicles/filters";
import { catalogHref } from "@/lib/vehicles/query";
import { formatKm, formatPrice } from "@/lib/format";

const LABELS: Record<MultiField, string> = { marque: "Marques", modele: "Modèles", carburant: "Carburant", boite: "Boîte de vitesses", carrosserie: "Carrosserie" };
const PRICE_STEPS = [8000, 10000, 12000, 15000, 18000, 20000, 25000, 30000];
const KM_STEPS = [20000, 40000, 60000, 80000, 100000];
const HP_STEPS = [70, 90, 110, 130, 150];

type Ctx = { open: boolean; setOpen: (o: boolean) => void; pending: boolean; go: (f: CatalogFilters) => void };
const CatalogCtx = createContext<Ctx | null>(null);
const useCatalog = () => {
  const c = useContext(CatalogCtx);
  if (!c) throw new Error("CatalogProvider manquant");
  return c;
};

/** Partage l'état du panneau de filtres et la navigation entre la barre latérale et la barre d'outils. */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const go = (f: CatalogFilters) => start(() => router.push(catalogHref({ ...f, page: undefined }), { scroll: false }));
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  return <CatalogCtx.Provider value={{ open, setOpen, pending, go }}>{children}</CatalogCtx.Provider>;
}

export function PendingArea({ children }: { children: ReactNode }) {
  const { pending } = useCatalog();
  return <div id="results" className={pending ? "filters-pending" : undefined} aria-busy={pending}>{children}</div>;
}

export function OpenFiltersButton() {
  const { setOpen } = useCatalog();
  return (
    <button className="btn btn-secondary filter-btn" type="button" onClick={() => setOpen(true)} aria-controls="filters">
      <SlidersHorizontal size={16} aria-hidden /> Filtres
    </button>
  );
}

export function SortSelect({ filters, sorts }: { filters: CatalogFilters; sorts: Record<SortKey, string> }) {
  const { go } = useCatalog();
  return (
    <div className="field">
      <label htmlFor="sort">Trier par</label>
      <select id="sort" value={filters.tri ?? "recent"} onChange={(e) => go({ ...filters, tri: e.target.value as SortKey })}>
        {Object.entries(sorts).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
      </select>
    </div>
  );
}

export function FiltersPanel({ filters: f, facets, years, total, modelBrands }: { filters: CatalogFilters; facets: Record<MultiField, Facet[]>; years: number[]; total: number; modelBrands: Record<string, string> }) {
  const { open, setOpen, go } = useCatalog();

  const toggle = (field: MultiField, value: string, on: boolean) => {
    const cur = new Set(f[field] ?? []);
    if (on) cur.add(value);
    else cur.delete(value);
    const next: CatalogFilters = { ...f, [field]: cur.size ? [...cur] : undefined };
    if (field === "marque" && next.modele) {
      // Retire les modèles dont la marque n'est plus cochée, pour garder une URL juste.
      const kept = next.modele.filter((m) => cur.has(modelBrands[m]));
      next.modele = kept.length ? kept : undefined;
    }
    go(next);
  };
  const setNum = (key: keyof CatalogFilters, value: string) => go({ ...f, [key]: value ? Number(value) : undefined });

  const chips = (field: MultiField) => (
    <fieldset key={field}>
      <legend>{LABELS[field]}</legend>
      <div className="chips">
        {facets[field].map(({ value, count }) => {
          const on = f[field]?.includes(value) ?? false;
          return (
            <label className="chip" key={value}>
              <input type="checkbox" checked={on} disabled={!count && !on} onChange={(e) => toggle(field, value, e.target.checked)} />
              <span>{value}<small>{count}</small></span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );

  const numSelect = (id: string, key: keyof CatalogFilters, steps: number[], fmt: (n: number) => string, empty: string, label: string, srOnly = false) => (
    <div className="field">
      <label htmlFor={id} className={srOnly ? "sr" : undefined}>{label}</label>
      <select id={id} value={String(f[key] ?? "")} onChange={(e) => setNum(key, e.target.value)}>
        <option value="">{empty}</option>
        {steps.map((n) => <option key={n} value={n}>{fmt(n)}</option>)}
      </select>
    </div>
  );

  return (
    <aside className={`filters${open ? " open" : ""}`} id="filters" aria-label="Filtres">
      <div className="head">
        <h2>Filtres</h2>
        <button className="btn btn-ghost" type="button" onClick={() => go({})} style={{ minHeight: 36, fontSize: 14 }}>Réinitialiser</button>
      </div>
      {chips("marque")}
      {facets.modele.length ? chips("modele") : <p className="muted" style={{ fontSize: 14, marginTop: -8 }}>Choisissez une ou plusieurs marques pour filtrer par modèle.</p>}
      <div>
        <span className="lbl" style={{ fontSize: 14, fontWeight: 700 }}>Prix</span>
        <div className="row2" style={{ marginTop: 6 }}>
          {numSelect("f-pmin", "prix_min", PRICE_STEPS, formatPrice, "Min", "Prix minimum", true)}
          {numSelect("f-pmax", "prix_max", PRICE_STEPS, formatPrice, "Max", "Prix maximum", true)}
        </div>
      </div>
      {numSelect("f-km", "km_max", KM_STEPS, formatKm, "Sans limite", "Kilométrage maximum")}
      <div>
        <span className="lbl" style={{ fontSize: 14, fontWeight: 700 }}>Année</span>
        <div className="row2" style={{ marginTop: 6 }}>
          {numSelect("f-ymin", "annee_min", years, String, "Depuis", "Année minimum", true)}
          {numSelect("f-ymax", "annee_max", years, String, "Jusqu'à", "Année maximum", true)}
        </div>
      </div>
      {chips("carburant")}
      {chips("boite")}
      {chips("carrosserie")}
      {numSelect("f-hp", "puissance_min", HP_STEPS, (n) => `${n} ch`, "Toutes", "Puissance minimum")}
      <div className="drawer-foot">
        <button className="btn btn-secondary" type="button" onClick={() => go({})}>Réinitialiser</button>
        <button className="btn btn-primary" type="button" onClick={() => setOpen(false)}>Voir {total} véhicule{total > 1 ? "s" : ""}</button>
      </div>
    </aside>
  );
}
