"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { catalogHref } from "@/lib/vehicles/query";
import { formatPrice } from "@/lib/format";

const BUDGETS = [10000, 12000, 15000, 20000, 25000, 30000];

export function QuickSearch({ brands, fuels }: { brands: string[]; fuels: string[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [fuel, setFuel] = useState("");
  const detailsRef = useRef<HTMLDetailsElement>(null);

  // Ferme la liste des marques au clic à l'extérieur ou avec Échap.
  useEffect(() => {
    const close = (e: Event) => {
      const d = detailsRef.current;
      if (!d?.open) return;
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !d.contains(e.target as Node)) d.open = false;
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  const summary = !selected.length ? "Toutes les marques" : selected.length <= 2 ? selected.join(", ") : `${selected.length} marques`;

  return (
    <form
      className="quick-form"
      aria-label="Recherche rapide"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(
          catalogHref({
            marque: selected.length ? selected : undefined,
            prix_max: budget ? Number(budget) : undefined,
            carburant: fuel ? [fuel] : undefined,
          }),
        );
      }}
    >
      <div className="field">
        <span className="lbl" id="q-brand-lbl">Marques</span>
        <details className="ms" ref={detailsRef}>
          <summary aria-labelledby="q-brand-lbl"><span>{summary}</span><ChevronDown size={16} aria-hidden /></summary>
          <div className="pop" role="group" aria-label="Choisir une ou plusieurs marques">
            {brands.map((b) => (
              <label key={b}>
                <input
                  type="checkbox"
                  checked={selected.includes(b)}
                  onChange={(e) => setSelected((s) => (e.target.checked ? [...s, b] : s.filter((x) => x !== b)))}
                />{" "}
                {b}
              </label>
            ))}
          </div>
        </details>
      </div>
      <div className="field">
        <label htmlFor="q-budget">Budget maximum</label>
        <select id="q-budget" value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="">Sans limite</option>
          {BUDGETS.map((n) => <option key={n} value={n}>{formatPrice(n)}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="q-fuel">Carburant</label>
        <select id="q-fuel" value={fuel} onChange={(e) => setFuel(e.target.value)}>
          <option value="">Tous</option>
          {fuels.map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>
      <button className="btn btn-dark" type="submit"><Search aria-hidden /> Rechercher</button>
    </form>
  );
}
