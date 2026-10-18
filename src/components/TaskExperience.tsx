'use client';
import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Lesson } from '@/lib/education';
import type { TaskProgress } from '@/lib/progress';
import { LessonContent } from './LessonContent';
export function TaskExperience({ task, worldId, nextHref, initialProgress, content, heading }: { task: Lesson & { worldName: string }; worldId: string; nextHref: string; initialProgress?: TaskProgress; content?: ReactNode; heading?: string }) {
  const router = useRouter();
  const [done, setDone] = useState(Boolean(initialProgress?.completed));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  return <div className="task-body"><Link className="back-button" href={'/' + worldId}>← Voltar ao mundo</Link><div className="eyebrow">{task.worldName}</div><h1>{heading ?? task.title}</h1>
    {content ?? <LessonContent lesson={task}/>}
    <section className="lesson-conclusion"><div className="eyebrow">04 · Conclusão</div><h2>{done ? 'Lição concluída' : 'Estudou o conteúdo?'}</h2><p>A conclusão depende apenas da sua confirmação. Não há treinamento obrigatório.</p>
      {!done ? <button className="primary-button" disabled={saving} onClick={async () => {
        if (inFlight.current) return;
        inFlight.current = true; setSaving(true); setError('');
        try {
          const response = await fetch('/api/progress', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ taskId: task.id, worldId, completed: true }) });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error ?? 'Não foi possível salvar.');
          setDone(true); router.refresh();
        } catch (error) { setError(error instanceof Error ? error.message : 'Falha de conexão.'); }
        finally { setSaving(false); inFlight.current = false; }
      }}>{saving ? 'Salvando…' : 'Concluir lição'}</button> : <div role="status"><p>✓ Progresso salvo na sua conta.</p><Link className="primary-button" href={nextHref}>Continuar →</Link><Link className="secondary-button" href={'/' + worldId}>Voltar ao mundo</Link></div>}
      {error && <p role="alert">{error}</p>}
    </section>
  </div>;
}
