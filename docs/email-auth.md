# Cadastro, acesso e recuperação de senha

## Comportamento atual

Cadastro e login **não exigem verificação de e-mail**. O cadastro cria a conta imediatamente, sem enviar mensagem pelo Resend, e mostra a opção de entrar. Contas antigas com emailVerifiedAt vazio também podem acessar trilhas, perfil e progresso. O sistema não marca esses endereços como verificados sem comprovação.

Cadastros repetidos não sobrescrevem nome ou senha de uma conta existente. A resposta é genérica; use a senha atual ou a recuperação. Links antigos de verificação continuam compatíveis, mas são opcionais e não aparecem como etapa de acesso. Solicitações antigas de cadastro pendente podem ser substituídas por um novo cadastro normal.

A recuperação permanece protegida:

- Link “Esqueci minha senha” no login e página /recuperar-senha.
- Resposta igual para e-mails cadastrados e desconhecidos.
- Token aleatório de 256 bits, armazenado somente como SHA-256, com validade de 30 minutos e uso único.
- Página /confirmar com nova senha e repetição; link sem token válido, expirado ou usado apresenta orientação para solicitar outro.
- Token no fragmento da URL, removido após carregamento e mantido só em memória. Abrir a página não consome o token; a confirmação exige POST.
- Troca de senha e revogação de todas as sessões na mesma transação. Links irmãos também são cancelados. Senhas antigas deixam de funcionar.
- Recuperação vinculada ao usuário e senha existentes na solicitação, sem afetar uma conta criada posteriormente.
- Envio com timeout, uma repetição usando a mesma chave de idempotência e erro recuperável se o provedor falhar. Reenvio malsucedido preserva o link anterior.
- Webhooks assinados pelo Resend validam assinatura e timestamp e tratam falhas, atrasos e bounces. Entrega nunca é tratada como confirmação de posse do e-mail.

Não há bloqueio de login por conta de 15 minutos. Mantêm-se limite de 30 requisições de autenticação por IP/minuto e atraso progressivo para senhas erradas, de 125 ms até 2 segundos. Cadastro: 5 solicitações por IP/hora e por e-mail/hora. Envio de recuperação: 1 por e-mail/minuto, 5 por e-mail/hora e 5 por IP/hora. As quotas de envio/cadastro não bloqueiam login.

Na Vercel, o IP usado é o encaminhado e sobrescrito pela plataforma; fora dela há um bucket compartilhado para não confiar em cabeçalhos forjados. Mantenha proteção de bots/WAF na infraestrutura.

## Configuração para recuperação real

No .env local e nas variáveis do ambiente correspondente da Vercel, sem NEXT_PUBLIC_:

```dotenv
APP_ORIGIN="http://localhost:3000"
RESEND_API_KEY="preencher-com-a-chave-de-envio"
EMAIL_FROM="Politika <conta@auth.seu-dominio.com>"
RESEND_WEBHOOK_SECRET="whsec_preencher-com-o-segredo-do-webhook"
```

Em produção, APP_ORIGIN deve usar a origem HTTPS canônica, sem caminho. DATABASE_URL, DIRECT_URL e SESSION_SECRET continuam necessários. Não substitua credenciais existentes pelos exemplos. Nunca habilite EMAIL_TEST_ENDPOINT ou SECURITY_TEST_MODE em produção.

RESEND_API_KEY, EMAIL_FROM e RESEND_WEBHOOK_SECRET estavam ausentes/vazios na última inspeção local. Sem as duas primeiras configurações, cadastro/login funcionam, mas o envio de recuperação retorna erro de indisponibilidade. O build da Vercel em produção exige também o segredo do webhook, para não publicar recuperação incompleta.

1. Verifique um domínio/subdomínio próprio no Resend.
2. Copie exatamente os registros DNS apresentados pelo Resend: DKIM, SPF e registros de Return-Path/MX quando solicitados. Não substitua MX do domínio principal nem publique dois SPF para o mesmo nome.
3. Use EMAIL_FROM desse domínio e chave com permissão de envio. Desative rastreamento de cliques/abertura nos e-mails transacionais para evitar reescrita dos links.
4. Cadastre o webhook HTTPS em /api/webhooks/resend. Eventos: email.sent, email.delivered, email.delivery_delayed, email.failed, email.bounced, email.complained e email.suppressed quando disponível. Configure o signing secret em RESEND_WEBHOOK_SECRET. A rota precisa ser acessível ao provedor, sem login de navegador.
5. Reinicie o servidor/republique após alterar variáveis e teste com uma caixa de e-mail sua.

Referências oficiais: [domínios](https://resend.com/docs/dashboard/domains/introduction), [envio](https://resend.com/docs/api-reference/emails/send-email), [webhooks](https://resend.com/docs/webhooks/verify-webhooks-requests).

## Banco e publicação

Esta remoção da exigência de verificação não muda o schema e não precisa de uma migration adicional. Preserve as migrations existentes; a estrutura de tokens/sessões ainda depende delas. Se não foram aplicadas no destino, faça backup e execute npm run db:migrate antes de liberar o novo código. Não marque e-mails como verificados manualmente.

Nenhuma migration remota, publicação ou mensagem externa é executada pelos testes locais. O executor cria banco PostgreSQL isolado, substitui as conexões/segredos, captura e-mails em memória e encerra o cluster no final.

## Testes

```sh
npm run typecheck
npm run lint
npm run test:unit
npm run test:integration -- --browser
```

A integração cobre cadastro e acesso sem confirmação, contas antigas, recuperação, expiração/replay/concorrência, revogação de sessões, falhas HTTP/timeout de envio, webhooks, proteção contra abuso, progresso/conquistas e importação. Chromium percorre cadastro, login, recuperação, senhas diferentes, troca de senha e rejeição de links usados.

Antes de publicar, teste a entrega real:

1. Cadastre-se e entre sem confirmar e-mail.
2. Abra a conta em dois navegadores e solicite recuperação.
3. Abra o e-mail recebido, defina a nova senha e confirme que ambas as sessões antigas deixam de funcionar.
4. Verifique que só a nova senha funciona e o link não pode ser reutilizado.
5. Erre a senha oito vezes e entre com a correta sem bloqueio de 15 minutos.
6. Confira os eventos de entrega no Resend, spam e funcionamento do link completo.

## Validação após remover a exigência de e-mail

Typecheck, lint, build e a suíte completa `node scripts/run-security-tests.mjs --browser` passaram. Foi validado cadastro sem envio/sem confirmação, acesso de contas antigas não verificadas, cadastro mesmo com provedor indisponível, recuperação com uso único/expiração, falha de reenvio preservando o link anterior, revogação de sessões, login após oito senhas erradas e fluxo completo no Chromium. Regressões de progresso/conquistas, temas e importação também passaram.

Os e-mails foram capturados localmente. O envio externo ainda depende das variáveis do Resend e do domínio. Nenhuma migration adicional foi criada, nem houve alteração no banco remoto. O servidor de desenvolvimento foi parado para liberar o Prisma no Windows; reinicie com `npm run dev`.
