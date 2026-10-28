# Vérification de l'application — 28 octobre 2026

## Livraison

Première version locale React/Vite d'Éclairage 2027 : exploration des personnes, fiches documentaires, comparaison de deux ou trois profils, bibliothèque, sondages et méthode économique. Elle présente le corpus existant et ses lacunes ; les neuf axes ne comportent pas encore d'évaluations économiques.

## Contrôles automatisés

- Installation des dépendances avec versions fixées et verrouillage npm.
- Build de production réussi après les derniers correctifs.
- Sept tests Node : jointures des 49 personnes et six dossiers ; 13 scénarios distincts et valeurs censurées ; archives publiques exclusivement PDF/texte ; recherche et absence de données ; sélection limitée à trois ; titres des routes ; contraste des textes secondaires.
- Contrôle HTTP du serveur local : les 40 URL de PDF ou textes extraits répondent avec les types attendus. Les fichiers PDF commencent bien par leur signature PDF.

## Parcours vérifiés dans le navigateur

- Accueil et six dossiers, puis ouverture de la liste complète.
- Recherche « melenchon » sans accent : un résultat, Jean-Luc Mélenchon.
- Sélection de trois personnes ; tentative d'ajout d'une quatrième rejetée ; comparaison de trois profils ; retrait vers deux profils.
- Fiche Marine Le Pen et documents : contre-budget 2026 et version 2022 mise à jour correctement qualifiés à proximité des liens.
- Cluster17 H1 puis H2 : remplacement de Philippe par Attal et valeurs propres à chaque scénario, base utile et page PDF correspondantes.
- OpinionWay : valeurs « <1 % » conservées pour Arthaud et Bouamrane sans barre numérique imputée.
- Ipsos : marges individuelles affichées près des résultats, distinctes des pourcentages.
- Titre de document et focus du contenu mis à jour après navigation.
- Rendu mobile à 390 px : aucune largeur excédentaire du document ; le comparateur conserve son défilement interne (760 px de contenu dans une zone d'environ 331 px).
- Après ajustement mobile : texte introductif 14 px, champs 16 px. Rendu d'ensemble contrôlé également à 1280 px.

## Revue indépendante et corrections

Trois lectures séparées ont examiné les ajouts : revue générale sans contexte, recherche de cas limites et contrôle d'acceptation. Les défauts concrets retenus ont été corrigés : contraste, navigation du focus, défilement de la barre latérale sur faible hauteur et accès aux sources collectives de la base des candidatures. L'affichage des marges individuelles et de l'échelle des barres a été complété. La revue des cas limites n'a pas relevé de rupture supplémentaire sur les données actuelles.

La vérification visuelle a entraîné une augmentation des tailles de lecture mobiles. Un avertissement React sur la réutilisation de la racine lors du rechargement à chaud a aussi été corrigé ; le build final reste fonctionnel.

## Limites connues

- Les statuts et rattachements de la base initiale ne sont pas revalidés par l'application. Les liens collectifs et réserves restent visibles.
- Aucun nouveau programme, chiffrage, score économique ou résultat de simulation n'a été ajouté.
- La sélection de comparaison reste en mémoire pendant la navigation ; elle se réinitialise au rechargement.
- La première version n'implémente pas le fonctionnement hors ligne ni l'installation PWA.
- Pas de vérification exhaustive sur tous les lecteurs d'écran et navigateurs. Les contrôles clavier, focus, contrastes et dimensions constituent une première vérification.
- L'aperçu est local ; aucun site distant n'a été publié.
