import "server-only";
import type { VehicleProvider } from "./types";
import { ProviderNotConfiguredError } from "./types";

/**
 * Connecteur Evialog : NON ACTIVÉ.
 *
 * Aucune documentation officielle d'export Evialog n'est disponible à ce jour.
 * Ce fichier ne fait volontairement aucun appel réseau et n'invente aucun point d'accès.
 *
 * Quand Evialog aura fourni sa méthode (API, flux XML/JSON/CSV), il faudra ici :
 * 1. lire le flux avec les identifiants de EVIALOG_FEED_URL / EVIALOG_API_KEY (côté serveur uniquement) ;
 * 2. convertir chaque annonce vers `Vehicle` (types.ts) et la valider avec `vehicleSchema` ;
 * 3. garder l'identifiant Evialog comme `externalId` stable ;
 * 4. ne jamais marquer un véhicule « vendu » parce qu'il manque temporairement dans le flux.
 * Voir docs/EVIALOG.md.
 */
export const evialogVehicleProvider: VehicleProvider = {
  id: "evialog",
  async listVehicles() {
    throw new ProviderNotConfiguredError(
      "evialog",
      "la méthode d'export officielle d'Evialog n'est pas encore connue (voir docs/EVIALOG.md).",
    );
  },
};
