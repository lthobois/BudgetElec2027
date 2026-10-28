---
title: Vérification approfondie et restitution des propositions économiques
type: feature
created: 2026-10-28
status: in-progress
baseline_commit: bbbaec0
context:
  - docs/METHODOLOGY.md
  - docs/ANALYSE_ECONOMIQUE.md
  - docs/PROJECT_CONTEXT.md
---

# Vérification approfondie et restitution des propositions économiques

## Intent

**Problème :** La première application montre le corpus et des axes vides. L'utilisateur demande une vérification plus approfondie de l'état des programmes des principaux candidats, car la restitution semble vide. Des documents déjà collectés contiennent des mesures qui n'ont pas encore été extraites.

**Approche :** Rechercher les publications officielles des six personnes déjà documentées, archiver les nouveaux textes et extraire des mesures économiques avec leur provenance précise. Présenter une première lecture documentaire dans les fiches et le comparateur, tout en distinguant programme complet, propositions partielles et textes collectifs ou antérieurs. La demande autorise la recherche et l'intégration dans l'application existante ; pas de publication distante.

Complément explicitement demandé par l'utilisateur pendant la recherche : rapprocher les mesures chiffrées déjà acquises pour comparer les solutions concrètes. Le fichier `verification/comparaisons.json` regroupe ces rapprochements par objet et documente leurs limites d'unité, horizon, public et attribution. L'interface doit permettre leur consultation pour deux ou trois personnes sans transformer une proximité de thème en équivalence de coût.

## Contraintes

Toujours conserver les originaux du premier instantané et qualifier chaque mesure individuellement. Une annonce personnelle de 2027 ne change pas la nature d'un ancien texte du parti. La stratégie offre/demande est une interprétation argumentée des mécanismes décrits, pas une déclaration du candidat ni un effet économique prouvé. Les coûts et bénéfices restent ceux annoncés ; pas de note, de total additionnant des enveloppes et leurs composants, ni de simulation non étayée. Une recherche infructueuse ne prouve pas l'absence de programme.

Le périmètre est Marine Le Pen, Jean-Luc Mélenchon, Édouard Philippe, Raphaël Glucksmann, Bruno Retailleau et Gabriel Attal. Les 43 autres profils et les sondages restent disponibles dans leur état actuel. Les candidats conservent la même grille et les mêmes exigences de preuve. Les pages archivées sont proposées en texte ou PDF, jamais exécutées comme HTML local.

## Entrées et cas limites

| Situation | Restitution attendue |
|---|---|
| Mesure explicite de campagne | Description, axe, auteur, source, extrait fidèle, page/intertitre, horizon et réserves |
| Projet collectif ou antérieur | Mesure consultable avec badge de nature et avertissement d'attribution visible |
| Montant sans base claire | Montant présenté comme annoncé, avec ambiguïté annuelle/cumulée signalée ; pas de total comparatif |
| Axe sans mesure repérée | « Non repéré dans les sources examinées » ; ne pas transformer en absence de position |
| Source inaccessible | Échec consigné et source non utilisée comme preuve exclusive d'une mesure |
| Profil non examiné dans cette passe | État « Analyse à réaliser » conservé ; pas de fiche remplie par défaut |

## Modèle et fichiers

- `data/research/2026-10-28/verification/<candidate_id>/audit.json` : état de publication, journal de recherche, interprétation de stratégie, mesures et limites de financement/répartition/faisabilité. Chaque mesure possède un identifiant, un axe, une source connue, une URL, un passage et un extrait.
- Les sources supplémentaires et leurs manifestes restent dans ces dossiers. Le collecteur existant conserve date de consultation, statut HTTP, empreinte et chemin du texte extrait.
- `scripts/build_programme_verification.*` : fusion et contrôle des six audits, export d'un registre complémentaire, d'un catalogue JSON et CSV des mesures et d'un rapport Markdown. Ne pas écraser l'instantané documentaire initial.
- `scripts/prepare-app-data.mjs` : jointure de la vérification aux personnes et intégration des nouvelles sources dans les documents consultables.
- `src/` : présenter état de publication et propositions dans la synthèse ; remplir les neuf axes par les mesures ou constats documentaires disponibles ; enrichir la comparaison et les compteurs avec des données réelles.
- `tests/` : vérifier les jointures, identifiants, provenance, axes, qualification des anciens textes, absence de faux zéros et fichiers consultables.
- Documentation : mise à jour du README et de la méthode pour distinguer extraction sourcée, première lecture qualitative et évaluation économique indépendante.

## Tâches et acceptation

- [ ] Auditer les six candidats en parallèle par paires, sans modifications concurrentes du registre global.
- [ ] Contrôler les nouveaux fichiers, les références des mesures et les passages probants.
- [ ] Construire les exports de recherche et le rapport d'état de publication.
- [ ] Intégrer les résultats dans les fiches, le comparateur et les documents.
- [ ] Mettre à jour la documentation et tester les parcours.

Critères :

- Étant donné un des six dossiers, lorsqu'on ouvre sa synthèse, l'état de publication et des propositions économiques substantielles sont visibles sans devoir lire soi-même tous les PDF.
- Étant donné une mesure affichée, lorsqu'on consulte ses détails, on retrouve le document, son passage, son attribution et les limites du chiffrage.
- Étant donné deux candidats, lorsqu'on les compare par axe, les mesures sont affichées avec leurs natures distinctes, et non remplacées systématiquement par « Analyse à réaliser ».
- Étant donné un axe non couvert, l'interface indique le périmètre de recherche manquant et conserve la distinction avec une absence d'engagement.
- Étant donné une nouvelle annonce personnelle, l'ancien statut documentaire global est rectifié explicitement dans la nouvelle vérification, sans modifier rétroactivement les archives.
- Étant donné les changements, le build et les tests réussissent, et les fiches remplies ainsi que le comparateur restent utilisables sur mobile et au clavier.

## Vérification

Contrôler les empreintes des nouvelles archives, l'existence des sources et la présence des extraits dans les textes acquis ; vérifier les pages des PDF pour les montants importants. Exécuter les tests ciblés et le build, puis consulter les fiches, les détails d'une mesure et la comparaison dans le navigateur. Relire séparément la fidélité des données et l'intégration technique. Conserver les limites de recherche dans le rapport final.

## Journal

- 28/10/2026 : demande d'approfondissement ; correction de la différence entre manque de restitution et manque de propositions publiées. Recherche et implémentation autorisées dans le périmètre existant.
