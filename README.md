# Politika

Plataforma educacional com cadastro, login, perfil, trilhas, progresso individual e conquistas compartilháveis. Next.js 16, Prisma 6, PostgreSQL e bcrypt.

## Configuração

Requer Node.js 24.x e PostgreSQL. Consulte [o guia de migração, Neon e Vercel](docs/postgresql-vercel.md), incluindo valores das variáveis, transferência de dados e configuração do deploy.

Configure `.env` usando `.env.example`: `DATABASE_URL`, `DIRECT_URL` e `SESSION_SECRET`.

```bash
npm ci
npm run db:migrate
# Apenas na primeira transferência, com SQLite parado e destino vazio:
npm run db:import:sqlite
npm run dev
```

Abra http://localhost:3000. Uma instalação nova sem dados anteriores não precisa executar o importador.

## Validação

```bash
npm run lint
npm run typecheck
npm run build
npm run test:integration
```

O teste de integração usa PostgreSQL real, sobe o build na porta 3197 e remove as contas de teste ao terminar. Execute contra banco de desenvolvimento/homologação.

## Arquitetura

- `prisma/schema.prisma`: User, TaskProgress, AnswerAttempt e AchievementShare.
- `src/lib/prisma.ts`: cliente reutilizado por processo; pooling Neon na aplicação.
- `src/lib/storage.ts`: autenticação bcrypt e persistência de progresso.
- `src/lib/session.ts`: cookie HTTP-only assinado, válido por 30 dias.
- `prisma/migrations`: histórico PostgreSQL aplicado por migrate deploy.
- `scripts/import-sqlite.mjs`: ferramenta offline; SQLite não participa do runtime.

O build Vercel gera Prisma Client, aplica migrations e compila Next.js. Não use db push ou migrate reset em produção. Layout, conteúdo e critérios de conclusão foram preservados.
