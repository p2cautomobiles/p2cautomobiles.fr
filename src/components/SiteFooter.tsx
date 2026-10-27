import Link from "next/link";
import { Logo } from "./Logo";
import { GARAGE } from "@/config/garage";

export function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="cols">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="foot-logo"><Logo height={42} /></span>
            <p style={{ fontSize: 15, maxWidth: "34ch" }}>Voitures d&apos;occasion préparées et garanties, à Plan de Campagne.</p>
            <a href={`tel:${GARAGE.phoneTel}`} style={{ color: "#fff", fontWeight: 700 }}>
              {GARAGE.contactName} · {GARAGE.phone}
            </a>
          </div>
          <div>
            <h4>Le garage</h4>
            <ul>
              <li><Link href="/qui-sommes-nous">Qui sommes-nous ?</Link></li>
              <li><Link href="/contact">Nous contacter</Link></li>
              <li><Link href="/#visite">Venir au garage</Link></li>
            </ul>
          </div>
          <div>
            <h4>Véhicules</h4>
            <ul>
              <li><Link href="/vehicules">Tous nos véhicules</Link></li>
              <li><Link href="/vehicules?prix_max=15000">Moins de 15 000 €</Link></li>
              <li><Link href="/reprise">Reprise de mon véhicule</Link></li>
            </ul>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li><Link href="/services#garantie">Garantie</Link></li>
              <li><Link href="/services#financement">Crédit ou leasing</Link></li>
              <li><Link href="/services#carte-grise">Carte grise</Link></li>
              <li><Link href="/services#recherche">Recherche personnalisée</Link></li>
            </ul>
          </div>
        </div>
        <div className="legal">
          <span>© {GARAGE.name}</span>
          <span>
            <Link href="/mentions-legales">Mentions légales</Link> · <Link href="/confidentialite">Politique de confidentialité</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
