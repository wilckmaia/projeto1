# Politika

## Mundos e conteúdo educacional

A jornada começa com os três mundos originais: **Fundamentos → Estado, Democracia e Instituições → Política Brasileira, Economia e Poder**. As atividades, os certificados e o progresso salvo desses mundos foram restaurados.

Ao concluir os três mundos iniciais, **Executivo, Legislativo, Judiciário e Economia são liberados juntos**. Executivo, Legislativo e Judiciário continuam vazios. Economia contém os sete micromundos e três tópicos com atividades, incluindo os textos completos e as atividades de PIB e de Inflação fornecidos pelo usuário. Os quatro não dependem da conclusão uns dos outros. Mundos vazios nunca contam como concluídos nem emitem certificados. As regras são validadas também no servidor.

O acervo anterior foi preservado em `src/lib/legacy-data.ts` e pode ser consultado em
`/biblioteca` após entrar na conta. A biblioteca continua como consulta opcional. Nos três mundos originais, os exercícios e a correção foram recuperados, e o progresso anterior volta a contar. Progresso, respostas e compartilhamentos existentes são preservados.

### Adicionar trilhas e lições

Edite `src/lib/education.ts`. Cada mundo tem `tracks`; cada trilha recebe `id`,
`title`, `description` e `lessons`. Cada lição recebe `id`, `title`, `summary`
(conceito), `explanation`, `deepContent`, `keyConcepts`, `examples` e `questions`.
Use arrays vazios para campos opcionais de lista e texto vazio quando necessário.
Nos quatro mundos novos, perguntas servem apenas como consulta e o botão **Concluir lição** salva a conclusão sem exigir respostas. Nos três originais, a conclusão exige responder todas as questões, como antes. As lições de um mundo desbloqueado ficam disponíveis nas trilhas.

Use IDs únicos, estáveis e em letras minúsculas, números e hífens. Não reutilize IDs
do acervo, nem renomeie um ID para dar outro significado ao progresso existente.
Não use `trilhas` como ID. O gerador valida colisões. Após editar, execute:

```bash
npm run catalog:generate
npm run typecheck
npm run test:unit
```

`catalog.ts` é gerado e contém apenas metadados de navegação. O conteúdo completo
permanece no servidor até o aluno abrir a lição. Não são necessárias telas de administração.

### Atualizar uma instalação existente

Esta versão acrescenta a tabela `Certificate`, sem alterar tabelas ou registros
existentes. Antes de usar a versão atualizada, aplique a migração no ambiente correto:

```bash
npm ci
npm run db:migrate
npm run build
npm run start
```

Para desenvolver, use `npm run dev` após a migração. Pare o servidor Next antes de
regenerar Prisma Client no Windows, caso a DLL esteja em uso. Não use `migrate reset`.
O banco remoto não é alterado pelos testes: eles usam um PostgreSQL temporário local.

### Certificados

Em `/perfil`, cada mundo oferece seu certificado após a conclusão de todas as lições.
A emissão é explícita, idempotente e registrada com UUID, nome do usuário, mundo,
plataforma e datas. Os dados ficam preservados como eram no momento da emissão.
Somente o titular pode abrir `/certificados/[id]` e baixar o PDF. O PDF é gerado no
navegador com `pdf-lib`, preservando caracteres do nome com fontes locais, e contém
uma imagem de alta resolução do certificado. A página HTML mantém o texto acessível;
também há opção de imprimir/salvar como PDF. Links públicos antigos continuam em
`/conquistas/[token]` e podem ser gerenciados no histórico do perfil.

Os testes `test-restored-worlds.mjs` e `test-education-database.mjs` verificam regras,
persistência, isolamento, concorrência e certificados usando fixtures exclusivamente
de teste. `npm run test:integration -- --browser` inclui Chrome, responsividade,
preferência de tema e download real do PDF; as capturas ficam em `.data/theme-check`.

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
- src/lib/auth.ts, password-reset.ts e session.ts: autenticação, confirmação/recuperação e cookies HTTP-only.
- src/lib/storage.ts: persistência transacional e isolamento por conta.
- src/lib/data.ts: conteúdo completo e gabaritos, somente no servidor.
- src/lib/catalog.ts: metadados públicos. Execute npm run catalog:generate após mudar o catálogo.
- scripts/import-sqlite.mjs: importação offline com preservação do histórico.

Fluxos de e-mail, limites e configuracao do Resend: [guia completo](docs/email-auth.md).

## Atividades de PIB e Inflação

O tópico 1 de Macroeconomia apresenta o texto completo de PIB fornecido pelo usuário, com dez atividades, quatro avançadas, fórmulas e tabelas. Por escolha explícita do usuário, o novo **Tópico 2 — Inflação e Deflação** foi inserido em **Microeconomia**, também com dez atividades. O tópico de Elasticidade existente foi preservado, assim como o tópico-resumo de inflação de Macroeconomia; Essa etapa foi posteriormente atualizada pela remoção dos tópicos sem atividades.

Os textos originais ficam em `src/lib/economy-study-documents.ts`, sem correção editorial ou alteração dos valores. As fórmulas são renderizadas por KaTeX no servidor. As respostas comentadas ficam recolhidas para consulta, e há simuladores nas atividades interativas e campos opcionais de resolução nas avançadas. A conclusão continua registrada por tópico, sem transformar as atividades em treinamento obrigatório.

## Desemprego e limpeza dos tópicos vazios

Macroeconomia mantém PIB e Desemprego e Mercado de Trabalho; Microeconomia mantém Inflação e Deflação, conforme a localização escolhida pelo usuário. São três tópicos com 30 atividades, sendo 12 avançadas. As sete áreas principais foram preservadas; seus tópicos internos sem atividades e as listas “Micromundos internos” foram retirados da navegação. As definições dos 68 tópicos removidos estão em `docs/economy-empty-topics-archive.json`, sem rotas ativas. Nenhum registro de progresso foi apagado do banco, e os IDs dos três tópicos mantidos foram preservados.


Atualização: o Tópico 2 — Inflação e Deflação foi transferido para Macroeconomia, entre PIB e Desemprego e Mercado de Trabalho. Microeconomia permanece sem tópicos cadastrados. O identificador e o progresso da lição foram preservados.
