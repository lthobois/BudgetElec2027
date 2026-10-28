"""Index the sources already downloaded for the 2026-10-28 research snapshot."""
import csv
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'data/research/2026-10-28'

profiles = [
    dict(candidate_id='marine-le-pen', name='Marine Le Pen', priority='reference_top5',
         financial_document_status='related_party_documents_found_personal_2027_programme_not_found_in_search',
         programme_scope='Contre-budget RN 2026 et livret entreprises reprenant une version 2022 mise à jour',
         source_ids=['rn-index', 'rn-contre-budget-2026', 'rn-entreprises'],
         primary_source_id='rn-contre-budget-2026',
         findings='Le contre-budget est daté du 23 octobre 2025 sur sa couverture et vise 2026. Le livret entreprises précise p. 2 qu’il s’agit de la version 2022 mise à jour, servant de base de travail pour les prochaines échéances.',
         limits='Aucun programme financier personnel consolidé pour la présidentielle 2027 identifié dans les sources officielles consultées. Ne pas transformer ces documents en engagements 2027 confirmés.',
         useful_locations='Contre-budget : couverture p. 1, mesures et tableaux p. 3–7 ; livret entreprises : avertissement d’édition p. 2.'),
    dict(candidate_id='jean-luc-melenchon', name='Jean-Luc Mélenchon', priority='reference_top5',
         financial_document_status='personal_2027_budget_orientations_found_partial_costing',
         programme_scope='Orientations budgétaires 2027 et plan thématique sur le pôle public bancaire',
         source_ids=['melenchon-programme-index', 'melenchon-comptes-publics', 'melenchon-pole-bancaire', 'melenchon-laec-index'],
         primary_source_id='melenchon-comptes-publics',
         findings='Deux PDF officiels conservés : Comment nous allons remettre de l’ordre dans les comptes publics (24 pages), et dossier pôle public bancaire (16 pages). La page de campagne rattache ces documents au programme et annonce le livre pour le 6 novembre.',
         limits='La page officielle précise que les orientations 2027 ne constituent pas le chiffrage complet de L’Avenir en commun sur plusieurs années. La date exacte de publication du PDF n’est pas établie par son seul chemin /2026/10/. Le livre intégral 2027 n’a pas été téléchargé.',
         useful_locations='Comptes publics : sommaire p. 3 ; dépenses et urgences p. 8–12 ; ressources p. 13–14 ; investissement p. 15–16 ; stratégie budgétaire p. 17–18 ; financement p. 19–20. Vérifier chaque passage avant extraction de mesure.'),
    dict(candidate_id='edouard-philippe', name='Édouard Philippe', priority='reference_top5',
         financial_document_status='personal_2027_economic_and_budget_priorities_found_html',
         programme_scope='Priorités économiques et budgétaires de campagne, page HTML',
         source_ids=['philippe-prosperite'], primary_source_id='philippe-prosperite',
         findings='La page Pour une France plus prospère contient des mesures sur la fiscalité des entreprises, les dépenses publiques, le déficit, les retraites et l’assurance chômage. HTML original et texte extrait conservés.',
         limits='Aucun dossier PDF budgétaire autonome ni chiffrage exhaustif de l’ensemble du programme identifié sur cette page. Des objectifs chiffrés ne suffisent pas à établir un financement complet. Date de publication non indiquée dans le contenu consulté.',
         useful_locations='Intertitres : Libérer nos entreprises ; Rétablir nos comptes ; Alléger la charge sur les actifs ; Relèvement économique de l’Europe.'),
    dict(candidate_id='raphael-glucksmann', name='Raphaël Glucksmann', priority='reference_top5',
         financial_document_status='collective_party_project_found_personal_2027_financial_programme_not_found_in_search',
         programme_scope='Acte I de Place publique, vision collective ; page personnelle de campagne',
         source_ids=['glucksmann-projet-parti', 'glucksmann-campagne', 'glucksmann-acte1'],
         primary_source_id='glucksmann-acte1',
         findings='Acte I — Notre vision pour la France téléchargé depuis le lien officiel du parti : 88 pages. Le texte comprend des orientations sociales, économiques, fiscales et de financement. Le site de campagne glucks2027.fr est relié depuis Place publique.',
         limits='Ce projet collectif est distinct d’un programme financier personnel consolidé de 2027. Aucun tel document identifié dans les pages officielles consultées. La date exacte de publication n’est pas établie ici par la page ni la couverture ; la qualification initiale 2025 du manifeste de collecte reste à confirmer par une notice primaire datée.',
         useful_locations='Sommaire au début du PDF ; section Retrouver les moyens d’agir, financer nos ambitions à la fin du document. Ne pas attribuer automatiquement chaque proposition collective au candidat.'),
    dict(candidate_id='bruno-retailleau', name='Bruno Retailleau', priority='reference_top5',
         financial_document_status='personal_2027_budget_dossier_and_trajectory_found',
         programme_scope='Fiches presse budgétaires du 12 octobre 2026, trajectoire et six fiches web',
         source_ids=['retailleau-livret-comptes-publics', 'retailleau-theme-comptes-publics', 'retailleau-trajectoire', 'retailleau-deficit', 'retailleau-faire-mieux', 'retailleau-faire-moins', 'retailleau-etre-juste', 'retailleau-regle-or'],
         primary_source_id='retailleau-livret-comptes-publics',
         findings='Rétablir l’ordre dans les comptes publics : PDF de 17 pages, daté 12 10 26 sur la couverture, lié par Téléchargez le livret sur la rubrique Comptes publics du site de campagne. Comprend trajectoire, hypothèses, mesures et financement revendiqué.',
         limits='Le chiffrage est celui du candidat, sans validation indépendante dans cette collecte. Le dossier budgétaire ne représente pas nécessairement l’intégralité du programme présidentiel. Des pages index ont expiré à deux reprises ; les fiches et le PDF ont bien été téléchargés.',
         useful_locations='Sommaire p. 2 ; hypothèses et trajectoire p. 4 ; État p. 5–7 ; sphère sociale p. 8–13 ; collectivités p. 14 ; déficit p. 15 ; restitution p. 16 ; règle d’or p. 17.'),
    dict(candidate_id='gabriel-attal', name='Gabriel Attal', priority='scenario_sensitivity_complement',
         financial_document_status='personal_2027_debt_reduction_plan_found_html',
         programme_scope='Plan de désendettement, propositions dette et travail, présentation de lettre aux Français',
         source_ids=['attal-programme-index', 'attal-dette-etat', 'attal-travail-salaires', 'attal-plan-desendettement', 'attal-lettre-finances', 'attal-actualites-index', 'attal-lettre-application'],
         primary_source_id='attal-lettre-finances',
         findings='Les publications officielles des 23 septembre et 15 octobre 2026 exposent un plan de désendettement et ses objectifs. Pages HTML et texte extrait conservés. La publication du 15 octobre renvoie vers une lettre dans attal.app.',
         limits='Le lien attal.app fournit uniquement une redirection côté navigateur, sans le texte intégral de la lettre dans la capture. La lettre intégrale n’est donc pas considérée comme acquise. Aucun PDF de chiffrage exhaustif identifié dans les pages consultées. Les deux publications doivent être rapprochées pour vérifier les éventuelles évolutions de calendrier.',
         useful_locations='Publication du 15 octobre : intertitre Un plan de 150 milliards d’euros d’économies sur cinq ans ; publication du 23 septembre : Un plan de 150 milliards d’euros d’économies ; page Dette de l’État.')
]


