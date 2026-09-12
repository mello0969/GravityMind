# Segurança do GRAVITYMIND

## Controles ativos

- Segredos ficam apenas em variáveis de servidor. Somente chaves explicitamente públicas usam o prefixo `VITE_`.
- Senhas usam PBKDF2-SHA-256 com salt aleatório e 600 mil iterações.
- Tokens de sessão são aleatórios, armazenados como hash no D1 e enviados em cookie `HttpOnly`, `SameSite=Strict` e `Secure` em produção.
- Login, cadastro, sincronização, tutor e checkout têm rate limit no servidor.
- Turnstile, honeypot e tempo mínimo de formulário reduzem automação abusiva em autenticação.
- Schemas Zod estritos bloqueiam campos extras e limitam tamanho, formato e quantidade dos inputs.
- Consultas D1 usam `prepare().bind()` e aplicam `user_id` obtido da sessão no servidor.
- Notas são criptografadas com AES-GCM antes de persistirem no banco.
- Uploads do quadro aceitam apenas PNG, JPEG e WebP, validam assinatura, tamanho, dimensões e total de pixels.
- Respostas privadas usam `Cache-Control: private, no-store`; o servidor aplica CSP, HSTS, anti-framing e políticas de permissão.
- Pagamento usa Stripe Checkout hospedado. Número do cartão e CVC não entram no aplicativo ou no D1.

## D1 e isolamento de registros

Cloudflare D1 não oferece RLS no estilo PostgreSQL/Supabase e não usa uma chave pública de banco no navegador. O binding `DB` existe apenas no Worker. O equivalente de isolamento neste projeto é uma camada server-side que exige sessão e adiciona o `user_id` da sessão a toda leitura e escrita. O cliente não escolhe esse identificador.

## Segredos e histórico Git

`.env`, `.env.local`, `.dev.vars` e suas variações estão ignorados. Rode `npm run security:secrets` antes de cada commit. Este diretório não contém metadados `.git`, então não há histórico local disponível para reescrever. Se uma credencial já tiver sido publicada em outro repositório, revogue-a primeiro e use `git filter-repo` no repositório que contém esse histórico.

## Verificação

```sh
npm run security:secrets
npm run security:dependencies
npm run typecheck
npm run test
npm run test:e2e
```
