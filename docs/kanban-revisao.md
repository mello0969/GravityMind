# Revisão dos cartões do TCC — 15/11/2026

**Estado: alterações preparadas; ainda não aplicadas ao Trello.** O quadro está público para leitura. O conector retorna erro antes de identificar a conta; isso não comprova falta de permissão do usuário. A edição visual também ficou indisponível nesta sessão.

Quadro: https://trello.com/b/BZjw4a2F/tcc

Este documento especifica a substituição das descrições vagas e a revisão dos checklists nativos dos 25 cartões técnicos e de organização. Os 14 cartões acadêmicos já concluídos e confirmados pelo autor não serão reabertos. O histórico de atividade do Trello deve ser preservado; não é necessário acumular descrições antigas contraditórias no texto atual.

## Regras de aplicação

- Manter o responsável Murilo Mello e o limite de duas atividades em Fazendo.
- Usar as etiquetas já existentes, sem duplicá-las.
- Substituir descrições, títulos e critérios dos cartões identificados pelos links abaixo; não duplicar cartões existentes.
- Preservar as datas existentes de planejamento e as conclusões anteriores. Elas não serão tratadas como datas comprovadas de execução. Os novos prazos dependem de confirmação, pois a sprint de 20/10 a 03/11 terminou.
- Marcar apenas os critérios com evidência. Revisão/Teste não significa aprovação do professor.
- Não publicar contas, senhas, chaves ou respostas identificáveis de participantes.
- Conferir cada alteração pelo conector antes de declarar que foi aplicada.

## Cartões existentes

### [DOC-15] Consolidar registros reais de desenvolvimento

Cartão: https://trello.com/c/UAnp7y55/8-doc-15-consolidar-caderno-de-campo-do-projeto

Lista atual: Backlog. Lista proposta: **Backlog**. Etiqueta: **Documentação**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Reunir as decisões, dificuldades, testes e revisões já documentados no Git e nos arquivos do TCC em um diário de bordo.

**Por que:** Permitir acompanhar o desenvolvimento por evidências, sem reconstruir datas de execução por suposição.

**Situação proposta:** Backlog. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [ ] Relacionar cada etapa a um commit, arquivo ou registro datado existente.
- [ ] Distinguir datas de execução conhecidas de datas de registro no Trello.
- [ ] Descrever a revisão de responsabilidades de outubro e o complemento de novembro.
- [ ] Disponibilizar o diário e conferir a leitura pela banca.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/commits/main

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [PESQ-04] Documentar avaliação de navegação e conforto

Cartão: https://trello.com/c/UPtEb4kH/26-pesq-04-documentar-pesquisa-de-conforto-e-usabilidade

Lista atual: Backlog. Lista proposta: **Backlog**. Etiqueta: **Pesquisa**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Reunir no acervo o instrumento de avaliação da experiência, os registros originais disponíveis e a análise documentada da navegação.

**Por que:** Vincular os ajustes de interface às evidências existentes e identificar o que ainda precisa ser observado com usuários.

**Situação proposta:** Backlog. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [ ] Localizar e anexar instrumento e respostas originais disponíveis, sem expor dados pessoais.
- [ ] Separar público-alvo, respostas recebidas e tarefas de uso realmente observadas.
- [ ] Relacionar dificuldades documentadas às telas e ajustes correspondentes.
- [ ] Registrar as limitações da coleta e revisar o texto com o orientador.

**Evidências e limites:**

- O autor informou que não dispõe de links próprios desta pesquisa. Não marcar como concluída apenas pela existência do formulário geral.

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [PESQ-05] Documentar fundamentos de foco e recompensas

Cartão: https://trello.com/c/Wy43CfGG/27-pesq-05-documentar-pesquisa-de-foco-e-recompensas

Lista atual: Backlog. Lista proposta: **Backlog**. Etiqueta: **Pesquisa**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Relacionar as fontes usadas no TCC ao modo foco, às metas de sessão, ao histórico e às recompensas implementadas.

**Por que:** Explicar as escolhas pedagógicas sem atribuir à plataforma um ganho de aprendizagem que não foi medido.

