import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getTaskById } from '@/lib/legacy-data';
import { getCurrentUser } from '@/lib/storage';
import { LessonContent } from '@/components/LessonContent';
import { ThemeToggle } from '@/components/ThemeToggle';
export const metadata = { robots: { index: false, follow: false } };
export default async function ReferencePage({ params }: { params: Promise<{ lesson: string }> }) {
  const { lesson: id } = await params;
  const lesson = getTaskById(id);
  if (!lesson) notFound();
  if (!await getCurrentUser()) redirect('/');
  return <main className="task-page"><header className="task-header"><Link className="back-button" href="/biblioteca">← Biblioteca</Link><ThemeToggle/></header><div className="task-body"><div className="eyebrow">Consulta voluntária · {lesson.worldName}</div><h1>{lesson.title}</h1><LessonContent lesson={lesson}/><Link className="secondary-button" href="/biblioteca">Voltar à biblioteca</Link></div></main>;
}
