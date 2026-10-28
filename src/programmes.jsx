import React, { useEffect, useState } from 'react';
import { AXES, GROUPS, initials, sourceLabel, CANDIDATE_REGISTRY_SOURCES } from './lib.mjs';
import './programmes.css';

export const ATTRIBUTIONS = {
  personal_2027: 'Engagement personnel 2027',
  personal_statement: 'Déclaration personnelle',
  party_collective: 'Projet collectif du parti',
  historical_updated: 'Document antérieur / autre scrutin',
};
const sourceFor = (data, id) => data.sources.find((source) => source.id === id);
const measureFor = (data, id) => data.verification.measures.find((measure) => measure.id === id);
const docsFor = (data, candidate) => data.sources.filter((source) => new Set([...(candidate.profile?.source_ids || []), ...(candidate.audit?.source_ids || [])]).has(source.id) && (source.pdf_url || source.text_url));
export const amountText = (amount) => amount ? `${String(amount.value).replace('.', ',')} ${amount.unit}` : null;

function SourceLink({ data, id, locator, label }) {
  const source = sourceFor(data, id);
  if (!source) return <span>Source à vérifier</span>;
  const page = locator?.match(/(?:page\s+PDF|PDF\s+page)\s+(\d+)/i)?.[1];
  return <a className="measure-source" href={source.pdf_url ? source.pdf_url + (page ? `#page=${page}` : '') : source.text_url || source.url} target="_blank" rel="noreferrer">{label || sourceLabel(source)} ↗</a>;
}

function Measure({ data, measure, compact = false }) {
  return <article className={`measure-card ${compact ? 'compact-measure' : ''}`} id={measure.id}>
    <div className={`attribution ${measure.attribution}`}>{ATTRIBUTIONS[measure.attribution]}</div>
    <h3>{measure.title}</h3>
    <p>{measure.description}</p>
    {measure.amount && <div className="announced-amount"><strong>{amountText(measure.amount)}</strong><span>Chiffre annoncé · {measure.amount.basis}</span></div>}
    {measure.horizon && <p className="measure-horizon"><b>Horizon :</b> {measure.horizon}</p>}
    <SourceLink data={data} id={measure.source_id} locator={measure.locator}/>
    <p className="measure-locator">{measure.locator}</p>
    <details className="measure-details"><summary>Source, financement et réserves</summary>
      <blockquote>« {measure.evidence_excerpt} »</blockquote>
      <p><a href={measure.source_url} target="_blank" rel="noreferrer">Publication officielle ↗</a></p>
      <dl><dt>Financement annoncé</dt><dd>{measure.financing}</dd><dt>Publics concernés</dt><dd>{measure.beneficiaries}</dd><dt>Limites et éléments à vérifier</dt><dd>{measure.limits}</dd></dl>
    </details>
  </article>;
}

function Missing({ audited = false }) { return <p className="measure-missing">{audited ? 'Aucune mesure repérée sur cet axe dans les sources examinées. Cela ne signifie pas une absence de position.' : 'Analyse à réaliser : ce dossier ne fait pas partie des six vérifiés dans cette passe.'}</p>; }

function AxisContent({ data, candidate, axis, compact = false }) {
  const audit = candidate.audit;
  if (!audit) return <Missing/>;
  if (axis.id === 'strategie') return <div className="qualitative"><span className="interpretation-label">Lecture qualitative · interprétation</span><p>{audit.strategy.summary}</p><p className="measure-missing">{audit.strategy.limits}</p><div className="inline-sources">{audit.strategy.source_ids.map((id) => <SourceLink key={id} data={data} id={id}/>)}</div></div>;
  if (axis.id === 'repartition') return <div className="qualitative"><span className="interpretation-label">Publics et arbitrages · à approfondir</span><p>{audit.assessment.distribution}</p><p className="measure-missing">Aucune microsimulation des effets sur les ménages n’est publiée dans cette étude.</p></div>;
  if (axis.id === 'faisabilite') return <div className="qualitative"><span className="interpretation-label">État de la documentation · pas de validation indépendante</span><p>{audit.assessment.funding}</p><p>{audit.assessment.feasibility}</p><p className="measure-missing">{audit.assessment.limitations}</p></div>;
  const measures = audit.measures.filter((measure) => measure.axis === axis.id);
  return measures.length ? <div className="axis-measures">{measures.map((measure) => <Measure key={measure.id} data={data} measure={measure} compact={compact}/>)}</div> : <Missing audited/>;
}