**Situação proposta:** Backlog. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [ ] Localizar referências efetivamente consultadas para foco e recompensas.
- [ ] Descrever quais comportamentos do produto cada fonte fundamenta.
- [ ] Separar referencial teórico de resultados obtidos com usuários.
- [ ] Anexar o texto revisado e validar com o orientador.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/tree/main/src/lib/rewards

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [DOC-14] Documentar camadas, fluxos e esquema real

Cartão: https://trello.com/c/kfHIBOaf/38-doc-14-documentar-arquitetura-e-modelo-de-dados

Lista atual: Backlog. Lista proposta: **Revisão/Teste**. Etiqueta: **Documentação**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Atualizar a arquitetura para mostrar rota, apresentação, controle de sessão, regras, persistência e servidor; manter o modelo de dados alinhado às migrations do Supabase.

**Por que:** Responder à crítica estrutural com caminhos concretos de código e permitir auditar onde cada responsabilidade está implementada.

**Situação proposta:** Revisão/Teste. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Descrever o fluxo da Prática até as regras sem dependência de navegador.
- [x] Descrever os controles de conversas e notas e os serviços de servidor existentes.
- [x] Vincular o esquema documentado às migrations atuais, distinguindo o D1 legado.
- [ ] Revisar os documentos com o orientador e registrar sua avaliação.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/blob/main/docs/arquitetura.md
- https://github.com/mello0969/GravityMind/blob/main/docs/banco-de-dados.md
- https://github.com/mello0969/GravityMind/tree/main/supabase/migrations

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [GEST-01] Revisar pendências e registrar retrospectiva

Cartão: https://trello.com/c/JqVB7fds/39-gest-01-revisar-sprint-e-registrar-retrospectiva

Lista atual: Backlog. Lista proposta: **Para Fazer**. Etiqueta: **Documentação**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Encerrar a leitura da sprint de 20/10 a 03/11, registrar o feedback do professor e priorizar a correção estrutural e a validação final.

**Por que:** Evitar cartões sem próximo passo e manter no máximo duas atividades em execução para o único integrante.

**Situação proposta:** Para Fazer. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Consultar o estado público do quadro e localizar cartões com descrições antigas.
- [x] Preparar descrições específicas, critérios observáveis e links de evidência.
- [ ] Aplicar as revisões no Trello e conferir nomes, etiquetas e checklists nativos.
- [ ] Registrar pendências da sprint e combinar os novos prazos reais com o orientador.

**Evidências e limites:**

- https://trello.com/b/BZjw4a2F/tcc
- https://github.com/mello0969/GravityMind/blob/main/docs/kanban-revisao.md

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [INFRA-02] Publicar revisão estrutural e scripts do banco

Cartão: https://trello.com/c/mamGBwTT/33-infra-02-publicar-c%C3%B3digo-e-migrations-atuais-no-github

Lista atual: Para Fazer. Lista proposta: **Revisão/Teste**. Etiqueta: **Documentação**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Versionar a refatoração, os testes de limites entre camadas e a documentação no repositório já existente; preservar as migrations atuais.

**Por que:** Permitir que o professor compare a implementação anterior com uma correção estrutural verificável.

**Situação proposta:** Revisão/Teste. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Separar código e documentação de arquivos gerados e credenciais.
- [x] Executar scanners da fonte e do bundle e revisar os arquivos da alteração.
- [ ] Conferir o commit final no GitHub e o hash publicado em produção.
- [ ] Repetir os passos de reprodução a partir do README sem divulgar segredos.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind
- https://github.com/mello0969/GravityMind/tree/main/supabase/migrations

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [QA-04] Registrar regressão após separar responsabilidades

Cartão: https://trello.com/c/mMJxqiKz/35-qa-04-registrar-testes-e-corrigir-regress%C3%B5es-finais

Lista atual: Para Fazer. Lista proposta: **Revisão/Teste**. Etiqueta: **Teste/Validação**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Registrar comandos, ambiente, resultados e limites dos testes da revisão de 15/11, substituindo o resumo desatualizado de 92 testes.

**Por que:** Comprovar que a extração dos controles e da persistência preserva dicas, correção, progresso e apresentação das restrições de plano.

