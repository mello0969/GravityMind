# Banco de dados do GRAVITYMIND

## Supabase
Projeto criado no plano gratuito em 26/09/2026:
- Nome: GRAVITYMIND
- Organizacao: mello0969's Org
- Referencia: sayqfyeyiutustjudpzt
- Regiao: sa-east-1 (Sao Paulo)
- Custo de criacao confirmado pela API: US$ 0/mes. Nenhum recurso pago ativado.
- Painel: https://supabase.com/dashboard/project/sayqfyeyiutustjudpzt

O projeto antigo da organizacao e os bancos D1 foram preservados.
O Free tem limites de armazenamento e uso e pode pausar por inatividade.
A gratuidade do banco nao inclui chamadas a OpenAI nem constitui garantia de cota ilimitada.
Consulte os limites atuais em https://supabase.com/pricing antes de publicar para uma turma.

## Configuracao
No .env.local, apenas no servidor:
```dotenv
SUPABASE_URL=https://sayqfyeyiutustjudpzt.supabase.co
SUPABASE_SECRET_KEY=
SUPABASE_PUBLISHABLE_KEY=
DATA_ENCRYPTION_KEY=
APP_ORIGIN=http://127.0.0.1:4173
```

Preencha a Secret key em Settings > API Keys > Secret keys. Nunca use prefixo VITE_.
A Publishable key serve para o teste de acesso anonimo; o site nao acessa o banco diretamente.
Preserve a DATA_ENCRYPTION_KEY existente para continuar lendo notas cifradas.
O script de preparacao nao cria nem imprime chaves de provedores.

O ambiente de desenvolvimento e o deploy usam o projeto indicado em SUPABASE_URL.
Portanto, quando conectado, o desenvolvimento grava no banco online, nao no D1 local.
Criar o banco nao publica o site. Em producao configure as mesmas variaveis como secrets do servidor,
origem HTTPS e Turnstile real. A Secret key nunca deve aparecer no frontend, screenshots ou logs.

## Autenticacao e RLS
Esta migracao troca a persistencia, preservando a autenticacao propria do GRAVITYMIND.
Nao usa Supabase Auth: as contas aparecem em Table Editor > users, nao em Authentication > Users.
Senhas continuam como PBKDF2 com salt; sessoes como hashes de tokens e cookies HttpOnly.
Nao foi necessario alterar as senhas ou os UUIDs, que tambem identificam o cache local de cada conta.

As 14 tabelas tem RLS ativada e privilegios de anon/authenticated revogados, com politica deny-all.
Todas as funcoes RPC sao SECURITY INVOKER, sem EXECUTE para PUBLIC/anon/authenticated.
O servidor usa a Secret key com service_role, que ignora RLS. Por isso a autorizacao por estudante
e feita obrigatoriamente no servidor: usuario obtido da sessao, filtros por user_id e schemas estritos.
Nao e uma politica auth.uid() por estudante: nao ha JWT Supabase Auth neste fluxo.
Nunca permita uma consulta generica recebida do cliente, nem exponha esse cliente privilegiado no browser.

Notas usam AES-256-GCM com contexto de usuario/nota/campo. Uploads e recompensas sao transacionais;
eventos repetidos nao duplicam XP. Registros de autoestudo nao constituem prova antifraude.

## Estrutura
Schema PostgreSQL e funcoes: supabase/migrations/20260926101033_gravitymind_initial.sql.
Tipos TypeScript gerados do banco: src/lib/db/database.types.ts.
O arquivo docs/database-schema.sql e um retrato LEGADO do D1, nao deve ser executado no Supabase.

| Grupo | Tabelas |
| --- | --- |
| Contas e seguranca | users, sessoes, rate_limits |
| Pratica | respostas_questoes, respostas_calculo, dificuldade_adaptativa, quiz_resultados |
| Notas e aulas | notas, notas_historico, progresso_licoes |
| Recompensas | perfis_estudo, atividade_estudo, eventos_recompensa |
| Plus | assinaturas |

## Comandos
Na pasta com package.json:
```sh
npm run db:check
npm run db:verify
npm run db:backup
npm run db:import:d1
npm run security:config
npm run dev -- --host 127.0.0.1 --port 4173
```

db:check confere as 14 tabelas com a chave do servidor.
db:verify cria duas contas tecnicas temporarias, testa bloqueio publico e RPCs, colisao de notas,
rollback de upload e eventos simultaneos. Remove somente essas contas ao terminar.
db:import:d1 cria um backup D1 local antes da leitura e outro do destino antes de importar.
Use -- --remote para importar o D1 remoto. A importacao preserva IDs e hashes de senha, nao sobrescreve
conflitos e nao copia sessoes nem rate limits. Depois da troca, entre novamente no site.
Se houver interrupcao, o comando pode ser repetido; registros existentes sao preservados.

Backups Supabase sao JSON em backups/, ignorados pelo Git. Nao sao snapshots transacionais:
rode com as gravacoes do site suspensas para consistencia entre tabelas.
Nao publique backups; podem conter dados privados e hashes de senha.
Guarde a chave de criptografia separadamente. Antes de restaurar, valide em um projeto de teste.
Este projeto nao tem um comando de restore automatico; o JSON exige importacao controlada e validada.

## D1 preservado
D1 remoto legado: gravitymind-db, ID 522f20f3-f293-4f4f-8215-d807d84e7ed1.
A verificacao anterior a migracao encontrou zero contas no D1 remoto e uma conta no D1 local.
Nenhum banco D1 foi apagado. Backups SQL privados foram criados em 26/09/2026.
Nao apague .wrangler/state nem troque o preview_database_id legado em wrangler.jsonc.

Comandos de manutencao antigos agora tem prefixo db:d1:
```sh
npm run db:d1:check
npm run db:d1:check:remote
npm run db:d1:backup
npm run db:d1:backup:remote
```

## Verificacao
- Testes SQL transacionais em supabase/tests/server-boundary.sql: notas, sessoes, rate limit e XP.
- Testes de servidor em tests/supabase-server.test.ts: hashes, cookies, identificacao do proprietario,
  criptografia, limites e normalizacao de timestamps PostgreSQL para as chaves de eventos locais.
- O advisor de seguranca do Supabase nao apontou problemas no schema inicial.
- Indices ainda sem uso sao esperados num banco novo; nao removidos sem analisar o uso real.
  Referencia: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

Conexao e importacao verificadas em 26/09/2026: uma conta do D1 local, tres dificuldades
adaptativas e um perfil foram preservados. Cadastro, login, logout e recuperacao de uma nota
em outro navegador passaram contra o Supabase real. A conta temporaria de teste foi removida.
Consulte docs/supabase-verification.md para as evidencias e os limites da verificacao.

A sincronizacao de notas, respostas e marcos continua ocorrendo ao entrar na conta.
O autosave durante a sessao e local, sem envio continuo. Exclusoes locais de notas ainda nao
sao propagadas ao banco e podem reaparecer no proximo login. Isso nao foi alterado pela migracao.
O site ainda precisa de configuracao de producao e deploy para acesso publico.
