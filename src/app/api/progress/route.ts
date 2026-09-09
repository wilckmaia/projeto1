import { NextResponse } from "next/server";
import { buildTaskCompletion, isWorldUnlocked } from "@/lib/progress";
import { getProgressByUserId, getSessionPayload, saveProgress } from "@/lib/storage";
import { getTaskById } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const taskId = typeof body?.taskId === "string" ? body.taskId : "";
    const worldId = typeof body?.worldId === "string" ? body.worldId : "";
    const answers = Array.isArray(body?.answers) ? body.answers : [];

    const session = await getSessionPayload();
    if (!session.user) {
      return NextResponse.json({ error: "Faça login antes de salvar progresso." }, { status: 401 });
    }

    const task = getTaskById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Tarefa não encontrada." }, { status: 404 });
    }

    if (task.worldId !== worldId) {
      return NextResponse.json({ error: "Tarefa inválida para este mundo." }, { status: 400 });
    }

    const progress = await getProgressByUserId(session.user.id);
    if (!isWorldUnlocked(worldId, progress)) {
      return NextResponse.json({ error: "Mundo bloqueado. Complete as tarefas anteriores primeiro." }, { status: 403 });
    }

    // Completion requires every question; correctness is always computed on the server.
    if (answers.length === 0 || answers.length > task.questions.length || (!task.sequential && answers.length !== task.questions.length) || task.questions.slice(0, answers.length).some((question, index) => {
      const answer = answers[index];
      return answer?.questionId !== `${task.id}-${index}` || !Number.isInteger(answer?.selectedIndex) || answer.selectedIndex < 0 || answer.selectedIndex >= question.options.length;
    })) {
      return NextResponse.json({ error: "Responda todas as questões com opções válidas antes de concluir." }, { status: 400 });
    }
    const verifiedAnswers = task.questions.slice(0, answers.length).map((question, index) => ({
      questionId: `${task.id}-${index}`, selectedIndex: answers[index].selectedIndex,
      correctIndex: question.correctIndex, isCorrect: answers[index].selectedIndex === question.correctIndex,
    }));
    const updated = buildTaskCompletion(taskId, worldId, verifiedAnswers, new Date().toISOString(), progress);
    // A repeated request must not replace a longer saved attempt with a shorter one.
    if (task.sequential && (progress.taskProgress[taskId]?.answers.length ?? 0) > verifiedAnswers.length) {
      return NextResponse.json({ error: "Há respostas mais recentes. Recarregue a página para continuar." }, { status: 409 });
    }
    await saveProgress(session.user.id, updated, taskId);

    return NextResponse.json({ ok: true, progress: updated, message: "Progresso salvo com sucesso." }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível salvar o progresso.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
