import { ThemeToggle } from '@/components/ThemeToggle';
import { notFound, redirect } from 'next/navigation';
import { getTaskById, getWorldById } from '@/lib/data';
import { getSessionPayload } from '@/lib/storage';
import { isWorldUnlocked } from '@/lib/progress';
import { TaskExperience } from '@/components/TaskExperience';
import { LegacyTaskExperience } from '@/components/LegacyTaskExperience';
import { StudyDocument } from '@/components/StudyDocument';
import { studyDocuments } from '@/lib/economy-study-documents';

export default async function TaskPage({ params }: { params: Promise<{ world: string; task: string }> }) {
  const { world, task } = await params;
  const worldData = getWorldById(world);
  if (!worldData) notFound();

  const session = await getSessionPayload();

  if (!session.user) {
    redirect('/');
  }


  const taskData = getTaskById(task);
  if (!taskData || taskData.worldId !== world) {
    notFound();
  }

  if (!isWorldUnlocked(world, session.progress)) {
    redirect(`/${world}`);
  }

  const taskIndex = worldData.tasks.findIndex((item) => item.id === taskData.id);
  const nextTask = worldData.tasks[taskIndex + 1];
  const nextHref = nextTask ? `/${world}/${nextTask.id}` : `/${world}`;

  return (
    <main className="task-page" data-world={world} data-world-page={world}>
      <header className="lesson-theme-header"><ThemeToggle /></header>
      {worldData.original ? <LegacyTaskExperience key={taskData.id} task={{ ...taskData, questions: taskData.questions.map(({ prompt, options }) => ({ prompt, options })) }} worldId={world} nextHref={nextHref} initialProgress={session.progress.taskProgress[taskData.id]}/> : <TaskExperience heading={taskData.documentId ? studyDocuments[taskData.documentId].split("\n")[0] : undefined} content={taskData.documentId ? <StudyDocument documentId={taskData.documentId}/> : undefined} key={taskData.id} task={taskData} worldId={world} nextHref={nextHref} initialProgress={session.progress.taskProgress[taskData.id]} />}
    </main>
  );
}
