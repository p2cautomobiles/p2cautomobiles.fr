import type { Metadata } from "next";
import Link from "next/link";
import { RepriseForm } from "@/components/forms/RepriseForm";
import { GARAGE } from "@/config/garage";

export const metadata: Metadata = {
  title: "Reprise de votre véhicule",
  description: "Vendez ou faites reprendre votre voiture chez P2C Automobiles à Plan de Campagne : décrivez-la en ligne, nous vous faisons une proposition personnalisée.",
  alternates: { canonical: "/reprise" },
};

export default function ReprisePage() {
  return (
    <div className="wrap doc">
      <div>
        <nav className="crumbs" aria-label="Fil d'Ariane"><Link href="/">Accueil</Link><span>›</span><span>Reprise</span></nav>
        <h1>Vous souhaitez vendre ou faire reprendre votre voiture ?</h1>
      </div>
      <p style={{ fontSize: 18 }}>
        Décrivez votre véhicule en trois étapes. Nous l&apos;étudions et vous faisons une proposition personnalisée après l&apos;avoir vu :
        pas de cote automatique. Vous préférez en parler ? Appelez {GARAGE.contactName} au{" "}
        <a className="text-link" href={`tel:${GARAGE.phoneTel}`} style={{ fontWeight: 700 }}>{GARAGE.phone}</a>.
      </p>
      <RepriseForm />
    </div>
  );
}
