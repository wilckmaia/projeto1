'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Task } from '@/lib/data';

type Props = {
  task: Task & { worldId: string; worldName: string };
  worldId: string;
  nextHref: string;
};

const buildResult = (sel: number | undefined, correct: number) => {
  if (sel === undefined) return 'pending';
  return sel === correct ? 'correct' : 'wrong';
};

export function TaskExperience({ task, worldId, nextHref }: Props) {
  const saveInFlight = useRef(false);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);

  const answeredCount = useMemo(
    () => Object.keys(selected).filter((index) => selected[Number(index)] !== undefined).length,
    [selected],
  );

  const allAnswered = task.questions.length > 0 && answeredCount === task.questions.length;

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setSelected((current) => ({ ...current, [questionIndex]: optionIndex }));
    setSubmitted(false);
  };

  const handleSubmit = async () => {
    if (saveInFlight.current) return;
    if (!allAnswered) {
      setToast('Responda todas as questões antes de corrigir.');
      return;
    }

    const answers = task.questions.map((question, questionIndex) => {
      const selectedIndex = selected[questionIndex];
      const isCorrect = selectedIndex === question.correctIndex;
      return {
        questionId: `${task.id}-${questionIndex}`,
        selectedIndex,
        correctIndex: question.correctIndex,
        isCorrect,
      };
    });

    saveInFlight.current = true;
    setSaving(true);
    setToast('');
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: task.id, worldId, answers }),
      });

      const data = await response.json();

      if (!response.ok || data.ok !== true) {
        setToast(data.error ?? 'Não foi possível salvar o progresso.');
        return;
      }

      setSubmitted(true);
      setAchievementUnlocked(Boolean(data.progress?.completedWorlds?.includes(worldId)));
      setToast(data.message ?? 'Progresso salvo com sucesso.');
    } catch {
      setToast('Não foi possível salvar o progresso. Tente novamente.');
    } finally {
      saveInFlight.current = false;
      setSaving(false);
    }
  };

  return (
    <div className="task-body">
      <div className="task-header">
        <button className="back-button" type="button" onClick={() => window.location.assign(`/${worldId}`)}>
          ← Voltar ao mundo
        </button>
        <div className="progress-rail">
          <span style={{ width: `${Math.min(100, (answeredCount / task.questions.length) * 100)}%` }} />
        </div>
      </div>

      <div className="eyebrow">{task.worldName}</div>
      <Link href="/perfil" className="profile-task-link">Meu perfil e conquistas ↗</Link>
      <h1>{task.title}</h1>
      <div className="subtitle">{task.summary}</div>

      <div className="task-narrative">
        <p>{task.explanation}</p>
        <p>{task.deepContent}</p>
      </div>

      <div className="keybox">
        <h3>Conceitos-chave</h3>
        <div className="kpis">
          {task.keyConcepts.map((concept) => (
            <span key={concept}>{concept}</span>
          ))}
        </div>
      </div>

      {task.questions.map((question, questionIndex) => {
        const currentSelection = selected[questionIndex];
        const result = buildResult(currentSelection, question.correctIndex);

        return (
          <div className="question-card" key={question.prompt}>
            <h3>{questionIndex + 1}. {question.prompt}</h3>
            <div className="option-list">
              {question.options.map((option, optionIndex) => {
                const buttonClass = submitted
                  ? optionIndex === question.correctIndex
                    ? 'option-button correct'
                    : currentSelection === optionIndex && currentSelection !== question.correctIndex
                      ? 'option-button wrong'
                      : 'option-button'
                  : currentSelection === optionIndex
                    ? 'option-button selected'
                    : 'option-button';

                return (
                  <button
                    key={option}
                    type="button"
                    className={buttonClass}
                    disabled={saving}
                    onClick={() => handleSelect(questionIndex, optionIndex)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div className={`feedback-box ${result === 'correct' ? 'correct' : 'incorrect'}`}>
                <strong>{result === 'correct' ? 'Correto' : 'Resposta discutida'}</strong>
                {question.explanation}
              </div>
            )}
          </div>
        );
      })}

      <div className="action-row">
        {submitted ? (
          <button className="primary-button" type="button" onClick={() => window.location.assign(nextHref)}>
            Próxima
          </button>
        ) : (
          <button className="primary-button" type="button" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Corrigindo...' : 'Corrigir'}
          </button>
        )}
      </div>

      {achievementUnlocked && <div className="keybox" role="status"><h3>✦ Mundo concluído. Sua conquista está desbloqueada!</h3><Link href="/perfil">Ver minha medalha e compartilhar →</Link></div>}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
