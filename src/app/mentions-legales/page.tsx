import type { Metadata } from "next";
import Link from "next/link";
import { ToFill } from "@/components/ToFill";
import { GARAGE, fullAddress } from "@/config/garage";

export const metadata: Metadata = { title: "Mentions légales", alternates: { canonical: "/mentions-legales" } };

export default function LegalPage() {
  const L = GARAGE.legal;
  return (
    <div className="wrap doc">
      <div>
        <nav className="crumbs" aria-label="Fil d'Ariane"><Link href="/">Accueil</Link><span>›</span><span>Mentions légales</span></nav>
        <h1>Mentions légales</h1>
      </div>
      <p className="notice">Texte à faire relire avant la mise en ligne. Les champs entre crochets restent à compléter.</p>
      <div>
        <h2>Éditeur du site</h2>
        <p>Le site est édité par {L.company}, exerçant sous le nom commercial {GARAGE.name}, {L.form} au capital de {L.capital}, dont le siège social est situé {fullAddress}.</p>
        <p>Immatriculée sous le numéro {L.rcs}. Numéro de TVA intracommunautaire : {L.vat}.</p>
        <p>Téléphone : {GARAGE.phone}. E-mail : <ToFill value={GARAGE.email} label="adresse e-mail" />.</p>
        <p>Directrice de la publication : {L.publicationDirector}.</p>
      </div>
      <div>
        <h2>Hébergement</h2>
        <p>Le site est hébergé par <ToFill value={L.host} label="nom, adresse et téléphone de l'hébergeur" />.</p>
      </div>
      <div>
        <h2>Médiation de la consommation</h2>
        <p>Conformément aux articles L.612-1 et suivants du Code de la consommation, le client peut recourir gratuitement au médiateur de la consommation suivant : <ToFill value={L.consumerMediator} label="nom et coordonnées du médiateur" />.</p>
      </div>
      <div>
        <h2>Annonces et informations des véhicules</h2>
        <p>Les caractéristiques, équipements et prix des véhicules sont présentés avec soin à partir de nos données de stock. Ils sont confirmés au moment de la vente. Les conditions de garantie et de financement applicables sont remises au client avant tout engagement.</p>
      </div>
      <div>
        <h2>Propriété intellectuelle</h2>
        <p>Les textes, photographies, logos et éléments graphiques de ce site appartiennent à {L.company} ou sont utilisés avec autorisation. Toute reproduction sans accord préalable est interdite.</p>
      </div>
      <div>
        <h2>Données personnelles</h2>
        <p>Le traitement de vos données est décrit dans notre <Link href="/confidentialite">politique de confidentialité</Link>.</p>
      </div>
    </div>
  );
}
