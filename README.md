# Politika

Plataforma educacional com cadastro sem confirmação obrigatória de e-mail, login, recuperação de senha, perfil, trilhas, progresso individual e conquistas compartilháveis. Next.js 16, Prisma 6, PostgreSQL e bcrypt.

## Configuração

Requer Node.js 24.x e PostgreSQL. Use [.env.example](.env.example) e consulte [segurança e publicação](docs/security.md).

Configure DATABASE_URL, DIRECT_URL, SESSION_SECRET, APP_ORIGIN, RESEND_API_KEY, EMAIL_FROM e RESEND_WEBHOOK_SECRET. Para envio de mensagens, o remetente/domínio deve estar verificado no Resend.

```bash
npm ci
npm run db:migrate
npm run dev
```

O comando de migration escreve no banco configurado: use o ambiente correto. Para migração única de SQLite, com origem parada e destino vazio, use npm run db:import:sqlite. Uma instalação nova não precisa importar dados.

## Verificação

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run test:integration
npm run security:audit
```

O teste integrado cria seu próprio PostgreSQL com senha e acesso local. Não utiliza o banco remoto do .env. Exercita upgrade de migrations, build, autenticação, isolamento, concorrência, progresso e conquistas. Requer PostgreSQL 18 instalado; configure PG_BIN se necessário. Adicione -- --browser para incluir os testes Chromium (Chrome instalado).

## Produção

O build Vercel gera Prisma Client e compila Next.js. Migrations devem ser aplicadas explicitamente pelo processo de release antes da publicação, após backup e validação em homologação. Não use db push ou migrate reset em produção.

Consulte [o checklist de publicação](docs/security.md) e [a configuração PostgreSQL/Vercel](docs/postgresql-vercel.md).

## Arquitetura

- prisma/schema.prisma: usuários, sessões revogáveis, desafios de e-mail, progresso, respostas, compartilhamentos e quotas.
- src/lib/auth.ts e session.ts: autenticação, confirmação/recuperação e cookies HTTP-only.
- src/lib/storage.ts: persistência transacional e isolamento por conta.
- src/lib/data.ts: conteúdo completo e gabaritos, somente no servidor.
- src/lib/catalog.ts: metadados públicos. Execute npm run catalog:generate após mudar o catálogo.
- scripts/import-sqlite.mjs: importação offline com preservação do histórico.

Fluxos de e-mail, limites e configuracao do Resend: [guia completo](docs/email-auth.md).
