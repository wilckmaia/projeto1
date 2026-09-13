# Segurança e publicação

## Implementado

- F01: quotas atômicas no PostgreSQL por operação, conta e IP confiável da Vercel; 429 e Retry-After. Não há contador em memória nem opção de desativação em produção.
- F02/F08: uma resposta atual por pergunta; gravação e verificação sob lock da conta. Requests idênticos são idempotentes. Histórico anterior preservado em AnswerArchive.
- F03: tokens opacos aleatórios, apenas SHA-256 no banco, expiração e revogação no logout/redefinição de senha. Máximo de dez sessões ativas por conta; tokens HMAC antigos não são aceitos.
- F04/F06/F07: origem explícita, JSON obrigatório, leitura limitada em bytes, validação de campos e erros públicos sanitizados.
- F05/F09/R05: cadastro imediato sem confirmação obrigatória de e-mail, respostas uniformes, comparação bcrypt também para conta inexistente, mínimo de 15 caracteres e máximo de 72 bytes UTF-8. Senhas antigas curtas permanecem válidas; antigas acima de 72 bytes exigem recuperação por e-mail.
- R02: links públicos podem ser revogados pelo proprietário. Revogação é imediata; um novo compartilhamento gera outro token.
- R03/R07: CSP com nonce renovado, antienquadramento, no-referrer, nosniff, Permissions-Policy e módulos server-only.
- R06: catálogo público separado de conteúdo/gabaritos. A tela recebe explicações e índices corretos após responder; critérios de conclusão e conteúdo não mudaram.
- D01/D02: Prisma/Client 6.19.3, Effect corrigido e override de deepmerge-ts 8.0.0. Testar geração, migrations e build sempre que atualizar o override.
- R01: testes criam cluster isolado com SCRAM, loopback e nome aleatório; não carregam .env. Execução direta contra outra base é bloqueada.
- R04: capturas, cookie jars, dados locais e arquivos temporários não são versionados.
- F10: scripts/harden-local-postgres.mjs configura SCRAM na antiga instância local, testa acesso com senha e rejeição sem credencial. Não modifica a conexão remota.

## Configurar antes de publicar

1. Em cada ambiente, definir APP_ORIGIN como origem exata, sem caminho, por exemplo https://seu-dominio.example. Use um domínio canônico e redirecione os alternativos. Para desenvolvimento: http://localhost:3000.
2. Definir DATABASE_URL (runtime com pooling), DIRECT_URL (migrations), SESSION_SECRET aleatório de 32 bytes ou mais, RESEND_API_KEY, EMAIL_FROM e RESEND_WEBHOOK_SECRET com remetente/domínio verificado no Resend. Nenhuma variável deve usar NEXT_PUBLIC_.
3. Separar banco, segredo e domínio entre Production, Preview e Development. O build de produção Vercel verifica presença e parâmetros básicos, mas não confirma permissões ou configuração do provedor.
4. Configurar regras de volume/WAF e alertas de consumo no painel Vercel. Fora da Vercel, clientes compartilham uma quota conservadora; não confiar em headers IP enviados diretamente pelo cliente.
5. Testar envio real de e-mail com destinatário autorizado após configurar o provedor. Esta implementação só testa entrega em capturador local, sem mensagens externas.
6. Fazer backup e testar restauração. Revisar roles: runtime sem DDL; migrations com credencial separada; restringir o acesso à tabela AnswerArchive que contém histórico privado.
7. Aplicar migrations pelo processo de release explicitamente apontado ao banco correto, ANTES de liberar o novo deployment:
   npm run db:migrate
8. Fazer deploy. O build NÃO aplica migrations. Todas as sessões antigas precisarão de novo login.
9. Confirmar HTTPS, headers/CSP, login, recuperação, revogação, concorrência e isolamento entre contas no deployment real. Remover/proteger deployments antigos.
10. Não registrar passwords, cookies, links de confirmação nem URLs do banco. Eventos inesperados têm identificador de incidente sem serializar a exceção.

## Dados existentes e migration

A migration 20260912000000_security é transacional. Ela copia todas as AnswerAttempt antigas para AnswerArchive antes de consolidar a resposta atual mais recente por pergunta (desempate determinístico por ID). Não apaga usuários, progressos nem conquistas. As cópias históricas não são carregadas pelas APIs.

O importador SQLite arquiva as respostas de origem e importa uma resposta atual por pergunta; é offline, exige destino vazio ou idêntico e preserva um backup. Nunca executá-lo automaticamente no build.

Planejar retenção/eliminação de dados pessoais e do arquivo histórico conforme a política do produto. Contas novas e antigas acessam sem verificação de e-mail. Dados e senhas são preservados; emailVerifiedAt não é preenchido artificialmente.

## Testes

Requer PostgreSQL 18 instalado. No Windows usa C:/Program Files/PostgreSQL/18/bin; em outro local definir PG_BIN. Nenhum teste necessita de credenciais remotas:

