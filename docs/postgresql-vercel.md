# PostgreSQL, Neon e Vercel

## Análise e alterações

SQLite era utilizado pelo datasource Prisma e pela `DATABASE_URL` em `.env`, apontando para `prisma/dev.db`. Não havia migrations versionadas; o README orientava `db push`. O seed é vazio. Aulas e regras de progressão estão em `src/lib/data.ts` e `src/lib/progress.ts`.

Foram analisados aplicação, componentes, APIs, autenticação, progresso, conquistas, schema, scripts e configurações. Os acessos ao banco estão em `src/lib/prisma.ts`, `src/lib/storage.ts`, API de compartilhamento e página pública de conquista. Não há papéis administrativos; as permissões existentes são autenticação, isolamento por usuário e desbloqueios por progresso.

Prisma e Prisma Client 6.16.2, bcryptjs, Next.js e React foram preservados. O datasource agora é PostgreSQL, com `DATABASE_URL` pooled para aplicação e `DIRECT_URL` direta para migrations. As quatro tabelas mantêm campos, índices, unicidade e cascatas. Tipos PostgreSQL: TEXT, INTEGER, BOOLEAN e TIMESTAMP(3).

As consultas Prisma são compatíveis. Foi corrigida uma diferença: SQLite ordena datas NULL primeiro em ordem crescente, PostgreSQL por último. `completedAt` agora declara `nulls: "first"`, preservando mundo atual e última atualização.

Também foi corrigido um problema concreto de produção: o cookie antigo continha somente o ID do usuário sem assinatura. Agora a sessão usa HMAC-SHA256 e verifica validade no servidor. Cookies continuam HTTP-only, SameSite=Lax, Secure em produção e com validade de 30 dias. Será necessário um novo login uma vez após a atualização; contas, senhas e progresso são preservados. Mantenha `SESSION_SECRET` entre deployments. Mudar de localhost para o domínio Vercel também exige login, pois cookies pertencem ao domínio.

Nenhum componente visual, CSS, conteúdo ou regra de conclusão/desbloqueio foi alterado.

## Criar o Neon gratuito

1. Acesse https://console.neon.tech e crie uma conta.
2. Escolha o plano Free e crie um projeto, por exemplo `politika`.
3. Escolha uma região próxima às funções Vercel. Use `neondb` ou anote o nome escolhido.
4. Abra **Connect** e selecione a branch de produção, o banco e o usuário/role.
5. Ative **Connection pooling** e copie a connection string para `DATABASE_URL`.
6. Desative **Connection pooling** e copie a string direta para `DIRECT_URL`. As duas devem apontar para a mesma branch e banco.
7. Use outra branch/banco para Preview e Development, pois cada deploy aplica migrations.

