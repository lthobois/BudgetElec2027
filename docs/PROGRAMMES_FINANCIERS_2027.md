# Programmes économiques et budgétaires — collecte du 28 octobre 2026

## Périmètre

Les cinq dossiers de référence sont ceux des cinq premiers de l'hypothèse H1 de la dernière enquête retenue, Cluster17 pour POLITICO, publiée le 26 octobre 2026. Ce choix dépend du bulletin testé : [méthode, croisement des 49 personnes et sensibilité aux scénarios](SONDAGES_2027_2026-10-28.md). Gabriel Attal est également documenté, car il figure dans les cinq premiers de l'hypothèse H2 où il remplace Philippe.

La collecte porte sur les propositions ayant un effet économique ou budgétaire : recettes, dépenses, dette, financement, économies, retraites, revenus et investissement. Elle ne comprend aucune évaluation des candidats. Les sources ont été téléchargées sans les modifier ; les pages web sont conservées en HTML avec une extraction textuelle. Les PDF sont accompagnés d'un texte avec repères de pages.

## Résultat de la recherche

| Personne | Résultat | Documents conservés | Qualification |
|---|---|---|---|
| Marine Le Pen | Documents économiques connexes trouvés ; programme financier personnel 2027 consolidé non trouvé dans cette recherche | Contre-budget RN 2026, 8 pages ; La France entreprend, 35 pages | Le contre-budget est daté du 23/10/2025 et concerne 2026. Le livret entreprises se décrit p. 2 comme la version 2022 mise à jour servant de base de travail. Ne pas les attribuer automatiquement à 2027. |
| Jean-Luc Mélenchon | Orientations budgétaires 2027 trouvées | Comment nous allons remettre de l'ordre dans les comptes publics, 24 pages ; Pôle public bancaire, 16 pages | Documents liés par la campagne ; la page précise que les orientations 2027 ne constituent pas le chiffrage complet du programme pluriannuel. |
| Édouard Philippe | Propositions économiques et budgétaires de campagne trouvées | Page Pour une France plus prospère, HTML et texte | Mesures et objectifs chiffrés ; aucun dossier financier autonome exhaustif identifié sur cette page. |
| Raphaël Glucksmann | Projet collectif trouvé ; programme financier personnel 2027 consolidé non trouvé dans cette recherche | Acte I — Notre vision pour la France, 88 pages ; page du projet et site de campagne | Texte de Place publique avec orientations économiques et fiscales ; attribution personnelle 2027 à confirmer mesure par mesure. |
| Bruno Retailleau | Dossier budgétaire détaillé et trajectoire trouvés | Rétablir l'ordre dans les comptes publics, 17 pages, daté du 12/10/2026 ; six fiches de mesures et index budgétaire web | Hypothèses, mesures et chiffrages revendiqués par le candidat ; aucune validation indépendante réalisée. |
| Gabriel Attal — complément | Plan personnel de désendettement trouvé | Publications des 23/09 et 15/10/2026, pages Dette de l'État et Travail & salaires | Textes officiels de campagne. Le lien vers la lettre intégrale dans l'application ne restitue qu'une redirection : la lettre elle-même n'est pas acquise. |

« Non trouvé » décrit cette recherche, pas une preuve de non-publication. Les documents collectifs, textes antérieurs et annonces partielles restent utilisables pour l'analyse, à condition de conserver leur nature et leur date.

## Dossiers individuels et données

- [Marine Le Pen](../data/research/2026-10-28/programmes/marine-le-pen/README.md).
- [Jean-Luc Mélenchon](../data/research/2026-10-28/programmes/jean-luc-melenchon/README.md).
- [Édouard Philippe](../data/research/2026-10-28/programmes/edouard-philippe/README.md).
- [Raphaël Glucksmann](../data/research/2026-10-28/programmes/raphael-glucksmann/README.md).
- [Bruno Retailleau](../data/research/2026-10-28/programmes/bruno-retailleau/README.md).
- [Gabriel Attal](../data/research/2026-10-28/programmes/gabriel-attal/README.md).
- [Catalogue JSON](../data/research/2026-10-28/programmes/catalogue.json) et [CSV](../data/research/2026-10-28/programmes/catalogue.csv).
- [Registre global des sources](../data/research/2026-10-28/sources.json) : URL demandée, URL finale, statut HTTP, date de consultation, taille, SHA-256, métadonnées PDF et chemin du texte extrait. Les échecs sont conservés.

