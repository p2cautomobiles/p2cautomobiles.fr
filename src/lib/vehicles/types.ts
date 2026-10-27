import { z } from "zod";

/** Modèle interne normalisé, indépendant de la source (Evialog, démo, autre). */
export const vehicleStatusSchema = z.enum(["available", "reserved", "sold"]);

export const vehiclePhotoSchema = z.object({
  url: z.url(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: z.string().optional(),
});

export const vehicleSchema = z.object({
  /** Identifiant stable fourni par la source, jamais réattribué. */
  externalId: z.string().min(1),
  source: z.enum(["demo", "evialog"]),
  slug: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  version: z.string().optional(),
  priceEur: z.number().int().positive(),
  mileageKm: z.number().int().nonnegative(),
  year: z.number().int().min(1950).max(2100),
  /** Format AAAA-MM. */
  firstRegistration: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  fuel: z.string().optional(),
  gearbox: z.string().optional(),
  powerHp: z.number().int().positive().optional(),
  body: z.string().optional(),
  color: z.string().optional(),
  description: z.array(z.string()).default([]),
  equipment: z.array(z.string()).default([]),
  photos: z.array(vehiclePhotoSchema).default([]),
  status: vehicleStatusSchema,
  soldAt: z.iso.datetime().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  syncedAt: z.iso.datetime().optional(),
  /** Rendu des visuels de démonstration uniquement (silhouette dessinée). */
  demoArt: z.object({ paint: z.string(), shape: z.enum(["citadine", "suv", "compacte", "berline", "break"]) }).optional(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;
export type VehicleStatus = z.infer<typeof vehicleStatusSchema>;

/** Véhicule enrichi pour l'affichage public. */
export type PublicVehicle = Vehicle & { isNew: boolean };
