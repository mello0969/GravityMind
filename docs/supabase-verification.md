# Verificacao da migracao Supabase
Data: 26/09/2026.

## Estado
Migracao do banco concluida e verificada no aplicativo local, conectado ao Supabase online.
SUPABASE_SECRET_KEY configurada pelo usuario no .env.local e aceita pelo servidor.
Nenhuma chave privada foi obtida da conversa ou exibida em logs.
O site nao foi publicado; esta verificacao nao aprova uma configuracao de producao.

## Infraestrutura
- Projeto GRAVITYMIND, sayqfyeyiutustjudpzt, Sao Paulo, ativo.
- Criacao autorizada apos consulta e confirmacao de US$ 0/mes.
- 14 tabelas, 5 RPCs SECURITY INVOKER, RLS ativada, acesso anon/authenticated negado.
- Advisor de seguranca sem alertas.
- Advisor de desempenho: apenas indices ainda sem uso em banco novo, mantidos.
- Consulta REST real com Publishable key bloqueada com codigo 42501.
- Banco D1 remoto vazio; a conta do D1 local foi importada, preservando UUID, salt e hash da senha.
- Importados tambem tres registros de dificuldade adaptativa e um perfil de estudo.
- Novos backups D1 local e remoto em backups/, origem preservada.

## Codigo
- SDK @supabase/supabase-js fixado em 2.117.2.
- Cliente privilegiado restrito ao servidor.
- Autenticacao propria mantida, nao migrada para Supabase Auth.
- Login, sessoes, rate limit, sincronizacao, perfil, flashcards Plus e webhook adaptados.
- Notas cifradas antes do envio, com contexto de proprietario.
- Upload transacional e recompensas idempotentes com bloqueio por estudante.
- Timestamps PostgreSQL normalizados para ISO UTC para nao duplicar eventos no cache local.
- Scripts para verificacao, backup e importacao nao destrutiva do D1.

## Evidencias
- TypeScript: passou.
- Biome: passou.
- Vitest: 46 testes em 9 arquivos passaram, incluindo 7 novos de fronteira do servidor.
- Build: passou. Aviso preexistente de chunk cliente de aproximadamente 646 KB.
- Scanner do bundle cliente: 37 arquivos, sem segredos configurados nem marcadores privados.
- Scanner de fontes: sem padroes conhecidos de credenciais; nao existe historico Git local.
- npm install/audit: zero vulnerabilidades reportadas na instalacao.
- SQL real via MCP: transacoes, isolamento de notas, limite de sessoes, rate limit, XP e rollback.
  As contas ficticias desses testes foram revertidas por ROLLBACK.
- E2E desktop/mobile: 21 passaram, 2 pulados por viewport e 1 timeout inicial de hidratacao.
  O teste que excedeu 5 segundos passou na repeticao isolada, sem alteracao de codigo.
- Browser CLI abriu o site e as aulas; console sem erros na verificacao.
- Servidor local: http://127.0.0.1:4173/

## Verificacao real apos configurar a chave
- npm run db:check: 14 tabelas acessiveis pelo servidor.
- npm run db:verify: acesso publico negado nas 14 tabelas e 5 RPCs, isolamento de notas,
  rollback de upload e XP idempotente sob concorrencia aprovados. Fixtures removidas.
- npm run db:import:d1: importacao concluida com backups previos e sem modificar a origem.
- Cadastro pela interface: conta temporaria criada, sessao aberta e painel carregado.
- Login incorreto: mensagem generica, sem sessao criada.
- Login correto: autenticacao e sincronizacao concluidas.
- Nota criada na interface, salva localmente e enviada ao entrar novamente na conta.
- Segundo navegador sem cache previo: login recuperou titulo e conteudo corretos da nota.
- Banco consultado: titulo e conteudo da nota com prefixo enc:v2:, sem texto em claro.
- Conta importada: senha anterior aceita; a nota da outra conta nao apareceu.
- Cookie local: HttpOnly e SameSite=Strict; inacessivel a document.cookie.
  Secure=false apenas no HTTP local; flags de producao cobertas por teste unitario, nao por deploy.
- Logout: cookie removido, sessoes da fixture excluidas; reapresentar um cookie revogado
  retornou usuario nulo pela funcao de servidor.
- Conta temporaria e seus dados removidos apos o teste; a conta importada foi preservada.
- Novo build com a chave configurada passou; scanner de 37 arquivos cliente sem segredos.
- TypeScript, Biome e os 46 testes passaram novamente depois da importacao.
- Console do navegador de verificacao sem erros.
- Evidencia visual: output/playwright/supabase/nota-restaurada.png, apenas dados sinteticos.
- Backup final privado: backups/supabase-2026-09-26T16-10-24.298Z.json.

## Limites e pendencias fora da migracao
- A sincronizacao existente de notas, respostas e marcos roda ao fazer login/cadastro,
  nao continuamente a cada edicao. O autosave de notas durante a sessao e local.
- Exclusoes locais de notas ainda nao geram exclusoes remotas; uma nota ja sincronizada
  pode reaparecer no proximo login. Esta migracao preserva esse comportamento anterior.
- Backups JSON nao sao snapshots transacionais nem incluem um comando de restore automatico.
- Producao ainda exige secrets no host, HTTPS e Turnstile real; nao foi feito deploy.
- Tutor OpenAI, checkout Stripe e observabilidade continuam sem suas credenciais locais.
- A autenticacao continua propria, com contas em public.users; nao utiliza Supabase Auth.
- Nenhum recurso pago foi ativado. Nao foi alterado o projeto antigo da organizacao.
