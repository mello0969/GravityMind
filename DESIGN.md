---
name: GRAVITYMIND
description: Ambiente de estudo de Fisica com pratica, experimentos e revisao.
colors:
  primary: "#9bd4bf"
  background: "#0e1916"
  surface: "#15221e"
  text: "#eef3ef"
  border: "#33493f"
  chrome: "#101c19"
  light-background: "#eef2f0"
  light-surface: "#f7f9f8"
  light-primary: "#006241"
  marketing-ground: "#10231b"
  marketing-text: "#f1f5f1"
  marketing-muted: "#c3d4ca"
  marketing-action: "#b5dfcb"
  marketing-action-text: "#132d21"
  marketing-action-hover: "#cdebdc"
  marketing-footnote: "#b3c9bd"
  enrollment-ground: "#183c2b"
  enrollment-muted: "#c1d7ca"
typography:
  display:
    fontFamily: "Outfit, Segoe UI, sans-serif"
    fontSize: "3rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "0"
  headline:
    fontFamily: "Outfit, Segoe UI, sans-serif"
    fontSize: "2.5rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "0"
  body:
    fontFamily: "Outfit, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
  formula:
    fontFamily: "Georgia, serif"
    fontSize: "2rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
rounded:
  control: "4px"
  surface: "6px"
spacing:
  small: "8px"
  medium: "16px"
  section: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#07130e"
    rounded: "{rounded.control}"
    height: "44px"
---
# Design System: GRAVITYMIND

## Overview

Atualizado em 03/10/2026. A identidade e as ferramentas existentes permanecem.
A home oferece um caminho claro para estudar, com navegacao completa e cadastro
gratuito. O uso e sofisticado e simples, com hierarquia contida e acessos previsiveis.

**Creative North Star: "Fisica em primeiro plano"**

A home apresenta GRAVITYMIND, "Sua curiosidade vai mais longe." e a acao
"Explorar as aulas", que leva a /aulas. O prisma optico em raster gerado tem
estilo fotografico e funciona como ilustracao cientifica decorativa, sem alegar
um experimento real ou um curso de optica. Quatro links sem moldura levam ao
estudo; o convite a conta gratuita e o rodape institucional completam o percurso.
As telas de estudo usam divisorias, filtros legiveis e o conteudo como prioridade.
Nao ha estatisticas, depoimentos, conversas ou resultados inventados.

Pratica adaptativa e gratuita para visitantes e contas, com historico local validado
e separado por conta. Tutor e gratuito para contas autenticadas, com limites no
servidor e sujeito a disponibilidade. Sem OPENAI_API_KEY no ambiente informado,
respostas reais ainda nao estao ativas. O deck avancado de Flash Cards mantem
acesso Plus verificado no servidor; planos aparecem somente em /plus.

**Key Characteristics:**
- Fundo verde-grafite, contraste mineral e prisma raster como imagem cientifica.
- Tipografia geometrica de peso moderado, sem espacamento artificial.
- Logo de contorno fino, navegacao completa e ferramentas agrupadas.
- Estudo gratuito, progressao pessoal, revisao e experimentos reais nas aulas.

## Colors

Os tokens do frontmatter descrevem o tema escuro, agora padrao para novas visitas.
Preferencias anteriores de tema claro ou sistema sao respeitadas. Os dois temas
usam header e footer escuros. As variacoes completas, incluindo estados
semanticos, continuam em src/styles.css.

**The Semantic Color Rule.** Erro, aviso e sucesso mantem papeis distintos.
As cores do prisma pertencem a ilustracao, sem substituir estados da interface.

## Typography

Outfit 400/500/600/700 e servido localmente em public/fonts, com licenca OFL.
JetBrains Mono fica restrito a dados; Georgia italico identifica equacoes simples.
Texto corrente parte de 16 px. Texto maior aumenta a raiz para 18 px e escala
titulos e controles em rem. Titulos internos sao de 32 a 40 px; apenas a home
usa escala de hero. Nenhum tamanho depende de vw, e letter-spacing e zero.

## Layout

Largura util ate 78 rem. Header de 72 px no desktop e 64 px no celular.
A navegacao abre um menu abaixo de 1024 px; grades de estudo empilham abaixo
de 768 px. No celular, margens de 20 px e colunas minmax(0, 1fr).

