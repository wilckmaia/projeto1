import Link from 'next/link';
import { redirect } from 'next/navigation';
import { worlds } from '@/lib/legacy-data';
import { getCurrentUser } from '@/lib/storage';
import { ThemeToggle } from '@/components/ThemeToggle';
export const metadata = { title: 'Biblioteca de consulta | Politika', robots: { index: false, follow: false } };
export default async function LibraryPage() {
  if (!await getCurrentUser()) redirect('/');
  return <main className="task-page"><header className="task-header"><Link className="back-button" href="/">← Início</Link><ThemeToggle/></header><div className="task-body"><div className="eyebrow">Consulta voluntária</div><h1>Biblioteca</h1><p>O conteúdo anterior permanece disponível para consulta. Não há atividades obrigatórias e estas leituras não interferem no progresso dos novos mundos.</p>{worlds.map(world => <section key={world.id}><h2>{world.name}</h2><div className="task-list">{world.tasks.map(task => <Link className="task-item" href={'/biblioteca/' + task.id} key={task.id}><span className="meta"><strong>{task.title}</strong><small>Consultar conteúdo →</small></span></Link>)}</div></section>)}</div></main>;
}