Consulte as cotas atuais do Free no painel Neon. Referências: [criação de projeto](https://neon.com/docs/get-started/signing-up) e [pooling](https://neon.com/docs/connect/connection-pooling).

## Valores das variáveis

O valor real de `DATABASE_URL` é exatamente a connection string do seu projeto copiada em Connect com pooling ligado. Não há URL universal: endpoint, usuário e senha dependem do banco criado. Não cole os placeholders abaixo literalmente.

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@ep-YOUR-ENDPOINT-pooler.REGION.aws.neon.tech/neondb?sslmode=require&connect_timeout=15&connection_limit=5&pool_timeout=20"
DIRECT_URL="postgresql://USER:PASSWORD@ep-YOUR-ENDPOINT.REGION.aws.neon.tech/neondb?sslmode=require&connect_timeout=15"
SESSION_SECRET="SEU_SEGREDO_ALEATORIO"
```

Preserve host, provedor, região, senha codificada e parâmetros de segurança fornecidos pelo Neon, como `channel_binding=require`. Acrescente os timeouts e o limite de conexões usando `&` se já houver `?`, sem duplicar parâmetros. O limite de 5 é por instância da aplicação e pode ser ajustado conforme carga/capacidade. A conexão direta não usa o host `-pooler`.

Gere o segredo uma vez e copie o resultado para `SESSION_SECRET`:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Nunca use `NEXT_PUBLIC_` nestas variáveis. `.env.example` contém somente exemplos; `.env` e backups não devem ser versionados.

## Transferir os dados existentes

1. Pare a aplicação SQLite e suspenda cadastros/gravações durante a transferência.
2. Preserve `prisma/dev.db`. O importador o abre somente para leitura e cria snapshot consistente em `.migration-backups/` pela API SQLite de backup, incluindo dados confirmados no WAL.
3. Configure `.env` com as URLs Neon e o segredo.
4. Execute na raiz, usando Node.js 24.x:

```bash
npm ci
npm run db:migrate
npm run db:import:sqlite
npx prisma migrate status
```

Para outro arquivo de origem:

```bash
npm run db:import:sqlite -- "C:/caminho/backup/dev.db"
```

O importador verifica integridade, converte datas/booleanos, copia tabelas na ordem das relações e compara todos os campos dentro de uma transação. IDs, hashes bcrypt, datas e tokens públicos são preservados. Ele bloqueia as quatro tabelas durante a operação e exige destino vazio. Repetir com destino exatamente igual não escreve nem duplica; divergências abortam sem sobrescrever dados. Timeout: 120 segundos; bases muito maiores exigem dimensionar a transferência antes do corte.

Não execute o importador no build Vercel. Termine a cópia antes de liberar tráfego. Se o destino tiver dados legítimos, use outro banco vazio, sem apagá-los. Não use `db push`, `migrate reset` ou exclusão do SQLite como procedimento de produção. Guarde o backup com acesso restrito. Depois de novas gravações PostgreSQL, voltar ao SQLite antigo perderia essas gravações; mantenha tráfego suspenso e corrija o destino em caso de falha.

Instalação nova sem dados anteriores: omita `db:import:sqlite`. O seed não é necessário.

## Configurar Vercel

1. Importe o repositório como Next.js, com a raiz deste projeto como Root Directory.
2. Em **Settings → Build and Deployment**, configure Node.js **24.x**, Install Command `npm ci` e Build Command `npm run vercel-build` (já declarado em `vercel.json`). Mantenha Output Directory padrão.
3. Em **Settings → Environment Variables**, adicione `DATABASE_URL`, `DIRECT_URL` e `SESSION_SECRET`.
4. Cole apenas os valores, sem aspas externas ou prefixo `DATABASE_URL=`. Selecione Production para o banco de produção; configure valores próprios para Preview e Development.
5. Faça deploy após importar os dados. O build gera Prisma Client, aplica migrations pendentes e compila Next.js. `postinstall` também gera o cliente, evitando código gerado antigo com cache de dependências.
6. Alterações de variáveis só valem para novos deployments: faça **Redeploy** depois de alterá-las.
7. No domínio HTTPS publicado, teste cadastro, saída/login, tarefa, recarga, perfil, isolamento entre contas e bloqueios/conquistas.

Use o runtime Node.js padrão; não configure exportação estática ou Edge. Cookies, Prisma e bcrypt precisam do servidor. Nenhum `.db` é enviado à Vercel. O cliente Prisma continua reutilizado por processo e usa pooling Neon.

Fontes: [conexões Prisma](https://www.prisma.io/docs/orm/v6/prisma-client/setup-and-configuration/databases-connections), [variáveis Vercel](https://vercel.com/docs/environment-variables), [Node.js 24 Vercel](https://vercel.com/changelog/node-js-24-lts-is-now-generally-available-for-builds-and-functions).

## Ambiente local e testes

O `.env` desta máquina aponta para PostgreSQL 18 local em `127.0.0.1:55439`, banco `politika_test`, com os dados importados. Essa URL NÃO funciona na Vercel; substitua pelas conexões Neon antes do deploy. A instância local está limitada a loopback e utiliza trust para testes: não a exponha na rede. Um segredo local aleatório foi gerado sem exibi-lo.

Se precisar reiniciar esse banco no Windows, a partir da raiz:

```powershell
Start-Process -FilePath 'C:/Program Files/PostgreSQL/18/bin/postgres.exe' -ArgumentList '-D .local-postgres -h 127.0.0.1 -p 55439' -WindowStyle Hidden
```

Execute em banco de desenvolvimento/homologação:

```bash
npm run lint
npm run typecheck
npm run vercel-build
npm run test:integration
```

O teste abre um servidor na porta 3197, cria contas descartáveis e remove apenas essas contas ao terminar. Verifica cadastro, duplicidade, login, senha inválida, assinatura do cookie, logout, persistência, isolamento, bloqueios, perfil, respostas e conquistas públicas.

Validações executadas com sucesso: lint, TypeScript, build de produção com `vercel-build`, testes HTTP de integração e comparação do schema instalado com o Prisma (`migrate diff`, sem diferenças). O teste de logout foi ajustado para aceitar a expiração de cookie por `Expires`, usada por esta versão do Next.js.

A importação dos dados existentes foi validada em PostgreSQL real: 4 usuários, 7 progressos, 24 respostas e 1 compartilhamento, com comparação integral e repetição sem duplicação. Credenciais Neon/Vercel não estavam disponíveis: banco remoto, importação remota e deploy precisam ser executados com as credenciais do projeto. Teste local não equivale a deploy remoto verificado.

## Arquivos alterados/criados

- `.env` (local, ignorado): PostgreSQL local e segredo.
- `.env.example`: variáveis Neon.
- `.gitignore`: ambientes, backups, PostgreSQL local e cache TypeScript.
- `package.json` e `package-lock.json`: scripts e Node.js 24.
- `prisma/schema.prisma`: PostgreSQL e conexão direta.
- `prisma/migrations/migration_lock.toml`: provider PostgreSQL.
- `prisma/migrations/20260908000000_postgresql_init/migration.sql`: tabelas, índices e relações.
- `src/lib/storage.ts`: ordenação equivalente e sessão assinada.
- `src/lib/session.ts`: assinatura e validade de sessão.
- `scripts/import-sqlite.mjs`: importação transacional verificável.
- `scripts/check-achievements.mjs`: testes ampliados.
- `vercel.json`: build com migrations.
- `README.md` e `docs/postgresql-vercel.md`: documentação.

Artefatos locais gerados: `.local-postgres/`, `.migration-backups/`, `.next/` e Prisma Client em `node_modules/`. O SQLite original foi preservado.
