import { GARAGE, SITE_URL } from "@/config/garage";
import type { PublicVehicle } from "@/lib/vehicles/types";

/** Données structurées Schema.org. Le contenu est sérialisé côté serveur ; « < » est échappé. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function autoDealerJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: GARAGE.name,
    legalName: GARAGE.legal.company,
    url: SITE_URL,
    telephone: GARAGE.phoneTel,
    ...(GARAGE.email && { email: GARAGE.email }),
    image: `${SITE_URL}/garage-p2c.webp`,
    openingHoursSpecification: GARAGE.openingHoursSchema.map((h) => ({ "@type": "OpeningHoursSpecification", ...h })),
    address: {
      "@type": "PostalAddress",
      streetAddress: GARAGE.address.street,
      postalCode: GARAGE.address.postalCode,
      addressLocality: GARAGE.address.city,
      addressRegion: GARAGE.address.region,
      addressCountry: "FR",
    },
    areaServed: ["Bouches-du-Rhône", "Marseille", "Aix-en-Provence"],
  };
}

/** Uniquement pour les véhicules réels : on ne publie pas de données structurées pour des exemples. */
export function vehicleJsonLd(v: PublicVehicle, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${v.brand} ${v.model}${v.version ? ` ${v.version}` : ""}`,
    brand: { "@type": "Brand", name: v.brand },
    model: v.model,
    vehicleModelDate: String(v.year),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: v.mileageKm, unitCode: "KMT" },
    ...(v.fuel && { fuelType: v.fuel }),
    ...(v.gearbox && { vehicleTransmission: v.gearbox }),
    ...(v.body && { bodyType: v.body }),
    ...(v.color && { color: v.color }),
    itemCondition: "https://schema.org/UsedCondition",
    image: v.photos.map((p) => p.url),
    url,
    offers: {
      "@type": "Offer",
      price: v.priceEur,
      priceCurrency: "EUR",
      availability: v.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      seller: { "@type": "AutoDealer", name: GARAGE.name },
    },
  };
}
