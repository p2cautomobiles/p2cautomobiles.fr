import { describe, expect, it } from "vitest";
import { applyFilters, facets, filtersToQuery, parseFilters, pruneModels, similarVehicles } from "./filters";
import { buildDemoVehicles } from "./providers/mock";
import { toPublicVehicles } from "./visibility";

const NOW = new Date("2026-10-27T12:00:00Z");
const all = toPublicVehicles(buildDemoVehicles(NOW), NOW, { soldVisibleDays: 14, newBadgeDays: 10 });

describe("parseFilters", () => {
  it("lit plusieurs marques séparées par des virgules", () => {
    expect(parseFilters({ marque: "Peugeot,Renault" }).marque).toEqual(["Peugeot", "Renault"]);
  });
  it("ignore les valeurs invalides au lieu d'échouer", () => {
    const f = parseFilters({ prix_max: "abc", tri: "n'importe-quoi", page: "-3" });
    expect(f).toEqual({ marque: undefined, modele: undefined, carburant: undefined, boite: undefined, carrosserie: undefined, prix_min: undefined, prix_max: undefined, km_max: undefined, annee_min: undefined, annee_max: undefined, puissance_min: undefined, tri: undefined, page: undefined });
  });
  it("aller-retour avec l'URL", () => {
    const q = filtersToQuery(parseFilters({ marque: "Peugeot,Renault", prix_max: "15000" }));
    expect(q).toBe("?marque=Peugeot,Renault&prix_max=15000");
  });
});

describe("applyFilters", () => {
  it("combine plusieurs marques", () => {
    const r = applyFilters(all, parseFilters({ marque: "Peugeot,Renault,Toyota" }));
    expect(r.total).toBe(6);
    expect(new Set(r.items.map((v) => v.brand))).toEqual(new Set(["Peugeot", "Renault", "Toyota"]));
  });
  it("filtre par budget et trie par prix croissant", () => {
    const r = applyFilters(all, parseFilters({ prix_max: "15000", tri: "prix-asc" }));
    expect(r.items.every((v) => v.priceEur <= 15000)).toBe(true);
    const prices = r.items.map((v) => v.priceEur);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
  it("pagine par 12", () => {
    const r = applyFilters(all, parseFilters({ page: "2" }));
    expect(r.page).toBe(2);
    expect(r.items.length).toBe(all.length - 12);
  });
});

describe("facets", () => {
  it("ne propose que les modèles des marques choisies", () => {
    const f = facets(all, parseFilters({ marque: "Peugeot" }));
    expect(f.modele.map((x) => x.value)).toEqual(["2008", "208"]);
  });
  it("ne propose aucun modèle sans marque", () => {
    expect(facets(all, parseFilters({})).modele).toEqual([]);
  });
});

describe("pruneModels", () => {
  it("retire un modèle quand sa marque est décochée", () => {
    const f = pruneModels(parseFilters({ marque: "Renault", modele: "208,Clio V" }), all);
    expect(f.modele).toEqual(["Clio V"]);
  });
});

describe("visibilité", () => {
  it("garde un véhicule vendu depuis 7 jours, avec son statut", () => {
    expect(all.find((v) => v.model === "C3")?.status).toBe("sold");
  });
  it("retire un véhicule vendu depuis plus de 14 jours", () => {
    const later = new Date(NOW.getTime() + 10 * 864e5);
    const vis = toPublicVehicles(buildDemoVehicles(NOW), later, { soldVisibleDays: 14, newBadgeDays: 10 });
    expect(vis.find((v) => v.model === "C3")).toBeUndefined();
  });
  it("ne met jamais le badge Nouveau sur un véhicule vendu ou réservé", () => {
    expect(all.filter((v) => v.status !== "available").some((v) => v.isNew)).toBe(false);
  });
});

describe("similarVehicles", () => {
  it("ne propose que des véhicules disponibles, sans le véhicule lui-même", () => {
    const v = all[0];
    const s = similarVehicles(all, v);
    expect(s).toHaveLength(3);
    expect(s.every((o) => o.status === "available" && o.externalId !== v.externalId)).toBe(true);
  });
});
