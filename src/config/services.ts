/** Services du garage. Les conditions précises (garantie, financement, dépôt-vente) restent à confirmer avant d'être détaillées. */
export const SERVICES = [
  { id: "achat", title: "Achat de votre voiture", body: ["Des occasions multimarques choisies une par une par l'équipe.", "Avant la remise des clés, chaque voiture passe par le contrôle technique, la révision, la carrosserie, le nettoyage et le plein."] },
  { id: "garantie", title: "Garantie", body: ["Chaque voiture est garantie par un organisme de garantie spécialisé.", "La garantie couvre le moteur, la boîte de vitesses et le pont, pièces et main-d'œuvre comprises.", "La durée et les conditions exactes vous sont remises avec chaque véhicule."] },
  { id: "financement", title: "Crédit ou leasing", body: ["Crédit classique ou location avec option d'achat : nous vous aidons à monter le dossier.", "L'acceptation dépend de l'organisme financier. Nous vous présentons les conditions avant tout engagement."] },
  { id: "reprise", title: "Reprise de votre véhicule", body: ["Vous changez de voiture ? Nous étudions la reprise de l'ancienne et vous faisons une proposition personnalisée après examen."] },
  { id: "depot-vente", title: "Dépôt-vente", body: ["Vous nous confiez votre véhicule, nous nous occupons de le présenter et de le vendre.", "Les conditions du mandat sont fixées ensemble avant la mise en vente."] },
  { id: "recherche", title: "Recherche personnalisée", body: ["Grâce à notre réseau de professionnels de l'automobile, nous trouvons des véhicules difficiles à dénicher, notamment les petites voitures à moins de 15 000 €.", "Donnez-nous vos critères : marque, modèle, budget, kilométrage. Nous vous rappelons dès qu'un véhicule correspond."] },
  { id: "carte-grise", title: "Carte grise", body: ["Nous nous occupons des démarches d'immatriculation à votre place."] },
  { id: "entretien", title: "Entretien et réparation", body: ["Nous continuons à vous suivre après l'achat : entretien, révisions et réparations si nécessaire."] },
  { id: "controle-technique", title: "Contrôle technique", body: ["Chaque véhicule vendu passe le contrôle technique avant la remise des clés. Nous pouvons aussi organiser celui de votre voiture."] },
  { id: "pressing", title: "Pressing intérieur et extérieur", body: ["Un nettoyage en profondeur de l'habitacle et de la carrosserie : sièges, moquettes, vitres."] },
] as const;
