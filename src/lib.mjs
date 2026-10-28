export const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export const initials = (name) => name.split(/[ -]/).filter(Boolean).map((part) => part[0]).filter((_, i, a) => i === 0 || i === a.length - 1).join('');
export const formatPercent = (value) => value === null || value === undefined ? 'Non testé' : `${String(value).replace('.', ',').replace('<', '< ')} %`;
export function filterCandidates(candidates, { query = '', scope = 'collected', kind = 'all' } = {}) {
  const search = normalize(query);
  return candidates.filter((c) => (scope !== 'collected' || c.profile) && normalize(`${c.name} ${c.party}`).includes(search)
    && (kind === 'all' || (kind === 'personal' ? c.profile?.financial_document_status.startsWith('personal_') : kind === 'related' ? c.profile && !c.profile.financial_document_status.startsWith('personal_') : !c.profile)));
}
export function toggleComparison(ids, id) {
  if (ids.includes(id)) return ids.filter((value) => value !== id);
  return ids.length < 3 ? [...ids, id] : ids;
}
export const AXES = [
  ['strategie', 'Stratégie économique', 'Offre, demande, redistribution : par quels mécanismes créer et répartir la richesse ?', 'Offre et demande'],
  ['dette', 'Déficit et dette', 'Quelle trajectoire pour le déficit, la dette et la charge d’intérêts ? Sous quelles hypothèses ?', 'Comptes publics'],
  ['entreprises', 'Fiscalité des entreprises', 'IS, impôts de production, cotisations et aides : quels changements pour quelles entreprises ?', 'Entreprises'],
  ['particuliers', 'Fiscalité des particuliers', 'Revenus, consommation, patrimoine et successions : qui contribuerait davantage ou moins ?', 'Particuliers'],
  ['depenses', 'Dépenses et services publics', 'Quels moyens, quelles économies et quelles conséquences sur les services rendus ?', 'Services publics'],
  ['travail', 'Travail et protection sociale', 'Quels effets sur les salaires, l’emploi, les retraites et la protection sociale ?', 'Travail et social'],
  ['investissement', 'Production et investissement', 'Quels leviers pour l’industrie, l’énergie, le logement et la transition écologique ?', 'Investissement'],
  ['repartition', 'Répartition des effets', 'Quels bénéficiaires et contributeurs selon le revenu, la génération et le territoire ?', 'Effets distributifs'],
  ['faisabilite', 'Cohérence et faisabilité', 'Le financement, le calendrier et les moyens de mise en œuvre sont-ils documentés ?', 'Faisabilité'],
].map(([id, title, question, short], index) => ({ id, title, question, short, number: String(index + 1).padStart(2, '0') }));
export const GROUPS = { A: 'Déclaration rapportée par la presse', B: 'Annonce à recouper', C: 'Statut à clarifier', D: 'Personnalité pressentie' };
export const CANDIDATE_REGISTRY_SOURCES = [
  { id: 'S1', label: 'LCP — candidats déjà en lice et prétendants', url: 'https://lcp.fr/actualites/presidentielle-2027-la-liste-des-candidats-deja-en-lice-et-des-pretendants-436373' },
  { id: 'S2', label: 'Public Sénat — candidats déclarés ou presque', url: 'https://www.publicsenat.fr/actualites/politique/election-presidentielle-2027-qui-sont-les-candidats-declares-ou-presque' },
  { id: 'S3', label: 'PresiTracker2027 — recensement des candidatures', url: 'https://presitracker2027.fr/candidats' },
];
export function pageTitle(route, candidates) {
  const [view, id] = route.split('/');
  const candidate = id ? candidates.find((person) => person.candidate_id === id) : null;
  const title = view === 'candidats' && id ? candidate?.name || 'Page introuvable'
    : { candidats: 'Les candidats', comparer: 'Comparer les dossiers', documents: 'Les documents', sondages: 'Les sondages', methode: 'Notre méthode' }[view] || 'Page introuvable';
  return `${title} — Éclairage 2027`;
}
export function profileLabel(candidate) {
  if (!candidate.profile) return 'Collecte à réaliser';
  return candidate.profile.financial_document_status.startsWith('personal_') ? 'Documents de campagne' : 'Documents connexes';
}
export function sourceLabel(source) {
  const labels = { 'rn-contre-budget-2026': 'Contre-budget RN 2026', 'rn-entreprises': 'La France entreprend', 'melenchon-comptes-publics': 'Remettre de l’ordre dans les comptes publics', 'melenchon-pole-bancaire': 'Pour un pôle public bancaire', 'philippe-prosperite': 'Pour une France plus prospère', 'glucksmann-acte1': 'Acte I — Notre vision pour la France', 'retailleau-livret-comptes-publics': 'Rétablir l’ordre dans les comptes publics', 'attal-lettre-finances': 'Plan pour rétablir les finances publiques', 'attal-plan-desendettement': 'Plan de désendettement et Messmer II', 'attal-dette-etat': 'Dette de l’État', 'attal-travail-salaires': 'Travail et salaires', 'rn-index': 'Présentation du Rassemblement national', 'melenchon-programme-index': 'Découvrir le programme de Jean-Luc Mélenchon', 'melenchon-laec-index': 'L’Avenir en commun — page de présentation', 'attal-programme-index': 'Les chantiers capitaux de Gabriel Attal', 'attal-actualites-index': 'Publications de campagne de Gabriel Attal', 'glucksmann-projet-parti': 'Le projet de Place publique', 'glucksmann-campagne': 'Présentation de la campagne de Raphaël Glucksmann', 'retailleau-theme-comptes-publics': 'Comptes publics — présentation du dossier', 'retailleau-trajectoire': 'La trajectoire financière du projet', 'retailleau-deficit': 'Réduire le déficit pour retrouver notre souveraineté', 'retailleau-faire-mieux': 'Faire mieux — le fonctionnement de l’État', 'retailleau-faire-moins': 'Faire moins — revoir le périmètre de l’État', 'retailleau-etre-juste': 'Être juste — fraude et aides publiques', 'retailleau-regle-or': 'La règle d’or budgétaire' };
  return labels[source.id] || source.id.replace(/^(retailleau|attal|rn|glucksmann|melenchon|philippe)-/, '').replace(/-/g, ' ');
}
export function sourceKindLabel(source) {
  const labels = {
    notice_sondage: 'Notice originale de sondage', page_campagne: 'Page officielle de campagne',
    orientations_budgetaires_2027: 'Orientations budgétaires 2027 · chiffrage partiel',
    plan_thematique: 'Plan thématique de campagne', priorites_campagne_2027: 'Priorités personnelles de campagne 2027',
    projet_parti: 'Projet collectif du parti · attribution personnelle à confirmer', page_parti: 'Page officielle du parti',
    contre_budget_parti_2026: 'Contre-budget du parti pour 2026 · publié en 2025',
    programme_2022_mis_a_jour_base_travail: 'Programme 2022 mis à jour · base de travail, engagement 2027 à confirmer',
    projet_collectif_parti_date_a_confirmer: 'Projet collectif du parti · date exacte non établie',
    priorites_budgetaires_campagne_2027: 'Priorités budgétaires personnelles de campagne 2027',
    priorites_economiques_campagne_2027: 'Priorités économiques personnelles de campagne 2027',
    annonce_personnelle_campagne_2027: 'Annonce personnelle de campagne 2027',
    index_recherche_documentaire: 'Index des publications de campagne', registre_officiel: 'Registre officiel des sondages',
    trajectoire_budgetaire_campagne_2027: 'Trajectoire budgétaire annoncée pour le mandat',
    mesure_budgetaire_campagne_2027: 'Mesure budgétaire de campagne 2027',
    annonce_budgetaire_campagne_2027: 'Annonce budgétaire personnelle de campagne 2027',
    programme_campagne_2027: 'Page du programme de campagne 2027',
    fiches_presse_budgetaires_campagne_2027: 'Dossier budgétaire de campagne · chiffrage du candidat',
    index_programme_budgetaire: 'Présentation du programme budgétaire', lien_lettre_campagne: 'Lien vers la lettre de campagne',
  };
  return labels[source.kind] || 'Document conservé · qualification à préciser';
}