Home: intro com imagem raster sem moldura, marca e mensagem sobre a imagem,
seguida de quatro links de recursos sem cards, conta gratuita e rodape institucional.
Os links para aulas, pratica e revisao, ferramentas e Tutor usam duas colunas no
desktop e uma abaixo de 720 px, separados por linhas finas. A faixa de conta leva
ao cadastro ou, para quem entrou, ao progresso. Planos ficam somente em /plus.
Sem maca, cena 3D, interface de exercicios, explicacoes de aula, laboratorio,
estatisticas ou chat flutuante na pagina inicial.
Pratica: filtros laterais e questao principal; no celular objetivo e ferramentas
podem ser expandidos. Flash Cards mantem selecao de deck e um cartao por vez.
Tutor usa contexto lateral no desktop e fluxo vertical no celular para contas
autenticadas, inclusive gratuitas. Visitantes veem o convite para entrar ou criar
uma conta gratuita, sem campo de conversa.

## Elevation & Depth

Sem sombras decorativas ou vidro. Profundidade vem de superficies, bordas e
luz representada no prisma raster. O plano Plus usa linhas de contorno em shader,
restritas ao proprio plano em /plus. Nao aplicar efeitos decorativos a campos ou respostas.

## Shapes

Bordas finas de 1 px. Controles de 4 px e superficies de 6 px, nunca acima de 8 px.
Circulos ficam no simbolo da marca, numeracao da trilha e chaves liga/desliga.
Sem orbitas ou formulas decorativas na home atual.

## Components

### Navigation
Logo proprio de circulo e eixo, nome GRAVITYMIND em caixa alta e tagline.
Na home e nas rotas internas: Inicio, Estudar, Pratica, Flash Cards e Tutor sao
acessos diretos no topo.
Explorar contem Quadro, Calculo, Progresso, Anotacoes, Configuracoes e Plus.
Menu com foco visivel, estado ativo, fechamento por Escape e rotas reais.

### Controls
Botoes primarios de preenchimento mineral e secundarios com contorno.
Alvos principais de pelo menos 44 px. Hover altera cor, sem deslocar a pagina.
Campos tem labels; estados desabilitados sao reais e nao substituem mensagens.

### Study Surfaces
Questao, flashcard e calculadora sao ferramentas emolduradas. Secoes sao faixas,
nao cards aninhados. Dificuldade, confianca e respostas mantem estado acessivel.
Flash Cards mostram estatisticas somente ao terminar. Plus nao solicita dados
brutos de cartao; o Tutor nunca mostra uma conversa ficticia como atividade real.
Pratica adaptativa e niveis fixos Facil, Medio e Dificil sao gratuitos, inclusive
para visitantes. A adaptatividade usa historico local validado e separado por conta.
Tutor e gratuito para contas autenticadas, com limites no servidor e sujeito a
disponibilidade. OPENAI_API_KEY esta ausente no ambiente informado: respostas
reais do provedor ainda nao estao ativas; a interface deve refletir indisponibilidade
sem simular uma conversa. O deck avancado de Flash Cards mantem a verificacao
Plus no servidor. A comparacao Essencial/Plus aparece somente em /plus, sem
apresentar Tutor ou adaptatividade como exclusivos do plano pago.

**The Local Focus Rule.** Foco pertence ao wrapper da rota. Nunca aplicar
data-focus ao html ou esconder globalmente header e footer.

### Motion
O prisma e uma imagem estatica, sem rotacao ou interacao 3D. A entrada da frase
usa GSAP e respeita movimento reduzido. Entrada do texto e revelacao dos flashcards
sao breves; simulacoes pedagogicas continuam com seus controles explicitos.

## Do's and Don'ts

### Do
- Mostrar o produto funcionando, com dados do proprio estudante.
- Preservar claro, escuro, leitura ampliada e movimento reduzido.
- Usar identidade propria e manter CIMOL, Taquara/RS no rodape.
- Testar teclado, contraste, celular e estados vazios antes de concluir.

### Don't
- Copiar logos de Alura, Apple ou Starbucks.
- Inventar evidencias de aprendizagem ou apresentar Tutor sem chave como IA ativa.
- Adicionar gradientes de titulo, brilho, neon, vidro ou animacoes de hover.
- Tratar progresso de visita como dominio de um conceito.
