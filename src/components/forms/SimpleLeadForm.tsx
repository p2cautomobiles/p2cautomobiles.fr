"use client";

import type { LeadType } from "@/lib/leads/schema";
import { ContactFields, FormStatus, Honeypot, PrivacyNote, Select, SubmitButton, Success, TextArea, Field, useLeadForm } from "./FormKit";

const FUELS = ["Essence", "Diesel", "Hybride", "Électrique"] as const;
const GEARBOXES = ["Manuelle", "Automatique"] as const;

/** Contact, demande sur un véhicule (info, rendez-vous, essai) et recherche personnalisée. */
export function SimpleLeadForm({ type, vehicleSlug, vehicleRef }: { type: Exclude<LeadType, "reprise">; vehicleSlug?: string; vehicleRef?: string }) {
  const { state, pending, errors, submit, statusRef } = useLeadForm(type);
  if (state.status === "success") return <Success statusRef={statusRef} />;

  const defaultMessage = vehicleRef ? `Bonjour, je suis intéressé(e) par ce véhicule (réf. ${vehicleRef}).` : undefined;

  return (
    <form
      className="lead-form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit(e.currentTarget);
      }}
    >
      <Honeypot />
      {vehicleSlug && <input type="hidden" name="vehicleSlug" value={vehicleSlug} />}
      {type === "recherche" && (
        <div className="form-grid">
          <Field name="brands" label="Marque(s) souhaitée(s)" errors={errors} placeholder="Ex. Peugeot, Renault" optional />
          <Field name="model" label="Modèle souhaité" errors={errors} optional />
          <Field name="budgetMax" label="Budget maximum (€)" errors={errors} inputMode="numeric" placeholder="Ex. 14000" optional />
          <Field name="mileageMax" label="Kilométrage maximum" errors={errors} inputMode="numeric" placeholder="Ex. 80000" optional />
          <Select name="fuel" label="Carburant" errors={errors} options={FUELS} placeholder="Indifférent" optional />
          <Select name="gearbox" label="Boîte de vitesses" errors={errors} options={GEARBOXES} placeholder="Indifférent" optional />
        </div>
      )}
      <ContactFields errors={errors} withAvailability={type === "rdv" || type === "essai"} />
      <TextArea name="message" label="Message" errors={errors} defaultValue={defaultMessage} optional={type !== "contact"} rows={4} />
      <FormStatus state={state} statusRef={statusRef} />
      <SubmitButton pending={pending} />
      <PrivacyNote />
    </form>
  );
}
