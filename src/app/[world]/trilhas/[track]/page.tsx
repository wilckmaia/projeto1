import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getWorldById } from '@/lib/data';
import { getSessionPayload } from '@/lib/storage';
import { isWorldUnlocked } from '@/lib/progress';
import { ThemeToggle } from '@/components/ThemeToggle';
import { TrackIntroduction } from '@/components/TrackIntroduction';
export default async function TrackPage({ params }: { params: Promise<{ world: string; track: string }> }) {
  const { world: id, track: trackId } = await params;
  const world = getWorldById(id);
  const track = world?.tracks.find(track => track.id === trackId);
  if (!world || !track) notFound();
  const { user, progress } = await getSessionPayload();
  if (!user) redirect('/');
  if (!isWorldUnlocked(id, progress)) redirect('/' + id);
  return <main className="task-page" data-world={id} data-world-page={id}><header className="task-header"><Link className="back-button" href={'/' + id}>← Voltar ao mundo</Link><ThemeToggle/></header><div className="task-body"><div className="eyebrow">{world.name} · {id === 'economia' ? 'Micromundo' : 'Trilha'}</div><h1>{track.title}</h1><TrackIntroduction track={track}/><div className="task-list">{track.lessons.map(lesson => <Link className="task-item" href={'/' + id + '/' + lesson.id} key={lesson.id}><span className="dot"/><span className="meta"><strong>{lesson.title}</strong><small>{progress.completedTasks.includes(lesson.id) ? '✓ Concluída' : id === 'economia' ? 'Abrir tópico' : 'Estudar lição'}</small></span><span>→</span></Link>)}</div>{track.lessons.length === 0 && <div className="empty-state"><h2>Lições em preparação</h2><p>Esta trilha ainda não conta como concluída.</p></div>}</div></main>;
}