def main():
    attempts = []
    for name in ['collecte-initiale', 'collecte-complementaire', 'collecte-finale', 'collecte-livrets']:
        attempts.extend(json.loads((BASE / (name + '-results.json')).read_text(encoding='utf-8')))
    sources = {r['id']: r for r in attempts}
    sources['rn-contre-budget-2026']['publication_date'] = '2025-10-23'
    sources['rn-contre-budget-2026']['date_evidence'] = 'Couverture PDF p. 1'
    sources['rn-entreprises']['kind'] = 'programme_2022_mis_a_jour_base_travail'
    sources['rn-entreprises']['edition_evidence'] = 'PDF p. 2 : version 2022 mise à jour, base de travail pour les prochaines échéances'
    sources['glucksmann-acte1']['publication_date'] = None
    sources['glucksmann-acte1']['kind'] = 'projet_collectif_parti_date_a_confirmer'
    sources['glucksmann-acte1']['date_note'] = 'Date exacte non établie par la source primaire consultée ; la catégorie 2025 du manifeste initial est à confirmer.'
    sources['attal-lettre-application']['content_status'] = 'browser_redirect_only_no_letter_text'
    for record in sources.values():
        if record['status'] == 'downloaded':
            target = ROOT / record['path']
            assert target.is_file()
            assert hashlib.sha256(target.read_bytes()).hexdigest() == record['sha256']
    (BASE / 'sources.json').write_text(json.dumps(list(sources.values()), ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    for profile in profiles:
        profile['snapshot_date'] = '2026-10-28'
        profile['analysis_status'] = 'collected_not_independently_evaluated'
        docs = [sources[key] for key in profile['source_ids']]
        folder = BASE / 'programmes' / profile['candidate_id']
        (folder / 'fiche.json').write_text(json.dumps(profile, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        report = f"# {profile['name']} — dossier économique et budgétaire\n\nDate de collecte : 28 octobre 2026.\n\n"
        report += f"## Qualification\n\n{profile['programme_scope']}.\n\n{profile['findings']}\n\n"
        report += f"## Limites d’attribution et de couverture\n\n{profile['limits']}\n\n"
        report += f"## Repères pour l’analyse ultérieure\n\n{profile['useful_locations']}\n\n"
        report += 'Les données chiffrées présentes dans les documents sont des affirmations de leurs auteurs. Aucun contrôle de faisabilité, aucune notation et aucune validation indépendante ne sont réalisés ici.\n\n'
        report += '## Sources conservées\n\n| Identifiant | Nature | Original local | Texte extrait | Source en ligne |\n|---|---|---|---|---|\n'
        for record in docs:
            original = Path(record['path']).name
            extracted = Path(record['text_path']).name
            report += f"| {record['id']} | {record['kind']} | [{original}](sources/{original}) | [Texte](sources/{extracted}) | [Source]({record['url']}) |\n"
        report += '\nLes empreintes SHA-256, tailles, dates de consultation UTC et redirections figurent dans [le registre global](../../sources.json). Les pages HTML constituent des captures de contenu ; leurs ressources externes ne sont pas entièrement archivées. Les textes extraits peuvent perdre la mise en page et ne remplacent pas les PDF pour lire un tableau.\n'
        (folder / 'README.md').write_text(report, encoding='utf-8')
    (BASE / 'programmes/catalogue.json').write_text(json.dumps(profiles, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    fields = ['candidate_id', 'name', 'priority', 'financial_document_status', 'programme_scope', 'primary_source_id', 'limits']
    with (BASE / 'programmes/catalogue.csv').open('w', encoding='utf-8-sig', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=fields)
        writer.writeheader()
        writer.writerows({key: profile[key] for key in fields} for profile in profiles)
    pdfs = [r for r in sources.values() if r['status'] == 'downloaded' and r['path'].endswith('.pdf')]
    print(json.dumps(dict(sources=len(sources), downloaded=sum(r['status']=='downloaded' for r in sources.values()),
                          failures=sum(r['status']=='failed' for r in sources.values()), pdfs=len(pdfs),
                          programmes=len(profiles)), ensure_ascii=False))


if __name__ == '__main__':
    main()