**Situação proposta:** Revisão/Teste. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Executar TypeScript, lint, testes unitários e build da revisão.
- [x] Executar Prática, navegação e restrições de plano em desktop e mobile: 26 aprovados e 2 ignorados.
- [x] Manter testes de regras sem navegador e controle da sessão com erro e correção.
- [ ] Revisar o registro final e homologar a versão publicada após o envio do commit.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/blob/main/docs/arquitetura.md
- https://github.com/mello0969/GravityMind/tree/main/tests

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [MVP-01] Homologar versão publicada com o orientador

Cartão: https://trello.com/c/VjEoJP9M/25-mvp-01-homologar-mvp-e-conferir-entregas-finais

Lista atual: Para Fazer. Lista proposta: **Para Fazer**. Etiqueta: **Teste/Validação**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Comparar a aplicação pública, o commit entregue, o dossiê e o artigo; registrar a avaliação do orientador sobre a correção estrutural.

**Por que:** Garantir que os acessos da banca correspondem ao produto efetivamente disponível e às funcionalidades descritas.

**Situação proposta:** Para Fazer. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Manter o quadro acessível para leitura pública.
- [ ] Conferir commit, publicação e ausência de links antigos nos documentos.
- [ ] Repetir os fluxos da banca sem usar uma conta pessoal.
- [ ] Registrar a validação do orientador e resolver os apontamentos pendentes.

**Evidências e limites:**

- https://gravitymind.estudefisica.workers.dev
- https://github.com/mello0969/GravityMind
- https://trello.com/b/BZjw4a2F/tcc

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [QA-02] Validar Flash Cards, cálculo, foco e notas

Cartão: https://trello.com/c/S2vQ0e3D/36-qa-02-testar-fluxos-complementares-do-aluno

Lista atual: Para Fazer. Lista proposta: **Revisão/Teste**. Etiqueta: **Teste/Validação**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Executar os recursos complementares com passos e resultados esperados, diferenciando validação local de confirmação em produção.

**Por que:** Cobrir o percurso de estudo além de login e Tutor, inclusive navegação no celular e saída do modo foco.

**Situação proposta:** Revisão/Teste. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Verificar calculadora científica e encerramento de Flash Cards nos testes de navegador.
- [x] Ativar foco na Prática, sair e confirmar que não afeta outras rotas.
- [x] Verificar quadro, preferências e navegação em desktop e mobile.
- [ ] Registrar validação manual de restauração de notas e exportação do quadro em produção.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/blob/main/tests/e2e/study-flow.spec.ts
- https://github.com/mello0969/GravityMind/blob/main/tests/e2e/study-hub.spec.ts

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [DOC-13] Indexar acervo e conferir acesso aos artefatos

Cartão: https://trello.com/c/5IICi7Bz/37-doc-13-organizar-acervo-e-links-da-pesquisa

Lista atual: Para Fazer. Lista proposta: **Para Fazer**. Etiqueta: **Documentação**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Organizar os links existentes do artigo, dossiê, vídeo e apresentação; indicar o que ainda falta no acervo da pesquisa.

**Por que:** Permitir que a banca encontre os arquivos oficiais sem depender do computador do autor.

**Situação proposta:** Para Fazer. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Identificar links existentes de dossiê, artigo, vídeo e apresentação.
- [ ] Conferir permissão de leitura em cada link sem sessão do proprietário.
- [ ] Relacionar diário de bordo e registros de pesquisa ainda ausentes.
- [ ] Atualizar o índice do acervo e testar os links finais.

**Evidências e limites:**

- https://drive.google.com/drive/folders/1fcrJsElPxaiDUrHQEHcVw0KvwuEzBF4d

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [QA-03] Avaliar tarefas de uso e acessibilidade

Cartão: https://trello.com/c/eRSPwaGB/9-qa-03-validar-usabilidade-e-acessibilidade

Lista atual: Fazendo. Lista proposta: **Fazendo**. Etiqueta: **Teste/Validação**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Revisar teclado, nomes dos controles, foco visível, contraste e largura das telas; documentar as tarefas de uso realmente avaliadas.

**Por que:** Distinguir execução de testes automáticos de uma avaliação de usabilidade com participantes.

