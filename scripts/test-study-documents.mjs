import assert from 'node:assert/strict';
import katex from 'katex';
import { load } from './education-test-harness.mjs';
const { studyDocuments } = load('src/lib/economy-study-documents.ts');
const { parseStudyDocument } = load('src/lib/study-document.ts');
for (const [id, source] of Object.entries(studyDocuments)) {
  const parsed = parseStudyDocument(source);
  assert.equal(parsed.title, ({pib:'Tópico 1 — Produto Interno Bruto (PIB)',inflacao:'Tópico 2 — Inflação e Deflação',desemprego:'Tópico 3 — Desemprego e Mercado de Trabalho',crescimento:'Tópico 4 — Crescimento Econômico',ciclos:'Tópico 5 — Ciclos Econômicos',demanda:'Tópico 6 — Demanda e Oferta Agregadas',consumo:'Tópico 7 — Consumo, Poupança e Investimento'})[id]);
  assert.equal(parsed.activities.length, 10);
  assert.equal(parsed.activities.filter(activity => activity.prompt.startsWith('Tipo: Avançada')).length, 4);
  assert.equal(parsed.activities.filter(activity => activity.prompt.startsWith('Tipo: Interativa')).length, 2);
  assert.equal(parsed.activities.filter(activity => activity.prompt.startsWith('Tipo: Teórica')).length, 4);
  assert.ok(parsed.activities[6].groupHeading);
  assert.ok(parsed.activities.every((activity, i) => activity.title.startsWith('Atividade ' + (i + 1) + ' — ') && activity.answer.length > 100));
  const formulas = [...source.matchAll(/\\\[\n([\s\S]*?)\n\\\]/g)];
  assert.ok(formulas.length > 25);
  for (const [, formula] of formulas) assert.doesNotThrow(() => katex.renderToString(formula, { throwOnError: true, trust: false, strict: false }));
  if (id !== 'demanda') assert.ok(source.includes('\t'), 'source tables preserve actual columns');
  const expectedLetters = id === 'pib' ? ['B', 'B', 'B', 'C', 'C', 'D'] : id === 'inflacao' ? ['B', 'B', 'B', 'A', 'C', 'D'] : id === 'crescimento' ? ['A', 'C', 'B', 'C', 'A', 'D'] : ['B', 'B', 'B', 'C', 'A', 'D'];
  assert.deepEqual(parsed.activities.slice(0, 6).map(activity => activity.answer.match(/Alternativa correta: ([A-D])\)/)?.[1]), expectedLetters);
  // Every original line remains represented by the renderer model, including table cells and LaTeX.
  const represented = [parsed.title, parsed.metadata, parsed.introduction, ...parsed.activities.flatMap(activity => [activity.groupHeading ?? '', activity.title, activity.prompt, 'Resposta:', activity.answer])].join('\n');
  for (const line of source.split('\n').filter(Boolean)) assert.ok(represented.includes(line), `Source line retained: ${line}`);
}
const economy = load('src/lib/education.ts').educationWorlds.find(world => world.id === 'economia');
assert.equal(economy.tracks[0].lessons[0].documentId, 'pib');
assert.equal(economy.tracks[0].lessons[2].documentId, 'desemprego');
assert.equal(economy.tracks[0].lessons[1].documentId, 'inflacao', 'placement explicitly selected by user');
assert.ok(!economy.tracks.flatMap(track=>track.lessons).some(lesson=>lesson.id==='economia-micro-topico-2'),'empty elasticity topic removed as requested');
assert.equal(economy.tracks.flatMap(track => track.lessons).length, 7);
assert.deepEqual(economy.tracks[0].lessons.slice(3).map(lesson => lesson.documentId), ['crescimento', 'ciclos', 'demanda', 'consumo']);
console.log('PASS: seven study documents, 70 activities, 28 advanced exercises, all formulas render, source lines retained, updated Macroeconomia placement and empty topics removed.');
