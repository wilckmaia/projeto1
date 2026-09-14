# Indexação

A URL pública configurada em `src/lib/site.ts` é https://projeto1-beta-beryl.vercel.app. Não depende de APP_ORIGIN, que continua controlando a autenticação e os e-mails.

`src/app/sitemap.ts` usa a convenção MetadataRoute.Sitemap do Next.js e inclui somente `/sobre`. A página inicial é login/cadastro; mundos, tarefas e perfil são privados. Confirmação, recuperação, redefinição, APIs e conquistas por token não entram no sitemap.

`src/app/robots.ts` permite rastreamento com `User-Agent: *` e `Allow: /`, incluindo Googlebot, e informa o endereço do sitemap. APIs são excluídas do rastreamento. As páginas com noindex permanecem rastreáveis para o buscador ler essa diretiva. Robots não substitui controle de acesso.

`/sobre` tem conteúdo renderizado no servidor, canonical para o domínio público, título, descrição e robots index/follow. O login possui um link para essa apresentação. As regras de autenticação e o design existente foram preservados.

Na revisão inicial não havia robots.txt, sitemap ou X-Robots-Tag global. Os noindex de recuperação/redefinição e conquistas eram intencionais. Foram adicionados headers noindex às rotas de autenticação, perfil, APIs e conquistas; o layout de mundos aplica noindex aos mundos e tarefas. Não há noindex global no layout raiz.

O arquivo `public/google1e5978080cba4aa8 (2).html` e o código de verificação nos metadados foram preservados, incluindo o nome original do arquivo.

## Validação

Execute `npm run lint`, `npx tsc --noEmit`, `npm run build` e `node scripts/check-seo.mjs`. O último comando sobe um servidor local de produção temporário e verifica respostas HTTP sem consultar o banco.

Depois do deploy, confira HTTP 200 em:

- https://projeto1-beta-beryl.vercel.app/sitemap.xml — deve conter somente a URL absoluta de `/sobre`.
- https://projeto1-beta-beryl.vercel.app/robots.txt — deve permitir `/` e apontar para esse sitemap.
- https://projeto1-beta-beryl.vercel.app/sobre — canonical correto e index/follow, sem X-Robots-Tag noindex.

Envie `sitemap.xml` em Sitemaps no Google Search Console e use Inspeção de URL / Testar URL publicada para `/sobre`. As configurações de proteção de deployment da Vercel também precisam permitir acesso público. A verificação local não comprova os headers de produção nem garante indexação pelo Google.

Referências: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap e https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots.
