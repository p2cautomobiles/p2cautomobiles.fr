"use client";

import { useRef, useState } from "react";
import { CalendarDays, CarFront, Mail, Phone, X } from "lucide-react";
import { SimpleLeadForm } from "./SimpleLeadForm";

type Kind = "info" | "rdv" | "essai";
const TITLES: Record<Kind, string> = { info: "Demander des informations", rdv: "Prendre rendez-vous", essai: "Demander un essai" };

/**
 * Actions de la fiche véhicule : appel, demande d'infos, rendez-vous et essai (ces deux derniers fermés si réservé).
 * Inclut la barre de contact fixe sur mobile ; tous les boutons ouvrent la même fenêtre de formulaire.
 */
export function VehicleLeadActions({ slug, refId, title, tel, reserved }: { slug: string; refId: string; title: string; tel: string; reserved: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [kind, setKind] = useState<Kind | null>(null);
  const [round, setRound] = useState(0);

  const open = (k: Kind) => {
    setKind(k);
    setRound((r) => r + 1);
    dialog.current?.showModal();
  };
  const call = <a className="btn btn-primary" href={tel}><Phone aria-hidden /> Appeler</a>;
  const info = <button className="btn btn-secondary" type="button" onClick={() => open("info")}><Mail aria-hidden /> Demander des infos</button>;

  return (
    <>
      <div className="cta-stack">
        <div className="pair">{call}{info}</div>
        {!reserved && (
          <div className="pair">
            <button className="btn btn-secondary" type="button" onClick={() => open("rdv")}><CalendarDays aria-hidden /> Prendre rendez-vous</button>
            <button className="btn btn-secondary" type="button" onClick={() => open("essai")}><CarFront aria-hidden /> Demander un essai</button>
          </div>
        )}
      </div>
      <div className="mobile-bar">{call}{info}</div>

      <dialog ref={dialog} className="lead-dialog" aria-labelledby="lead-dialog-title" onClose={() => setKind(null)} onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
        <div className="box">
          <div className="top">
            <div>
              <h2 id="lead-dialog-title">{kind ? TITLES[kind] : ""}</h2>
              <p className="muted" style={{ fontSize: 14.5, marginTop: 4 }}>{title} · réf. {refId}</p>
            </div>
            <button className="icon-btn" type="button" aria-label="Fermer" onClick={() => dialog.current?.close()}><X size={20} aria-hidden /></button>
          </div>
          {kind && <SimpleLeadForm key={`${kind}-${round}`} type={kind} vehicleSlug={slug} vehicleRef={refId} />}
        </div>
      </dialog>
    </>
  );
}
