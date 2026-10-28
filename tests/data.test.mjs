import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildAppData } from '../scripts/prepare-app-data.mjs';
import { filterCandidates, formatPercent, toggleComparison, AXES, pageTitle, CANDIDATE_REGISTRY_SOURCES } from '../src/lib.mjs';

const data = await buildAppData();

test('all 49 people and six documentary profiles retain stable joins', () => {
  assert.equal(data.candidates.length, 49);
  assert.equal(new Set(data.candidates.map((c) => c.candidate_id)).size, 49);
  assert.equal(data.candidates.filter((c) => c.profile).length, 6);
  assert.equal(data.candidates.filter((c) => !c.profile).length, 43);
  assert.equal(AXES.length, 9);
  for (const c of data.candidates) assert.ok(c.party);
  for (const profile of data.profiles) for (const id of profile.source_ids) assert.ok(data.sources.some((s) => s.id === id), id);
});
test('all 13 scenarios retain distinct bulletins and published censored values', () => {
  assert.equal(data.polling.polls.flatMap((p) => p.scenarios).length, 13);
  const cluster = data.polling.polls[0];
  assert.equal(cluster.scenarios[0].values['marine-le-pen'], 33);
  assert.equal(cluster.scenarios[0].values['gabriel-attal'], undefined);
  assert.equal(cluster.scenarios[1].values['gabriel-attal'], 12);
  const opinionway = data.polling.polls.find((p) => p.id.startsWith('opinionway'));
  assert.equal(opinionway.scenarios[0].values['nathalie-arthaud'], '<1');
  assert.equal(opinionway.scenarios[0].values['karim-bouamrane'], '<1');
  assert.equal(formatPercent('<1'), '< 1 %');
  assert.equal(formatPercent(null), 'Non testé');
  assert.equal(formatPercent(0), '0 %');
  const ipsos = data.polling.polls.find((p) => p.id.startsWith('ipsos'));
  assert.equal(ipsos.scenarios[0].margins['marine-le-pen'], 2.8);
  assert.equal(ipsos.scenarios[0].margins['gabriel-attal'], 1.2);
});
test('public documents are readable PDFs or text and never executable HTML archives', async () => {
  for (const source of data.sources) {
    assert.ok(!('path' in source));
    for (const key of ['pdf_url', 'text_url']) {
      if (!source[key]) continue;
      assert.match(source[key], /^\/documents\/[a-z0-9-]+\.(pdf|txt)$/);
      const file = await readFile(new URL('../public' + source[key], import.meta.url));
      assert.ok(file.length > 0);
      if (key === 'pdf_url') assert.equal(file.subarray(0, 5).toString(), '%PDF-');
    }
  }
  assert.equal(data.sources.find((s) => s.id === 'attal-lettre-application').text_url, null);
});
test('search handles accents and uncollected profiles without fabricating coverage', () => {
  assert.equal(filterCandidates(data.candidates, { query: 'melenchon' })[0].name, 'Jean-Luc Mélenchon');
  assert.equal(filterCandidates(data.candidates, { scope: 'all', query: 'asselineau' })[0].profile, null);
  assert.equal(filterCandidates(data.candidates, { scope: 'collected', query: 'asselineau' }).length, 0);
  assert.equal(filterCandidates(data.candidates, { scope: 'all', kind: 'missing' }).length, 43);
  assert.equal(filterCandidates(data.candidates, { query: 'zzzz' }).length, 0);
});
test('comparison cap preserves selection, removal and order', () => {
  let ids = ['a', 'b', 'c'];
  assert.deepEqual(toggleComparison(ids, 'd'), ids);
  ids = toggleComparison(ids, 'b');
  assert.deepEqual(ids, ['a', 'c']);
  assert.deepEqual(toggleComparison(ids, 'd'), ['a', 'c', 'd']);
});
test('route titles distinguish candidates and missing routes without implying candidature validation', () => {
  assert.equal(pageTitle('candidats/gabriel-attal', data.candidates), 'Gabriel Attal — Éclairage 2027');
  assert.equal(pageTitle('sondages', data.candidates), 'Les sondages — Éclairage 2027');
  assert.equal(pageTitle('candidats/inconnu', data.candidates), 'Page introuvable — Éclairage 2027');
  assert.deepEqual(CANDIDATE_REGISTRY_SOURCES.map((source) => source.id), ['S1', 'S2', 'S3']);
  assert.ok(CANDIDATE_REGISTRY_SOURCES.every((source) => source.url.startsWith('https://')));
});
test('secondary text palette exceeds 4.5 contrast on the light surfaces', async () => {
  const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.ok(css.includes(':root{--muted:#56634f}'));
  const luminance = (hex) => {
    const channels = hex.match(/[a-f0-9]{2}/gi).map((value) => parseInt(value, 16) / 255)
      .map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  for (const background of ['f8f7f2', 'fffefa', 'e9eee1', 'f0f2e9', 'f3f1e9']) {
    assert.ok((luminance(background) + .05) / (luminance('56634f') + .05) >= 4.5, background);
  }
});