export function ProgrammeCandidate({ data, candidate: c, selection, toggle, DocumentCard }) {
  const [tab, setTab] = useState('synthese');
  const [axisId, setAxisId] = useState('all');
  useEffect(() => { setTab('synthese'); setAxisId('all'); }, [c.candidate_id]);
  const audit = c.audit, docs = docsFor(data, c);
  const headline = audit?.publication_status_label || (c.profile ? 'Dossier documentaire initial' : 'Un dossier à constituer');
  return <>
    <a className="back-link" href="#candidats">← Tous les candidats</a>
    <section className="profile-header"><div className="avatar large">{initials(c.name)}</div><div><div className="eyebrow">DOSSIER CANDIDAT · VÉRIFICATION AU 28.10.2026</div><h1>{c.name}</h1><p>{c.party}</p></div><button className={`button ${selection.includes(c.candidate_id) ? 'secondary' : ''}`} onClick={() => toggle(c.candidate_id)}>{selection.includes(c.candidate_id) ? 'Retirer de la comparaison' : 'Ajouter à la comparaison'}</button></section>
    <div className="profile-meta"><span className="status"><i/>{audit ? `${audit.measures.length} propositions repérées` : 'Collecte à réaliser'}</span><span>{GROUPS[c.initial_list]}</span><span>{audit ? 'Première lecture documentaire' : 'Analyse économique à réaliser'}</span></div>
    {c.reservation && <div className="notice">{c.reservation}</div>}
    <details className="registry-provenance"><summary>Origine du statut et du rattachement</summary><p>Le statut et le rattachement viennent de la base initiale et restent à vérifier. Les références collectives ne constituent pas une preuve individuelle de candidature.</p><ul>{CANDIDATE_REGISTRY_SOURCES.map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}</ul></details>
    <div className="tabs" role="group" aria-label="Rubriques du dossier">{[['synthese', 'Synthèse et état du programme'], ['analyse', `Propositions · ${audit?.measures.length || 0}`], ['sources', `Documents · ${docs.length}`]].map(([id, text]) => <button key={id} aria-pressed={tab === id} className={tab === id ? 'selected' : ''} onClick={() => setTab(id)}>{text}</button>)}</div>
    {tab === 'synthese' ? <>
      <div className="publication-panel"><div className="eyebrow">ÉTAT DE PUBLICATION VÉRIFIÉ</div><h2>{headline}</h2><p>{audit?.publication_status_detail || c.profile?.findings || 'Ce profil reste dans la base. Ses publications économiques n’ont pas encore été examinées dans cette passe.'}</p>{audit && <><div className="callout"><p>{audit.scope_warning}</p></div><div className="inline-sources">{(audit.publication_status_source_ids || audit.source_ids).map((id) => <SourceLink key={id} data={data} id={id}/>)}</div></>}</div>
      {audit ? <>
        <section className="strategy-panel"><div className="eyebrow">QUELLE LOGIQUE ÉCONOMIQUE ?</div><h2>Les mécanismes proposés.</h2><AxisContent data={data} candidate={c} axis={AXES[0]}/></section>
        <div className="section-heading compact"><div><div className="eyebrow">UNE PREMIÈRE SÉLECTION SOURCÉE</div><h2>Des propositions concrètes.</h2><p>Montants et objectifs annoncés par leurs auteurs ; effets et financement à vérifier.</p></div><button className="button secondary" onClick={() => setTab('analyse')}>Voir les {audit.measures.length} propositions →</button></div>
        <div className="measure-preview">{audit.measures.slice(0, 3).map((measure) => <Measure key={measure.id} data={data} measure={measure}/>)}</div>
        <div className="funding-summary"><h3>Financement : ce qui est documenté</h3><p>{audit.assessment.funding}</p><p className="measure-missing">{audit.assessment.limitations}</p></div>
        <details className="search-log"><summary>Ce qui a été recherché et vérifié</summary><ul>{audit.search_log.map((item, i) => <li key={i}><b>{item.query_or_url}</b><p>{item.result}</p></li>)}</ul></details>
      </> : <Missing/>}
    </> : tab === 'analyse' ? <>
      <div className="section-heading compact"><div><h2>Les propositions, axe par axe.</h2><p>Chaque engagement conserve son auteur, sa source, son horizon et ses réserves. La lecture qualitative ne constitue pas une évaluation indépendante.</p></div></div>
      <label className="axis-filter">Axe de lecture<select value={axisId} onChange={(event) => setAxisId(event.target.value)}><option value="all">Les neuf axes</option>{AXES.map((axis) => <option key={axis.id} value={axis.id}>{axis.number} · {axis.title}</option>)}</select></label>
      <div className="programme-axes">{AXES.filter((axis) => axisId === 'all' || axisId === axis.id).map((axis) => <section className="programme-axis" key={axis.id}><div className="axis-heading"><span>{axis.number}</span><div><h2>{axis.title}</h2><p>{axis.question}</p></div></div><AxisContent data={data} candidate={c} axis={axis}/></section>)}</div>
    </> : <><div className="section-heading compact"><div><h2>Revenir aux textes.</h2><p>Les nouveaux documents et les archives initiales restent distincts.</p></div></div>{docs.length ? <div className="documents-list">{docs.map((source) => <DocumentCard key={source.id} source={source} candidate={c}/>)}</div> : <Missing/>}</>}
  </>;
}

