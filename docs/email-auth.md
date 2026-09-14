# Recuperação de senha — Politika

## Fluxo implementado

O login existente em `/` usa `AuthForm`. O link “Esqueci minha senha” abre `/recuperar-senha`. O cadastro, a verificação opcional, o progresso e o login mantêm seus comportamentos.

- `POST /api/auth/forgot-password`: recebe e-mail, normaliza e valida; aplica limites persistentes de 5 solicitações/IP/hora, 1/e-mail/minuto e 5/e-mail/hora. Responde HTTP 202 com a mesma mensagem para contas existentes e desconhecidas. HTTP 429 inclui Retry-After.
- A consulta e o envio executam com `after()` do Next.js (suportado na Vercel, maxDuration 60 segundos), impedindo que o tempo de envio revele a existência da conta. Não é uma fila durável: em falhas ou interrupções, o usuário pode reenviar após o intervalo. Erros geram eventos sanitizados no servidor, sem alterar a resposta genérica.
- Somente usuários existentes recebem token aleatório de 32 bytes (256 bits), com hash SHA-256 em `PasswordResetToken`. Nenhum token é devolvido pela API.
- Cada solicitação processada apaga os tokens anteriores da conta. Se o envio falhar, o novo token também é apagado; solicite outro link.
- E-mail real pelo SDK oficial Resend, HTML responsivo e texto simples, com timeout de 10 segundos por tentativa e uma repetição com a mesma chave de idempotência.
- Link: `${APP_ORIGIN}/redefinir-senha#token=...`. O fragmento mantém o token fora dos logs HTTP e é removido do endereço após carregar. A página também aceita `?token=...` por compatibilidade, mas o envio usa fragmento. Desative rastreamento de cliques para não reescrever o link.
- `/redefinir-senha`: nova senha, confirmação, mostrar/ocultar, validação, loading, erros, sucesso e retorno ao login. Abrir o link não consome o token.
- `POST /api/auth/reset-password`: recebe `token`, `password` e `confirmPassword`. Valida hash, expiração de 30 minutos e uso; aplica limite de 20 tentativas/IP/minuto.
- A política existente foi compartilhada entre frontend e backend: mínimo de 15 caracteres Unicode, máximo de 72 bytes UTF-8, rejeição de senhas previsíveis. O bcryptjs permanece com custo 12.
- Transação com bloqueio da linha do usuário atualiza a senha, marca o token como usado, invalida os demais e apaga todas as sessões. O bloqueio é compatível com a emissão de sessões existente e impede corridas com login e consumo duplo.
- A recuperação identifica a conta exclusivamente pelo token. Nenhuma senha, token original ou credencial é registrada pelos logs da aplicação.

## Variáveis e Resend

São usados `RESEND_API_KEY`, `EMAIL_FROM`, `APP_ORIGIN`, `DATABASE_URL` e `SESSION_SECRET` (HMAC dos limites persistentes). `DIRECT_URL` continua sendo a conexão direta usada pelo Prisma nas migrations.

O webhook existente `/api/webhooks/resend` foi preservado, incluindo assinatura Svix e timestamp. Ele continua usando `RESEND_WEBHOOK_SECRET` para a verificação opcional de e-mail; a recuperação não depende de callbacks nem desse segredo. A verificação de produção existente ainda exige esse segredo para manter o webhook funcional.

Na Vercel, mantenha as variáveis nos ambientes corretos, APP_ORIGIN como origem HTTPS canônica sem caminho e EMAIL_FROM em domínio verificado no Resend. A chave precisa ter permissão de envio. Não habilite EMAIL_TEST_ENDPOINT ou SECURITY_TEST_MODE em produção. O SDK não é importado por componentes cliente.

Confira domínio/DNS, remetente e eventos no painel do Resend. Referência: https://resend.com/docs/api-reference/emails/send-email

## Migration e publicação

Nova migration aditiva: `prisma/migrations/20260913030000_password_reset/migration.sql`. Cria somente `PasswordResetToken`, índices e relação com User. Preserve o histórico existente. Nenhuma migration de produção foi executada nesta implementação.

Antes de publicar o código no ambiente de destino:

