import type { Metadata } from "next";
import Link from "next/link";
import { ToFill } from "@/components/ToFill";
import { GARAGE, fullAddress } from "@/config/garage";

export const metadata: Metadata = { title: "Politique de confidentialité", alternates: { canonical: "/confidentialite" } };

export default function PrivacyPage() {
  return (
    <div className="wrap doc">
      <div>
        <nav className="crumbs" aria-label="Fil d'Ariane"><Link href="/">Accueil</Link><span>›</span><span>Politique de confidentialité</span></nav>
        <h1>Politique de confidentialité</h1>
      </div>
      <p className="notice">Texte à faire relire avant la mise en ligne, et à mettre à jour si des formulaires, une mesure d&apos;audience ou un assistant en ligne sont ajoutés.</p>
      <div>
        <h2>Responsable du traitement</h2>
        <p>{GARAGE.legal.company} ({GARAGE.name}), {fullAddress}, joignable au {GARAGE.phone} ou à <ToFill value={GARAGE.email} label="adresse e-mail" />.</p>
      </div>
      <div>
        <h2>Données collectées</h2>
        <p>Nous collectons uniquement ce que vous saisissez dans nos formulaires (contact, demande sur un véhicule, rendez-vous, essai, reprise, recherche personnalisée) :</p>
        <ul>
          <li>nom, téléphone et, si vous la donnez, adresse e-mail ;</li>
          <li>votre message et vos disponibilités ;</li>
          <li>la référence du véhicule qui vous intéresse ;</li>
          <li>pour une reprise : les informations et photos de votre véhicule ;</li>
          <li>pour une recherche : vos critères (marque, modèle, budget).</li>
        </ul>
      </div>
      <div>
        <h2>Pourquoi nous les utilisons</h2>
        <ul>
          <li>Répondre à vos demandes d&apos;information, d&apos;essai ou de rendez-vous.</li>
          <li>Étudier la reprise de votre véhicule ou rechercher une voiture pour vous.</li>
          <li>Assurer le suivi de votre achat.</li>
        </ul>
        <p>Ces traitements reposent sur les mesures précontractuelles prises à votre demande et, pour le suivi client, sur notre intérêt légitime.</p>
      </div>
      <div>
        <h2>Qui y a accès</h2>
        <p>Vos demandes sont transmises par e-mail à l&apos;équipe de {GARAGE.name} ; le site ne les conserve pas. Nos prestataires techniques (hébergement du site : <ToFill value={GARAGE.legal.host} label="hébergeur" /> ; envoi des e-mails : Resend) y accèdent seulement pour faire fonctionner le service. Vos données ne sont ni vendues ni cédées.</p>
        <p>Pour protéger les formulaires contre les abus, votre adresse IP est utilisée temporairement, en mémoire, pour limiter le nombre d&apos;envois. Elle n&apos;est pas enregistrée.</p>
      </div>
      <div>
        <h2>Combien de temps nous les gardons</h2>
        <p>Les demandes reçues par e-mail et restées sans suite sont conservées au maximum 3 ans après notre dernier échange. Les données liées à une vente sont conservées pendant la durée imposée par nos obligations légales et comptables.</p>
      </div>
      <div>
        <h2>Vos droits</h2>
        <p>Vous pouvez accéder à vos données, les rectifier, les effacer, limiter leur traitement, vous opposer à leur utilisation ou demander leur portabilité, en nous écrivant à <ToFill value={GARAGE.email} label="adresse e-mail" />. Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la CNIL (cnil.fr).</p>
      </div>
      <div>
        <h2>Cookies</h2>
        <p>Le site n&apos;utilise pas de cookies de mesure d&apos;audience ni de publicité. Si de tels outils sont ajoutés, votre consentement vous sera demandé au préalable.</p>
      </div>
    </div>
  );
}
