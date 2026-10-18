import assert from 'node:assert/strict';
import { load, fixtures } from './education-test-harness.mjs';
const { data, progress } = fixtures();
const jsx = (type, props) => ({ type, props });
let session = { user: { id: 'test-only', name: 'Test fixture' }, progress: { ...progress.defaultProgress, completedTasks: ['fixture-mundo-1','fixture-mundo-2','fixture-mundo-3'] } };
const TaskExperience = () => null;
const deps = {
  'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
  'next/link': { default: 'a' },
  'next/navigation': { redirect: path => { throw new Error('redirect:' + path); }, notFound: () => { throw new Error('404'); } },
  '@/lib/data': data, '@/lib/storage': { getSessionPayload: async () => session }, '@/lib/progress': progress,
  '@/components/LegacyTaskExperience': { LegacyTaskExperience: () => null },
  '@/components/TrackIntroduction': { TrackIntroduction: () => null },
  '@/components/StudyDocument': { StudyDocument: () => null }, '@/lib/economy-study-documents': load('src/lib/economy-study-documents.ts'),
  '@/components/ThemeToggle': { ThemeToggle: () => null }, '@/components/TaskExperience': { TaskExperience },
};
const trackPage = load('src/app/[world]/trilhas/[track]/page.tsx', deps).default;
const lessonPage = load('src/app/[world]/[task]/page.tsx', deps).default;
function nodes(tree) { return Array.isArray(tree) ? tree.flatMap(nodes) : tree && typeof tree === 'object' ? [tree, ...nodes(tree.props?.children)] : []; }
const page = await trackPage({ params: Promise.resolve({ world: 'executivo', track: 'track-executivo' }) });
assert.ok(nodes(page).some(node => node.props?.href === '/executivo/fixture-executivo'));
const lesson = await lessonPage({ params: Promise.resolve({ world: 'executivo', task: 'fixture-executivo' }) });
assert.ok(nodes(lesson).some(node => node.type === TaskExperience && node.props.task.id === 'fixture-executivo' && node.props.nextHref === '/executivo'));
session = { ...session, progress: progress.defaultProgress };
await assert.rejects(trackPage({ params: Promise.resolve({ world: 'legislativo', track: 'track-legislativo' }) }), /redirect:\/legislativo/);
await assert.rejects(lessonPage({ params: Promise.resolve({ world: 'legislativo', task: 'fixture-legislativo' }) }), /redirect:\/legislativo/);
await assert.rejects(trackPage({ params: Promise.resolve({ world: 'executivo', track: 'unknown' }) }), /404/);
await assert.rejects(lessonPage({ params: Promise.resolve({ world: 'executivo', task: 'fixture-economia' }) }), /404/);
session = { ...session, user: null };
await assert.rejects(trackPage({ params: Promise.resolve({ world: 'executivo', track: 'track-executivo' }) }), /redirect:\//);
console.log('PASS: actual track/lesson page navigation, world locks, cross-world lesson rejection and authentication guards.');
