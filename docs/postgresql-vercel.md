# PostgreSQL, Neon e Vercel

## Banco e variáveis

Use PostgreSQL e Prisma 6.19.3. DATABASE_URL aponta para a conexão pooled do runtime; DIRECT_URL para a conexão de migrations. Ambas devem apontar para o banco do ambiente correto, com TLS exigido.

Copie as URLs fornecidas pelo Neon, preservando senha codificada e parâmetros de segurança. Nunca versionar valores reais ou usar prefixo NEXT_PUBLIC_.

Configure também APP_ORIGIN, SESSION_SECRET, RESEND_API_KEY, EMAIL_FROM e RESEND_WEBHOOK_SECRET conforme [docs/security.md](security.md). O .env local pode apontar para banco remoto: não presuma que ele seja um banco de teste.

## Deploy

1. Separar bancos, secrets e domínios de Production, Preview e Development.
2. Configurar Node.js 24.x, instalação npm ci e build npm run vercel-build.
3. Fazer backup e testar a migration em homologação.
4. Aplicar npm run db:migrate explicitamente com as variáveis do destino correto.
5. Publicar o build. Ele NÃO aplica migrations.
6. Confirmar funcionamento de autenticação, e-mail, progresso, concorrência e compartilhamentos no domínio HTTPS.

A nova versão rejeita cookies antigos; usuários existentes precisam entrar novamente. Contas, senhas bcrypt, conteúdo e regras de conclusão são preservados. Senhas legadas acima de 72 bytes devem ser redefinidas pelo fluxo de recuperação.

## Importação única de SQLite

Pare as gravações na origem. O importador abre o SQLite para leitura e faz backup consistente em .migration-backups/. Execute contra um destino vazio, com migrations aplicadas:

```bash
npm run db:import:sqlite
```

Também aceita caminho do SQLite como argumento. Todas as respostas originais são preservadas em AnswerArchive, enquanto AnswerAttempt contém a resposta atual por pergunta. Repetições com destino idêntico não duplicam dados; divergências abortam a transação. Não executar no build. Não apagar dados legítimos para tornar o destino vazio.

## Ambiente local antigo

A pasta .local-postgres/ é um cluster antigo de desenvolvimento, independente do banco remoto. O script npm run db:harden:local troca trust por SCRAM e guarda as credenciais exclusivamente na pasta local ignorada. LOCAL_PG_ADMIN pode indicar o papel administrativo; PG_BIN indica o diretório dos binários.

Não expor esse cluster à rede, nem incluí-lo em deployments ou arquivos distribuídos. Os testes novos usam outro cluster descartável com SCRAM desde a criação.

## Validação

npm run test:integration cria um destino exclusivo e protegido, valida upgrade da migration antiga, preservação de histórico, reaplicação sem pendências, build e testes. Não carrega a configuração remota como destino de teste.

Configuração real de permissões, backups, domínio, e-mail e WAF precisa ser validada no painel do provedor. Testes locais não equivalem a deploy remoto verificado.

Fluxos de e-mail, limites e configuracao do Resend: [guia completo](email-auth.md).
