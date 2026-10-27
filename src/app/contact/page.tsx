import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { GARAGE, fullAddress, mapsUrl } from "@/config/garage";
import { SimpleLeadForm } from "@/components/forms/SimpleLeadForm";
import { Hours } from "@/components/Hours";
import { GaragePhoto } from "@/components/GaragePhoto";

export const metadata: Metadata = {
  title: "Nous contacter",
  description: "Contactez P2C Automobiles à Plan de Campagne, Les Pennes-Mirabeau : téléphone, adresse et itinéraire.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="wrap doc">
      <div>
        <nav className="crumbs" aria-label="Fil d'Ariane"><Link href="/">Accueil</Link><span>›</span><span>Nous contacter</span></nav>
        <h1>Nous contacter</h1>
      </div>
      <div className="visit">
        <div className="info">
          <dl>
            <dt>Téléphone</dt><dd><a className="text-link" href={`tel:${GARAGE.phoneTel}`} style={{ fontWeight: 700 }}>{GARAGE.phone}</a> ({GARAGE.contactName})</dd>
            <dt>Adresse</dt><dd>{fullAddress}</dd>
            <dt>Horaires</dt><dd><Hours /></dd>
            {GARAGE.email && <><dt>E-mail</dt><dd><a className="text-link" href={`mailto:${GARAGE.email}`}>{GARAGE.email}</a></dd></>}
          </dl>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="btn btn-primary" href={`tel:${GARAGE.phoneTel}`}><Phone aria-hidden /> Appeler</a>
            <a className="btn btn-secondary" href={mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin aria-hidden /> Itinéraire</a>
          </div>
        </div>
        <div className="ph"><GaragePhoto sizes="(max-width: 860px) 100vw, 420px" /></div>
      </div>
      <div>
        <h2>Écrivez-nous</h2>
        <p className="muted" style={{ marginBottom: 16 }}>Une question, une demande de rendez-vous : on vous répond au plus vite.</p>
        <div className="form-card"><SimpleLeadForm type="contact" /></div>
      </div>
    </div>
  );
}
