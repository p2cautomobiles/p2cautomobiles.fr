import { vehicleSchema, type Vehicle } from "../types";
import type { VehicleProvider } from "./types";
import { slugify } from "../../slug";

/**
 * Données de démonstration. Ces véhicules n'existent pas : le site les signale
 * comme « Exemple » et ils disparaissent dès que la vraie source est branchée.
 */
type Row = [brand: string, model: string, version: string, price: number, km: number, year: number, reg: string, fuel: string, gearbox: string, hp: number, body: string, paint: string, color: string, status: Vehicle["status"], daysAgo: number];

const ROWS: Row[] = [
  ["Peugeot", "208", "1.2 PureTech 100 Allure", 14490, 38200, 2021, "2021-03", "Essence", "Manuelle", 100, "Citadine", "#C9302C", "Rouge Elixir", "available", 5],
  ["Renault", "Clio V", "TCe 90 Evolution", 14900, 29500, 2022, "2022-06", "Essence", "Manuelle", 90, "Citadine", "#3E5C8A", "Bleu Iron", "available", 8],
  ["Toyota", "Yaris", "Hybride 116h Design", 16990, 51000, 2021, "2021-02", "Hybride", "Automatique", 116, "Citadine", "#E8E8E8", "Blanc pur", "available", 24],
  ["Fiat", "500", "1.0 Hybrid 70 Dolcevita", 12490, 22800, 2022, "2022-04", "Hybride", "Manuelle", 70, "Citadine", "#9CC6C0", "Vert Rugiada", "available", 3],
  ["Volkswagen", "Polo", "1.0 TSI 95 Life", 13790, 61300, 2020, "2020-09", "Essence", "Manuelle", 95, "Citadine", "#4A4D52", "Gris Urano", "available", 29],
  ["Dacia", "Sandero Stepway", "TCe 90 Expression", 12990, 33900, 2022, "2022-01", "Essence", "Manuelle", 90, "Citadine", "#B8763C", "Orange Arizona", "available", 16],
  ["Kia", "Picanto", "1.0 DPi 67 Active", 10990, 14100, 2023, "2023-05", "Essence", "Manuelle", 67, "Citadine", "#F0F0F0", "Blanc Clair", "available", 2],
  ["Peugeot", "2008", "1.2 PureTech 130 EAT8 GT Line", 21490, 47600, 2021, "2021-07", "Essence", "Automatique", 130, "SUV", "#1F2A44", "Bleu Vertigo", "available", 19],
  ["Renault", "Captur", "E-Tech hybride 145 Techno", 22900, 36200, 2022, "2022-10", "Hybride", "Automatique", 145, "SUV", "#B9B9B4", "Gris Cassiopée", "available", 12],
  ["Volkswagen", "Golf 8", "1.5 eTSI 150 DSG7 Style", 23990, 58400, 2021, "2021-05", "Hybride", "Automatique", 150, "Compacte", "#2B2B2D", "Noir intense", "available", 37],
  ["Tesla", "Model 3", "Propulsion", 27490, 72000, 2021, "2021-11", "Électrique", "Automatique", 283, "Berline", "#EDEDED", "Blanc nacré", "available", 26],
  ["Toyota", "C-HR", "1.8 Hybride 122h Dynamic", 19990, 64800, 2020, "2020-03", "Hybride", "Automatique", 122, "SUV", "#7D1E23", "Rouge Grenat", "available", 43],
  ["Mini", "Cooper", "136 ch Edition", 17490, 52300, 2019, "2019-06", "Essence", "Manuelle", 136, "Citadine", "#2F5D3A", "British Racing Green", "reserved", 22],
  ["Citroën", "C3", "PureTech 83 Shine", 11490, 44000, 2021, "2021-04", "Essence", "Manuelle", 83, "Citadine", "#D9D2C3", "Sable", "sold", 47],
  ["Skoda", "Octavia Combi", "2.0 TDI 150 DSG7 Style", 20990, 88500, 2020, "2020-08", "Diesel", "Automatique", 150, "Break", "#5A6068", "Gris Quartz", "available", 27],
  ["Hyundai", "Kona Electric", "64 kWh 204 ch Intuitive", 21990, 41000, 2021, "2021-09", "Électrique", "Automatique", 204, "SUV", "#2D6E8E", "Bleu Surfy", "available", 9],
  ["Opel", "Corsa", "1.2 75 Edition", 10490, 39800, 2021, "2021-01", "Essence", "Manuelle", 75, "Citadine", "#C7C9CC", "Gris Quartz", "available", 14],
  ["Ford", "Puma", "1.0 EcoBoost 125 mHEV ST-Line", 18490, 49700, 2021, "2021-10", "Hybride", "Manuelle", 125, "SUV", "#16365C", "Bleu Desert Island", "available", 6],
];

const EQUIPMENT: Record<string, string[]> = {
  Citadine: ["Climatisation automatique", "Écran tactile avec Apple CarPlay / Android Auto", "Radar de recul", "Régulateur de vitesse", "Allumage automatique des feux", "Bluetooth"],
  SUV: ["Climatisation bizone", "Caméra de recul", "Navigation GPS", "Apple CarPlay / Android Auto", "Aide au maintien dans la voie", "Jantes alliage 17\"", "Accès et démarrage sans clé"],
  Compacte: ["Climatisation trizone", "Cockpit numérique", "Navigation GPS", "Régulateur adaptatif", "Radars avant et arrière", "Recharge du téléphone par induction"],
  Berline: ["Toit en verre", "Sièges avant chauffants", "Caméras 360°", "Navigation intégrée", "Mises à jour à distance"],
  Break: ["Climatisation bizone", "Hayon électrique", "Navigation GPS", "Régulateur adaptatif", "Radars avant et arrière", "Attelage"],
};

const SHAPES = { Citadine: "citadine", SUV: "suv", Compacte: "compacte", Berline: "berline", Break: "break" } as const;

export function buildDemoVehicles(now: Date): Vehicle[] {
  return ROWS.map((r, i) => {
    const [brand, model, version, price, km, year, reg, fuel, gearbox, hp, body, paint, color, status, daysAgo] = r;
    const externalId = `DEMO-${String(i + 1).padStart(3, "0")}`;
    const created = new Date(now.getTime() - daysAgo * 864e5).toISOString();
    return vehicleSchema.parse({
      externalId,
      source: "demo",
      slug: slugify(`${brand} ${model} ${version} ${externalId}`),
      brand, model, version,
      priceEur: price, mileageKm: km, year, firstRegistration: reg,
      fuel, gearbox, powerHp: hp, body, color,
      description: [
        `${brand} ${model} ${version}, ${year}, teinte ${color.toLowerCase()}.`,
        "Texte d'exemple : la description saisie dans Evialog s'affichera ici telle quelle.",
      ],
      equipment: EQUIPMENT[body] ?? [],
      photos: [],
      status,
      soldAt: status === "sold" ? new Date(now.getTime() - 7 * 864e5).toISOString() : undefined,
      createdAt: created,
      updatedAt: created,
      demoArt: { paint, shape: SHAPES[body as keyof typeof SHAPES] ?? "citadine" },
    });
  });
}

export const mockVehicleProvider: VehicleProvider = {
  id: "demo",
  async listVehicles() {
    return buildDemoVehicles(new Date());
  },
};
