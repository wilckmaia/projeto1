# Politika

Politika e uma plataforma educacional gamificada para aprender politica brasileira e ciencia politica com linguagem clara, trilhas curtas e estudo apartidario.

## MVP atual

- Dashboard com XP, nivel, streak, progresso e proxima aula.
- 3 mundos e 10 topicos com conteudo inicial demonstravel.
- Trilha visual com aulas bloqueadas/desbloqueadas.
- Player em etapas com leitura, questoes de multipla escolha, V/F, selecao multipla e cenarios politicos.
- XP por aula, nivel, sequencia diaria, revisao automatica, conquistas, perfil e ranking local.
- Persistencia local com `localStorage` para testar o fluxo sem backend.

## Como executar do zero

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Perfil e conquistas

Antes de iniciar uma instalação existente, execute `npx prisma db push` para adicionar a tabela `AchievementShare` e gerar o cliente Prisma, preservando os registros existentes.

O perfil em `/perfil` oferece acesso ao painel, às trilhas e a três medalhas vetoriais próprias. Cada medalha desbloqueia quando todas as tarefas do respectivo mundo estão concluídas, inclusive para progresso já salvo. Responder todas as questões continua sendo o critério de conclusão; não é necessário acertar todas.

O botão de compartilhamento cria um link persistente `/conquistas/<token>`, acessível sem login. A página verifica a conclusão no banco e publica apenas nome e conquista. O token público é independente do identificador de sessão. Para compartilhar fora do computador, o site precisa estar publicado em um endereço acessível, com banco persistente. O favicon vetorial está em `src/app/icon.svg`.

## Como testar o fluxo

1. Execute `npm run dev` e abra `http://localhost:3000`.
2. Na tela inicial, escolha `Criar conta`, informe nome, e-mail e uma senha com pelo menos 6 caracteres.
3. Responda uma tarefa e clique em `Salvar progresso`.
4. Atualize a página ou feche e abra o navegador: a sessão e o progresso devem continuar.
5. Clique em `Sair` e entre novamente com o mesmo e-mail e senha.
6. Crie uma segunda conta para confirmar que ela começa sem o progresso da primeira.

## Banco e arquitetura

O projeto não tinha banco real antes: usava `.data/app-store.json` e criava usuários somente pelo nome. Agora usa SQLite local em `prisma/dev.db`, configurado por `DATABASE_URL` em `.env`, com Prisma Client em `src/lib/prisma.ts`.

O schema em `prisma/schema.prisma` possui `User` (nome, e-mail e hash bcrypt da senha), `TaskProgress` (progresso por usuário e tarefa) e `AnswerAttempt` (usuário, atividade, pergunta, resposta escolhida, correção e data/hora). A camada `src/lib/storage.ts` converte essas tabelas para o formato de progresso já usado pelas telas. A sessão fica em cookie `httpOnly` com duração de 30 dias.

## Validacao

```bash
npm run lint
npm run typecheck
npm run build
```