Chaque dossier contient une fiche lisible, une fiche JSON avec l'identifiant stable de la personne et un répertoire `sources/` avec les originaux et leurs extractions. Une capture HTML ne constitue pas une copie complète de toutes les ressources du site, ni une garantie d'affichage hors ligne.

## Parcours de recherche et limites

1. Départ : base des 49 personnes ; recherche des sondages récents ; retour aux notices déposées à la Commission plutôt qu'aux seules moyennes d'agrégateurs.
2. Choix des cinq priorités dans un scénario identifié, avec conservation des autres scénarios et ajout d'Attal en complément.
3. Recherche sur les sites officiels et liens de téléchargement fournis par les campagnes ou partis. Les comparateurs ont servi à découvrir certains liens ; leurs reformulations ne sont pas retenues comme source primaire des propositions.
4. Pour Glucksmann, le domaine de campagne retenu est celui relié depuis Place publique (`glucks2027.fr`). La page de programme d'un autre domaine trouvée dans les résultats n'est pas utilisée faute d'authentification par ces liens officiels.
5. Pour Retailleau, deux tentatives de capture de l'index général ont expiré. La page Comptes publics, ses six fiches et son PDF ont ensuite été téléchargés avec succès.
6. Pour Attal, la présentation de la lettre est acquise, mais la redirection `attal.app` ne livre pas la lettre. Cette limite est distincte du succès HTTP.
7. Le livre intégral de L'Avenir en commun annoncé pour le 6 novembre n'est pas acquis ; seuls les documents budgétaires et bancaires disponibles sont collectés. La présence d'un lien vers le programme NFP 2024 n'en fait pas un programme présidentiel 2027.

Les requêtes de découverte ont notamment porté sur « sondage présidentielle 2027 octobre 2026 », les sites des instituts et le registre de la Commission, puis sur le nom de chaque personne avec « programme 2027 », « budget », « économie », « PDF », ainsi que les sites de leurs partis et campagnes. Les manifestes `collecte-*.json` listent les URL effectivement demandées, et les fichiers `*-results.json` conservent les résultats des tentatives. Ce corpus n'est pas une exploration exhaustive de tous les discours, vidéos, amendements et réseaux sociaux.

## Pour l'analyse ultérieure

Appliquer la [méthode du projet](METHODOLOGY.md). Pour chaque mesure extraite : enregistrer la personne, l'auteur réel du texte, sa nature, l'édition, le passage ou la page, l'unité, l'horizon, le périmètre administratif, les conditions et le financement annoncé. Séparer les chiffrages des campagnes des analyses indépendantes. Ne pas comparer directement un coût annuel, un cumul de mandat et une économie à terme.

L'absence de document ne vaut ni absence de position, ni note nulle. Le classement électoral sert ici uniquement à prioriser la recherche ; il ne valide aucune proposition et ne modifie pas la méthode d'évaluation.

## Sources primaires principales

- [RN — contre-budget 2026](https://rassemblementnational.fr/documents/GRN-CONTRE-BUDGET-2026.pdf) et [livret entreprises](https://rassemblementnational.fr/documents/WEB-GRN-LIVRET-ENTREPRISE.pdf).
- [Mélenchon — page officielle des documents de programme](https://melenchon2027.fr/programme/decouvrir/).
- [Philippe — Pour une France plus prospère](https://www.edouardphilippe.fr/priorites/pour-une-france-plus-prospere).
- [Place publique — projet et lien vers l'Acte I](https://place-publique.eu/pages/69jA2SKIG5udlNX7wI3dmc/le-projet).
- [Retailleau — Comptes publics et lien vers le livret](https://www.avecretailleau.fr/projet/theme/comptes-publics).
- [Attal — présentation du plan du 15 octobre](https://attalpresident.fr/actualites/gabriel-attal-lettre-aux-francais-plan-finances-publiques).
