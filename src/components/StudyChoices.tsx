'use client';
import { useId, useState } from 'react';
export function StudyChoices({ options, correct }: { options: string[]; correct?: string }) {
  const id = useId();
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  return <fieldset className="study-choices"><legend>Selecione uma alternativa</legend>{options.map(option => <label key={option} className={selected === option[0] ? 'selected' : ''}><input type="radio" name={id} value={option[0]} checked={selected === option[0]} onChange={() => { setSelected(option[0]); setChecked(false); }}/><span>{option}</span></label>)}{correct && <><button className="secondary-button" disabled={!selected} onClick={() => setChecked(true)}>Conferir alternativa</button>{checked && <p role="status">{selected === correct ? 'Alternativa correta.' : 'Revise sua escolha e consulte a resposta comentada.'}</p>}</>}</fieldset>;
}
export function ActivityDraft() {
  return <label className="activity-draft">Sua resolução (opcional)<textarea rows={3} placeholder="Registre seus cálculos ou sua interpretação…"/></label>;
}
