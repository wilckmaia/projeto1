import { NextResponse } from "next/server";
import { getProgressByUserId, getSessionPayload, loginUser, logoutUser, registerUser } from "@/lib/storage";

export async function GET() {
  const session = await getSessionPayload();
  return NextResponse.json(session);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body?.action === "login" ? "login" : "register";
    const email = typeof body?.email === "string" ? body.email : "";
    const password = typeof body?.password === "string" ? body.password : "";
    const user = action === "login"
      ? await loginUser(email, password)
      : await registerUser(typeof body?.name === "string" ? body.name : "", email, password);
    const progress = await getProgressByUserId(user.id);

    return NextResponse.json({ user, progress }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível criar o usuário.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE() {
  await logoutUser();
  return NextResponse.json({ ok: true }, { status: 200 });
}
