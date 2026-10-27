"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Trash2 } from "lucide-react";
import { PHOTO_RULES, REPRISE_STEPS } from "@/lib/leads/schema";
import { ContactFields, Field, FormStatus, Honeypot, PrivacyNote, Select, SubmitButton, Success, TextArea, useLeadForm } from "./FormKit";

const FUELS = ["Essence", "Diesel", "Hybride", "Électrique", "GPL", "Autre"] as const;
const GEARBOXES = ["Manuelle", "Automatique"] as const;
const CONDITIONS = ["Très bon état", "Bon état", "État correct", "À rafraîchir"] as const;
const MAINTENANCE = ["Carnet complet", "Factures en partie", "Pas d'historique", "Je ne sais pas"] as const;
const STEP_TITLES = ["Votre véhicule", "Son état", "Vos coordonnées"];

type Photo = { file: File; url: string };

/** Réduit une photo dans le navigateur (1600 px max, JPEG) pour un envoi rapide et léger. */
async function shrink(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
  if (!blob) throw new Error("conversion");
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}

export function RepriseForm() {
  const { state, pending, errors, check, submit, statusRef, setClientErrors } = useLeadForm("reprise");
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (state.status === "success") {
    return <Success statusRef={statusRef}>Nous étudions votre véhicule et vous rappelons pour convenir d&apos;un rendez-vous.</Success>;
  }

  const addPhotos = async (list: FileList | null) => {
    if (!list?.length) return;
    setPhotoError(null);
    const room = PHOTO_RULES.maxCount - photos.length;
    if (room <= 0) return setPhotoError(`${PHOTO_RULES.maxCount} photos maximum.`);
    setBusy(true);
    const added: Photo[] = [];
    for (const f of [...list].slice(0, room)) {
      if (!f.type.startsWith("image/")) continue;
      try {
        const small = await shrink(f);
        if (small.size > PHOTO_RULES.maxBytes) continue;
        added.push({ file: small, url: URL.createObjectURL(small) });
      } catch {
        setPhotoError("Une photo n'a pas pu être lue. Essayez une photo au format JPEG ou PNG.");
      }
    }
    if (list.length > room) setPhotoError(`${PHOTO_RULES.maxCount} photos maximum : les suivantes n'ont pas été ajoutées.`);
    setPhotos((p) => [...p, ...added]);
    setBusy(false);
  };

  const next = () => {
    if (formRef.current && check(formRef.current, REPRISE_STEPS[step])) {
      setClientErrors(null);
      setStep((s) => s + 1);
      formRef.current.querySelector<HTMLElement>(".wizard-head")?.focus();
    }
  };

  // Si le serveur signale une erreur sur un champ d'une étape précédente, on y retourne.
  const serverErrorStep = state.status === "error" && state.fieldErrors
    ? REPRISE_STEPS.findIndex((fields) => fields.some((f) => state.fieldErrors?.[f]))
    : -1;
  const shown = serverErrorStep >= 0 && serverErrorStep < step && !pending ? serverErrorStep : step;

  return (
    <form
      ref={formRef}
      className="lead-form form-card"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (shown < 2) return next();
        submit(e.currentTarget, (fd) => photos.forEach((p) => fd.append("photos", p.file)));
      }}
    >
      <Honeypot />
      <div className="wizard-head" tabIndex={-1}>
        <ol className="steps" aria-label="Étapes">
          {STEP_TITLES.map((t, i) => (
            <li key={t} aria-current={i === shown ? "step" : undefined} className={i < shown ? "done" : undefined}>
              <span>{i + 1}</span>{t}
            </li>
          ))}
        </ol>
      </div>

      <fieldset hidden={shown !== 0}>
        <legend className="sr">Votre véhicule</legend>
        <div className="form-grid">
          <Field name="brand" label="Marque" errors={errors} placeholder="Ex. Peugeot" required />
          <Field name="model" label="Modèle" errors={errors} placeholder="Ex. 208" required />
          <Field name="year" label="Année" errors={errors} inputMode="numeric" placeholder="Ex. 2018" required />
          <Field name="mileage" label="Kilométrage" errors={errors} inputMode="numeric" placeholder="Ex. 85000" required />
          <Select name="fuel" label="Carburant" errors={errors} options={FUELS} optional />
          <Select name="gearbox" label="Boîte de vitesses" errors={errors} options={GEARBOXES} optional />
        </div>
      </fieldset>

      <fieldset hidden={shown !== 1}>
        <legend className="sr">État du véhicule</legend>
        <div className="form-grid">
          <Select name="condition" label="État général" errors={errors} options={CONDITIONS} optional />
          <Select name="maintenance" label="Historique d'entretien" errors={errors} options={MAINTENANCE} optional />
        </div>
        <TextArea name="defects" label="Défauts éventuels" errors={errors} rows={3} placeholder="Rayures, voyant allumé, pneus à changer…" optional />
        <TextArea name="message" label="Commentaires" errors={errors} rows={3} optional />
        <div className="field">
          <span className="lbl">Photos <span className="muted" style={{ fontWeight: 400 }}>(facultatif, {PHOTO_RULES.maxCount} maximum)</span></span>
          <div className="photo-grid">
            {photos.map((p, i) => (
              <div key={p.url} className="photo-thumb">
                {/* Aperçu local d'un fichier choisi par le visiteur : next/image ne s'applique pas aux URL blob. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={`Photo ${i + 1}`} />
                <button type="button" className="icon-btn" aria-label={`Retirer la photo ${i + 1}`} onClick={() => { URL.revokeObjectURL(p.url); setPhotos((ps) => ps.filter((x) => x !== p)); }}>
                  <Trash2 size={16} aria-hidden />
                </button>
              </div>
            ))}
            {photos.length < PHOTO_RULES.maxCount && (
              <label className="photo-add">
                <ImagePlus aria-hidden />
                <span>{busy ? "Préparation…" : "Ajouter des photos"}</span>
                <input type="file" accept="image/*" multiple onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} disabled={busy} className="sr" />
              </label>
            )}
          </div>
          {(photoError || errors.photos) && <span className="err">{photoError ?? errors.photos}</span>}
        </div>
      </fieldset>

      <fieldset hidden={shown !== 2}>
        <legend className="sr">Vos coordonnées</legend>
        <ContactFields errors={errors} withAvailability />
      </fieldset>

      <FormStatus state={state} statusRef={statusRef} />
      <div className="wizard-nav">
        {shown > 0 && (
          <button type="button" className="btn btn-secondary" onClick={() => { setClientErrors(null); setStep(shown - 1); }}>
            <ArrowLeft aria-hidden /> Retour
          </button>
        )}
        {shown < 2 ? (
          <button type="submit" className="btn btn-primary">Continuer <ArrowRight aria-hidden /></button>
        ) : (
          <SubmitButton pending={pending || busy}>Envoyer ma demande</SubmitButton>
        )}
      </div>
      {shown === 2 && <PrivacyNote />}
    </form>
  );
}
