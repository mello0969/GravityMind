# Arquitetura do GRAVITYMIND

Revisão estrutural de 15/11/2026, complementando a separação iniciada em outubro.
Mantida a stack React 19, TanStack Start,
TypeScript, Tailwind v4, Cloudflare Workers e Supabase/PostgreSQL.

## Responsabilidades

| Camada | Local | Responsabilidade |
| --- | --- | --- |
| Rotas | `src/routes/` | URLs, validação de parâmetros, metadados e composição da página. |
| Telas por funcionalidade | `src/features/` | Apresentação e interação de cada área. |
| Controles da interface | Hooks em `src/features/` | Estado, ciclo de vida, envio de formulários e ações de sessão. |
| Componentes compartilhados | `src/components/` | Quadro, questões, calculadora, navegação e controles reutilizáveis. |
| Regras de questões | `src/lib/questions/engine.ts`, `calculation.ts`, `adaptive.ts`, `fixed.ts`, `session.ts` | Seleção, correção e decisões pedagógicas sem React, navegador ou persistência. |
| Serviço de prática | `src/lib/questions/practice-service.ts`, `engine-calculo.ts` | Leitura e gravação do histórico da conta e chamada das regras. |
| Outros domínios | `src/lib/profile/`, `rewards/`, `calculator/`, `flashcards/` | Cálculos, decisões e serviços específicos de cada recurso. |
| Serviços do servidor | `src/lib/**/server*.ts`, `*.server.ts` | Autenticação, validação, limites e integração com provedores. |
| Persistência | `src/lib/db/` e módulos de armazenamento | Acesso ao banco ou armazenamento local, conforme o recurso. |

Não há migração para Express nem uma simulação de MVC: o projeto usa rotas de arquivo
do TanStack Start e separação por funcionalidade. Conteúdo estático pode continuar
composto na rota; regras de negócio e persistência não devem ficar nela.

As telas não importam definições de `src/routes/`. Parâmetros já validados chegam
como propriedades. Isso evita dependência circular entre roteamento e interface.

## Exemplos Para Auditoria

### Prática e questões de cálculo

A revisão anterior deixou as rotas pequenas, mas o componente de questões ainda
controlava a sessão, gravava respostas e escolhia a próxima questão. Além disso,
`questions/engine.ts` combinava decisões pedagógicas com `localStorage`. A revisão
atual separa essas responsabilidades:

1. `src/routes/questoes.tsx` define URL e parâmetros; `practice-page.tsx` compõe a página.
2. `question-practice.tsx` e `calculation-card.tsx` apresentam enunciados, alternativas,
   dicas, correção e controles acessíveis.
3. `use-question-practice.ts` e `use-calculation-question.ts`, em `src/features/practice/`,
   controlam etapas, tentativas, tempo e ações da sessão.
4. `questions/engine.ts` seleciona questões a partir do histórico recebido;
   `calculation.ts` verifica respostas numéricas; `adaptive.ts` reconstitui o nível.
5. `practice-service.ts` lê e valida o histórico local da conta antes de chamar as
   regras. `engine-calculo.ts` registra respostas numéricas e o histórico unificado.

Os dois caminhos de adaptação usam `proximoNivel`, com os mesmos critérios e a
mesma janela de respostas. As regras podem ser executadas em Node sem simular
`window`. As chaves de armazenamento, o limite de histórico e os critérios de
correção existentes foram preservados; não há migração ou exclusão de dados.

Para localizar uma alteração:

- Critérios de dificuldade e seleção: `engine.ts` e `adaptive.ts`.
- Tolerância da resposta numérica: `calculation.ts`.
- Chaves, validação e limites do histórico: `practice-service.ts` e `engine-calculo.ts`.
- Etapas, tentativas e ações da sessão: hooks em `src/features/practice/`.
- Texto, controles e apresentação: componentes de questões em `src/components/`.

### Tutor e anotações

