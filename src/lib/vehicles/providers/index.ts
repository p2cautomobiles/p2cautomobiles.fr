import "server-only";
import type { VehicleProvider } from "./types";
import { mockVehicleProvider } from "./mock";
import { evialogVehicleProvider } from "./evialog";

/** Choisit la source des véhicules via VEHICLE_PROVIDER (« demo » par défaut). */
export function getVehicleProvider(): VehicleProvider {
  return process.env.VEHICLE_PROVIDER === "evialog" ? evialogVehicleProvider : mockVehicleProvider;
}
