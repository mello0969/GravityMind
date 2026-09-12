/**
 * Banco do Quiz Rápido de Verificação
 * ----------------------------------------------------------------
 * Cobertura: 3 leis × 4 formatos (texto, resumo, visual, vídeo) = 12 quizzes
 * Cada quiz tem exatamente 3 perguntas.
 *
 * Critério de escrita das perguntas:
 * - Simples e diretas, testam se leu/assistiu, não profundidade
 * - Cada pergunta tem apenas uma resposta claramente correta
 * - A explicação é breve mas instrutiva (não só "errado")
 * - Evitam armadilhas ou pegadinhas, não são para intimidar
 */

import type { QuizFormato } from "./types";

const QUIZZES: QuizFormato[] = [
  // ══════════════════════════════════════════════════════
  // 1ª LEI DE NEWTON
  // ══════════════════════════════════════════════════════

  {
    assunto: "lei-1",
    formato: "texto",
    perguntas: [
      {
        id: "q-lei1-txt-1",
        pergunta: "O que a 1ª Lei de Newton afirma sobre um corpo em repouso?",
        opcoes: [
          "Ele tende a se mover espontaneamente",
          "Ele permanece em repouso a menos que uma força atue sobre ele",
          "Ele sempre acelera com o tempo",
        ],
        correta: 1,
        explicacao:
          "A 1ª Lei diz que corpos em repouso ficam em repouso, e corpos em movimento mantêm sua velocidade, a menos que uma força resultante não nula atue sobre eles.",
      },
      {
        id: "q-lei1-txt-2",
        pergunta: "O que é inércia?",
        opcoes: [
          "A força que impede o movimento",
          "A tendência de um corpo de manter seu estado atual de movimento",
          "A aceleração máxima de um objeto",
        ],
        correta: 1,
        explicacao:
          "Inércia é a resistência de um corpo a qualquer mudança no seu estado de movimento. Quanto maior a massa, maior a inércia.",
      },
      {
        id: "q-lei1-txt-3",
        pergunta: "Quando a força resultante sobre um corpo é zero, o que acontece?",
        opcoes: [
          "O corpo para imediatamente",
          "O corpo acelera",
          "O corpo mantém seu estado de repouso ou movimento constante",
        ],
        correta: 2,
        explicacao:
          "Força resultante nula significa equilíbrio: o corpo mantém exatamente o que estava fazendo, parado continua parado, em movimento retilíneo constante continua assim.",
      },
    ],
  },

  {
    assunto: "lei-1",
    formato: "resumo",
    perguntas: [
      {
        id: "q-lei1-res-1",
        pergunta: "Segundo o resumo, o que faz um corpo mudar seu movimento?",
        opcoes: [
          "O peso do próprio corpo",
          "A presença de uma força resultante não nula",
          "O tempo que está em movimento",
        ],
        correta: 1,
        explicacao:
          "O ponto central da 1ª Lei é justamente esse: só uma força resulante diferente de zero consegue mudar o estado de movimento de um corpo.",
      },
      {
        id: "q-lei1-res-2",
        pergunta: "Como a massa se relaciona com a inércia, segundo o resumo?",
        opcoes: [
          "Mais massa = menos inércia",
          "Massa e inércia não têm relação",
          "Mais massa = mais inércia",
        ],
        correta: 2,
        explicacao:
          "A inércia é diretamente proporcional à massa. Um caminhão cheio tem muito mais resistência a mudanças de movimento do que uma bicicleta.",
      },
      {
        id: "q-lei1-res-3",
        pergunta:
          "No exemplo do cinto de segurança mencionado no resumo, o que explica a sensação de ser empurrado para frente numa freada?",
        opcoes: [
          "Uma força para frente gerada pelo freio",
          "A inércia do corpo tentando manter o movimento original",
          "O peso aumentando durante a freada",
        ],
        correta: 1,
        explicacao:
          "Não existe força para frente, o que acontece é que seu corpo tende a continuar com a velocidade que tinha antes da freada. Isso é inércia em ação.",
      },
    ],
  },

  {
    assunto: "lei-1",
    formato: "visual",
    perguntas: [
      {
        id: "q-lei1-vis-1",
        pergunta: "No diagrama de equilíbrio (ΣF = 0), quais forças verticais estão representadas?",
        opcoes: ["Apenas o peso", "Peso (↓) e Força Normal (↑)", "Apenas a força normal"],
        correta: 1,
        explicacao:
          "No diagrama, o bloco em equilíbrio tem duas forças verticais que se cancelam: o peso puxando para baixo e a normal empurrando para cima.",
      },
      {
        id: "q-lei1-vis-2",
        pergunta: "No diagrama de movimento com ΣF = 0, o que o vetor 'v' representa?",
        opcoes: [
          "A força aplicada sobre o bloco",
          "A velocidade constante do bloco",
          "A aceleração do bloco",
        ],
        correta: 1,
        explicacao:
          "O vetor 'v' representa a velocidade constante. Com resultante zero, não há aceleração, a velocidade se mantém idêntica.",
      },
      {
        id: "q-lei1-vis-3",
        pergunta: "O que diferencia os dois cenários mostrados no diagrama?",
        opcoes: [
          "Um tem mais massa que o outro",
          "Um está em repouso (v = 0) e o outro em movimento com velocidade constante",
          "Um tem atrito e o outro não",
        ],
        correta: 1,
        explicacao:
          "O diagrama ilustra os dois estados que a 1ª Lei trata como equivalentes: repouso (v = 0) e movimento retilíneo uniforme (v = constante). Em ambos, ΣF = 0.",
      },
    ],
  },

  {
    assunto: "lei-1",
    formato: "video",
    perguntas: [
      {
        id: "q-lei1-vid-1",
        pergunta: "Na animação da 1ª Lei, o que acontece com o bloco antes do impulso?",
        opcoes: [
          "Ele se move lentamente",
          "Ele fica em repouso",
          "Ele oscila de um lado para o outro",
        ],
        correta: 1,
        explicacao:
          "O bloco permanece em repouso enquanto nenhuma força horizontal atua sobre ele, isso ilustra a inércia do repouso.",
      },
      {
        id: "q-lei1-vid-2",
        pergunta: "Após receber o impulso, o que acontece com o bloco na animação?",
        opcoes: [
          "Ele desacelera gradualmente até parar",
          "Ele continua com velocidade constante",
          "Ele acelera cada vez mais",
        ],
        correta: 1,
        explicacao:
          "Sem forças agindo (atrito zero no ambiente da animação), o bloco mantém a velocidade que recebeu do impulso indefinidamente, inércia do movimento.",
      },
      {
        id: "q-lei1-vid-3",
        pergunta: "Qual é a ideia principal que a animação da 1ª Lei demonstra?",
        opcoes: [
          "Que forças sempre aceleram os objetos",
          "Que objetos mudam de estado sozinhos com o tempo",
          "Que corpos tendem a manter seu estado de movimento",
        ],
        correta: 2,
        explicacao:
          "A animação mostra que, sem força externa, o estado de movimento não muda, o bloco em repouso fica em repouso, e em movimento mantém a velocidade.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 2ª LEI DE NEWTON
  // ══════════════════════════════════════════════════════

  {
    assunto: "lei-2",
    formato: "texto",
    perguntas: [
      {
        id: "q-lei2-txt-1",
        pergunta: "O que a fórmula F = m·a relaciona?",
        opcoes: [
          "Força, velocidade e tempo",
          "Força resultante, massa e aceleração",
          "Peso, normal e atrito",
        ],
        correta: 1,
        explicacao:
          "F = m·a é a expressão matemática da 2ª Lei: a força resultante (F) é igual à massa (m) multiplicada pela aceleração (a) que ela produz.",
      },
      {
        id: "q-lei2-txt-2",
        pergunta:
          "Se a massa dobrar e a força resultante permanecer igual, o que ocorre com a aceleração?",
        opcoes: ["Ela dobra", "Ela fica pela metade", "Ela não muda"],
        correta: 1,
        explicacao:
          "Como a = F/m, dobrar m com F constante reduz a pela metade. Massa e aceleração são inversamente proporcionais para força constante.",
      },
      {
        id: "q-lei2-txt-3",
        pergunta: "Qual a unidade da força no Sistema Internacional?",
        opcoes: ["Quilograma (kg)", "Metro por segundo (m/s)", "Newton (N)"],
        correta: 2,
        explicacao:
          "1 Newton (N) é a força necessária para acelerar 1 kg a 1 m/s². É a unidade de força no SI, derivada diretamente de F = m·a.",
      },
    ],
  },

  {
    assunto: "lei-2",
    formato: "resumo",
    perguntas: [
      {
        id: "q-lei2-res-1",
        pergunta: "Segundo o resumo, qual é o ponto central da 2ª Lei?",
        opcoes: [
          "Mais força = mais velocidade; mais massa = mais aceleração",
          "Mais força = mais aceleração; mais massa = menos aceleração (força constante)",
          "Força e aceleração são sempre iguais em valor",
        ],
        correta: 1,
        explicacao:
          "Esse é o coração da 2ª Lei: para uma força fixa, objetos mais pesados (maior massa) aceleram menos. Para uma massa fixa, mais força gera mais aceleração.",
      },
      {
        id: "q-lei2-res-2",
        pergunta: "O que deve ser calculado antes de aplicar F = m·a quando há várias forças?",
        opcoes: [
          "A maior das forças",
          "A força de atrito isoladamente",
          "A força resultante (soma vetorial de todas as forças)",
        ],
        correta: 2,
        explicacao:
          "A 2ª Lei usa a FORÇA RESULTANTE, não uma força individual. É preciso somar vetorialmente todas as forças antes de calcular a aceleração.",
      },
      {
        id: "q-lei2-res-3",
        pergunta: "A aceleração tem a mesma direção e sentido que:",
        opcoes: ["A velocidade do corpo", "A força resultante", "O peso do corpo"],
        correta: 1,
        explicacao:
          "A aceleração sempre aponta na mesma direção e sentido da força resultante, é uma consequência direta de F = m·a (a e F são vetores na mesma direção).",
      },
    ],
  },

  {
    assunto: "lei-2",
    formato: "visual",
    perguntas: [
      {
        id: "q-lei2-vis-1",
        pergunta: "No diagrama, o bloco 'leve' tem qual cor?",
        opcoes: ["Azul", "Verde", "Vermelho"],
        correta: 1,
        explicacao:
          "O bloco verde representa o objeto mais leve, que por isso recebe maior aceleração para a mesma força aplicada.",
      },
      {
        id: "q-lei2-vis-2",
        pergunta: "O que os vetores amarelos no diagrama representam?",
        opcoes: [
          "A velocidade de cada bloco",
          "A mesma força F aplicada nos dois blocos",
          "O peso de cada bloco",
        ],
        correta: 1,
        explicacao:
          "Os vetores amarelos têm o mesmo tamanho em ambos os blocos para mostrar que a mesma força F é aplicada, o que muda é a aceleração resultante.",
      },
      {
        id: "q-lei2-vis-3",
        pergunta: "Por que o vetor de aceleração do bloco pesado é menor no diagrama?",
        opcoes: [
          "Porque recebe uma força menor",
          "Porque tem mais massa, resultando em menor aceleração para a mesma força",
          "Porque está em repouso",
        ],
        correta: 1,
        explicacao:
          "Massa 3× maior com a mesma força → aceleração 3× menor (a = F/m). O diagrama ilustra visualmente essa relação inversa entre massa e aceleração.",
      },
    ],
  },

  {
    assunto: "lei-2",
    formato: "video",
    perguntas: [
      {
        id: "q-lei2-vid-1",
        pergunta: "Na animação, qual bloco acelera mais rapidamente?",
        opcoes: ["O bloco pesado (marrom)", "Os dois aceleram igual", "O bloco leve (verde)"],
        correta: 2,
        explicacao:
          "O bloco verde (mais leve) acelera muito mais que o marrom (mais pesado) com a mesma força aplicada, exatamente o que F = m·a prevê.",
      },
      {
        id: "q-lei2-vid-2",
        pergunta: "O que a animação mantém igual entre os dois blocos?",
        opcoes: ["A aceleração", "A força aplicada", "A massa"],
        correta: 1,
        explicacao:
          "A força aplicada é a mesma nos dois blocos (representada pelos vetores amarelos iguais). O que varia é a massa, e por isso a aceleração de cada um é diferente.",
      },
      {
        id: "q-lei2-vid-3",
        pergunta: "Qual princípio a animação da 2ª Lei demonstra diretamente?",
        opcoes: [
          "Que objetos mais pesados caem mais rápido",
          "Que a aceleração depende da força e da massa (F = m·a)",
          "Que forças sempre se cancelam em pares",
        ],
        correta: 1,
        explicacao:
          "A animação mostra visualmente F = m·a: mesma força, massas diferentes → acelerações diferentes, inversamente proporcionais às massas.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════
  // 3ª LEI DE NEWTON
  // ══════════════════════════════════════════════════════

  {
    assunto: "lei-3",
    formato: "texto",
    perguntas: [
      {
        id: "q-lei3-txt-1",
        pergunta: "O que a 3ª Lei afirma sobre o par ação-reação?",
        opcoes: [
          "A reação é sempre menor que a ação",
          "Ação e reação têm mesmo módulo, mesma direção e sentidos opostos",
          "Ação e reação atuam no mesmo corpo",
        ],
        correta: 1,
        explicacao:
          "A 3ª Lei é precisa: as forças do par têm IGUAL módulo, MESMA direção e SENTIDOS OPOSTOS. E crucialmente, atuam em corpos diferentes.",
      },
      {
        id: "q-lei3-txt-2",
        pergunta: "Por que as forças de ação e reação NÃO se cancelam?",
        opcoes: [
          "Porque têm módulos diferentes",
          "Porque atuam em corpos diferentes, não no mesmo",
          "Porque têm direções diferentes",
        ],
        correta: 1,
        explicacao:
          "Para duas forças se cancelarem, precisam atuar no mesmo corpo. A ação atua em B (exercida por A) e a reação atua em A (exercida por B), corpos diferentes, sem cancelamento.",
      },
      {
        id: "q-lei3-txt-3",
        pergunta: "Um foguete no espaço se move porque:",
        opcoes: [
          "Empurra o ar para trás",
          "Os gases expelidos para trás geram uma reação que empurra o foguete para frente",
          "Reduz sua própria massa",
        ],
        correta: 1,
        explicacao:
          "Propulsão por reação: o foguete empurra gases para trás (ação), e os gases empurram o foguete para frente (reação). Funciona até no vácuo, sem ar.",
      },
    ],
  },

  {
    assunto: "lei-3",
    formato: "resumo",
    perguntas: [
      {
        id: "q-lei3-res-1",
        pergunta: "Qual é o erro mais comum sobre o par ação-reação mencionado no resumo?",
        opcoes: [
          "Achar que a reação é maior que a ação",
          "Achar que o par de forças se anula",
          "Achar que só existe quando há movimento",
        ],
        correta: 1,
        explicacao:
          "O erro clássico é pensar que ação e reação se anulam. Não se anulam porque atuam em corpos diferentes, só forças no mesmo corpo podem se cancelar.",
      },
      {
        id: "q-lei3-res-2",
        pergunta: "Segundo o resumo, o que caminhar e foguetes têm em comum?",
        opcoes: [
          "Ambos dependem do ar para funcionar",
          "Ambos são exemplos de propulsão por par ação-reação",
          "Ambos usam F = m·a diretamente",
        ],
        correta: 1,
        explicacao:
          "Ao caminhar, você empurra o chão para trás (ação) e o chão te empurra para frente (reação). O foguete faz o mesmo com os gases. São par ação-reação.",
      },
      {
        id: "q-lei3-res-3",
        pergunta: "Toda força de ação:",
        opcoes: [
          "Gera uma reação de módulo igual e sentido oposto em outro corpo",
          "Gera uma reação apenas quando há contato físico",
          "Gera uma reação de módulo maior no corpo mais leve",
        ],
        correta: 0,
        explicacao:
          "Sempre, sem exceção: toda ação gera uma reação de IGUAL módulo e sentido oposto, em outro corpo. Isso vale para contato, gravidade, magnetismo, toda interação.",
      },
    ],
  },

  {
    assunto: "lei-3",
    formato: "visual",
    perguntas: [
      {
        id: "q-lei3-vis-1",
        pergunta: "No diagrama, o que o vetor vermelho representa?",
        opcoes: [
          "A força de B sobre A (reação)",
          "A força de A sobre B (ação)",
          "A velocidade do bloco A",
        ],
        correta: 1,
        explicacao:
          "O vetor vermelho representa F(A→B), a força que A exerce sobre B, a ação. O vetor azul representa a reação de B sobre A.",
      },
      {
        id: "q-lei3-vis-2",
        pergunta: "O que os tamanhos dos vetores vermelho e azul no diagrama indicam?",
        opcoes: [
          "Que a ação é maior que a reação",
          "Que ação e reação têm o mesmo módulo",
          "Que a reação é maior que a ação",
        ],
        correta: 1,
        explicacao:
          "Os dois vetores têm o mesmo comprimento no diagrama, representando que ação e reação têm sempre o mesmo módulo, é a 3ª Lei.",
      },
      {
        id: "q-lei3-vis-3",
        pergunta: "Os vetores de ação e reação apontam em que direções no diagrama?",
        opcoes: [
          "A mesma direção e o mesmo sentido",
          "A mesma direção, mas sentidos opostos",
          "Direções completamente diferentes",
        ],
        correta: 1,
        explicacao:
          "Ação e reação sempre têm a mesma direção (linha de ação), mas sentidos opostos, um aponta para direita, o outro para esquerda, como no diagrama.",
      },
    ],
  },

  {
    assunto: "lei-3",
    formato: "video",
    perguntas: [
      {
        id: "q-lei3-vid-1",
        pergunta: "Na animação dos patinadores, o que acontece quando eles se empurram?",
        opcoes: [
          "Só o mais leve se afasta",
          "Ambos se afastam em sentidos opostos",
          "Eles ficam parados",
        ],
        correta: 1,
        explicacao:
          "Ambos se afastam, cada um recebe a força de reação do outro. Isso é o par ação-reação em ação: A empurra B (ação) e B empurra A (reação).",
      },
      {
        id: "q-lei3-vid-2",
        pergunta:
          "Na animação, os blocos A (vermelho) e B (azul) se afastam com a mesma velocidade?",
        opcoes: [
          "Sim, sempre com a mesma velocidade",
          "Não necessariamente, depende das massas de cada um",
          "Não, o maior sempre vai mais rápido",
        ],
        correta: 1,
        explicacao:
          "As forças de ação e reação são iguais, mas as acelerações podem ser diferentes se as massas forem diferentes. Massa menor → aceleração maior → velocidade final maior.",
      },
      {
        id: "q-lei3-vid-3",
        pergunta: "O que a animação demonstra sobre o par ação-reação?",
        opcoes: [
          "Que forças sempre ocorrem em pares em corpos diferentes",
          "Que forças maiores vencem as menores",
          "Que a ação ocorre antes da reação",
        ],
        correta: 0,
        explicacao:
          "A animação mostra que toda interação gera um par de forças simultâneas em corpos distintos: A exerce força sobre B e B exerce força sobre A ao mesmo tempo.",
      },
    ],
  },
];

export function obterQuiz(assunto: string, formato: string): QuizFormato | undefined {
  return QUIZZES.find((q) => q.assunto === assunto && q.formato === formato);
}
