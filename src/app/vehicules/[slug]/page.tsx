import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Repeat, ShieldCheck } from "lucide-react";
import { VehicleLeadActions } from "@/components/forms/VehicleLeadActions";
import { Gallery } from "@/components/Gallery";
import { ShareButton } from "@/components/ShareButton";
import { VehicleCard } from "@/components/VehicleCard";
import { photoCount } from "@/components/VehiclePhoto";
import { JsonLd, vehicleJsonLd } from "@/components/JsonLd";
import { GARAGE, SITE_URL } from "@/config/garage";
import { getPublicVehicles, getVehicleBySlug } from "@/lib/vehicles/service";
import { similarVehicles } from "@/lib/vehicles/filters";
import { formatKm, formatMonth, formatPrice } from "@/lib/format";

export async function generateStaticParams() {
  return (await getPublicVehicles()).map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/vehicules/[slug]">): Promise<Metadata> {
  const v = await getVehicleBySlug((await params).slug);
  if (!v) return { title: "Véhicule introuvable" };
  const name = `${v.brand} ${v.model}${v.version ? ` ${v.version}` : ""}`;
  const facts = [String(v.year), formatKm(v.mileageKm), v.fuel, v.gearbox].filter(Boolean).join(", ");
  return {
    title: `${name} d'occasion, ${formatPrice(v.priceEur)}`,
    description: `${name}, ${facts}. ${formatPrice(v.priceEur)}. Chaque voiture est garantie. À voir chez P2C Automobiles, Plan de Campagne.`,
    alternates: { canonical: `/vehicules/${v.slug}` },
    // Les exemples de démonstration ne doivent pas être indexés.
    robots: v.source === "demo" ? { index: false, follow: true } : undefined,
    openGraph: { title: name, images: v.photos[0] ? [v.photos[0].url] : undefined },
  };
}

/**
 * La page attend son véhicule avant de répondre, pour qu'une annonce supprimée renvoie un vrai 404
 * (et non une page « introuvable » en 200). Les fiches connues restent prégénérées via generateStaticParams.
 */
export const instant = false;

export default async function VehiclePage({ params }: PageProps<"/vehicules/[slug]">) {
  const { slug } = await params;
  const [v, all] = await Promise.all([getVehicleBySlug(slug), getPublicVehicles()]);
  if (!v) notFound();

  const sold = v.status === "sold";
  const reserved = v.status === "reserved";
  const tel = `tel:${GARAGE.phoneTel}`;
  const rows: [string, string | undefined][] = [
    ["Marque", v.brand],
    ["Modèle", v.model],
    ["Finition / version", v.version],
    ["Mise en circulation", v.firstRegistration ? formatMonth(v.firstRegistration) : String(v.year)],
    ["Kilométrage", formatKm(v.mileageKm)],
    ["Énergie", v.fuel],
    ["Boîte de vitesses", v.gearbox],
    ["Puissance", v.powerHp ? `${v.powerHp} ch` : undefined],
    ["Carrosserie", v.body],
    ["Couleur", v.color],
    ["Référence", v.externalId],
  ];

  return (
    <div className="wrap">
      {v.source !== "demo" && <JsonLd data={vehicleJsonLd(v, `${SITE_URL}/vehicules/${v.slug}`)} />}
      <div className="cat-head" style={{ paddingBottom: 16 }}>
        <nav className="crumbs" aria-label="Fil d'Ariane">
          <Link href="/">Accueil</Link><span>›</span><Link href="/vehicules">Nos véhicules</Link><span>›</span><span>{v.brand} {v.model}</span>
        </nav>
      </div>

      <div className="vd">
        <Gallery vehicle={v} count={photoCount(v)} />
        <div className="vd-side">
          <div>
            <h1>{v.brand} {v.model}</h1>
            {v.version && <p className="ver">{v.version}</p>}
          </div>
          <div className="price num">{formatPrice(v.priceEur)}<small>TTC</small></div>
          <dl className="keyfacts num" style={{ margin: 0 }}>
            <div><dt>Année</dt><dd>{v.year}</dd></div>
            <div><dt>Kilométrage</dt><dd>{formatKm(v.mileageKm)}</dd></div>
            {v.fuel && <div><dt>Énergie</dt><dd>{v.fuel}</dd></div>}
            {v.gearbox && <div><dt>Boîte</dt><dd>{v.gearbox}</dd></div>}
          </dl>

          {sold ? (
            <div className="sold-box">
              <strong>Ce véhicule a été vendu.</strong>
              <p className="muted" style={{ fontSize: 14.5 }}>Voici des véhicules proches encore disponibles.</p>
              <a className="link" href="#similaires">Voir les véhicules similaires <ArrowRight size={16} aria-hidden /></a>
            </div>
          ) : (
            <>
              {reserved && <div className="notice">Ce véhicule est réservé. Appelez-nous pour être prévenu s&apos;il redevient disponible.</div>}
              <VehicleLeadActions slug={v.slug} refId={v.externalId} title={`${v.brand} ${v.model}`} tel={tel} reserved={reserved} />
            </>
          )}

          <div className="cta-minor">
            {!sold && <Link href="/reprise"><Repeat aria-hidden /> Faire reprendre mon véhicule</Link>}
            <ShareButton title={`${v.brand} ${v.model} · P2C Automobiles`} />
          </div>
          {!sold && (
            <>
              <p className="warranty-note"><ShieldCheck aria-hidden /> Chaque voiture est garantie.</p>
              <p className="muted" style={{ fontSize: 14.5 }}>Un financement est possible. Contactez-nous pour étudier votre projet.</p>
            </>
          )}
        </div>
      </div>

      <div className="vd-body">
        <div>
          {v.description.length > 0 && (
            <section><h2>Description</h2><div className="desc">{v.description.map((p, i) => <p key={i}>{p}</p>)}</div></section>
          )}
          {v.equipment.length > 0 && (
            <section><h2>Équipements</h2><ul className="equip">{v.equipment.map((e) => <li key={e}>{e}</li>)}</ul></section>
          )}
        </div>
        <div>
          <section>
            <h2>Caractéristiques</h2>
            <table className="spec-table num">
              <tbody>
                {rows.filter(([, x]) => x).map(([k, x]) => <tr key={k}><th scope="row">{k}</th><td>{x}</td></tr>)}
              </tbody>
            </table>
          </section>
          <section>
            <h2>Garantie</h2>
            <p style={{ fontSize: 15.5 }}>{GARAGE.warranty.parts.join(", ").replace(/, ([^,]*)$/, " et $1")}, {GARAGE.warranty.scope}, par {GARAGE.warranty.provider}.</p>
            <p className="muted" style={{ fontSize: 14.5, marginTop: 6 }}>
              {GARAGE.warranty.duration ? `Durée : ${GARAGE.warranty.duration}.` : <>Durée et conditions précisées pour ce véhicule. <span className="todo">durée à renseigner</span></>}
            </p>
          </section>
        </div>
      </div>

      <section id="similaires" style={{ paddingTop: 8 }}>
        <div className="section-head"><h2>Véhicules similaires</h2></div>
        <div className="grid-cars">{similarVehicles(all, v).map((o) => <VehicleCard key={o.externalId} vehicle={o} />)}</div>
      </section>

    </div>
  );
}