`tutor-workspace.tsx` apresenta a biblioteca, os filtros e os diálogos do site.
`use-tutor-workspace.ts` coordena a criação, carregamento, alteração de título/pasta,
exclusão e cache das conversas. O controle de versão evita sobrescrever uma
conversa que foi alterada em outra sessão.

`gravity-chat.tsx` apresenta mensagens, campo de pergunta e ações. O hook
`use-gravity-chat.ts` controla envio, tentativa de salvar novamente, estado de erro e
vínculo da resposta com as anotações. A chamada ao provedor e a autorização
permanecem nos módulos de servidor existentes de `src/lib/gravity/`.

`notes-panel.tsx` apresenta lista, editor e histórico. Os hooks `useNotes`,
`useNoteEditor` e `useNoteHistory`, em `src/features/notes/use-notes.ts`, coordenam
CRUD, salvamento automático e restauração. A persistência continua nos serviços
existentes de notas; não foi copiada para os componentes visuais.

Esses hooks são controles da aplicação, não uma nova camada de banco. Autorização,
validação confiável e criptografia continuam no servidor. As telas não são usadas
como mecanismo de proteção dos registros.

### Flash Cards

1. `src/routes/flashcards.tsx` registra a URL e a página.
2. `src/features/flashcards/flashcards-page.tsx` apresenta deck, controles e resultado.
3. `use-flashcard-session.ts` controla revelação, navegação, temporizador e carregamento.
4. `src/lib/flashcards/session.ts` calcula resumo e limites de navegação.
5. `session-store.ts` grava somente o resumo, no espaço da conta atual, limitado a 30 sessões.
6. O deck restrito continua sendo autorizado e carregado pelo servidor, não pelo botão.

O resultado aparece ao encerrar a sessão; o último cartão avaliado entra no resumo.
Encerramentos repetidos não duplicam a gravação, e sair da tela cancela o temporizador.

### Login e Cadastro

As rotas apontam para suas telas em `src/features/auth/`. O hook `use-auth-form.ts`
compartilha validação do formulário, prova humana, estado de envio, retorno de erros e
sincronização antes da navegação. Ele não consulta o banco nem calcula hashes.

O processamento confiável continua em `src/lib/auth/server.ts`,
`session.server.ts` e `password.server.ts`: validação no servidor, rate limiting,
verificação do Turnstile, hash e sessão protegida. Validação no navegador é apoio de
interface, não autorização. O servidor não confia no usuário informado pelo cliente.

### Pagamentos

`src/routes/api.stripe-webhook.ts` apenas entrega a requisição a
`src/lib/billing/webhook.server.ts`. O serviço verifica tamanho e assinatura,
valida o evento e decide a atualização da assinatura. `stripe-signature.ts`
contém a verificação criptográfica sem acesso ao banco. `subscriptions.server.ts`
concentra as consultas e escritas tipadas de assinatura, com campos explicitamente
selecionados. Eventos sem assinatura ou com estrutura inválida não gravam dados.

Essa separação não significa que pagamentos reais foram habilitados ou homologados.

### Preferências e Progresso

A tela de configurações apresenta os controles; `src/lib/settings/data-export.ts`
seleciona os dados exportáveis e realiza o download. Dados de outras contas e de
outros aplicativos não entram na exportação.

O hook `src/features/progress/use-dashboard.ts` coordena atualização do painel e
eventos de progresso. As fórmulas de desempenho e recompensas continuam nos motores
de `src/lib/profile/` e `src/lib/rewards/`.

O documento HTML, provedores e navegação global ficam em `src/components/app-shell.tsx`;
os estados de erro/404, em `route-error.tsx`. A rota raiz continua responsável pelos
metadados e pelo contexto do roteador, não pelo controle de sessão de uma página.

## Verificação e Manutenção

- `tests/architecture.test.ts`: mantém as restrições nas rotas e nas telas; impede
  acesso direto a persistência/provedores nos cinco componentes refatorados; percorre
  imports e reexports locais, inclusive aliases `@/`, das regras de questões para
  detectar dependências de React, armazenamento e serviços.
