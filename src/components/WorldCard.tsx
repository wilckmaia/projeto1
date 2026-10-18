import { worlds } from '@/lib/catalog';
import { getWorldStatus, type UserProgress } from '@/lib/progress';
import { WorldIcon } from './WorldIcon';
export function WorldCard({ world, progress, onOpen }: { world: typeof worlds[number]; progress: UserProgress; onOpen: () => void }) {
  const { unlocked, summary, blockedReason } = getWorldStatus(world.id, progress);
  const done = summary.total > 0 && summary.completed === summary.total;
  return <button type="button" data-world={world.id} className={`world-card education-world ${unlocked ? '' : 'locked'}`} onClick={onOpen} aria-label={`${world.name}: ${unlocked ? 'disponível' : blockedReason}`}>
    <span className="world-icon"><WorldIcon kind={world.icon}/></span><span className="world-card-copy"><small>MUNDO {world.number}</small><strong>{world.name}</strong><span>{world.subtitle}</span><span className="world-state">{!unlocked ? '🔒 Bloqueado' : done ? '✓ Concluído' : summary.total ? 'Disponível para estudar' : 'Disponível · Conteúdo em preparação'}</span><progress max={Math.max(1, summary.total)} value={summary.completed} aria-label={`Progresso de ${world.name}`}/><span>{summary.percent}% · {summary.completed}/{summary.total} lições</span>{!unlocked && <span className="world-requirement">{blockedReason}</span>}</span>
  </button>;
}
