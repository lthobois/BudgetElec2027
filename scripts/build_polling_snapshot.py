"""Build the 2026-10-28 snapshot from manually checked primary PDF tables.

No network access. Published values (not raw or merely adjusted columns) only.
"""
import csv
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'data/research/2026-10-28'
OUT = BASE / 'sondages'
ALIASES = dict(
    NA='nathalie-arthaud', JM='jean-luc-melenchon', FR='fabien-roussel',
    MT='marine-tondelier', RG='raphael-glucksmann', GA='gabriel-attal',
    EP='edouard-philippe', BR='bruno-retailleau', DL='david-lisnard',
    ND='nicolas-dupont-aignan', ML='marine-le-pen', EZ='eric-zemmour',
    FH='francois-hollande', DV='dominique-de-villepin', KB='karim-bouamrane')


def values(**kwargs):
    return {ALIASES[key]: value for key, value in kwargs.items()}


polls = [
    dict(id='cluster17-2026-10-26', source_id='sondage-cluster17-10339',
         institute='Cluster17', commissioner='POLITICO', publication_date='2026-10-26',
         fieldwork_start='2026-10-19', fieldwork_end='2026-10-22',
         sample_adults=3000, sample_registered=2817,
         method='En ligne, quotas et redressements sociodémographiques et politiques',
         methodology_pdf_pages=[2, 3],
         margin_note='Table p. 3 : pour bases utiles 1889 à 1920, environ ±1,0 point à 5 %, ±1,3 à 10 %, ±1,8 à 20 %, ±2,0 à 30 %, ±2,2 à 40–50 %. Indications théoriques publiées par l’institut.',
         scenarios=[
             dict(id='H1', label='Philippe et Glucksmann ; sans Attal, Lisnard et Hollande', pdf_page=18, effective_base=1920,
                  values=values(NA=.5, JM=18.5, FR=2, MT=2, RG=13, EP=16, BR=8, ND=3, ML=33, EZ=4)),
             dict(id='H2', label='Attal et Glucksmann ; sans Philippe, Lisnard et Hollande', pdf_page=19, effective_base=1889,
                  values=values(NA=.5, JM=19.5, FR=2, MT=2, RG=14, GA=12, BR=10, ND=3.5, ML=32.5, EZ=4)),
             dict(id='H3', label='Philippe, Lisnard et Hollande ; sans Attal et Glucksmann', pdf_page=20, effective_base=1917,
                  values=values(NA=.5, JM=19.5, FR=2, MT=2.5, EP=17, DL=8, FH=6.5, BR=7, ND=3, ML=30.5, EZ=3.5))]),
    dict(id='ipsos-2026-10-24', source_id='sondage-ipsos-10338',
         institute='Ipsos bva CESI école d’ingénieurs', commissioner='Le Parisien', publication_date='2026-10-24',
         fieldwork_start='2026-10-21', fieldwork_end='2026-10-22',
         sample_adults=None, sample_registered=1500,
         method='En ligne, quotas et redressements ; inscrits certains d’aller voter et exprimés',
         methodology_pdf_pages=[2, 3, 4, 5],
         margin_note='Marges par candidat sur les pages de chaque hypothèse ; jusqu’à ±2,9 points selon la valeur et la base.',
         scenarios=[
             dict(id='H1', label='Attal et Philippe', pdf_page=11, effective_base=1057,
                  values=values(NA=.5, JM=17, FR=2, MT=3.5, RG=13, GA=4, EP=13, BR=7.5, ND=1.5, ML=33.5, EZ=4.5),
                  margins=values(NA=.4, JM=2.3, FR=.8, MT=1.1, RG=2, GA=1.2, EP=2, BR=1.6, ND=.7, ML=2.8, EZ=1.2)),
             dict(id='H2', label='Philippe candidat unique du centre', pdf_page=13, effective_base=1060,
                  values=values(NA=.5, JM=17, FR=2, MT=3.5, RG=14, EP=15, BR=8, ND=2, ML=33.5, EZ=4.5),
                  margins=values(NA=.4, JM=2.3, FR=.8, MT=1.1, RG=2.1, EP=2.1, BR=1.6, ND=.8, ML=2.8, EZ=1.2)),
             dict(id='H3', label='Attal candidat unique du centre', pdf_page=15, effective_base=1048,
                  values=values(NA=.5, JM=17, FR=2.5, MT=3.5, RG=15.5, GA=9.5, BR=11.5, ND=2, ML=33.5, EZ=4.5),
                  margins=values(NA=.4, JM=2.3, FR=.9, MT=1.1, RG=2.2, GA=1.8, BR=1.9, ND=.8, ML=2.9, EZ=1.3)),
             dict(id='H4', label='Philippe et Lisnard ; sans Attal', pdf_page=17, effective_base=1069,
                  values=values(NA=.5, JM=17, FR=2.5, MT=3.5, RG=13, EP=14, DL=6.5, BR=5.5, ND=1.5, ML=32, EZ=4),
                  margins=values(NA=.4, JM=2.3, FR=.9, MT=1.1, RG=2, EP=2.1, DL=1.5, BR=1.4, ND=.7, ML=2.8, EZ=1.2))]),
    dict(id='harris-2026-10-23', source_id='sondage-harris-10332',
         institute='Toluna Harris Interactive', commissioner='M6 et RTL', publication_date='2026-10-23',
         fieldwork_start='2026-10-19', fieldwork_end='2026-10-21',
         sample_adults=2500, sample_registered=2094,
         method='En ligne, quotas et redressements ; inscrits certains d’aller voter et exprimés',
         methodology_pdf_pages=[3, 4],
         margin_note='Les pages de résultats annoncent ±1,4 à ±2,9 points ; la méthodologie générale p. 3 indique ±1,4 à ±3,1 points. Écart interne conservé.',
         scenarios=[
             dict(id='H1', label='Philippe, Villepin et Lisnard ; sans Attal', pdf_page=35, effective_base=1372,
                  values=values(NA=1, JM=17, FR=2, MT=2, RG=12, EP=15, DV=1, DL=7, BR=4, ND=1, ML=33, EZ=5)),
             dict(id='H2', label='Attal, Villepin et Lisnard ; sans Philippe', pdf_page=37, effective_base=1357,
                  values=values(NA=1, JM=17, FR=2, MT=2, RG=14, GA=10, DV=2, DL=8, BR=5, ND=1, ML=33, EZ=5)),
             dict(id='H3', label='Attal et Philippe', pdf_page=39, effective_base=1360,
                  values=values(NA=1, JM=17, FR=1, MT=2, RG=12, GA=5, EP=13, BR=6, ND=2, ML=35, EZ=6)),
             dict(id='H4', label='Philippe candidat unique du centre', pdf_page=42, effective_base=1343,
                  values=values(NA=1, JM=17, FR=2, MT=2, RG=13, EP=16, BR=7, ND=2, ML=35, EZ=5)),
             dict(id='H5', label='Attal candidat unique du centre', pdf_page=45, effective_base=1323,
                  values=values(NA=1, JM=19, FR=2, MT=2, RG=13, GA=11, BR=9, ND=2, ML=35, EZ=6))]),
    dict(id='opinionway-2026-10-22', source_id='sondage-opinionway-10333',
         institute='OpinionWay', commissioner='CNEWS', publication_date='2026-10-22',
         fieldwork_start='2026-10-21', fieldwork_end='2026-10-22',
         sample_adults=1033, sample_registered=973,
         method='CAWI, quotas ; colonne Publié, certains d’aller voter (notes 9 et 10)',
         methodology_pdf_pages=[2, 3, 4],
         margin_note='Table p. 4 : sur 731 certains d’aller voter, ±1,6 à ±3,7 points selon le score ; base exprimée 680. Reprendre la mention Sondage OpinionWay pour CNEWS. Couverture et métadonnées portent encore Septembre : le terrain et le registre établissent octobre.',
         scenarios=[
             dict(id='H1', label='Attal, Philippe, Lisnard et Bouamrane', pdf_page=12, effective_base=680,
                  values=values(NA='<1', JM=16, FR=1, MT=1, RG=13, KB='<1', GA=4, EP=12, BR=6, DL=6, ND=1, ML=36, EZ=4))])
]


