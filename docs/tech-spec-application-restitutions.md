---
title: Application locale de restitution économique des candidats
type: feature
created: 2026-10-28
status: done
baseline_commit: NO_COMMITS
context:
  - docs/PROJECT_CONTEXT.md
  - docs/METHODOLOGY.md
  - docs/CANDIDATS_2027.md
---

# Application locale de restitution économique des candidats

## Intent

**Problème :** Les candidatures, sondages et documents économiques sont structurés dans le dépôt, mais restent difficiles à consulter ensemble. L'utilisateur a accepté une grille d'analyse à neuf axes et demande de commencer l'application pour présenter ces restitutions et analyses.

**Approche :** Construire une première application React locale, interactive et responsive, alimentée par les données réelles du dépôt. Elle présente le corpus et ses limites, prépare la restitution des neuf axes et permet de consulter les sources, sans fabriquer des analyses économiques encore absentes.

L'autorisation d'implémentation vient de la demande du 28 octobre 2026 et de l'accord explicite sur la grille précédente. Le dépôt ne comporte aucun commit initial ; les fichiers présents proviennent de ce travail documentaire et doivent être conservés. La configuration BMAD n'est pas installée dans ce dépôt : les documents de contexte existants et cette spécification tiennent lieu de configuration pour cette livraison, en français. Aucun push, PR ou déploiement distant dans cette première implémentation locale.

## Boundaries & Constraints

**Toujours :** Français, neutralité, sources visibles, date de l'instantané, distinction entre campagne personnelle 2027 / texte collectif / document antérieur / analyse non réalisée. Les 49 identifiants sont conservés ; les six dossiers collectés sont accessibles. Les sondages restent séparés par scénario, avec marges et absence explicite de mesure. Accessibilité clavier, états vides compréhensibles et adaptation mobile. Les originaux du dépôt restent inchangés. Les références à des fichiers ne doivent pas donner accès à des pages HTML distantes exécutées localement : offrir les textes extraits et les PDF, avec liens officiels séparés.

**Décisions techniques :** React et Vite pour une interface client sans serveur de données, compte utilisateur ni clé ; CSS personnalisé pour un rendu éditorial soigné. Charger les données JSON existantes par un générateur local qui produit un catalogue public normalisé et copie les PDF / textes disponibles pour la lecture. Pas de base de données à ce stade. La PWA complète pourra être ajoutée après ce premier socle ; ne pas annoncer un mode hors ligne non implémenté.

**Hors périmètre :** Automatisation des recherches web, nouvelles données politiques, calcul macroéconomique non validé, score global, classement de mérite, notation de faisabilité inventée, simulation personnelle de fiscalité, suivi de visiteurs. Ne pas attribuer à un candidat une mesure issue d'un ancien document sans qualification.

## I/O et cas limites

| Scénario | Entrée | Résultat attendu |
|---|---|---|
| Vue principale | Corpus existant | Six dossiers mis en avant, accès aux 49 personnes et contexte de collecte |
| Recherche et filtre | Nom accentué ou sans accent, parti, état documentaire | Liste correspondante ; état vide si aucun résultat |
| Fiche candidat | Dossier collecté | Synthèse documentaire, limites, documents téléchargeables et neuf axes indiquant leur état réel |
| Personne sans dossier | Une des 43 autres personnes | Informations disponibles et collecte non réalisée ; aucun faux zéro ni programme inventé |
| Comparaison | Deux ou trois personnes sélectionnées | Tableau des neuf axes et de la couverture documentaire, modification et retrait des personnes |
| Sondages | Changement de vague et de scénario | Valeurs exactes et bulletin choisi ; personnes absentes indiquées non testées, valeurs <1 conservées |
| Document | PDF ou texte extrait | Fichier consultable ou téléchargeable ; lien vers source officielle et qualification du document |
| Écran étroit | 390 px | Navigation utilisable et absence de débordement de la page ; tableau défilant dans sa zone |

## Code map et tâches

- [x] `package.json`, `index.html`, `vite.config.*` — socle React/Vite et commandes démarrage, build et vérification.
- [x] `scripts/prepare-app-data.*` — lecture des JSON existants et de la base Markdown ; génération de données publiques et copie contrôlée des documents pour servir le corpus localement.
- [x] `src/` — composants et logique des vues : panorama des candidats, fiche détaillée, comparateur, documents, méthode et sondages selon les besoins de navigation.
- [x] `src/*.css` — design éditorial : fond clair chaud, typographie affirmée, accents bleu nuit et vert, hiérarchie nette, tableaux sobres et bonnes respirations. Aucun besoin d'illustrations génériques ou de portraits non sourcés ; les initiales sont suffisantes.
- [x] `tests/` — vérifications utiles des données, jointures, scénarios et valeurs absentes ; pas de tests qui répliquent simplement le balisage.
- [x] `docs/ANALYSE_ECONOMIQUE.md` — grille acceptée : stratégie économique ; dette et déficit ; entreprises ; particuliers ; dépenses et services ; travail et protection ; production et investissement ; répartition ; cohérence et faisabilité. Contrôle transversal des coûts, financement, hypothèses et interactions.
- [x] `README.md` et `.gitignore` — instructions locales, limites actuelles, fichiers générés et dépendances ignorés. Aucun choix de déploiement.

## Critères d'acceptation

- Étant donné l'instantané existant, quand l'application est construite, alors elle compile et présente les 49 personnes, les six dossiers et les 13 scénarios sans discordance de provenance.
- Étant donné un document collectif ou antérieur, quand sa fiche est affichée, alors sa qualification reste visible à proximité du lien.
- Étant donné un axe sans analyse, quand une fiche ou une comparaison est ouverte, alors elle affiche « Analyse à réaliser » avec les questions à traiter ; aucun score artificiel.
- Étant donné les données de sondage, quand un utilisateur change de scénario, alors les pourcentages sont ceux de ce scénario et ne sont pas moyennés avec d'autres bulletins.
- Étant donné deux ou trois dossiers, quand l'utilisateur sélectionne Comparer, alors il peut comparer, retirer une personne et revenir à une fiche sans perdre le sens de la sélection.
- Étant donné l'application sur mobile ou au clavier, quand l'utilisateur navigue, alors les actions sont nommées, le focus est visible et les liens documentaires fonctionnent.

## Vérification

Exécuter les contrôles de cohérence des données, les tests ciblés, le build de production et une vérification visuelle et fonctionnelle dans le navigateur si disponible. Vérifier au minimum la vue d'ensemble, la fiche, la comparaison, les filtres, un scénario alternatif et un lien PDF / texte. Conserver le serveur local pour l'aperçu utilisateur et communiquer l'URL utilisable ainsi que les limites de vérification.

## Journal

- 28/10/2026 : périmètre issu de la grille acceptée et de la demande de démarrage ; implémentation locale autorisée. La publication d'une analyse économique reste distincte de la présentation du corpus.
- 28/10/2026 : première version réalisée et revue par trois lectures indépendantes. Corrections : contraste, tailles mobiles, provenance collective des statuts, focus et titre à la navigation, marges individuelles Ipsos et échelle des barres. Aucun périmètre politique ajouté. Voir [les vérifications](VERIFICATION_APPLICATION.md).
