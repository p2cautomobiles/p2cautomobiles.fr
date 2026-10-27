# Site P2C Automobiles

Site de P2C Automobiles, vendeur de voitures d'occasion à Plan de Campagne (Les Pennes-Mirabeau).
Next.js 16 (App Router, Cache Components), React 19, TypeScript strict, Tailwind CSS 4, Zod, Lucide.

> **Version de démonstration.** Les véhicules affichés sont des exemples tant que le flux Evialog n'est pas branché
> (voir [docs/EVIALOG.md](docs/EVIALOG.md)). Un bandeau le signale sur toutes les pages.

## Démarrer

Node.js 20.9 ou plus récent est nécessaire (installé ici dans `~/.local/node`).

```bash
export PATH="$HOME/.local/node/bin:$PATH"
```

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Le site est alors sur http://localhost:3000.

## Vérifications

| Commande | Rôle |
| --- | --- |
| `npm test` | Tests : catalogue (filtres, tri, pagination, véhicules vendus) et formulaires (validation, anti-spam, photos, e-mail) |
| `npm run typecheck` | Typage TypeScript |
| `npm run lint` | ESLint |
| `npm run build` | Compilation de production |

## Organisation

```
src/
  app/                    Pages (accueil, catalogue, fiche, services, juridique, sitemap, robots)
  components/             Composants d'interface (en-tête, cartes, filtres, galerie, illustration)
  config/garage.ts        Coordonnées, garantie, données légales, règles d'affichage
  config/services.ts      Textes des services
  app/actions/leads.ts    Action serveur unique qui reçoit tous les formulaires
  components/forms/       Formulaires (contact, véhicule, reprise en 3 étapes, recherche)
  lib/leads/              Règles de validation, anti-spam, contrôle des photos, e-mail envoyé au garage
  lib/vehicles/
    types.ts              Modèle de véhicule normalisé (Zod)
    filters.ts            Filtres, tri, pagination, véhicules similaires (testés)
    visibility.ts         Badge « Nouveau », véhicules vendus visibles 14 jours
    service.ts            Point d'accès unique au stock, mis en cache
    providers/            Source des véhicules : mock (démo) ou evialog (non activé)
docs/EVIALOG.md           Intégration Evialog
```

## Formulaires

Six formulaires envoient une vraie demande au garage par e-mail : contact, demande d'information, rendez-vous et essai
(depuis la fiche, avec la référence du véhicule), reprise en 3 étapes avec jusqu'à 6 photos, recherche personnalisée.

- Les mêmes règles de validation s'appliquent dans le navigateur et sur le serveur (`src/lib/leads/schema.ts`).
- Anti-abus : champ piège invisible, délai minimal avant envoi, 5 envois maximum par adresse IP et par 10 minutes.
- Photos : réduites dans le navigateur (1600 px, JPEG), puis vérifiées sur le serveur par leur contenu réel.
- Le message « Demande envoyée » ne s'affiche que si l'envoi a réellement réussi. Si l'envoi est désactivé ou échoue,
  le visiteur le voit et on lui donne le numéro de téléphone.

### Activer l'envoi des e-mails

1. Créer un compte sur [resend.com](https://resend.com) et y vérifier le nom de domaine du site (enregistrements DNS).
2. Renseigner dans les variables d'environnement : `LEADS_TRANSPORT=resend`, `RESEND_API_KEY`, `LEADS_FROM_EMAIL`
   (une adresse du domaine vérifié) et `LEADS_TO_EMAIL` (l'adresse qui reçoit les demandes).
3. Envoyer une demande de test depuis le site.

En développement, `LEADS_TRANSPORT=file` écrit chaque demande et ses photos dans `.leads/` (ignoré par Git).

## Modifier les contenus

En attendant l'administration (phase 6) :

- Téléphone, adresse, horaires, garantie, données légales : `src/config/garage.ts`.
  Une valeur `null` s'affiche « à renseigner » sur le site.
- Textes des services : `src/config/services.ts`.
- Logo : `public/logo-p2c.png`.

## Règles du projet

- Aucun véhicule, avis, chiffre ou condition commerciale inventé.
- Les exemples ne sont ni indexés ni présents dans le sitemap.
- `robots.txt` bloque l'indexation tant que `NEXT_PUBLIC_ALLOW_INDEXING` n'est pas à `true`.
- Les secrets restent côté serveur (`server-only`).

## Fait

- Formulaires avec envoi réel par e-mail (voir plus haut), testés de bout en bout en local.
- Accueil, catalogue (filtres combinables dont plusieurs marques, tri et pagination dans l'URL), fiche véhicule
  (galerie plein écran et tactile, véhicules similaires, statuts Réservé et VENDU), Qui sommes-nous, Services,
  Reprise, Contact, mentions légales, confidentialité, page 404.
- SEO : métadonnées par page, données structurées AutoDealer et Car (véhicules réels uniquement), sitemap, robots.
- Le contenu du site s'affiche sans script (rendu serveur), l'animation respecte `prefers-reduced-motion`.

## Reste à faire

| Sujet | Bloquant pour la mise en ligne |
| --- | --- |
| Flux Evialog (réponse de l'éditeur) | Oui, pour le stock réel |
| Hébergeur et médiateur de la consommation (mentions légales) | Oui |
| Confirmer « plus de 10 ans » (société créée en novembre 2017) | Oui |
| Compte Resend et clé d'envoi (les demandes iront à p2cautos@gmail.com) | Oui |
| Administration, base de données, journal de synchronisation | Phase 6 |
| Comparateur, assistant en ligne | Phases suivantes |
| Photos du garage et de l'équipe, durée de la garantie, lien fiche Google | Non |
| Hébergement, nom de domaine, préproduction | Avant lancement |
