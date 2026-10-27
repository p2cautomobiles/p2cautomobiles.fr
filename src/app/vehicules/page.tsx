import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { CatalogProvider, FiltersPanel, OpenFiltersButton, PendingArea, SortSelect } from "@/components/CatalogControls";
import { getPublicVehicles } from "@/lib/vehicles/service";
import { applyFilters, facets, MULTI_FIELDS, parseFilters, pruneModels, SORTS, type CatalogFilters, type MultiField } from "@/lib/vehicles/filters";
import { catalogHref } from "@/lib/vehicles/query";
import { formatKm, formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Nos véhicules d'occasion",
  description: "Toutes les voitures d'occasion disponibles chez P2C Automobiles à Plan de Campagne : filtrez par marque, budget, kilométrage, carburant et boîte de vitesses.",
  alternates: { canonical: "/vehicules" },
};

export default function CatalogPage({ searchParams }: PageProps<"/vehicules">) {
  return (
    <div className="wrap">
      <div className="cat-head">
        <nav className="crumbs" aria-label="Fil d'Ariane"><Link href="/">Accueil</Link><span>›</span><span>Nos véhicules</span></nav>
        <h1>Nos véhicules d&apos;occasion</h1>
        <p className="muted" style={{ marginTop: 8 }}>Toutes les voitures disponibles au garage. Chaque voiture est garantie.</p>
      </div>
      <Suspense fallback={<p className="muted" style={{ paddingBlock: 40 }}>Chargement des véhicules…</p>}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Catalog({ searchParams }: { searchParams: PageProps<"/vehicules">["searchParams"] }) {
  const all = await getPublicVehicles();
  const filters = pruneModels(parseFilters(await searchParams), all);
  const result = applyFilters(all, filters);
  const years = [...new Set(all.map((v) => v.year))].sort((a, b) => a - b);

  return (
    <CatalogProvider>
      <div className="cat">
        <FiltersPanel
          filters={filters}
          facets={facets(all, filters)}
          years={years}
          total={result.total}
          modelBrands={Object.fromEntries(all.map((v) => [v.model, v.brand]))}
        />
        <PendingArea>
          <div className="toolbar">
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <OpenFiltersButton />
              <span className="count num" aria-live="polite">{result.total} véhicule{result.total > 1 ? "s" : ""}</span>
            </div>
            <SortSelect filters={filters} sorts={SORTS} />
          </div>
          <ActiveFilters filters={filters} />
          {result.total ? (
            <div className="grid-cars">{result.items.map((v, i) => <VehicleCard key={v.externalId} vehicle={v} priority={i < 3} />)}</div>
          ) : (
            <div className="empty">
              <h3>Aucun véhicule ne correspond pour l&apos;instant</h3>
              <p className="muted">Élargissez la recherche, ou confiez-nous votre demande : on cherche aussi des voitures hors stock.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                <Link className="btn btn-secondary" href="/vehicules">Réinitialiser les filtres</Link>
                <Link className="btn btn-primary" href="/services#recherche">Demander une recherche</Link>
              </div>
            </div>
          )}
          {result.pages > 1 && <Pagination filters={filters} page={result.page} pages={result.pages} />}
        </PendingArea>
      </div>
    </CatalogProvider>
  );
}

function ActiveFilters({ filters: f }: { filters: CatalogFilters }) {
  const chips: { label: string; href: string }[] = [];
  for (const field of Object.keys(MULTI_FIELDS) as MultiField[]) {
    for (const value of f[field] ?? []) {
      const rest = f[field]!.filter((x) => x !== value);
      chips.push({ label: value, href: catalogHref({ ...f, [field]: rest.length ? rest : undefined, page: undefined }) });
    }
  }
  const nums: [keyof CatalogFilters, (n: number) => string][] = [
    ["prix_min", (n) => `Dès ${formatPrice(n)}`],
    ["prix_max", (n) => `Jusqu'à ${formatPrice(n)}`],
    ["km_max", (n) => `≤ ${formatKm(n)}`],
    ["annee_min", (n) => `Depuis ${n}`],
    ["annee_max", (n) => `Jusqu'à ${n}`],
    ["puissance_min", (n) => `≥ ${n} ch`],
  ];
  for (const [k, fmt] of nums) {
    const v = f[k];
    if (typeof v === "number") chips.push({ label: fmt(v), href: catalogHref({ ...f, [k]: undefined, page: undefined }) });
  }
  if (!chips.length) return null;
  return (
    <div className="active-filters">
      {chips.map((c) => (
        <Link key={c.label + c.href} href={c.href} scroll={false} className="chip-remove" aria-label={`Retirer le filtre ${c.label}`}>
          {c.label} <X size={14} aria-hidden />
        </Link>
      ))}
    </div>
  );
}

function Pagination({ filters, page, pages }: { filters: CatalogFilters; page: number; pages: number }) {
  const href = (p: number) => catalogHref({ ...filters, page: p });
  return (
    <nav className="pager" aria-label="Pagination">
      {page > 1 ? <Link href={href(page - 1)} aria-label="Page précédente"><ChevronLeft aria-hidden /></Link> : <span aria-hidden><ChevronLeft /></span>}
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <Link key={p} href={href(p)} aria-current={p === page ? "page" : undefined}>{p}</Link>
      ))}
      {page < pages ? <Link href={href(page + 1)} aria-label="Page suivante"><ChevronRight aria-hidden /></Link> : <span aria-hidden><ChevronRight /></span>}
    </nav>
  );
}
