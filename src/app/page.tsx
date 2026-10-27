import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { HeroArt } from "@/components/HeroArt";
import { Hours } from "@/components/Hours";
import { GaragePhoto } from "@/components/GaragePhoto";
import { QuickSearch } from "@/components/QuickSearch";
import { VehicleCard } from "@/components/VehicleCard";
import { JsonLd, autoDealerJsonLd } from "@/components/JsonLd";
import { GARAGE, fullAddress, mapsUrl } from "@/config/garage";
import { getPublicVehicles } from "@/lib/vehicles/service";

const uniq = (xs: (string | undefined)[]) => [...new Set(xs.filter((x): x is string => !!x))].sort((a, b) => a.localeCompare(b, "fr"));

export default async function HomePage() {
  const all = await getPublicVehicles();
  const available = all.filter((v) => v.status !== "sold");
  const latest = available.filter((v) => v.status === "available").sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);
  const deals = available.filter((v) => v.status === "available" && v.priceEur < 15000).sort((a, b) => a.priceEur - b.priceEur).slice(0, 3);

  return (
    <>
      <JsonLd data={autoDealerJsonLd()} />
      <section className="hero">
        <div className="wrap">
          <div>
            <h1>Votre prochaine voiture vous attend chez <span className="hl">P2C&nbsp;Automobiles</span>.</h1>
            <p className="lead">Des occasions préparées et garanties, et une équipe qui vous accompagne avant comme après l&apos;achat.</p>
            <div className="ctas">
              <Link className="btn btn-primary" href="/vehicules">Découvrir nos véhicules <ArrowRight aria-hidden /></Link>
              <Link className="btn btn-secondary" href="#visite"><MapPin aria-hidden /> Nous rendre visite</Link>
            </div>
          </div>
          <div className="art"><HeroArt /></div>
        </div>
      </section>

      <div className="quick">
        <div className="wrap">
          <QuickSearch brands={uniq(available.map((v) => v.brand))} fuels={uniq(available.map((v) => v.fuel))} />
        </div>
      </div>

      <section>
        <div className="wrap">
          <div className="section-head">
            <h2>Arrivées récentes</h2>
            <Link className="link" href="/vehicules">Voir tous les véhicules <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <div className="grid-cars">{latest.map((v, i) => <VehicleCard key={v.externalId} vehicle={v} priority={i === 0} />)}</div>
        </div>
      </section>

      <section className="on-dark deals">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="kicker">Notre spécialité</span>
              <h2 style={{ marginTop: 8 }}>Les bonnes affaires à moins de 15&nbsp;000&nbsp;€</h2>
            </div>
            <Link className="btn btn-secondary" href="/vehicules?prix_max=15000">Voir la sélection</Link>
          </div>
          {deals.length ? (
            <div className="grid-cars">{deals.map((v) => <VehicleCard key={v.externalId} vehicle={v} />)}</div>
          ) : (
            <div className="empty">
              <h3>Rien à moins de 15 000 € cette semaine</h3>
              <p>Dites-nous ce que vous cherchez, on vous prévient dès qu&apos;une voiture arrive.</p>
              <Link className="btn btn-primary" href="/services#recherche">Demander une recherche</Link>
            </div>
          )}
        </div>
      </section>

      <div className="call-band">
        <div className="wrap">
          <div>
            <h2>Une question ? Appelez {GARAGE.contactName}.</h2>
            <p>Une voiture vous plaît, vous cherchez un modèle précis ou vous voulez faire reprendre la vôtre : on en parle de vive voix.</p>
          </div>
          <a className="phone-big" href={`tel:${GARAGE.phoneTel}`}>{GARAGE.phone}</a>
        </div>
      </div>

      <section id="visite">
        <div className="wrap">
          <div className="visit">
            <div className="info">
              <h2>Votre prochain véhicule est peut-être déjà chez nous.</h2>
              <dl>
                <dt>Adresse</dt><dd>{fullAddress}</dd>
                <dt>Horaires</dt><dd><Hours /></dd>
              </dl>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link className="btn btn-primary" href="/contact"><CalendarDays aria-hidden /> Prendre rendez-vous</Link>
                <a className="btn btn-secondary" href={mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin aria-hidden /> Itinéraire</a>
              </div>
            </div>
            <div className="ph"><GaragePhoto sizes="(max-width: 860px) 100vw, 600px" /></div>
          </div>
        </div>
      </section>
    </>
  );
}
