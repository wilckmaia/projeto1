# Relatório da reestruturação educacional

> Atualização posterior: os três mundos originais foram restaurados com suas
> atividades, correção, progresso e conquistas. A jornada atual tem sete mundos.
> Executivo, Legislativo, Judiciário e Economia são desbloqueados juntos após a
> conclusão dos três iniciais. O restante deste relatório registra a etapa anterior;
> consulte o README para o comportamento atual.

Implementação realizada no projeto existente, em 17/10/2026.

## Resultado

- Quatro mundos vazios: Executivo (amarelo), Legislativo (azul), Judiciário (vermelho) e Economia (verde).
- Executivo inicialmente disponível; os demais dependem da conclusão integral dos anteriores.
- Mundos vazios permanecem com 0% e nunca desbloqueiam o próximo nem permitem emissão de certificados.
- Cards com identidade própria, ícones, progresso, cadeados e mensagens de desbloqueio.
- Trilhas com rotas próprias e lições vinculadas ao mundo correto, com validação de acesso no servidor.
- Conclusão explícita de lições, persistida por usuário, sem questionário obrigatório.
- Conteúdo original dos três mundos anteriores preservado integralmente na biblioteca de consulta voluntária.
- Apresentação reutilizável: conceito, explicação, desenvolvimento e conclusão. Perguntas antigas ficam recolhidas e opcionais.
- Botão de tema com sol/lua, maior contraste, destaque, transição e preferência persistente.
- Certificados por mundo, emissão explícita e idempotente, UUID, nome, mundo, plataforma e datas registrados.
- Certificados privados acessíveis novamente pelo perfil, com visualização, download real de PDF e impressão.
- PDF em A4 horizontal, com imagem de alta resolução para preservar nomes Unicode; o texto acessível permanece na página HTML.
- Compartilhamentos antigos continuam funcionando; seu histórico é separado do progresso dos novos mundos.

## Preservação e banco de dados

Os novos IDs são `executivo`, `legislativo`, `judiciario` e `economia`.
IDs antigos não foram reutilizados. Registros existentes de usuários, respostas,
progresso e compartilhamentos não foram excluídos.

A migração `20261017000000_education_certificates` apenas cria a tabela
`Certificate`, com vínculo ao usuário e unicidade por usuário/mundo.
O estado do banco configurado foi consultado antes: somente essa migração estava
pendente. Ela foi aplicada com sucesso após a validação em PostgreSQL isolado.

A emissão preserva uma cópia dos dados da conclusão; mudanças posteriores no nome
do usuário ou no catálogo não reescrevem os certificados emitidos. O acesso de outro
usuário a um certificado retorna 404. A emissão e a conclusão usam transações e
bloqueio por usuário para evitar duplicações em solicitações concorrentes.

## Funcionalidades retiradas do fluxo obrigatório

- Questionários, correção e respostas como condição para concluir uma lição.
- Botões de treinamento obrigatório e tarefas antigas na página inicial.
- Dependência do progresso antigo para liberar os novos mundos.

Nenhum conteúdo do acervo anterior foi apagado nesta reestruturação. A remoção dos
mundos dos quatro políticos, solicitada anteriormente, permanece em vigor.

## Arquivos criados

### Estrutura e persistência

- `src/lib/education.ts`
- `src/lib/certificates.ts`
- `src/lib/legacy-data.ts`
- `src/lib/legacy-achievements.ts`
- `prisma/migrations/20261017000000_education_certificates/migration.sql`

### Páginas e API

- `src/app/[world]/trilhas/[track]/page.tsx`
- `src/app/biblioteca/page.tsx`
- `src/app/biblioteca/[lesson]/page.tsx`
- `src/app/certificados/[id]/page.tsx`
- `src/app/api/certificates/route.ts`

### Componentes reutilizáveis

- `src/components/WorldCard.tsx`
- `src/components/WorldIcon.tsx`
- `src/components/LessonContent.tsx`
- `src/components/CertificateButton.tsx`
- `src/components/DownloadCertificate.tsx`
- `src/components/PrintCertificate.tsx`

### Testes e documentação

- `scripts/education-test-harness.mjs`
- `scripts/test-education-unit.mjs`
- `scripts/test-education-routes.mjs`
- `scripts/test-education-database.mjs`
- `docs/education-restructure.md`

## Arquivos modificados

