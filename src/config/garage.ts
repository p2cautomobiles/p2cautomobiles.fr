/**
 * Informations du garage. Une valeur `null` s'affiche « à renseigner » sur le site :
 * on ne remplace jamais une donnée manquante par une valeur inventée.
 * Ces contenus passeront dans l'administration à la phase 6.
 */
export const GARAGE = {
  name: "P2C Automobiles",
  contactName: "Yoni",
  phone: "07 84 92 89 49",
  phoneTel: "+33784928949",
  email: "p2cautos@gmail.com" as string | null,
  address: {
    street: "Plan de Campagne, Le Petit Péage",
    postalCode: "13170",
    city: "Les Pennes-Mirabeau",
    region: "Provence-Alpes-Côte d'Azur",
  },
  /** Horaires affichés tels quels sur le site. */
  hours: [
    { days: "Lundi au vendredi", time: "9 h – 18 h, non-stop" },
    { days: "Samedi", time: "fermé" },
    { days: "Dimanche matin", time: "sur rendez-vous" },
  ] as { days: string; time: string }[] | null,
  /** Pour les données structurées Google : uniquement les plages d'ouverture fixes. */
  openingHoursSchema: [{ dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" }],
  /** Affirmation fournie par le garage. La société actuelle date de novembre 2017 : à confirmer avant publication. */
  since: "plus de 10 ans",
  googleBusinessUrl: null as string | null,
  warranty: {
    parts: ["Moteur", "Boîte de vitesses", "Pont"],
    scope: "pièces et main-d'œuvre",
    provider: "un organisme de garantie spécialisé",
    duration: null as string | null,
  },
  legal: {
    company: "PLAN 2 CAMPAGNE AUTOMOBILES",
    form: "SASU, société par actions simplifiée unipersonnelle",
    capital: "6 000 €",
    rcs: "832 938 245 R.C.S. Aix-en-Provence",
    siren: "832 938 245",
    vat: "FR75832938245",
    publicationDirector: "Laure Attali, Présidente",
    host: null as string | null,
    consumerMediator: null as string | null,
  },
  /** Durée pendant laquelle un véhicule vendu reste visible avec le badge « VENDU ». */
  soldVisibleDays: 14,
  /** Un véhicule est « Nouveau » pendant ce nombre de jours après son arrivée. */
  newBadgeDays: 10,
} as const;

export const fullAddress = `${GARAGE.address.street}, ${GARAGE.address.postalCode} ${GARAGE.address.city}`;

export const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`P2C Automobiles, ${fullAddress}`);

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
