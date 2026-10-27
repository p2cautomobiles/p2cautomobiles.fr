import type { Vehicle } from "../types";

/** Toute source de véhicules (démo, Evialog, autre logiciel) implémente cette interface. */
export interface VehicleProvider {
  readonly id: "demo" | "evialog";
  /** Retourne le stock complet, véhicules vendus récents compris. */
  listVehicles(): Promise<Vehicle[]>;
}

export class ProviderNotConfiguredError extends Error {
  constructor(provider: string, detail: string) {
    super(`Le fournisseur de véhicules « ${provider} » n'est pas configuré : ${detail}`);
    this.name = "ProviderNotConfiguredError";
  }
}
