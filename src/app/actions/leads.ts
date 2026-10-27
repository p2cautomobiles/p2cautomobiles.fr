"use server";

import { headers } from "next/headers";
import { GARAGE, SITE_URL } from "@/config/garage";
import { LEAD_TYPES, validateLead, type FieldErrors, type LeadType } from "@/lib/leads/schema";
import { looksLikeBot, rateLimit } from "@/lib/leads/spam";
import { buildLeadEmail, type LeadVehicle } from "@/lib/leads/message";
import { sendLeadEmail } from "@/lib/leads/mailer";
import { readPhotos } from "@/lib/leads/photos";
import { getVehicleBySlug } from "@/lib/vehicles/service";
import { formatPrice } from "@/lib/format";

export type LeadState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: FieldErrors };

const CALL_US = `Vous pouvez aussi appeler ${GARAGE.contactName} au ${GARAGE.phone}.`;

/** Point d'entrée unique de tous les formulaires. Toujours revalidé ici : une action serveur peut être appelée directement. */
export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const type = String(formData.get("leadType")) as LeadType;
  if (!LEAD_TYPES.includes(type)) return { status: "error", message: "Formulaire inconnu." };

  if (looksLikeBot({ website: formData.get("website"), startedAt: formData.get("startedAt") })) {
    return { status: "error", message: `La demande n'a pas pu être envoyée. Patientez quelques secondes et réessayez. ${CALL_US}` };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "inconnue";
  if (!rateLimit(`lead:${ip}`)) {
    return { status: "error", message: `Trop de demandes envoyées en peu de temps. Réessayez dans quelques minutes. ${CALL_US}` };
  }

  const values: Record<string, unknown> = {};
  for (const [k, v] of formData.entries()) if (typeof v === "string") values[k] = v;
  const parsed = validateLead(type, values);
  if (!parsed.ok) return { status: "error", message: "Certains champs sont à corriger.", fieldErrors: parsed.errors };
  const data = parsed.data as Record<string, unknown>;

  let vehicle: LeadVehicle | undefined;
  if (type === "info" || type === "rdv" || type === "essai") {
    const v = await getVehicleBySlug(String(data.vehicleSlug));
    if (!v) return { status: "error", message: `Ce véhicule n'est plus en ligne. ${CALL_US}` };
    if (v.status === "sold" && type !== "info") return { status: "error", message: "Ce véhicule a été vendu : les essais et rendez-vous sont fermés." };
    vehicle = { ref: v.externalId, title: `${v.brand} ${v.model}${v.version ? ` ${v.version}` : ""}`, price: formatPrice(v.priceEur), url: `${SITE_URL}/vehicules/${v.slug}` };
    delete data.vehicleSlug;
  }

  let attachments: Awaited<ReturnType<typeof readPhotos>> & { ok: true } = { ok: true, photos: [] };
  if (type === "reprise") {
    const files = formData.getAll("photos").filter((f): f is File => f instanceof File);
    const r = await readPhotos(files);
    if (!r.ok) return { status: "error", message: r.error, fieldErrors: { photos: r.error } };
    attachments = r;
  }

  const mail = buildLeadEmail(type, data, vehicle, attachments.photos.length);
  const sent = await sendLeadEmail({ ...mail, replyTo: typeof data.email === "string" ? data.email : undefined, attachments: attachments.photos });
  if (!sent.ok) {
    return {
      status: "error",
      message:
        sent.reason === "not_configured"
          ? `L'envoi en ligne n'est pas encore activé : votre demande n'a pas été transmise. ${CALL_US}`
          : `Votre demande n'a pas pu être transmise, à cause d'un problème technique de notre côté. Réessayez dans un instant. ${CALL_US}`,
    };
  }
  return { status: "success" };
}
