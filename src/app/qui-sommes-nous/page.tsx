import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import { GARAGE } from "@/config/garage";
import { GaragePhoto } from "@/components/GaragePhoto";

export const metadata: Metadata = {
  title: "Qui sommes-nous ?",
  description: "P2C Automobiles, une équipe d'experts de l'automobile à Plan de Campagne, avec un réseau de professionnels pour trouver la bonne voiture et vous suivre après l'achat.",
  alternates: { canonical: "/qui-sommes-nous" },
};

export default function AboutPage() {
  return (
    <div className="wrap">
      <div className="page-hero">
        <nav className="crumbs" aria-label="Fil d'Ariane"><Link href="/">Accueil</Link><span>›</span><span>Qui sommes-nous ?</span></nav>
        <h1>Des passionnés d&apos;automobile, installés à Plan de Campagne depuis {GARAGE.since}.</h1>
        <p className="lead">Chez P2C Automobiles, on vend des voitures qu&apos;on connaît, à des gens qu&apos;on prend le temps d&apos;écouter.</p>
      </div>
      <section style={{ paddingTop: 24 }}>
        <div className="about">
          <div className="text">
            <p>P2C Automobiles, c&apos;est une équipe d&apos;experts de l&apos;automobile installée dans la zone de Plan de Campagne depuis {GARAGE.since}. Au fil des années, nous avons construit un vrai réseau de contacts dans le métier.</p>
            <p>Ce réseau nous permet de trouver des véhicules difficiles à dénicher, notamment de petites voitures attractives à moins de 15&nbsp;000&nbsp;€, et de vous accompagner dans la durée.</p>
            <p>Notre travail ne s&apos;arrête pas à la vente. Nous suivons nos clients pendant leur recherche, puis après l&apos;achat : entretien, réparations si besoin, contrôle technique, carte grise.</p>
            <p><b>{GARAGE.contactName} et son équipe</b> font le maximum pour vous apporter tous les services possibles autour de votre future voiture.</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 }}>
              <a className="btn btn-primary" href={`tel:${GARAGE.phoneTel}`}><Phone aria-hidden /> Appeler {GARAGE.contactName}</a>
              <Link className="btn btn-secondary" href="/vehicules">Voir nos véhicules</Link>
            </div>
          </div>
          <div style={{ display: "grid", gap: 24 }}>
            <div className="photo-slot photo-real"><GaragePhoto sizes="(max-width: 900px) 100vw, 520px" priority /></div>
            <div className="facts">
              <div><b>Depuis {GARAGE.since}</b><span>à Plan de Campagne, Les Pennes-Mirabeau</span></div>
              <div><b>Un réseau de professionnels</b><span>pour trouver la bonne voiture, même rare</span></div>
              <div><b>Avant et après l&apos;achat</b><span>recherche, garantie, entretien, réparation</span></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
