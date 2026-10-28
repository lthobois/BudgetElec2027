# Contexte du projet

## Objectif

Préparer puis réaliser une application de comparaison des propositions budgétaires des candidats à l'élection présidentielle française de 2027. L'outil doit permettre d'examiner ce qui est proposé, sur quelles sources l'analyse s'appuie et comment les critères et leurs pondérations influent sur les comparaisons.

Il s'agit d'un outil d'information et d'analyse, pas d'un outil de recommandation électorale. Il ne désigne pas un « meilleur » candidat et ne présente pas une note agrégée comme un résultat scientifique ou une vérité objective.

## État et périmètre

Le dépôt constitue le socle documentaire du projet. Une première collecte datée du 28 octobre 2026 conserve des sondages, documents de campagne, textes de partis et documents antérieurs, avec leur provenance et leurs limites d'attribution. Voir les [sondages](SONDAGES_2027_2026-10-28.md) et le [corpus économique et budgétaire](PROGRAMMES_FINANCIERS_2027.md). Aucune proposition, aucun chiffrage ni aucune note de candidat n'y sont validés indépendamment à ce stade. Ne pas présumer que tous les programmes complets de 2027 sont publiés ou disponibles.

Le périmètre envisagé est centré sur les propositions ayant un effet sur les finances publiques françaises : dépenses, recettes, dette, financement, économies et calendrier de mise en œuvre. Le périmètre précis des administrations, des comptes et des horizons temporels devra être défini avant le chargement des données.

La première application locale est une interface React construite avec Vite, sans serveur métier ni stockage de données personnelles. Elle présente les profils, le corpus, les scénarios de sondages et la grille d'analyse, en gardant les conclusions économiques à réaliser explicitement absentes. Voir le README pour les commandes de démarrage et [la grille acceptée](ANALYSE_ECONOMIQUE.md). Le fonctionnement hors ligne et l'installation PWA restent à développer ; l'hébergement et les intégrations ne sont pas choisis.

## Principes de travail

1. **Neutralité** — Appliquer le même périmètre, la même grille et les mêmes règles à tous les candidats. Distinguer l'analyse des propositions des préférences politiques.
2. **Traçabilité** — Toute proposition et toute affirmation factuelle doivent renvoyer à une source identifiable, avec un emplacement précis lorsque possible.
3. **Séparation des faits et des jugements** — Une source peut attester qu'une proposition a été publiée ; elle ne prouve pas automatiquement sa pertinence, sa légitimité ou sa faisabilité.
4. **Incertitude visible** — Afficher les hypothèses, les désaccords entre sources, les lacunes, la fraîcheur des données et la confiance dans les estimations.
5. **Comparabilité** — Comparer des mesures définies sur un périmètre et un horizon compatibles. Signaler toute différence plutôt que la masquer par un score.
6. **Méthode révisable** — Rendre critères, définitions, pondérations et versions de méthode consultables. Une pondération personnelle ne modifie pas les données sources.
7. **Accessibilité** — Prévoir une interface compréhensible, utilisable au clavier et adaptée aux petits écrans ; la fonction hors ligne de la PWA ne doit pas masquer la date de mise à jour des données.

## Parcours de données envisagé

1. Recenser et qualifier les sources, en privilégiant les documents primaires pour établir les propositions.
2. Extraire chaque mesure séparément, sans fusionner des engagements distincts.
3. Enregistrer le texte fidèle de la proposition, son contexte, son auteur/publication et sa provenance.
4. Relier les estimations budgétaires et les analyses à leurs sources, hypothèses, unités et horizons.
5. Évaluer les mesures au moyen d'une grille publiée, en gardant les éléments de preuve séparés des jugements.
6. Comparer les résultats et scénarios de pondération avec leur couverture et leurs limites visibles.

## Décisions à prendre avant une première comparaison publiée

- Le périmètre budgétaire (État, administrations publiques, sécurité sociale, collectivités) et l'année de référence.
- Les types de documents et le niveau de preuve requis pour attribuer une proposition à un candidat ou à son programme.
- Le jeu initial de critères, leurs définitions et leurs ancrages de notation.
- La règle de traitement des mesures non chiffrées, ambiguës, conditionnelles ou non comparables.
- Les règles d'archivage, de citation et de réutilisation des documents.
- Le seuil éventuel de couverture nécessaire pour afficher un score agrégé.
- Le format de stockage et les choix techniques de l'application.

Ces décisions doivent être documentées et appliquées de façon cohérente ; elles ne doivent pas être déduites silencieusement des données.
