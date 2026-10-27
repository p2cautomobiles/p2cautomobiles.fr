import { z } from "zod";

/** Schémas partagés navigateur / serveur. Le serveur revalide toujours : la validation navigateur n'est qu'un confort. */

export const LEAD_TYPES = ["contact", "info", "rdv", "essai", "reprise", "recherche"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

export const LEAD_LABELS: Record<LeadType, string> = {
  contact: "Contact",
  info: "Demande d'information",
  rdv: "Prise de rendez-vous",
  essai: "Demande d'essai",
  reprise: "Reprise de véhicule",
  recherche: "Recherche personnalisée",
};

const text = (max: number) => z.string().trim().max(max, `${max} caractères maximum.`);
const optionalText = (max: number) => text(max).optional().transform((v) => (v ? v : undefined));

export const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s.\-()]/g, ""))
  .refine((v) => /^(?:\+33|0033|0)[1-9]\d{8}$/.test(v), "Indiquez un numéro français valide, par exemple 06 12 34 56 78.");

export const contactFields = {
  name: text(80).min(2, "Indiquez votre nom."),
  phone: phoneSchema,
  email: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => !v || z.email().safeParse(v).success, "Cette adresse e-mail n'est pas valide."),
  message: optionalText(2000),
};

const vehicleRef = { vehicleSlug: text(200).min(1, "Véhicule manquant.") };
const availability = { availability: optionalText(200) };

const intField = (max: number, msg: string) =>
  z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v.replace(/[\s€.]/g, "") : undefined))
    .refine((v) => v === undefined || (/^\d+$/.test(v) && Number(v) <= max), msg)
    .transform((v) => (v === undefined ? undefined : Number(v)));

const CURRENT_YEAR = 2100;

export const leadSchemas = {
  contact: z.object({ ...contactFields, message: text(2000).min(5, "Écrivez votre message.") }),
  info: z.object({ ...contactFields, ...vehicleRef }),
  rdv: z.object({ ...contactFields, ...vehicleRef, ...availability }),
  essai: z.object({ ...contactFields, ...vehicleRef, ...availability }),
  recherche: z.object({
    ...contactFields,
    brands: optionalText(200),
    model: optionalText(120),
    budgetMax: intField(500_000, "Indiquez un budget en euros, par exemple 14000."),
    mileageMax: intField(1_000_000, "Indiquez un kilométrage, par exemple 80000."),
    fuel: optionalText(40),
    gearbox: optionalText(40),
  }),
  reprise: z.object({
    ...contactFields,
    ...availability,
    brand: text(60).min(1, "Indiquez la marque."),
    model: text(80).min(1, "Indiquez le modèle."),
    year: z
      .string()
      .trim()
      .refine((v) => /^\d{4}$/.test(v) && Number(v) >= 1950 && Number(v) <= CURRENT_YEAR, "Indiquez l'année, par exemple 2018.")
      .transform(Number),
    mileage: z
      .string()
      .trim()
      .transform((v) => v.replace(/[\s.]/g, ""))
      .refine((v) => /^\d+$/.test(v) && Number(v) <= 2_000_000, "Indiquez le kilométrage, par exemple 85000.")
      .transform(Number),
    fuel: optionalText(40),
    gearbox: optionalText(40),
    condition: optionalText(40),
    maintenance: optionalText(40),
    defects: optionalText(1000),
  }),
} satisfies Record<LeadType, z.ZodType>;

export type LeadData<T extends LeadType> = z.infer<(typeof leadSchemas)[T]>;
export type FieldErrors = Partial<Record<string, string>>;

export function validateLead<T extends LeadType>(type: T, values: Record<string, unknown>) {
  const r = leadSchemas[type].safeParse(values);
  if (r.success) return { ok: true as const, data: r.data as LeadData<T> };
  const errors: FieldErrors = {};
  for (const issue of r.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return { ok: false as const, errors };
}

/** Champs de la reprise par étape, pour valider étape par étape dans le navigateur. */
export const REPRISE_STEPS = [
  ["brand", "model", "year", "mileage", "fuel", "gearbox"],
  ["condition", "maintenance", "defects", "message"],
  ["name", "phone", "email", "availability"],
] as const;

export const PHOTO_RULES = { maxCount: 6, maxBytes: 1_500_000, types: ["image/jpeg", "image/png", "image/webp"] } as const;
