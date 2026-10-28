# Sources, données et méthode d'évaluation

Ce document définit un cadre de départ, pas une évaluation déjà réalisée. Les sources et propositions concrètes restent à collecter et à vérifier.

## 1. Choisir et qualifier les sources

Utiliser la source adaptée à la question posée :

- **Attribution d'une proposition** : privilégier le programme, le document ou la publication officielle du candidat ou du parti. Une reprise médiatique ne suffit pas à établir le libellé exact d'un engagement.
- **Contexte budgétaire et données de référence** : consulter les publications officielles des organismes compétents (par exemple INSEE, administrations budgétaires, Cour des comptes, Haut Conseil des finances publiques ou institutions européennes), en vérifiant le périmètre, la date et la méthodologie de chaque publication.
- **Estimation d'impact ou analyse** : identifier l'auteur, son mandat et sa méthode ; distinguer une estimation indépendante d'un chiffrage fourni par le candidat. Une expertise secondaire éclaire une mesure mais ne remplace pas sa source primaire.
- **Presse et sources secondaires** : elles peuvent aider à découvrir une mesure ou un débat. Vérifier les affirmations importantes dans les documents cités ou les sources primaires avant de les retenir.

La réputation d'un éditeur ne suffit pas à qualifier une affirmation : vérifier aussi la pertinence, l'indépendance, la méthode, la date et le périmètre de la source. Une source absente, inaccessible ou contradictoire doit être signalée.

## 2. Registre des sources et provenance

Chaque source retenue devrait comporter les champs suivants :

| Champ | Contenu attendu |
|---|---|
| Identifiant | Identifiant stable utilisé dans les références |
| Titre et éditeur | Titre du document, organisme ou personne responsable |
| Type et rôle | Programme, statistique, estimation, analyse, texte juridique, etc. ; fait qu'elle étaye |
| URL et accès | Lien direct, date de consultation, état d'accès et éventuel emplacement d'archive |
| Dates | Publication, mise à jour et consultation, conservées séparément |
| Emplacement | Page, chapitre, tableau, paragraphe ou horodatage permettant de retrouver le passage |
| Extrait et contexte | Citation fidèle, assez contextualisée pour éviter une interprétation trompeuse |
| Méthode et limites | Périmètre, hypothèses, méthode publiée, limites et éventuels conflits d'intérêts connus |
| Réutilisation | Conditions d'utilisation ou de reproduction lorsque celles-ci sont connues |

Ne pas transformer un lien ou une citation en preuve d'une affirmation qu'il ne soutient pas. Conserver les changements de version et signaler les liens rompus plutôt que de remplacer silencieusement une source.

## 3. Modèle conceptuel des données

Garder distincts les objets suivants ; une future implémentation pourra les normaliser davantage :

- **Candidat/parti** : identité affichée et statut de la source qui établit l'attribution.
- **Proposition** : formulation sourcée, date, domaine, statut (explicite, conditionnelle, ambiguë, retirée, etc.) et lien au candidat/parti.
- **Source** : notice de provenance décrite ci-dessus.
- **Affirmation ou estimation** : valeur, unité, périmètre institutionnel, année de prix, horizon, caractère annuel ou ponctuel, brut ou net, hypothèses, auteur et niveau d'incertitude. Une valeur sans unité ni horizon ne doit pas être présentée comme comparable.
- **Critère et version de méthode** : définition, question d'évaluation, échelle et ancrages, ainsi que version de la grille.
- **Évaluation** : mesure évaluée, critère, appréciation, justification, références probantes, évaluateur et date. Préserver la distinction entre faits établis, hypothèses et jugement.
- **Scénario de pondération** : poids non négatifs associés aux critères, avec auteur et date. Conserver les résultats comme calculs dérivés, pas comme données sources.

## 4. Grille de comparaison proposée

Les catégories ci-dessous sont une base de discussion et doivent être définies et testées avant toute notation publique.

### Pertinence

- Le problème visé et l'objectif sont-ils clairement identifiés ?
- Les éléments disponibles étayent-ils le diagnostic et le lien attendu entre la mesure et l'objectif ?
- Les effets annoncés et les effets secondaires pertinents sont-ils examinés ?

### Légitimité

Ne pas confondre popularité, attribution à un programme et conformité au droit. Documenter séparément, lorsque c'est pertinent :

- la traçabilité et la clarté de l'engagement public ;
- la compatibilité juridique et institutionnelle, avec les réserves d'expertise éventuelles ;
- les conséquences distributives et les groupes concernés ;
- la transparence des arbitrages, du financement et des conditions de mise en œuvre.

Une question juridique factuelle ne devrait pas être noyée dans une moyenne subjective.

### Faisabilité

- **Budgétaire** : chiffrage, financement, économies ou recettes associés, cohérence avec le périmètre et l'horizon retenus, sensibilité aux hypothèses.
- **Juridique et institutionnelle** : compétences nécessaires, changements législatifs ou réglementaires et contraintes identifiées.
- **Opérationnelle et temporelle** : moyens, dépendances, capacité d'exécution et calendrier plausible au vu des informations disponibles.

Il s'agit de dimensions distinctes : ne pas laisser une forte performance sur l'une effacer une impossibilité documentée sur une autre.

## 5. Notes, pondérations et agrégation

- Choisir une échelle commune seulement après avoir défini des ancrages observables propres à chaque critère. Toute note doit inclure une justification et des références.
- Garder la qualité/confiance des preuves distincte de la note : une proposition peut être pertinente mais mal documentée, ou bien documentée mais peu faisable.
- Représenter « inconnu », « non évalué » et « sans objet » explicitement ; ne pas convertir ces états en zéro.
- Les poids sont des préférences de comparaison, non des faits. Les montrer, permettre des scénarios alternatifs et ne jamais modifier les sources en fonction des poids.
- Si un score agrégé est introduit, publier sa formule, le traitement des données manquantes et la couverture des critères. Afficher qu'un résultat est partiel et éviter de comparer des scores calculés sur des ensembles de critères différents sans avertissement.
- Conserver les notes individuelles et les dimensions séparées à côté de tout résumé. Ne pas présenter davantage de précision que ne le permet la qualité des données.

## 6. Contrôles avant publication

Pour chaque proposition et résultat :

1. La source établit-elle bien l'attribution et le libellé indiqués ?
2. Les citations, liens, dates, unités, périmètres et horizons sont-ils vérifiables ?
3. Les sources et hypothèses contradictoires sont-elles visibles ?
4. La même méthode a-t-elle été appliquée aux autres candidats ?
5. Peut-on distinguer ce qui est cité, calculé, estimé et jugé ?
6. Les limites et données manquantes sont-elles explicites ?
7. Le résultat est-il reproductible avec la version de méthode et le scénario de poids indiqués ?

## 7. Présentation dans l'application future

Prévoir une fiche de proposition avec son texte source, ses références, ses hypothèses, ses évaluations et leurs justifications. La vue comparative devrait rendre les filtres et pondérations visibles, permettre de revenir aux dimensions détaillées et indiquer les données absentes. Une mise à jour hors ligne éventuelle devra afficher la date des données consultées.

Les données personnelles de l'utilisateur ne sont pas nécessaires pour comparer des scénarios ; ne pas ajouter de suivi ou de collecte sans besoin explicite et documenté.
