import type { Lesson } from '@/lib/education';
function Paragraphs({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part)}</p>)}</>;
}
export function LessonContent({ lesson }: { lesson: Lesson }) {
  return <div className="lesson-reading">
    <section className="concept-panel"><div className="eyebrow">01 · Conceito</div><h2>{lesson.title}</h2><Paragraphs text={lesson.summary}/>{lesson.keyConcepts.length > 0 && <div className="kpis">{lesson.keyConcepts.map(concept => <span key={concept}>{concept}</span>)}</div>}</section>
    {lesson.explanation && <section><div className="eyebrow">02 · Explicação</div><Paragraphs text={lesson.explanation}/></section>}
    {(lesson.deepContent || lesson.examples.length > 0) && <section><div className="eyebrow">03 · Desenvolvimento</div><Paragraphs text={lesson.deepContent}/>{lesson.examples.length > 0 && <><h3>Exemplos do conteúdo original</h3><ul>{lesson.examples.map(example => <li key={example}>{example}</li>)}</ul></>}</section>}
    {lesson.questions.length > 0 && <details className="optional-reference"><summary>Consultar perguntas e explicações do acervo (opcional)</summary>{lesson.questions.map((question, i) => <article key={i}><h3>{question.prompt}</h3><ol type="A">{question.options.map((option, index) => <li key={index}>{option}</li>)}</ol><p><strong>Resposta: {String.fromCharCode(65 + question.correctIndex)}.</strong> {question.explanation}</p></article>)}</details>}
  </div>;
}
