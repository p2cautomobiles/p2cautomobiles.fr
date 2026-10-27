"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitLead, type LeadState } from "@/app/actions/leads";
import { validateLead, type FieldErrors, type LeadType } from "@/lib/leads/schema";

/**
 * Gestion commune des formulaires : validation dans le navigateur avec les mêmes règles que le serveur,
 * envoi via l'action serveur, erreurs par champ, et confirmation uniquement si le serveur a réellement transmis.
 */
export function useLeadForm(type: LeadType, opts: { onlyFields?: readonly string[] } = {}) {
  const [state, dispatch] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const [pending, start] = useTransition();
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);
  const startedAt = useRef(0);
  const statusRef = useRef<HTMLDivElement>(null);

  // Horodatage posé après l'affichage : sert au délai minimal anti-robot.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  const errors: FieldErrors = clientErrors ?? (state.status === "error" ? state.fieldErrors ?? {} : {});

  /** Valide les champs visibles ; renvoie true si tout est bon. */
  const check = (form: HTMLFormElement, only?: readonly string[]) => {
    const values = Object.fromEntries([...new FormData(form).entries()].filter(([, v]) => typeof v === "string"));
    const r = validateLead(type, values);
    const errs = r.ok ? {} : Object.fromEntries(Object.entries(r.errors).filter(([k]) => !only || only.includes(k)));
    setClientErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) (form.elements.namedItem(first) as HTMLElement | null)?.focus();
    return !first;
  };

  const submit = (form: HTMLFormElement, extra?: (fd: FormData) => void) => {
    if (!check(form, opts.onlyFields)) return;
    setClientErrors(null);
    const fd = new FormData(form);
    fd.set("leadType", type);
    fd.set("startedAt", String(startedAt.current));
    extra?.(fd);
    start(() => dispatch(fd));
  };

  return { state, pending, errors, check, submit, statusRef, setClientErrors };
}

/** Champ piège invisible pour les robots. */
export function Honeypot() {
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
      <label>Ne pas remplir ce champ<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
    </div>
  );
}

type FieldProps = { name: string; label: string; errors: FieldErrors; hint?: string; optional?: boolean; children?: ReactNode };

export function Field({ name, label, errors, hint, optional, children, ...input }: FieldProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `f-${name}`;
  const err = errors[name];
  return (
    <div className="field">
      <label htmlFor={id}>{label}{optional && <span className="muted" style={{ fontWeight: 400 }}> (facultatif)</span>}</label>
      {children ?? <input id={id} name={name} aria-invalid={!!err} aria-describedby={err ? `${id}-err` : hint ? `${id}-hint` : undefined} {...input} />}
      {hint && !err && <span className="hint" id={`${id}-hint`}>{hint}</span>}
      {err && <span className="err" id={`${id}-err`}>{err}</span>}
    </div>
  );
}

export function TextArea({ name, label, errors, optional, ...rest }: FieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const err = errors[name];
  return (
    <Field name={name} label={label} errors={errors} optional={optional}>
      <textarea id={`f-${name}`} name={name} aria-invalid={!!err} aria-describedby={err ? `f-${name}-err` : undefined} {...rest} />
    </Field>
  );
}

export function Select({ name, label, errors, options, optional, placeholder = "Choisir" }: FieldProps & { options: readonly string[]; placeholder?: string }) {
  const err = errors[name];
  return (
    <Field name={name} label={label} errors={errors} optional={optional}>
      <select id={`f-${name}`} name={name} defaultValue="" aria-invalid={!!err}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </Field>
  );
}

export function ContactFields({ errors, withAvailability }: { errors: FieldErrors; withAvailability?: boolean }) {
  return (
    <>
      <Field name="name" label="Nom et prénom" errors={errors} autoComplete="name" required />
      <div className="form-grid">
        <Field name="phone" label="Téléphone" errors={errors} type="tel" inputMode="tel" autoComplete="tel" required />
        <Field name="email" label="E-mail" errors={errors} type="email" autoComplete="email" optional />
      </div>
      {withAvailability && <Field name="availability" label="Vos disponibilités" errors={errors} placeholder="Ex. samedi matin" optional />}
    </>
  );
}

export function FormStatus({ state, statusRef }: { state: LeadState; statusRef: React.RefObject<HTMLDivElement | null> }) {
  if (state.status !== "error") return null;
  return <div ref={statusRef} tabIndex={-1} className="notice notice-error" role="alert">{state.message}</div>;
}

export function Success({ statusRef, children }: { statusRef: React.RefObject<HTMLDivElement | null>; children?: ReactNode }) {
  return (
    <div ref={statusRef} tabIndex={-1} className="success" role="status">
      <CheckCircle2 size={28} aria-hidden />
      <div>
        <strong>Demande envoyée.</strong>
        <p>{children ?? "Nous vous recontactons au plus vite."}</p>
      </div>
    </div>
  );
}

export function SubmitButton({ pending, children = "Envoyer ma demande" }: { pending: boolean; children?: ReactNode }) {
  return (
    <button className="btn btn-primary" type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? "Envoi en cours…" : children}
    </button>
  );
}

export function PrivacyNote() {
  return (
    <p className="muted" style={{ fontSize: 13 }}>
      Vos coordonnées servent uniquement à traiter votre demande. <Link className="text-link" href="/confidentialite">Politique de confidentialité</Link>
    </p>
  );
}