- npm run typecheck
- npm run lint
- npm run test:unit
- npm run test:integration
- npm run security:audit

O teste integrado inicializa um cluster com senha aleatória e acesso somente em loopback, exercita upgrade de migration com duplicatas, aplica migrations novamente para verificar repetibilidade, gera Prisma, executa TypeScript, build e testes HTTP. E-mails ficam apenas em memória no capturador local. O cluster é parado ao terminar; arquivos de diagnóstico ficam em .security-test/, ignorado pelo Git.

O teste cobre cadastro/confirmar/recuperar, expiração e replay, contas legadas, CSRF, entradas grandes, enumeração por resposta, quotas concorrentes, progresso/conquistas de todos os mundos, idempotência, concorrência e isolamento.

## Limites operacionais

A aplicação reduz abuso, mas não substitui WAF e dimensionamento do banco. Não há bloqueio de login por conta/e-mail. A quota de autenticação por IP usa janela de 60 segundos; falhas de senha recebem atraso progressivo por IP até 2 segundos. Quotas separadas de envio limitam bots e abuso da caixa de entrada. Contas inexistentes usam comparação bcrypt de mesmo custo, mas não se promete indistinguibilidade perfeita de rede/infraestrutura.

E-mail depende do provedor e DNS; migrations remotas, permissões, backups, WAF, domínios e retirada de deployments antigos exigem acesso administrativo externo e não são validados pelos testes locais.

A migration 20260913000000_progress_consistency reconcilia acertos/erros com as respostas atuais, preservando flags de conclusao e datas. O importador aplica a mesma regra. SESSION_SECRET pseudonimiza as quotas; rotaciona-lo nao substitui a revogacao de sessoes no banco.

## Verificações concluídas em 13/09/2026

- TypeScript e ESLint aprovados.
- Build de produção aprovado com Next.js 16.3.4 e Prisma Client 6.19.3.
- npm audit: zero vulnerabilidades conhecidas nas dependências resolvidas.
- Upgrade das migrations a partir do schema original, preservação do histórico, reconciliação dos contadores e reaplicação sem pendências aprovados.
- Prisma migrate diff: nenhuma diferença entre schema e banco de teste.
- Integração HTTP de autenticação, confirmação/recuperação por e-mail local, revogação/expiração, isolamento, CSRF, limites de corpo, quotas concorrentes, todos os sete mundos e compartilhamentos aprovada.
- Importação de SQLite e segunda execução idempotente aprovadas, com preservação das respostas históricas.
- Chromium: temas claro/escuro, recarga/reabertura, desktop/mobile, navegação, feedback, contraste e ausência de erros de hidratação aprovados.
- Testes de conteúdo/regras dos mundos 4–7 e dos tokens de tema aprovados.
- Nenhuma correspondência dos valores secretos atuais nos 17 artefatos públicos examinados.
- PostgreSQL local antigo: SCRAM aplicado e testes de credencial válida/inválida aprovados.

As ferramentas Next/Prisma podem ler o arquivo .env durante o build, mas o executor fornece explicitamente conexões aleatórias de loopback, que têm precedência. Nenhuma migration ou teste de escrita foi executado contra o banco remoto.

Não houve deploy, envio de e-mail externo nem validação do painel Vercel. Aplicação das migrations no destino correto, remetente/DNS do e-mail, WAF, permissões e backups continuam como etapas de publicação.

Fluxos de e-mail, limites e configuracao do Resend: [guia completo](email-auth.md).

## Fluxos de e-mail concluídos em 13/09/2026

Histórico da etapa anterior (a exigência de verificação foi removida depois): verificação para contas novas e antigas, reenvio, recuperação completa, remoção do bloqueio de login por e-mail, atraso progressivo por IP, entrega com idempotência e webhooks assinados implementados. Nova migration: 20260913010000_email_flows. Svix 2.5.0 foi adicionado com versão exata; npm audit permanece sem vulnerabilidades conhecidas.

Typecheck, lint, build e suíte integrada completa com Chromium passaram após essas alterações. A configuração real do Resend e a migration no banco de destino continuam pendentes; consulte [email-auth.md](email-auth.md) para variáveis, DNS, webhook e validação real de entrega.

## Validação após remover a exigência de e-mail

Typecheck, lint, build e a suíte completa `node scripts/run-security-tests.mjs --browser` passaram. Foi validado cadastro sem envio/sem confirmação, acesso de contas antigas não verificadas, cadastro mesmo com provedor indisponível, recuperação com uso único/expiração, falha de reenvio preservando o link anterior, revogação de sessões, login após oito senhas erradas e fluxo completo no Chromium. Regressões de progresso/conquistas, temas e importação também passaram.

Os e-mails foram capturados localmente. O envio externo ainda depende das variáveis do Resend e do domínio. Nenhuma migration adicional foi criada, nem houve alteração no banco remoto. O servidor de desenvolvimento foi parado para liberar o Prisma no Windows; reinicie com `npm run dev`.