**Situação proposta:** Fazendo. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Executar os cenários automatizados de acessibilidade e responsividade existentes.
- [ ] Registrar uma revisão manual por teclado nas telas principais.
- [ ] Documentar resultados de tarefas com usuários apenas quando houver registros.
- [ ] Relacionar problemas encontrados, ajustes e nova verificação.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/blob/main/tests/e2e/study-flow.spec.ts
- https://github.com/mello0969/GravityMind/blob/main/tests/e2e/study-hub.spec.ts

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [DOC-12] Conferir dossiê original e links finais

Cartão: https://trello.com/c/P4vn0yvS/34-doc-12-completar-links-no-dossi%C3%AA-original

Lista atual: Fazendo. Lista proposta: **Fazendo**. Etiqueta: **Documentação**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Conferir no modelo original os acessos ao site, GitHub, Trello, vídeo e apresentação, mantendo a identificação de Murilo Mello, turma 63-1.

**Por que:** Entregar os recursos pedidos na atividade sem substituir o modelo da escola por outro documento.

**Situação proposta:** Fazendo. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Identificar o PDF existente e os links já produzidos para a banca.
- [ ] Conferir o endereço novo do site e eliminar o hostname anterior.
- [ ] Abrir o PDF final e verificar links, legibilidade e credenciais exclusivas de teste.
- [ ] Confirmar que a versão final está na pasta compartilhada e na atividade correta.

**Evidências e limites:**

- https://drive.google.com/file/d/17xYHDxI3LME_tNHZZeqlw1ZcMPl1BBFs/view
- https://gravitymind.estudefisica.workers.dev

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [RF-01] Validar temas e controles de estudo

Cartão: https://trello.com/c/vEqmqcjx/1-rf-01-implementar-interface-de-estudo-e-temas

Lista atual: Revisão/Teste. Lista proposta: **Revisão/Teste**. Etiqueta: **Interface/UI**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Manter os temas Claro, Escuro e GravityMind nas configurações e verificar a navegação responsiva nas áreas de estudo.

**Por que:** Permitir uso consistente sem controles duplicados de tema fora das configurações.

**Situação proposta:** Revisão/Teste. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Manter as três preferências de tema nas configurações.
- [x] Executar navegação e preferências nos cenários de navegador existentes.
- [ ] Conferir manualmente leitura, contraste e controles em todos os temas.

**Evidências e limites:**

- https://gravitymind.estudefisica.workers.dev/configuracoes
- https://github.com/mello0969/GravityMind/tree/main/src/features/settings

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [RF-02] Validar sessão e autorização por usuário

Cartão: https://trello.com/c/478EdgUW/2-rf-02-proteger-sess%C3%B5es-e-dados-no-servidor

Lista atual: Revisão/Teste. Lista proposta: **Revisão/Teste**. Etiqueta: **Nova Funcionalidade**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Manter autenticação, schemas, rate limit, cookies e autorização por registro nos serviços de servidor, separados da apresentação.

**Por que:** Impedir que dados fornecidos pelo navegador definam a identidade ou permitam acesso a registros de outra conta.

**Situação proposta:** Revisão/Teste. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Manter sessão HttpOnly e verificação de identidade no servidor.
- [x] Executar os testes existentes de segurança e isolamento entre contas.
- [ ] Revisar com o orientador o fluxo navegador, servidor e banco privilegiado.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/tree/main/src/lib/auth
- https://github.com/mello0969/GravityMind/blob/main/docs/banco-de-dados.md

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [RF-03] Conferir esquema Supabase e reprodução

Cartão: https://trello.com/c/Plc0W9WI/3-rf-03-estruturar-banco-supabase-e-migrations

Lista atual: Revisão/Teste. Lista proposta: **Revisão/Teste**. Etiqueta: **Nova Funcionalidade**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Conferir migrations, tipos e documentação do Supabase usado pelo servidor; manter o esquema D1 legado claramente identificado.

**Por que:** Permitir reproduzir o banco e explicar que a autorização por estudante ocorre no servidor com o cliente privilegiado.

