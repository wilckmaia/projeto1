import type { ReactNode } from 'react';
import katex from 'katex';
import { studyDocuments } from '@/lib/economy-study-documents';
import { parseStudyDocument } from '@/lib/study-document';
import { ActivityDraft, StudyChoices } from './StudyChoices';
import { EconomySimulator } from './EconomySimulator';

export function StudyText({ text, correct }: { text: string; correct?: string }) {
  const lines = text.split('\n');
  const blocks: ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const key = i;
    if (line === '\\[') {
      const formula: string[] = [];
      while (++i < lines.length && lines[i] !== '\\]') formula.push(lines[i]);
      const expression = formula.join('\n');
      // Only KaTeX-generated markup from the author's static source is used here.
      blocks.push(<div key={key} className="study-equation" dangerouslySetInnerHTML={{ __html: katex.renderToString(expression, { displayMode: true, throwOnError: false, trust: false, strict: false, output: 'htmlAndMathml' }) }}/>);
    } else if (line.includes('\t')) {
      const rows = [line.split('\t')];
      while (i + 1 < lines.length && lines[i + 1].includes('\t')) rows.push(lines[++i].split('\t'));
      blocks.push(<div className="study-table" key={key}><table><thead><tr>{rows[0].map((cell, index) => <th key={index} scope="col">{cell}</th>)}</tr></thead><tbody>{rows.slice(1).map((row, index) => <tr key={index}>{row.map((cell, col) => <td key={col}>{cell}</td>)}</tr>)}</tbody></table></div>);
    } else if (/^[A-D]\) /.test(line)) {
      const options = [line];
      while (i + 1 < lines.length && /^[A-D]\) /.test(lines[i + 1])) options.push(lines[++i]);
      blocks.push(<StudyChoices key={key} options={options} correct={correct}/>);
    } else if (line.startsWith('- ')) {
      const items = [line.slice(2)];
      while (i + 1 < lines.length && lines[i + 1].startsWith('- ')) items.push(lines[++i].slice(2));
      blocks.push(<ul key={key}>{items.map((item, index) => <li key={index}>{item}</li>)}</ul>);
    } else if (line.startsWith('Resumo — ')) {
      blocks.push(<h2 key={key}>{line}</h2>);
    } else {
      blocks.push(<p key={key}>{line}</p>);
    }
  }
  return <>{blocks}</>;
}

export function StudyDocument({ documentId }: { documentId: keyof typeof studyDocuments }) {
  const document = parseStudyDocument(studyDocuments[documentId]);
  return <div className="study-document"><p className="study-metadata">{document.metadata}</p><section className="study-introduction"><StudyText text={document.introduction}/></section>{document.activities.map(activity => <div key={activity.number}>
    {activity.groupHeading && <h2 className="study-group">{activity.groupHeading}</h2>}
    <section className="study-activity" data-activity={activity.number}><h2>{activity.title}</h2><StudyText text={activity.prompt} correct={activity.answer.match(/Alternativa correta: ([A-D])\)/)?.[1]}/>
      {activity.number <= 2 && <EconomySimulator kind={documentId} activity={activity.number}/>}
      {activity.number >= 7 && <ActivityDraft/>}
      <details className="study-answer"><summary>Resposta:</summary><StudyText text={activity.answer}/></details>
    </section>
  </div>)}</div>;
}
