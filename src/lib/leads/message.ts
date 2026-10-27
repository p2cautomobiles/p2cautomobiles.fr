import { LEAD_LABELS, type LeadType } from "./schema";

export type LeadVehicle = { ref: string; title: string; price: string; url: string };

const FIELD_LABELS: Record<string, string> = {
  name: "Nom", phone: "Téléphone", email: "E-mail", availability: "Disponibilités", message: "Message",
  brands: "Marque(s)", model: "Modèle", budgetMax: "Budget maximum (€)", mileageMax: "Kilométrage maximum",
  brand: "Marque", year: "Année", mileage: "Kilométrage", fuel: "Carburant", gearbox: "Boîte de vitesses",
  condition: "État général", maintenance: "Historique d'entretien", defects: "Défauts éventuels",
};
const ORDER = ["name", "phone", "email", "availability", "brand", "brands", "model", "year", "mileage", "budgetMax", "mileageMax", "fuel", "gearbox", "condition", "maintenance", "defects", "message"];

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Construit l'e-mail envoyé au garage. Toutes les valeurs saisies sont échappées dans la version HTML. */
export function buildLeadEmail(type: LeadType, data: Record<string, unknown>, vehicle: LeadVehicle | undefined, photoCount: number) {
  const rows = ORDER.filter((k) => data[k] !== undefined && data[k] !== "").map((k) => [FIELD_LABELS[k], String(data[k])] as const);
  const subject = `[Site] ${LEAD_LABELS[type]}${vehicle ? ` · ${vehicle.title} (réf. ${vehicle.ref})` : ""} · ${String(data.name)}`;
  const vehicleLines = vehicle ? [`Véhicule : ${vehicle.title}`, `Référence : ${vehicle.ref}`, `Prix affiché : ${vehicle.price}`, `Annonce : ${vehicle.url}`, ""] : [];
  const text = [
    `${LEAD_LABELS[type]} reçue depuis le site.`,
    "",
    ...vehicleLines,
    ...rows.map(([k, v]) => `${k} : ${v}`),
    ...(photoCount ? ["", `${photoCount} photo(s) en pièce jointe.`] : []),
  ].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#171717">
<p><strong>${esc(LEAD_LABELS[type])}</strong> reçue depuis le site.</p>
${vehicle ? `<p>Véhicule : <a href="${esc(vehicle.url)}">${esc(vehicle.title)}</a><br>Référence : ${esc(vehicle.ref)}<br>Prix affiché : ${esc(vehicle.price)}</p>` : ""}
<table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="color:#5B5F66;vertical-align:top">${esc(k)}</td><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`).join("")}</table>
${photoCount ? `<p>${photoCount} photo(s) en pièce jointe.</p>` : ""}
</div>`;
  return { subject, text, html };
}
