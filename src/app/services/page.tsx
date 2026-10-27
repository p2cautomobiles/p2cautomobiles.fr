import type { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/config/services";
import { GARAGE } from "@/config/garage";
import { SimpleLeadForm } from "@/components/forms/SimpleLeadForm";

export const metadata: Metadata = {
  title: "Nos services",
  description: "Achat, garantie, crédit ou leasing, reprise, dépôt-vente, recherche personnalisée, carte grise, entretien, contrôle technique et pressing, à Plan de Campagne.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="wrap">
      <div className="page-hero">
        <nav className="crumbs" aria-label="Fil d'Ariane"><Link href="/">Accueil</Link><span>›</span><span>Nos services</span></nav>
        <h1>Tout ce qu&apos;il faut autour de votre voiture.</h1>
        <p className="lead">
          De la recherche à l&apos;entretien, un seul interlocuteur. Appelez {GARAGE.contactName} au{" "}
          <a className="text-link" href={`tel:${GARAGE.phoneTel}`} style={{ fontWeight: 700 }}>{GARAGE.phone}</a> pour en parler.
        </p>
        <nav className="svc-jump" aria-label="Services">
          {SERVICES.map((s) => <a key={s.id} href={`#${s.id}`}>{s.title}</a>)}
        </nav>
      </div>
      <div style={{ paddingBottom: 40 }}>
        {SERVICES.map((s) => (
          <div className="svc-detail" id={s.id} key={s.id}>
            <h2>{s.title}</h2>
            <div className="txt">
              {s.body.map((p) => <p key={p}>{p}</p>)}
              {s.id === "reprise" && <p><Link className="link" href="/reprise">Décrire mon véhicule</Link></p>}
              {s.id === "recherche" && (
                <div className="form-card" style={{ marginTop: 10 }}>
                  <h3 style={{ fontSize: 20 }}>Décrivez la voiture que vous cherchez</h3>
                  <SimpleLeadForm type="recherche" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