```sh
npm ci
npm run db:migrate
npm run build
```

`db:migrate` executa `prisma migrate deploy`. Configure DATABASE_URL e DIRECT_URL para o mesmo banco de destino. O build Vercel já gera o Prisma Client e valida as variáveis; não aplica migrations automaticamente.

## Verificações

```sh
npm run lint
npm run typecheck
npm run test:unit
npm run test:integration -- --browser
```

A suíte integrada usa PostgreSQL temporário local, aplica todo o histórico de migrations e verifica diferenças de schema, TypeScript, build, APIs e Chromium. O SDK envia somente ao capturador HTTP do ambiente isolado; isso testa o fluxo sem mandar mensagens reais ou tocar no banco remoto. Requer PostgreSQL 18 e Chrome instalados; PG_BIN permite configurar o caminho do PostgreSQL.

Os testes de recuperação cobrem conta existente/inexistente e resposta idêntica, normalização, token aleatório armazenado como hash, prazo, token inválido/expirado/usado, senhas fracas/diferentes, substituição de link, consumo concorrente/replay, revogação de sessões, login com senha nova e rejeição da antiga, falha de envio e rate limiting. O teste Chromium percorre formulários, visibilidade, erros, sucesso e login.

Após publicar, faça uma solicitação para uma conta sua e confirme a entrega real na caixa de entrada e no painel do Resend. A entrega externa não é comprovada pelo capturador local.

## Diagnóstico de falha em produção

O código anterior já exigia ausência de `error` e presença de `data.id`, mas descartava o erro do SDK e as exceptions antes do log genérico. HTTP 202 confirma apenas o processamento agendado, não a aceitação pelo Resend. O SDK usa `RESEND_API_KEY` e `EMAIL_FROM`; o host de produção agora é fixado explicitamente em `https://api.resend.com`, impedindo override implícito por `RESEND_BASE_URL`. Não foi constatado esse override em produção.

O evento `password_reset_delivery_failed` inclui `provider`, `errorName` (lista permitida), `errorMessage` (classificação em texto fixo), `statusCode` (ou null), `recipientPresent`, `senderFormatValid` e `testSender`. Não são registrados mensagens brutas do SDK, stack, headers, destinatários, remetentes, URLs ou credenciais. Mensagens desconhecidas recebem classificação genérica. Os campos adicionais podem ser retirados após concluir o diagnóstico.

- `Resend test sender restriction`: `onboarding@resend.dev` permite testes somente para o endereço da conta Resend. Para usuários reais, verifique um domínio e use `Politika <noreply@seu-dominio-verificado>` em `EMAIL_FROM`.
- `Sender domain is not verified`: confira DNS e status Verified do domínio exato do remetente na mesma conta Resend.
- `API key authentication or permission failure` / `API key does not permit this sender domain`: confira chave ativa, sem aspas/espaços acidentais e escopo do domínio. `sending_access` basta; não é necessário ampliar para acesso total. Gere outra chave somente se a atual for inválida, revogada ou incompatível com o domínio.
- `Invalid EMAIL_FROM format` / `senderFormatValid: false`: use um endereço simples ou `Nome <endereco@dominio.com>`. A checagem local de formato não comprova domínio verificado.
- `Transport failure` com status null: o SDK não obteve resposta utilizável; investigar conectividade/timeout. Não implica rejeição por domínio.
- `invalid_response`: a resposta não trouxe ID; não é tratada como envio aceito.

Após publicar estas alterações, faça uma recuperação pelo formulário para uma conta sua cadastrada. Respeite o intervalo de 60 segundos e os limites por hora. Confira o evento nos Runtime Logs da mesma implantação. Ajuste apenas a variável indicada pelo diagnóstico em Vercel Production e faça novo deployment para aplicar os valores. Repita a solicitação: a falha invalida o token emitido. Confirme a tentativa em Emails no Resend e depois a entrega/inbox/spam. Nenhum teste local comprova entrega real.

Referências: https://resend.com/docs/api-reference/errors, https://resend.com/docs/knowledge-base/403-error-resend-dev-domain e https://resend.com/docs/api-reference/api-keys/create-api-key.