function NumericComparisons({ data, selected }) {
  const comparisons = data.verification.comparisons;
  const families = comparisons.families.filter((family) => family.entries.some((entry) => selected.some((candidate) => candidate.candidate_id === entry.candidate_id)));
  return <><div className="notice">{typeof comparisons.methodology === 'string' ? comparisons.methodology : 'Comparer le même objet, la même unité et le même horizon. Les chiffres présentés restent des annonces, avec leurs conditions et leurs limites.'}</div>{families.length ? families.map((family) => <section className="numeric-family" key={family.id}><div className="section-heading compact"><div><div className="eyebrow">{family.unit} · {family.comparability}</div><h2>{family.title}</h2><p>{family.explanation}</p></div></div><div className="numeric-grid" style={{ '--columns': selected.length }}>{selected.map((candidate) => {
    const entries = family.entries.filter((entry) => entry.candidate_id === candidate.candidate_id);
    return <article className="numeric-cell" key={candidate.candidate_id}><h3>{candidate.name}</h3>{entries.length ? entries.map((entry, i) => { const measure = measureFor(data, entry.measure_id); return <div className="numeric-entry" key={`${entry.measure_id}-${i}`}><strong className="numeric-value">{entry.display}</strong><div className={`attribution ${measure.attribution}`}>{ATTRIBUTIONS[measure.attribution]}</div><p>{entry.basis}</p>{entry.horizon && <p><b>Horizon :</b> {entry.horizon}</p>}<p className="measure-missing">{entry.limits}</p><SourceLink data={data} id={measure.source_id} locator={measure.locator}/><details className="measure-details"><summary>Retrouver la proposition</summary><p>{measure.title}</p><p>{measure.description}</p><p>{measure.locator}</p><blockquote>« {measure.evidence_excerpt} »</blockquote></details></div>; }) : <Missing audited={Boolean(candidate.audit)}/>}</article>;
  })}</div></section>) : <Missing audited/>}</>;
}

export function ProgrammeCompare({ data, selection, toggle }) {
  const [mode, setMode] = useState('chiffres');
  const selected = selection.map((id) => data.candidates.find((candidate) => candidate.candidate_id === id)).filter(Boolean);
  return <><section className="page-intro"><div className="eyebrow">02 / ÉCLAIRAGE 2027</div><h1>Des propositions en regard.</h1><p>Comparer les solutions annoncées, leur périmètre et leur financement. Sans score global.</p></section>
    <div className="compare-selection"><label htmlFor="add-person">Choisir un profil à comparer</label><div><select id="add-person" value="" onChange={(event) => toggle(event.target.value)} disabled={selection.length >= 3}><option value="">Ajouter une personne…</option>{data.candidates.filter((candidate) => !selection.includes(candidate.candidate_id)).sort((a, b) => a.name.localeCompare(b.name, 'fr')).map((candidate) => <option key={candidate.candidate_id} value={candidate.candidate_id}>{candidate.name}{candidate.audit ? ' · propositions vérifiées' : ''}</option>)}</select><span>{selection.length} / 3 profils</span></div><div className="selected-chips">{selected.map((candidate) => <button key={candidate.candidate_id} onClick={() => toggle(candidate.candidate_id)} aria-label={`Retirer ${candidate.name}`}>{candidate.name} <span aria-hidden="true">×</span></button>)}</div></div>
    {selected.length < 2 ? <div className="empty"><h2>Deux programmes, une même question.</h2><p>Sélectionnez au moins deux personnes. Les six dossiers vérifiés contiennent des propositions et des rapprochements chiffrés.</p><a className="button secondary" href="#candidats">Parcourir les candidats →</a></div> : <>
      <div className="tabs" role="group" aria-label="Mode de comparaison"><button className={mode === 'chiffres' ? 'selected' : ''} aria-pressed={mode === 'chiffres'} onClick={() => setMode('chiffres')}>Mesures chiffrées</button><button className={mode === 'axes' ? 'selected' : ''} aria-pressed={mode === 'axes'} onClick={() => setMode('axes')}>Les neuf axes</button></div>
      {mode === 'chiffres' ? <NumericComparisons data={data} selected={selected}/> : <><div className="notice">Première lecture des propositions repérées. Un projet collectif ou un texte antérieur ne vaut pas engagement personnel 2027. Aucun effet économique n’est validé par cette juxtaposition.</div><div className="table-scroll" tabIndex="0" aria-label="Tableau comparatif défilant"><table className="comparison-table programme-comparison"><thead><tr><th>Une lecture commune</th>{selected.map((candidate) => <th key={candidate.candidate_id}><a href={`#candidats/${candidate.candidate_id}`}>{candidate.name} ↗</a><small>{candidate.audit?.publication_status_label || 'Dossier non examiné'}</small></th>)}</tr></thead><tbody>{AXES.map((axis) => <tr key={axis.id}><th><span className="eyebrow">{axis.number}</span>{axis.title}<small>{axis.question}</small></th>{selected.map((candidate) => <td key={candidate.candidate_id}><AxisContent data={data} candidate={candidate} axis={axis} compact/></td>)}</tr>)}</tbody></table></div></>}
    </>}
  </>;
}