- `tests/question-rules.test.ts`: executa decisões de nível, prioridade de revisão e
  correção numérica sem navegador, com entradas explícitas.
- `tests/practice-controller.test.tsx`: verifica o limite de dicas, as etapas de erro
  e correção, a atualização do histórico e o encerramento da resposta numérica.
- `tests/auth-form.test.tsx`: verifica prova humana, termos, erros, sincronização e
  bloqueio de envio duplicado, sem criar contas reais.
- `tests/flashcard-session.test.tsx`: verifica resumo, navegação, avanço, cancelamento,
  encerramento e isolamento do armazenamento.
- `tests/data-export.test.ts`: verifica limites entre conta atual, visitante e aparelho.
- `tests/billing-webhook.test.ts`: verifica assinatura, validade temporal, campos
  permitidos, rejeição de eventos e erro seguro de persistência.
- Testes preexistentes dos motores, segurança, isolamento de contas e Tutor foram mantidos.

A suíte de arquitetura não substitui revisão humana. Testes locais com dependências
simuladas não comprovam disponibilidade dos serviços externos nem testes de produção.
O histórico Git deve registrar alterações reais; esta refatoração não reescreve datas
ou simula um desenvolvimento anterior.

### Resultado local de 15/11/2026

| Verificação | Resultado |
| --- | --- |
| `npm run test:coverage` | 177 testes aprovados; 2 ignorados. Cobertura de linhas de 92,74% no recorte configurado, não na aplicação inteira. |
| `npm run typecheck` | Aprovado. |
| `npm run lint` | Aprovado. |
| `npm run build` | Aprovado, com avisos de tamanho de chunk e de dependências. |
| `npm run test:mutation` | 86,82% no recorte configurado: decisão de nível, regras numéricas e tempo mínimo/máximo do formulário. Não representa o código inteiro. |
| `npm run security:secrets` | Nenhum padrão conhecido encontrado no código examinado; não examina o histórico Git. |
| `npm run security:client` | Nenhum segredo configurado ou marcador de deck protegido no bundle examinado. |
| Playwright: `study-flow.spec.ts`, `study-hub.spec.ts` e `plan-access.spec.ts` | 26 testes aprovados; 2 ignorados, em desktop e mobile. |

Para repetir os testes de navegador deste recorte:

```sh
npx playwright install chromium --only-shell
npx playwright test tests/e2e/study-flow.spec.ts tests/e2e/study-hub.spec.ts tests/e2e/plan-access.spec.ts --workers=2
```

Os cenários cobrem navegação, dicas, filtros, encerramento de Flash Cards,
preferências, foco local, calculadora, quadro e verificações de acessibilidade e
responsividade, além da apresentação das restrições de plano para visitante.
Não incluem pagamento real, criação de contas ou conversa real com
o provedor de IA em produção. Os relatórios são gerados em `playwright-report/` e
`test-results/`, sem versionar esses artefatos.

## Acesso da Avaliação

Em 21/10/2026, após autorização expressa de Murilo, o quadro TCC foi configurado como
público para leitura. Somente membros continuam podendo editar. O link é
https://trello.com/b/BZjw4a2F/tcc. Não publicar credenciais ou dados identificáveis de
participantes nos cartões ou anexos.

O envio do commit ao GitHub permite auditar esta revisão, mas não publica a aplicação.
A versão online depende de uma nova publicação; a reorganização local não altera a
versão publicada automaticamente.

Em 15/11/2026, a revisão de código `41d08c0` foi enviada ao GitHub e publicada no
Worker existente, versão `c68aab22-18dd-4146-9849-3e1b74e7b62f`, em
https://gravitymind.estudefisica.workers.dev. Na conferência após a publicação,
Home, Prática, Cálculo e Tutor responderam HTTP 200 e não emitiram erros de
JavaScript. Foi uma navegação de visitante: não comprova uma nova execução de
login, gravação autenticada ou resposta real do provedor de IA. As cinco
configurações secretas existentes e a origem da aplicação foram preservadas.
