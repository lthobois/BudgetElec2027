import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(root, 'data/research/2026-10-28');
const folder = path.join(base, 'verification');
const json = async (file) => JSON.parse(await readFile(file, 'utf8'));
const normal = (text) => String(text).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const csv = (value) => '"' + String(value ?? '').replaceAll('"', '""') + '"';
const axes = new Set(['dette', 'entreprises', 'particuliers', 'depenses', 'travail', 'investissement']);
const attributions = new Set(['personal_2027', 'personal_statement', 'party_collective', 'historical_updated']);
const labels = { personal_2027: 'Engagement personnel 2027', personal_statement: 'Déclaration personnelle', party_collective: 'Projet collectif du parti', historical_updated: 'Document antérieur / autre scrutin' };

async function findFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => entry.isDirectory() ? findFiles(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
  return files.flat();
}

export async function buildVerification() {
  const files = await findFiles(folder);
  const audits = await Promise.all(files.filter((file) => path.basename(file) === 'audit.json').sort().map(json));
  if (audits.length !== 6) throw new Error(`Six audits attendus, ${audits.length} trouvés.`);
  const allSources = new Map((await json(path.join(base, 'sources.json'))).map((source) => [source.id, source]));
  for (const file of files.filter((file) => file.endsWith('-results.json')).sort()) {
    const results = await json(file);
    if (!Array.isArray(results)) throw new Error(`Registre de résultats invalide : ${file}`);
    for (const source of results) {
      if (!source.id) throw new Error(`Source sans identifiant : ${file}`);
      if (source.status === 'downloaded' || !allSources.has(source.id)) allSources.set(source.id, source);
    }
  }
  const sources = [...allSources.values()];
  const textById = new Map();
  for (const source of sources.filter((item) => item.status === 'downloaded')) {
    const original = path.resolve(root, source.path);
    if (!original.startsWith(root + path.sep)) throw new Error(`Archive hors projet : ${source.id}`);
    const bytes = await readFile(original);
    if (createHash('sha256').update(bytes).digest('hex') !== source.sha256) throw new Error(`Empreinte différente : ${source.id}`);
    if (source.text_path) textById.set(source.id, normal(await readFile(path.resolve(root, source.text_path), 'utf8')));
  }
  const measures = [];
  const ids = new Set();
  const personIds = new Set();
  for (const audit of audits) {
    if (personIds.has(audit.candidate_id)) throw new Error(`Audit dupliqué : ${audit.candidate_id}`);
    personIds.add(audit.candidate_id);
    for (const sourceId of [...audit.source_ids, ...(audit.publication_status_source_ids || []), ...audit.strategy.source_ids]) {
      if (allSources.get(sourceId)?.status !== 'downloaded') throw new Error(`Source d'audit non acquise : ${sourceId}`);
    }
    for (const measure of audit.measures) {
      if (!measure.id || ids.has(measure.id)) throw new Error(`Identifiant de mesure absent ou dupliqué : ${measure.id}`);
      ids.add(measure.id);
      if (!axes.has(measure.axis) || !attributions.has(measure.attribution)) throw new Error(`Qualification invalide : ${measure.id}`);
      for (const field of ['title', 'description', 'source_id', 'source_url', 'locator', 'evidence_excerpt', 'financing', 'beneficiaries', 'limits']) {
        if (typeof measure[field] !== 'string' || !measure[field].trim()) throw new Error(`Champ ${field} manquant : ${measure.id}`);
      }
      const source = allSources.get(measure.source_id);
      if (source?.status !== 'downloaded' || source.candidate_id !== audit.candidate_id) throw new Error(`Source attribuée incorrectement : ${measure.id}`);
      if (!textById.get(measure.source_id)?.includes(normal(measure.evidence_excerpt))) throw new Error(`Extrait introuvable : ${measure.id}`);
      measures.push({ ...measure, candidate_id: audit.candidate_id, checked_date: audit.checked_date });
    }
  }
  let comparisons = { checked_date: '2026-10-28', methodology: 'Rapprochements chiffrés en préparation.', families: [] };
  try { comparisons = await json(path.join(folder, 'comparaisons.json')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  for (const family of comparisons.families) for (const entry of family.entries) {
    if (!measures.some((measure) => measure.id === entry.measure_id && measure.candidate_id === entry.candidate_id)) throw new Error(`Référence de comparaison inconnue : ${entry.measure_id}`);
  }
  await mkdir(folder, { recursive: true });
  for (const [name, value] of [['catalogue.json', audits], ['mesures.json', measures], ['sources.json', sources]]) {
    await writeFile(path.join(folder, name), JSON.stringify(value, null, 2) + '\n');
  }
  const fields = ['candidate_id', 'id', 'axis', 'title', 'description', 'attribution', 'source_id', 'source_url', 'locator', 'horizon', 'amount', 'financing', 'beneficiaries', 'limits'];
  await writeFile(path.join(folder, 'mesures.csv'), '\uFEFF' + [fields.map(csv).join(','), ...measures.map((measure) => fields.map((field) => csv(field === 'amount' ? JSON.stringify(measure.amount) : measure[field])).join(','))].join('\n') + '\n');
  let report = '# Vérification approfondie des programmes — 28 octobre 2026\n\n';
  report += `Cette passe examine six dossiers et extrait **${measures.length} propositions**. Elle distingue engagements personnels, projets collectifs et textes antérieurs. Les montants sont ceux des auteurs ; aucun chiffrage indépendant ni modèle macroéconomique n'est validé ici. Une recherche infructueuse n'établit pas une non-publication.\n\n`;
  report += 'Les archives initiales restent inchangées. Ce rapport et les audits constituent une mise à jour explicite de leur qualification documentaire.\n\n';
  for (const audit of audits) {
    const name = audit.candidate_id.split('-').join(' ');
    report += `## ${name}\n\n**${audit.publication_status_label}.** ${audit.publication_status_detail}\n\n${audit.scope_warning}\n\n`;
    report += `**Lecture des mécanismes (interprétation) :** ${audit.strategy.summary}\n\n${audit.strategy.limits}\n\n`;
    report += '| Proposition | Axe | Nature | Passage source |\n|---|---|---|---|\n';
    for (const measure of audit.measures) report += `| ${measure.title.replaceAll('|', '/')} | ${measure.axis} | ${labels[measure.attribution]} | [${measure.locator.replaceAll('|', '/')}](${measure.source_url}) |\n`;
    report += `\n**Financement :** ${audit.assessment.funding}\n\n**Répartition :** ${audit.assessment.distribution}\n\n**Faisabilité à examiner :** ${audit.assessment.feasibility}\n\n**Limites :** ${audit.assessment.limitations}\n\n`;
    report += `[Audit complet et journal de recherche](../data/research/2026-10-28/verification/${audit.candidate_id}/audit.json).\n\n`;
  }
  report += '## Données réutilisables\n\n- [Mesures JSON](../data/research/2026-10-28/verification/mesures.json) et [CSV](../data/research/2026-10-28/verification/mesures.csv).\n- [Registre fusionné des sources](../data/research/2026-10-28/verification/sources.json), avec empreintes et dates.\n- [Audits des six personnes](../data/research/2026-10-28/verification/catalogue.json).\n\nLes extraits probants sont contrôlés dans les textes archivés après normalisation des blancs, accents et césures. Ce contrôle de présence ne remplace pas la relecture du passage et de son contexte.\n';
  await writeFile(path.join(root, 'docs/ETAT_PROGRAMMES_APPROFONDI.md'), report);
  return { audits, measures, sources, comparisons };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const data = await buildVerification();
  console.log(`${data.audits.length} audits, ${data.measures.length} mesures vérifiées, ${data.comparisons.families.length} rapprochements chiffrés.`);
}
