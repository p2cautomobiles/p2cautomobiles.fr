import { describe, expect, it } from "vitest";
import { validateLead } from "./schema";
import { looksLikeBot, rateLimit, MIN_FILL_MS } from "./spam";
import { sniffImageType, readPhotos } from "./photos";
import { buildLeadEmail } from "./message";

const contact = { name: "Marie Dupont", phone: "06 12 34 56 78" };

describe("validation des demandes", () => {
  it("accepte un numéro avec espaces, points ou +33", () => {
    for (const phone of ["06 12 34 56 78", "06.12.34.56.78", "+33 6 12 34 56 78"]) {
      expect(validateLead("info", { ...contact, phone, vehicleSlug: "x" }).ok).toBe(true);
    }
  });
  it("refuse un numéro invalide et un e-mail invalide, avec un message par champ", () => {
    const r = validateLead("info", { name: "Marie", phone: "123", email: "pas-un-mail", vehicleSlug: "x" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.phone).toMatch(/numéro/);
      expect(r.errors.email).toMatch(/e-mail/);
    }
  });
  it("exige un message pour le contact général", () => {
    const r = validateLead("contact", contact);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.message).toBeDefined();
  });
  it("convertit année et kilométrage de la reprise en nombres", () => {
    const r = validateLead("reprise", { ...contact, brand: "Peugeot", model: "208", year: "2018", mileage: "85 000" });
    expect(r.ok && r.data).toMatchObject({ year: 2018, mileage: 85000 });
  });
  it("refuse une année de reprise invalide", () => {
    const r = validateLead("reprise", { ...contact, brand: "Peugeot", model: "208", year: "18", mileage: "85000" });
    expect(!r.ok && r.errors.year).toBeTruthy();
  });
  it("lit un budget écrit avec espaces et symbole euro", () => {
    const r = validateLead("recherche", { ...contact, budgetMax: "14 000 €" });
    expect(r.ok && r.data.budgetMax).toBe(14000);
  });
});

describe("anti-spam", () => {
  const now = 1_000_000;
  it("repère le champ piège rempli", () => {
    expect(looksLikeBot({ website: "http://spam", startedAt: now - 10_000 }, now)).toBe(true);
  });
  it("repère un envoi trop rapide ou sans horodatage", () => {
    expect(looksLikeBot({ website: "", startedAt: now - (MIN_FILL_MS - 1) }, now)).toBe(true);
    expect(looksLikeBot({ website: "", startedAt: "" }, now)).toBe(true);
  });
  it("laisse passer un humain", () => {
    expect(looksLikeBot({ website: "", startedAt: now - 20_000 }, now)).toBe(false);
  });
  it("limite le nombre d'envois par adresse", () => {
    const key = `test-${Math.random()}`;
    const results = Array.from({ length: 6 }, () => rateLimit(key, { max: 5, windowMs: 60_000 }, now));
    expect(results).toEqual([true, true, true, true, true, false]);
    expect(rateLimit(key, { max: 5, windowMs: 60_000 }, now + 61_000)).toBe(true);
  });
});

describe("photos", () => {
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0]);
  it("reconnaît le contenu réel du fichier", () => {
    expect(sniffImageType(jpeg)).toBe("image/jpeg");
    expect(sniffImageType(new TextEncoder().encode("<script>alert(1)</script>"))).toBeNull();
  });
  it("refuse un faux fichier image", async () => {
    const fake = new File(["<?php echo 1; ?>"], "photo.jpg", { type: "image/jpeg" });
    expect((await readPhotos([fake])).ok).toBe(false);
  });
  it("refuse plus de 6 photos", async () => {
    const files = Array.from({ length: 7 }, (_, i) => new File([jpeg], `p${i}.jpg`, { type: "image/jpeg" }));
    expect((await readPhotos(files)).ok).toBe(false);
  });
  it("renomme les photos acceptées", async () => {
    const r = await readPhotos([new File([jpeg], "../../etc/passwd.jpg", { type: "image/jpeg" })]);
    expect(r.ok && r.photos[0].filename).toBe("photo-1.jpg");
  });
});

describe("e-mail envoyé au garage", () => {
  it("contient la référence du véhicule et échappe le HTML saisi", () => {
    const mail = buildLeadEmail(
      "essai",
      { name: "<b>Marie</b>", phone: "0612345678", message: "<img src=x onerror=alert(1)>" },
      { ref: "DEMO-002", title: "Renault Clio V", price: "14 900 €", url: "https://exemple.fr/vehicules/clio" },
      0,
    );
    expect(mail.subject).toContain("réf. DEMO-002");
    expect(mail.text).toContain("Référence : DEMO-002");
    expect(mail.html).not.toContain("<img src=x");
    expect(mail.html).toContain("&lt;b&gt;Marie&lt;/b&gt;");
  });
});
