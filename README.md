# Comparateur des propositions budgétaires — présidentielle 2027

Projet en préparation : construire un outil transparent permettant de comparer les propositions budgétaires des candidats à l'élection présidentielle française de 2027, à partir de sources traçables et selon des critères et pondérations explicites.

Le projet contient une base de candidatures, un premier croisement avec les sondages et un corpus de documents économiques et budgétaires collectés le 28 octobre 2026. Ces documents sources et intentions de vote ne constituent pas une évaluation des candidats ; les propositions et leurs chiffrages restent à analyser et vérifier avant toute comparaison.

## Contexte du projet

- [Objectifs, périmètre et principes](docs/PROJECT_CONTEXT.md)
- [Sourçage, données et méthode d'évaluation](docs/METHODOLOGY.md)
- [Base de référence des candidatures 2027](docs/CANDIDATS_2027.md) — listes, identifiants et statuts à vérifier
- [Sondages et priorités documentaires au 28 octobre 2026](docs/SONDAGES_2027_2026-10-28.md) — croisement des 49 personnes, scénarios et sources
- [Documents économiques et budgétaires collectés](docs/PROGRAMMES_FINANCIERS_2027.md) — cinq dossiers de référence et un complément
- [Consignes de contribution assistée](.github/copilot-instructions.md)

## Application locale — première version

L'application **Éclairage 2027** présente les 49 profils, les six dossiers documentaires, les sources PDF et textes extraits, la grille de neuf axes, une comparaison de deux ou trois profils et les 13 scénarios de sondages. Les analyses économiques restent marquées « Analyse à réaliser » ; aucun score ni programme n'est inventé.

Prérequis : Node.js 22.12 ou version ultérieure compatible avec Vite (développement vérifié sous Node 24).

```powershell
npm.cmd install
npm.cmd run dev
```

Ouvrir l'URL locale affichée par Vite (habituellement `http://127.0.0.1:5173`).

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run preview
```

`npm run prepare:data` normalise les JSON du corpus du 28 octobre 2026 et les rattachements du registre Markdown. Il copie les PDF et textes vers `public/documents/`, sans exposer les archives HTML comme pages exécutables. Les originaux ne sont pas modifiés. `dev` et `build` lancent cette préparation ; `preview` sert le dernier build. Les fichiers publics générés, dépendances et build sont ignorés par Git.

La navigation fonctionne par URL fragment ; la comparaison est conservée pendant la session de navigation, sans stockage de données personnelles. Les fontes web sont facultatives et possèdent des alternatives locales. Pas de serveur métier, compte, clé API, suivi de visiteurs ni déploiement distant. Le fonctionnement hors ligne et l'installation PWA ne sont pas implémentés dans ce premier socle.

- [Grille d'analyse acceptée](docs/ANALYSE_ECONOMIQUE.md)
- [Spécification de cette première version](docs/tech-spec-application-restitutions.md)
