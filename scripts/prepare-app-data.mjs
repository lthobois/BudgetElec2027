import { readFile, writeFile, mkdir, copyFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildVerification } from './build_programme_verification.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(root, 'data/research/2026-10-28');
const read = async (file) => JSON.parse(await readFile(path.join(base, file), 'utf8'));

export async function buildAppData() {
  const [people, profiles, polling, verification, markdown] = await Promise.all([
    read('sondages/croisement-49-personnes.json'), read('programmes/catalogue.json'),
    read('sondages/enquetes-et-scenarios.json'), buildVerification(),
    readFile(path.join(root, 'docs/CANDIDATS_2027.md'), 'utf8'),
  ]);
  const identities = new Map(markdown.split(/\r?\n/).filter((line) => /^\| [a-z]+(?:-[a-z]+)+ \|/.test(line)).map((line) => {
    const cells = line.split('|').map((value) => value.trim());
    return [cells[1], { party: cells[3] || 'Rattachement non précisé', reservation: cells[4] === '—' ? null : cells[4] || null }];
  }));
  const candidates = people.map((person) => ({ ...person, ...identities.get(person.candidate_id), profile: profiles.find((p) => p.candidate_id === person.candidate_id) || null, audit: verification.audits.find((audit) => audit.candidate_id === person.candidate_id) || null }));
  const exportedSources = [];
  for (const source of verification.sources.filter((item) => item.status === 'downloaded')) {
    const safe = { id: source.id, candidate_id: source.candidate_id || null, url: source.url,
      kind: source.kind, publication_date: source.publication_date || null,
      consulted_at_utc: source.consulted_at_utc, sha256: source.sha256, page_count: source.page_count || null,
      limitation: source.limitation || null, content_status: source.content_status || null, title: source.title || null,
      pdf_url: null, text_url: null };
    const files = [];
    if (source.path?.endsWith('.pdf')) files.push(['pdf_url', source.path, '.pdf']);
    if (source.text_path && source.content_status !== 'browser_redirect_only_no_letter_text') files.push(['text_url', source.text_path, '.txt']);
    for (const [key, relative, extension] of files) {
      const original = path.resolve(root, relative);
      if (!original.startsWith(root + path.sep) || !['.pdf', '.txt'].includes(path.extname(original))) throw new Error(`Unsafe source: ${relative}`);
      await stat(original);
      const name = source.id.replace(/[^a-z0-9-]/g, '-') + extension;
      await mkdir(path.join(root, 'public/documents'), { recursive: true });
      await copyFile(original, path.join(root, 'public/documents', name));
      safe[key] = '/documents/' + name;
    }
    exportedSources.push(safe);
  }
  return { snapshot_date: '2026-10-28', candidates, profiles, polling, sources: exportedSources, verification: { checked_date: '2026-10-28', measures: verification.measures, comparisons: verification.comparisons } };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const data = await buildAppData();
  await mkdir(path.join(root, 'public/data'), { recursive: true });
  await writeFile(path.join(root, 'public/data/catalogue.json'), JSON.stringify(data));
  console.log(`Corpus préparé : ${data.candidates.length} profils, ${data.profiles.length} dossiers, ${data.polling.polls.reduce((n, p) => n + p.scenarios.length, 0)} scénarios.`);
}
