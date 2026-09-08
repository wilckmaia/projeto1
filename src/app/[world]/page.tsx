import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getWorldById } from '@/lib/data';
import { getSessionPayload } from '@/lib/storage';
import { isWorldUnlocked } from '@/lib/progress';

export default async function WorldPage({ params }: { params: Promise<{ world: string }> }) {
  const { world } = await params;
  const session = await getSessionPayload();

  if (!session.user) {
    redirect('/');
  }

  const selectedWorld = getWorldById(world);
  if (!selectedWorld) {
    redirect('/');
  }

  if (!isWorldUnlocked(world, session.progress)) {
    redirect(`/?blocked=${world}`);
  }

  return (
    <main className="task-page">
      <div className="task-header">
        <Link href="/" className="back-button" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          ← Voltar ao início
        </Link>
        <div className="eyebrow">Mundo {selectedWorld.number}</div>
        <Link href="/perfil" className="secondary-button">Meu perfil</Link>
      </div>

      <div className="task-body">
        <div className="eyebrow">{selectedWorld.subtitle}</div>
        <h1>{selectedWorld.name}</h1>
        <div className="subtitle">{selectedWorld.description}</div>

        <div className="keybox" style={{ marginTop: 24 }}>
          <h3>Etapas do mundo</h3>
          <div className="kpis">
            {selectedWorld.tasks.map((task) => (
              <span key={task.id}>{task.title}</span>
            ))}
          </div>
        </div>

        <div className="task-list" style={{ marginTop: 24 }}>
          {selectedWorld.tasks.map((task) => {
            const completed = session.progress.completedTasks.includes(task.id);
            return (
              <Link key={task.id} href={`/${selectedWorld.id}/${task.id}`} className="task-item">
                <span className={`dot ${completed ? '' : 'pending'}`} />
                <div className="meta">
                  <strong>{task.title}</strong>
                  <small>{task.summary}</small>
                </div>
                <span className="status">{completed ? 'Concluída' : 'Abrir'}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
