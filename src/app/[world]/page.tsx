import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { WorldIcon } from '@/components/WorldIcon';
import { CertificateButton } from '@/components/CertificateButton';
import { getWorldById } from '@/lib/data';
import { getSessionPayload } from '@/lib/storage';
import { getWorldStatus } from '@/lib/progress';
export default async function WorldPage({ params }: { params: Promise<{ world: string }> }) {
 const { world: id } = await params;
 const world = getWorldById(id);
 if (!world) notFound();
 const { user, progress } = await getSessionPayload();
 if (!user) redirect('/');
 const { unlocked, summary, blockedReason } = getWorldStatus(id, progress);
 return <main className="task-page" data-world={id} data-world-page={id}>
   <header className="task-header"><Link href="/" className="back-button">← Início</Link><Link href="/perfil" className="secondary-button">Meus certificados</Link><ThemeToggle/></header>
   <div className="task-body"><span className="world-icon"><WorldIcon kind={world.icon}/></span><div className="eyebrow">Mundo {world.number}</div><h1>{world.name}</h1><p className="subtitle">{world.description}</p>
   <div className="world-progress"><span>{summary.percent}% · {summary.completed}/{summary.total} lições concluídas</span><progress max={Math.max(1, summary.total)} value={summary.completed}/></div>
   {!unlocked ? <section className="locked-state"><h2>🔒 Mundo bloqueado</h2><p>{blockedReason}</p><Link className="secondary-button" href="/#trilhas">Voltar aos mundos</Link></section> : <>
    <section><div className="section-head"><h2>{id === 'economia' ? 'Micromundos' : 'Trilhas educacionais'}</h2></div>{world.tracks.length === 0 ? <div className="empty-state"><h3>As trilhas estão em preparação</h3><p>Este mundo ainda não tem trilhas ou lições cadastradas. Seu progresso começa quando os conteúdos forem publicados.</p><Link className="secondary-button" href="/biblioteca">Consultar conteúdos anteriores</Link></div> : <div className="task-list">{world.tracks.map(track => <Link className="task-item" key={track.id} href={'/' + id + '/trilhas/' + track.id}><span className="meta"><strong>{track.title}</strong><small>{track.overview ?? track.description}</small>{track.internalTopics && <small>{track.internalTopics}</small>}</span><span>{track.lessons.filter(lesson => progress.completedTasks.includes(lesson.id)).length}/{track.lessons.length} lições →</span></Link>)}</div>}</section>
    <section className="keybox"><h2>Lições</h2><p>{summary.total ? id === 'economia' ? 'Selecione um micromundo acima para acessar seus tópicos.' : 'Selecione uma trilha acima para acessar suas lições.' : 'As futuras lições aparecerão organizadas por trilha.'}</p></section>
   </>}
   <section className="keybox"><h2>{world.certificateTitle}</h2>{unlocked && summary.total > 0 && summary.completed === summary.total ? <CertificateButton worldId={id}/> : <p>Disponível após concluir todas as lições deste mundo. Mundos vazios não emitem certificados.</p>}</section>
   </div>
 </main>;
}
