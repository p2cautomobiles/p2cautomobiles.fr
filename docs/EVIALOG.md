# Intégration Evialog

## État actuel

**Non activée.** Evialog alimente déjà La Centrale et Leboncoin, il sait donc exporter le stock. Aucune documentation
publique ne précise si un site indépendant peut recevoir ce flux. Le connecteur
`src/lib/vehicles/providers/evialog.ts` ne fait aucun appel réseau : il renvoie une erreur explicite si on l'active.

## Questions envoyées à Evialog

1. Avez-vous une API ou un flux d'export du stock (XML, JSON ou CSV) pour notre propre site internet ?
2. Le flux contient-il les photos, les équipements, le statut (disponible, réservé, vendu) et un identifiant unique par voiture ?
3. À quelle fréquence est-il mis à jour, et combien ça coûte ?
4. Pouvez-vous nous envoyer la documentation technique et un accès de test ?

## Comment le brancher, une fois la réponse reçue

Tout le site lit les véhicules via `getPublicVehicles()` (`src/lib/vehicles/service.ts`), qui appelle le fournisseur
choisi par `VEHICLE_PROVIDER`. Il suffit d'implémenter `evialogVehicleProvider.listVehicles()` :

1. Lire le flux avec `EVIALOG_FEED_URL` / `EVIALOG_API_KEY` (variables serveur, jamais exposées au navigateur).
2. Convertir chaque annonce vers le modèle `Vehicle` (`src/lib/vehicles/types.ts`) et la valider avec `vehicleSchema`.
   Une annonce invalide est ignorée et journalisée, pas affichée à moitié.
3. Utiliser l'identifiant Evialog comme `externalId` (stable) et en dériver le `slug`.
4. Statuts : `available`, `reserved`, `sold` (avec `soldAt`). Un véhicule **absent du flux n'est pas considéré comme vendu** :
   il faut un statut explicite, ou une absence confirmée sur plusieurs synchronisations.
5. Photos : déclarer le domaine des images dans `images.remotePatterns` de `next.config.ts`.
6. Passer `VEHICLE_PROVIDER=evialog`.

## Synchronisation et fraîcheur

- Les véhicules sont mis en cache quelques minutes (`cacheLife("minutes")`, étiquette `vehicles`).
- Si Evialog propose des webhooks, une route serveur pourra appeler `revalidateTag("vehicles")` à chaque modification.
- À prévoir avec la base de données (phase 6) : dernière copie valide du stock en cas de panne d'Evialog,
  journal des synchronisations, alerte en cas d'échec.