**Situação proposta:** Revisão/Teste. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Disponibilizar migrations e tipos do esquema atual no repositório.
- [x] Documentar RLS, bloqueio público e autorização por usuário no servidor.
- [ ] Repetir a verificação remota do banco em uma etapa própria e registrar o resultado atual.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/tree/main/supabase/migrations
- https://github.com/mello0969/GravityMind/blob/main/docs/banco-de-dados.md

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [RF-04] Validar cadastro, login e saída da conta

Cartão: https://trello.com/c/C4PQoC69/4-rf-04-implementar-conta-e-autentica%C3%A7%C3%A3o-do-aluno

Lista atual: Revisão/Teste. Lista proposta: **Revisão/Teste**. Etiqueta: **Nova Funcionalidade**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Validar os formulários e o fluxo de sessão com prova humana, termos, mensagens de erro e sincronização antes de navegar.

**Por que:** Garantir entrada previsível e segura sem misturar validação do formulário com hash, sessão ou consultas ao banco.

**Situação proposta:** Revisão/Teste. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Separar tela e controle do formulário dos serviços de autenticação.
- [x] Executar os testes de validação, erros e bloqueio de envio duplicado.
- [ ] Registrar nova conferência do cadastro em produção com Turnstile real, sem expor dados pessoais.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/blob/main/tests/auth-form.test.tsx
- https://gravitymind.estudefisica.workers.dev/login

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [RF-05] Validar seleção, dicas e correção das questões

Cartão: https://trello.com/c/hMvespOr/5-rf-05-implementar-pr%C3%A1tica-e-dificuldade-adaptativa

Lista atual: Revisão/Teste. Lista proposta: **Revisão/Teste**. Etiqueta: **Nova Funcionalidade**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Manter seleção por modo, duas dicas por sessão, primeira tentativa e correção; isolar as regras da leitura e gravação de histórico.

**Por que:** Tornar as decisões de dificuldade auditáveis e testar o fluxo sem depender de componentes visuais ou armazenamento implícito.

**Situação proposta:** Revisão/Teste. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Executar regras sem navegador com histórico explícito e checkpoints de cinco respostas.
- [x] Verificar dicas, erro, correção e histórico no controle da sessão.
- [x] Manter testes de isolamento de conta e apresentação das restrições de plano.
- [ ] Revisar a separação de responsabilidades com o orientador antes de encerrar a correção estrutural.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/blob/main/src/lib/questions/engine.ts
- https://github.com/mello0969/GravityMind/blob/main/src/lib/questions/practice-service.ts
- https://github.com/mello0969/GravityMind/blob/main/tests/practice-controller.test.tsx

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [RF-07] Validar rotas e acesso às áreas do aluno

Cartão: https://trello.com/c/RGXPCU66/10-rf-07-organizar-navega%C3%A7%C3%A3o-e-%C3%A1reas-de-estudo

Lista atual: Revisão/Teste. Lista proposta: **Revisão/Teste**. Etiqueta: **Nova Funcionalidade**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Manter as rotas responsáveis por URL e composição da página; verificar os acessos a aulas, Prática, Flash Cards, Tutor, notas e cálculo.

**Por que:** Garantir que a navegação não volte a concentrar estado, persistência e regras de negócio no roteamento.

**Situação proposta:** Revisão/Teste. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Executar restrições de arquitetura sobre todos os arquivos de rotas.
- [x] Executar navegação entre recursos nos testes de desktop e mobile.
- [ ] Conferir manualmente o percurso da conta de teste na versão publicada.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/tree/main/src/routes
- https://github.com/mello0969/GravityMind/blob/main/tests/architecture.test.ts

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [RF-09] Validar quadro, cálculo e histórico das notas

Cartão: https://trello.com/c/PrLwAOyg/30-rf-09-implementar-quadro-c%C3%A1lculo-e-anota%C3%A7%C3%B5es

Lista atual: Revisão/Teste. Lista proposta: **Revisão/Teste**. Etiqueta: **Nova Funcionalidade**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Verificar rascunho no quadro, operações da calculadora e CRUD, salvamento automático e restauração de notas; manter os controles fora do JSX.

**Por que:** Apoiar a resolução e retomada do estudo sem espalhar gravação de dados dentro dos componentes de apresentação.