- `README.md`: funcionamento, expansão, migração e execução.
- `package.json` e `package-lock.json`: `pdf-lib`, geração do catálogo no build e testes.
- `next.config.ts`: páginas privadas novas com noindex.
- `prisma/schema.prisma`: modelo Certificate e relação com User.
- `src/lib/data.ts`: catálogo ativo derivado de mundos e trilhas.
- `src/lib/catalog.ts`: metadados públicos gerados, sem gabaritos.
- `src/lib/progress.ts`: sequência, conclusão explícita e proteção contra mundos vazios.
- `src/lib/storage.ts`: persistência sem treinamento, separação do histórico.
- `src/lib/achievements.ts`: quatro certificados atuais.
- `src/app/page.tsx`: mapa dos mundos, estados vazios e navegação.
- `src/app/[world]/page.tsx`: trilhas, lições, bloqueio e certificado.
- `src/app/[world]/[task]/page.tsx`: lição, acesso e navegação.
- `src/app/perfil/page.tsx`: certificados atuais e conquistas históricas.
- `src/app/api/progress/route.ts`: contrato de conclusão explícita.
- `src/app/api/achievements/share/route.ts`: compartilhamentos históricos preservados.
- `src/app/conquistas/[token]/page.tsx`: consulta das conquistas históricas.
- `src/app/themes.css`: destaque do tema, identidades, leitura, certificado e celular.
- `src/components/TaskExperience.tsx`: conclusão simples, sem questionário obrigatório.
- `src/components/ThemeToggle.tsx`: ícones e identificação acessível.
- `scripts/generate-catalog.mjs`: gera metadados e valida IDs únicos e estáveis.
- `scripts/security-unit.mjs`: catálogo e regras atuais.
- `scripts/check-achievements.mjs`: mundos vazios, certificados, isolamento e legado.
- `scripts/check-theme-tokens.mjs`: paletas globais preservadas.
- `scripts/check-themes.mjs`: mundos atuais, celular, biblioteca e PDF.
- `scripts/run-security-tests.mjs`: caminho temporário compatível com Windows, novos testes e opção `--browser-only`.
- `scripts/test-auth-flows.mjs`: asserção determinística do atraso e contador compartilhado.
- `scripts/test-auth-browser.mjs`: expectativa alinhada ao link de recuperação já oculto no projeto.

`scripts/check-world.mjs` já havia sido removido na etapa anterior, por testar
exclusivamente os mundos dos políticos. Não houve nova exclusão de arquivo de conteúdo.
`next-env.d.ts` é regenerado automaticamente pelo Next conforme desenvolvimento/build.

## Testes e verificações

| Verificação | Resultado |
| --- | --- |
| Lint | Aprovado, sem avisos |
| TypeScript / geração de tipos | Aprovado |
| Prisma validate | Aprovado |
| Compilação de produção Next.js | Aprovada |
| Testes unitários de segurança | Aprovados |
| Quatro mundos vazios e bloqueios iniciais | Aprovados |
| Desbloqueio progressivo com lições de teste | Aprovado |
| Rotas reais de trilha/lição, navegação e bloqueio | Aprovadas com módulos de teste |
| Persistência PostgreSQL e isolamento entre contas | Aprovados |
| Conclusão concorrente e idempotente | Aprovada |
| Emissão concorrente e única de certificados | Aprovada |
| Imutabilidade dos dados da emissão | Aprovada |
| Mundos vazios/incompletos sem certificados | Aprovados por API e regras |
| Certificado inacessível por outro usuário | Aprovado por HTTP |
| Progresso e links públicos históricos | Preservados e testados |
| Autenticação, recuperação, expiração e revogação | Aprovadas em HTTP e Chrome |
| Preferência de tema após recarga e reabertura | Aprovada no Chrome |
| Interface desktop e celular a 390px | Aprovada, sem overflow horizontal |
| Contraste nos temas claro e escuro | Aprovado |
| Biblioteca com perguntas inicialmente recolhidas | Aprovada |
| Download real do PDF, acentos e caracteres não latinos | Aprovado no Chrome |
| PDF com uma página, título correto e imagem revisada | Aprovado |
| Sitemap, SEO público, noindex e verificação Google | Aprovados |
| Upgrade de migrações e importação SQLite | Aprovados em banco isolado |
| Comparação do acervo com a versão original | Idêntico nos três mundos preservados |

Os mundos reais continuam vazios, como solicitado. As lições usadas para testar
progresso e certificados são fixtures locais aos módulos de teste e ao banco temporário;
nenhuma lição fictícia foi publicada no catálogo ou inserida no banco dos usuários.

As capturas e o PDF de teste ficam em `.data/theme-check`, ignorado pelo Git.
O servidor de desenvolvimento foi restaurado após liberar a DLL do Prisma.

## Problemas encontrados e pendências

- A DLL do Prisma estava em uso pelo Next dev; o servidor foi reiniciado e a geração passou.
- O caminho do PostgreSQL temporário no Windows foi corrigido para não conter espaços.
- Uma comparação antiga de tempos de login era instável; o teste agora verifica o atraso mínimo e o contador, sem mudar a autenticação.
- O teste antigo de navegador esperava um link de recuperação que já estava intencionalmente oculto. A expectativa foi corrigida; a rota direta foi testada normalmente.
- `npm audit --omit=dev` ainda aponta alertas nas dependências preexistentes `next` (crítico), `sharp` e `source-map-js` (altos). Não foram feitas atualizações de framework fora do escopo. `pdf-lib` não aparece entre os pacotes sinalizados.
- O cadastro de conteúdo real permanece para uma etapa futura, conforme solicitado. Não há trilhas fictícias.

## Executar e expandir

Neste ambiente, a migração já foi aplicada. Para desenvolver:

```bash
npm run dev
```

Em outra instalação com banco próprio:

```bash
npm ci
npm run db:migrate
npm run build
npm run start
```

Para conteúdo novo, edite `src/lib/education.ts`, preserve os IDs existentes e execute
`npm run catalog:generate`. O README detalha o formato de trilhas e lições.

Para validar novamente:

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:integration
npm run test:integration -- --browser
```

Para repetir apenas o Chrome após um build aprovado, com novo banco temporário:

```bash
node scripts/run-security-tests.mjs --browser-only
```

Os testes de integração exigem PostgreSQL 18 e os visuais exigem Chrome instalado.