def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def write_csv(path, rows):
    with path.open('w', encoding='utf-8-sig', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def main():
    candidates = []
    group = None
    for line in (ROOT / 'docs/CANDIDATS_2027.md').read_text(encoding='utf-8').splitlines():
        match = re.match(r'### Liste ([ABCD])', line)
        if match:
            group = match.group(1)
        if re.match(r'^\| [a-z]+(?:-[a-z]+)+ \|', line):
            fields = [x.strip() for x in line.split('|')]
            candidates.append(dict(candidate_id=fields[1], name=fields[2], initial_list=group))
    assert len(candidates) == len({x['candidate_id'] for x in candidates}) == 49
    ids = {x['candidate_id'] for x in candidates}
    rows = []
    for poll in polls:
        for scenario in poll['scenarios']:
            assert set(scenario['values']).issubset(ids)
            exact = [v for v in scenario['values'].values() if isinstance(v, (int, float))]
            total = sum(exact)
            assert 97 <= total <= 103, (poll['id'], scenario['id'], total)
            for candidate_id, value in scenario['values'].items():
                rows.append(dict(poll_id=poll['id'], scenario_id=scenario['id'], candidate_id=candidate_id,
                                 published_value=str(value), percent=value if isinstance(value, (int, float)) else None,
                                 operator='lt' if value == '<1' else 'eq', threshold=1 if value == '<1' else None,
                                 margin_points=scenario.get('margins', {}).get(candidate_id),
                                 source_id=poll['source_id'], pdf_page=scenario['pdf_page'],
                                 publication_date=poll['publication_date'], fieldwork_start=poll['fieldwork_start'],
                                 fieldwork_end=poll['fieldwork_end'], effective_base=scenario['effective_base']))
    reference = polls[0]['scenarios'][0]['values']
    ref_ranks = {key: 1 + sum(other > value for other in reference.values())
                 for key, value in sorted(reference.items(), key=lambda item: -item[1])}
    priority_ids = [key for key, rank in ref_ranks.items() if rank <= 5]
    latest_values = {}
    for scenario in polls[0]['scenarios']:
        for candidate_id, value in scenario['values'].items():
            latest_values.setdefault(candidate_id, []).append(value)
    summary = []
    for candidate in candidates:
        observations = [r for r in rows if r['candidate_id'] == candidate['candidate_id']]
        exact = [r['percent'] for r in observations if r['percent'] is not None]
        censored = any(r['operator'] == 'lt' for r in observations)
        latest = latest_values.get(candidate['candidate_id'], [])
        summary.append(dict(**candidate,
                            coverage='tested' if observations else 'not_found_in_selected_polls',
                            poll_count=len({r['poll_id'] for r in observations}), scenario_count=len(observations),
                            observed_min_exact=min(exact) if exact else None,
                            observed_max_exact=max(exact) if exact else None, has_censored_value=censored,
                            latest_wave_min=min(latest) if latest else None,
                            latest_wave_max=max(latest) if latest else None,
                            reference_percent=reference.get(candidate['candidate_id']),
                            reference_rank=ref_ranks.get(candidate['candidate_id']),
                            documentary_priority=candidate['candidate_id'] in priority_ids,
                            complementary_priority=candidate['candidate_id'] == 'gabriel-attal'))
    result = dict(snapshot_date='2026-10-28', metric='Intention de vote au premier tour, % exprimés',
                  reference_scenario='cluster17-2026-10-26/H1',
                  priority_rule='Cinq premiers du scénario H1 de la dernière vague publiée retenue ; choix documentaire conditionnel. Attal ajouté en complément car absent de H1 et à 12 % dans H2.',
                  limitations=['Pas de moyenne de scénarios incompatibles ni de score de popularité générale.',
                               'Une absence dans ce corpus de quatre enquêtes ne démontre pas une absence dans tous les sondages.',
                               'Les fourchettes sont des écarts entre scénarios et instituts, pas des intervalles de confiance.',
                               'Les scores sont affectés des marges décrites dans chaque notice.',
                               'Le rang de référence n’est attribué qu’aux personnes testées dans ce scénario.'],
                  polls=polls)
    write_json(OUT / 'enquetes-et-scenarios.json', result)
    write_json(OUT / 'observations.json', rows)
    write_json(OUT / 'croisement-49-personnes.json', summary)
    write_csv(OUT / 'observations.csv', rows)
    write_csv(OUT / 'croisement-49-personnes.csv', summary)
    by_id = {x['candidate_id']: x for x in summary}
    table = ['| Personne | Liste initiale | Couverture (enquêtes / scénarios) | Min–max exacts du corpus (%) | Dernière vague, tous scénarios (%) | Rang H1 |',
             '|---|---|---|---|---|---|']
    def number(value):
        return str(value).replace('.', ',')
    for row in sorted(summary, key=lambda x: (x['reference_rank'] is None, x['reference_rank'] or 100, x['name'])):
        observed = 'Non repéré' if not row['scenario_count'] else (
            f"{number(row['observed_min_exact'])}–{number(row['observed_max_exact'])}" if row['observed_min_exact'] is not None else '<1 uniquement')
        if row['has_censored_value'] and row['observed_min_exact'] is not None:
            observed += ' ; aussi <1'
        latest = f"{number(row['latest_wave_min'])}–{number(row['latest_wave_max'])}" if row['latest_wave_min'] is not None else 'Non testé'
        table.append(f"| {row['name']} | {row['initial_list']} | {row['poll_count']} / {row['scenario_count']} | {observed} | {latest} | {row['reference_rank'] or '—'} |")
    report = '''# Sondages et priorités documentaires — 28 octobre 2026

## Périmètre et méthode

Croisement des **49 personnes** de `candidats-2027-v1` avec les quatre dernières enquêtes d'intentions de vote de premier tour retenues dans le registre de la Commission des sondages : publications des 22, 23, 24 et 26 octobre 2026. Le baromètre politique Odoxa du 27 octobre est d'une autre nature et n'est pas mélangé à ces intentions de vote. Cette recherche porte sur la force électorale mesurée au premier tour, pas sur la sympathie ou la notoriété.

Les **13 scénarios**, leurs bulletins exacts, dates de terrain, échantillons, bases utiles, valeurs publiées et pages sources sont conservés dans les fichiers de données. Aucune moyenne de scénarios n'est calculée. Les quatre PDF ont été téléchargés depuis la Commission ; les tableaux récapitulatifs ont été contrôlés visuellement, et les pages détaillées lues pour l'attribution des valeurs. En particulier, OpinionWay publie « <1 % » pour Arthaud et Bouamrane : ce n'est pas remplacé par 0.

Une personne non repérée dans ces quatre enquêtes reste dans la base avec une valeur absente. Ce statut ne signifie ni 0 %, ni absence dans tous les sondages disponibles. Les statuts de candidature de la base initiale ne sont pas revalidés par le simple fait d'être testé dans une enquête.

## Cinq priorités de référence et sensibilité

Pour choisir un ensemble concret sans fabriquer un classement mêlant des bulletins différents, retenir le **scénario H1 de Cluster17 pour POLITICO, publié le 26 octobre**, terrain du 19 au 22 octobre : 2 817 inscrits issus de 3 000 adultes ; base utile pondérée de H1 : 1 920. Il teste Philippe et Glucksmann, sans Attal, Lisnard ni Hollande. Il s'agit d'une convention documentaire explicite, pas d'un classement universel des 49 personnes.

| Rang dans H1 | Personne | Intention de vote publiée |
|---|---|---:|
'''
    for candidate_id in priority_ids:
        row = by_id[candidate_id]
        report += f"| {row['reference_rank']} | {row['name']} | {number(row['reference_percent'])} % |\n"
    report += '''
**Sensibilité :** dans H2 de la même enquête, Attal remplace Philippe et atteint 12 %, devant Retailleau à 10 %. Dans Ipsos avec Attal et Philippe, Attal est à 4 % et Retailleau à 7,5 %. La cinquième place est donc conditionnelle. **Gabriel Attal fait l'objet d'une collecte complémentaire**, de sorte que les deux choix possibles sont couverts. Dans OpinionWay, Lisnard et Retailleau sont à égalité à 6 %, derrière les quatre premiers ; Lisnard atteint 8 % dans certains autres scénarios. Il reste dans le croisement et pourra faire l'objet de la prochaine extension documentaire.

Les deux places Philippe / Glucksmann peuvent aussi s'inverser selon l'institut et le scénario. Les écarts entre candidats doivent être lus avec les marges d'erreur, sans surinterpréter les rangs proches.

## Enquêtes sources

| Institut et commanditaire | Publication | Terrain | Inscrits | Scénarios de premier tour | Pages PDF des résultats |
|---|---|---|---:|---:|---|
| Cluster17 pour POLITICO | 26/10/2026 | 19–22/10 | 2 817 | 3 | 18–20 |
| Ipsos bva CESI école d'ingénieurs pour Le Parisien | 24/10/2026 | 21–22/10 | 1 500 | 4 | 11, 13, 15, 17 |
| Toluna Harris Interactive pour M6 et RTL | 23/10/2026 | 19–21/10 | 2 094 | 5 | 35, 37, 39, 42, 45 |
| Sondage OpinionWay pour CNEWS | 22/10/2026 | 21–22/10 | 973 | 1 | 12 |

**Marges :** Cluster17 publie, sur les bases utiles de 1 889 à 1 920, environ ±1 point à 5 %, ±1,3 à 10 %, ±1,8 à 20 %, ±2 à 30 % et ±2,2 à 40–50 %. Ipsos indique des marges individuelles jusqu'à ±2,9 points, enregistrées dans les données. Toluna Harris Interactive indique ±1,4 à ±2,9 points sur les résultats et ±1,4 à ±3,1 dans la méthodologie générale ; cette différence interne est conservée. OpinionWay fournit une table pour 731 certains d'aller voter (±1,6 à ±3,7 points selon le score), tandis que la base exprimée est de 680. Consulter les notices pour le détail. Ce sont les indications publiées par les instituts, pas des marges recalculées ici.

Les liens `add` de la Commission redirigent vers les PDF, parfois en HTTP : URL demandée et URL finale sont toutes deux conservées dans le registre. Le titre/métadonnée OpinionWay comporte « Septembre » alors que la notice indique un terrain des 21–22 octobre et figure dans le registre d'octobre ; l'anomalie est conservée.

## Croisement complet

15 personnes sont testées au moins une fois ; 34 ne sont pas repérées dans ce corpus. Les bornes du tableau sont des **variations entre scénarios/instituts**, jamais des marges d'erreur. Les valeurs « <1 » restent signalées séparément des minimums exacts.

'''
    report += '\n'.join(table)
    report += '''

## Fichiers réutilisables

- [Enquêtes, scénarios et méthode](../data/research/2026-10-28/sondages/enquetes-et-scenarios.json).
- [Observations en CSV](../data/research/2026-10-28/sondages/observations.csv) et [JSON](../data/research/2026-10-28/sondages/observations.json) : une valeur publiée par personne et scénario.
- [Croisement des 49 personnes en CSV](../data/research/2026-10-28/sondages/croisement-49-personnes.csv) et [JSON](../data/research/2026-10-28/sondages/croisement-49-personnes.json).
- [Registre des sources téléchargées](../data/research/2026-10-28/sources.json) : URL, horodatage, empreinte SHA-256 et chemin local.
- [Documents économiques et budgétaires collectés](PROGRAMMES_FINANCIERS_2027.md).

## Sources primaires en ligne

- [Registre de la Commission des sondages](https://www.commission-des-sondages.fr/notices/medias/fichiers/bytag/14/2027-Presidentielle).
- [Cluster17 pour POLITICO, notice 10339](https://www.commission-des-sondages.fr/notices/medias/fichiers/add/2361).
- [Ipsos bva pour Le Parisien, notice 10338](https://www.commission-des-sondages.fr/notices/medias/fichiers/add/2357).
- [Toluna Harris Interactive pour M6 et RTL, notice 10332](https://www.commission-des-sondages.fr/notices/medias/fichiers/add/2351).
- [Sondage OpinionWay pour CNEWS, notice 10333](https://www.commission-des-sondages.fr/notices/medias/fichiers/add/2352).
'''
    (ROOT / 'docs/SONDAGES_2027_2026-10-28.md').write_text(report, encoding='utf-8')
    print(json.dumps(dict(persons=len(summary), tested=sum(bool(x['scenario_count']) for x in summary),
                          observations=len(rows), scenarios=sum(len(x['scenarios']) for x in polls),
                          priority_ids=priority_ids), ensure_ascii=False))


if __name__ == '__main__':
    main()