**Situação proposta:** Revisão/Teste. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Extrair controle de notas, editor e restauração para hooks da funcionalidade.
- [x] Executar regressão existente de cálculo, quadro e isolamento de dados.
- [ ] Registrar conferência manual de exportação do quadro e restauração de versão de nota.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/blob/main/src/features/notes/use-notes.ts
- https://gravitymind.estudefisica.workers.dev/calculo
- https://gravitymind.estudefisica.workers.dev/quadro

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [RF-10] Validar sessão e resumo de Flash Cards

Cartão: https://trello.com/c/wBviFdIN/31-rf-10-implementar-revis%C3%A3o-com-flash-cards

Lista atual: Revisão/Teste. Lista proposta: **Revisão/Teste**. Etiqueta: **Nova Funcionalidade**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Verificar revelação, marcação de revisão, avanço e resumo, mantendo sessão e armazenamento separados da tela.

**Por que:** Garantir que o último cartão avaliado apareça no resumo e que encerrar novamente não duplique o registro.

**Situação proposta:** Revisão/Teste. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Manter deck restrito autorizado no servidor.
- [x] Executar testes de sessão, encerramento único e cancelamento do temporizador.
- [ ] Registrar a conferência manual do resumo em produção.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/blob/main/tests/flashcard-session.test.tsx
- https://gravitymind.estudefisica.workers.dev/flashcards

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [UI-01] Comparar protótipo Figma com fluxos publicados

Cartão: https://trello.com/c/YaXIYnMx/7-ui-01-revisar-prot%C3%B3tipo-e-fluxos-no-figma

Lista atual: Revisão/Teste. Lista proposta: **Revisão/Teste**. Etiqueta: **Interface/UI**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Conferir os fluxos de navegação existentes no arquivo fornecido pelo autor e registrar as diferenças em relação ao produto atual.

**Por que:** Usar o protótipo como referência real e identificar ajustes necessários sem presumir que todo o arquivo já foi validado.

**Situação proposta:** Revisão/Teste. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Registrar o link do arquivo Figma fornecido pelo autor.
- [ ] Conferir acesso de leitura e telas efetivamente presentes no arquivo.
- [ ] Registrar diferenças e validar os fluxos com o orientador.

**Evidências e limites:**

- https://www.figma.com/design/Aoy8Octs1Zi6XPhSHcVwiM/Untitled?node-id=0-1

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [INFRA-01] Manter MVP público em HTTPS

Cartão: https://trello.com/c/pU3luqKd/28-infra-01-publicar-mvp-gratuito-com-https

Lista atual: Concluído. Lista proposta: **Concluído**. Etiqueta: **Nova Funcionalidade**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Manter a aplicação no Worker existente e atualizar a evidência para o endereço gravitymind.estudefisica.workers.dev.

**Por que:** Disponibilizar o produto sem depender de localhost e retirar o identificador antigo do endereço público.

**Situação proposta:** Concluído. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Publicar a aplicação no Worker existente com HTTPS.
- [x] Disponibilizar o hostname público atual, sem o identificador anterior.
- [x] Manter as chaves como configurações privadas do servidor.

**Evidências e limites:**

- https://gravitymind.estudefisica.workers.dev
- A conclusão existente de hospedagem não equivale à homologação de cada alteração posterior.

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [QA-01] Registrar validação já informada dos fluxos principais

Cartão: https://trello.com/c/CwnrhYYo/32-qa-01-validar-login-progresso-tutor-e-notas

Lista atual: Concluído. Lista proposta: **Concluído**. Etiqueta: **Teste/Validação**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Preservar o registro em que Murilo confirmou login, recuperação do progresso, Tutor e salvamento de anotações funcionando no site público.

**Por que:** Manter a evidência de validação informada pelo autor distinta da nova execução automatizada de novembro.

**Situação proposta:** Concluído. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Registrar a confirmação anterior do autor sobre login e recuperação de progresso.
- [x] Registrar a confirmação anterior de Tutor e salvamento de anotações.
- [x] Distinguir confirmação de uso anterior de teste remoto reexecutado nesta revisão.

**Evidências e limites:**

- Confirmação do autor registrada em 20/10/2026; não foi repetida uma chamada real ao provedor de IA nesta revisão.

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [RF-06] Manter progresso e recompensas por conta

