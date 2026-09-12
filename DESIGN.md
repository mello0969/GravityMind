# GRAVITYMIND: direção de interface

Este documento é a regra visual do projeto. Ele existe para impedir que futuras alterações devolvam ao site uma aparência genérica de template ou de interface gerada automaticamente.

## Princípio

O GRAVITYMIND é uma bancada de estudo para alunos do ensino médio. A interface deve parecer concentrada, útil e próxima de um material escolar bem editado. O produto real sempre vem antes de texto promocional: questão, diagrama, simulação, quadro e progresso.

## Estrutura

- Navegação compacta, opaca e previsível.
- Títulos largos com no máximo três linhas em telas comuns.
- Seções amplas separadas por bordas e espaço, sem transformar cada faixa em um card.
- Cards apenas para unidades realmente independentes, como uma questão, diálogo ou ferramenta.
- Nada de três cards genéricos de funcionalidades, depoimentos inventados, preços ou janelas de terminal decorativas.
- Layout responsivo desde 320 px, sem rolagem horizontal acidental.

## Tipografia

- Família principal: Outfit.
- Família técnica: JetBrains Mono, apenas para fórmulas, medidas e dados curtos.
- Letter spacing sempre zero.
- Não usar Inter, Geist ou Space Grotesk.
- Texto de leitura deve preservar largura confortável e line-height generoso.

## Cores

- Base clara: verde mineral muito claro, nunca branco puro.
- Base escura: grafite esverdeado, nunca preto puro.
- Cor principal: verde profundo no claro e verde suave no escuro.
- Vermelho-maçã: reservado ao objeto 3D, erro pedagógico e recompensa importante.
- Azul, verde, cobre e vermelho existem como cores semânticas, não como arco-íris decorativo.
- Não usar roxo como cor de marca, neon, gradiente em títulos, orbs, bokeh ou grade de pontinhos.

Os tokens de verdade vivem em `src/styles.css`; componentes não devem criar uma paleta paralela.

## Forma e profundidade

- Raio-base de 6 px.
- Bordas finas organizam a maior parte da hierarquia.
- Sombras são reservadas a elementos realmente elevados, como diálogo e widget flutuante.
- Nada de liquid glass, brilho, borda animada ou pilhas de superfícies translúcidas.
- Botões de ferramenta usam ícones conhecidos e tooltip; comandos principais usam texto claro.

## Movimento

- Movimento explica mudança de estado, sequência de estudo ou relação espacial.
- A página inicial usa GSAP para entrada do produto real, perspectiva suave da prática, pinning do método e reveal das leis.
- Navegação ativa e painéis móveis podem usar layout animation curta.
- Simulações de Física são interativas e respondem a valores reais.
- Setas não pulam, brilham nem deslizam no hover.
- `prefers-reduced-motion` e a preferência interna de movimento reduzido devem desligar animações não essenciais.
- Hover não pode deslocar layout, aumentar card inteiro ou esconder informação necessária.

## Componentes dos prompts

- Animated navigation tabs: aplicado como indicador ativo compartilhado na navegação e como controles segmentados.
- File upload: adaptado ao quadro, com arrastar e soltar, estados claros e validação de tipo, assinatura, dimensão e tamanho.
- Footer: conteúdo real do CIMOL em Taquara, RS, com termos e privacidade.
- Auth section: formulário real em duas colunas, sem shader, depoimento falso ou mockup de terceiros.
- Container scroll e parallax: aplicados ao módulo real de prática e à sequência das leis com movimento comedido.
- Testimonials: deliberadamente não usado, pois o projeto ainda não possui depoimentos verificáveis.
- Kinetic navigation: reduzido a transições úteis de rota e menu móvel, sem tela cheia decorativa.

## Conteúdo

- Não usar emojis, estrelas de brilho, selos arbitrários ou rótulos como `SECTION 01` e `QUESTION 05`.
- Não usar a fórmula textual “não é X, é Y” como atalho de escrita.
- Não usar travessão como recurso de tom promocional.
- Não afirmar métricas, avaliações, parceiros ou resultados sem dados reais.
- Todo CTA deve abrir uma ação funcional do produto.

## Checklist de entrega

- Tema claro e escuro conferidos.
- Desktop e mobile conferidos.
- Estados vazio, carregando, erro, desabilitado e concluído cobertos quando aplicáveis.
- Nenhum texto extrapola seu controle.
- Nenhuma animação essencial para entender a página.
- Questões não revelam a resposta correta antes da tentativa de correção.
- Quadro preserva o fundo original ao apagar.
- Loops visuais têm controle de pausa e respeitam movimento reduzido.