Cartão: https://trello.com/c/GbPRmb4p/6-rf-06-acompanhar-progresso-metas-e-recompensas

Lista atual: Concluído. Lista proposta: **Concluído**. Etiqueta: **Nova Funcionalidade**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Manter desempenho por assunto, metas e eventos de recompensa vinculados à conta, com sincronização nos fluxos já implementados.

**Por que:** Permitir retomar o estudo e apresentar o progresso correspondente às atividades realizadas.

**Situação proposta:** Concluído. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Manter cálculos e serviços de perfil e recompensa separados das rotas.
- [x] Preservar os dados e chaves locais ao separar o serviço de questões.
- [x] Preservar a validação de recuperação do progresso já confirmada pelo autor.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/tree/main/src/lib/profile
- https://github.com/mello0969/GravityMind/tree/main/src/lib/rewards
- Sincronização no login não representa sincronização contínua de todos os dados entre dispositivos.

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

### [RF-08] Manter Tutor com conversas e vínculo às notas

Cartão: https://trello.com/c/mTLYvYR8/29-rf-08-oferecer-tutor-com-conversas-e-anota%C3%A7%C3%B5es

Lista atual: Concluído. Lista proposta: **Concluído**. Etiqueta: **Nova Funcionalidade**.

**Responsável:** Murilo Mello | Turma 63-1

**O que:** Manter conversas organizadas, envio ao provedor no servidor e salvamento de resposta como anotação; separar controle e apresentação.

**Por que:** Permitir perguntar, retomar uma conversa e guardar uma explicação sem misturar integração externa e JSX.

**Situação proposta:** Concluído. Critérios de aceite e evidências abaixo.

**Critérios de aceite:**

- [x] Extrair biblioteca e ciclo de envio para os controles da funcionalidade Tutor.
- [x] Preservar controle de versão, erros e vínculo de resposta com nota.
- [x] Executar testes de chat, formatação e serviços de conversas já existentes.

**Evidências e limites:**

- https://github.com/mello0969/GravityMind/tree/main/src/features/tutor
- https://github.com/mello0969/GravityMind/blob/main/tests/gravity-chat.test.tsx
- Funcionamento em produção confirmado anteriormente pelo autor; personalização por instruções e contexto, sem treinamento de modelo próprio.

**Datas:** preservar os campos existentes de planejamento. Registro desta revisão: 15/11/2026; não é uma reconstrução de datas passadas.

## Novo cartão de correção estrutural

### [REF-01] Separar regras, persistência e controles das telas

**Lista proposta:** Revisão/Teste. **Etiqueta:** Refatoração. **Responsável:** Murilo Mello. **Data de início:** 15/11/2026, quando esta revisão foi realizada. **Entrega:** combinar o prazo de avaliação; não inventar uma data anterior.

**O que:** remover o acoplamento residual entre regras de questões e armazenamento; retirar de cinco componentes visuais a coordenação de sessão, chamadas externas e CRUD de notas.

**Por que:** a revisão de outubro diminuiu as rotas, mas deixou responsabilidades concentradas em componentes e motores. A separação precisa alcançar o fluxo completo.

- [x] Executar seleção, adaptação e correção numérica com entradas explícitas, sem navegador.
- [x] Concentrar leitura e gravação do histórico nos serviços de prática.
- [x] Extrair controles de Prática, Tutor e notas mantendo os elementos da interface.
- [x] Impedir regressão dos limites por testes de importação, inclusive dependências indiretas.
- [x] Executar regressão unitária, TypeScript, lint, build e navegação em desktop e mobile.
- [ ] Conferir o commit remoto e a versão publicada.
- [ ] Registrar a avaliação do professor sobre esta separação.

**Evidência:** https://github.com/mello0969/GravityMind/blob/main/docs/arquitetura.md e arquivos/testes vinculados nesse documento.

## Critério para encerrar esta atualização do quadro

A preparação deste arquivo não altera o Trello. A tarefa de organização termina somente quando os títulos, descrições, etiquetas, listas e checklists forem gravados e relidos no quadro. As datas de entrega ainda dependentes de acordo devem ser definidas antes de encerrar os cartões novos.
