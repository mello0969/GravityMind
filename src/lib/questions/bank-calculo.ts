/**
 * Banco de Questões de Cálculo Numérico
 * ----------------------------------------------------------------
 * Cada questão exige que o aluno calcule e digite um valor numérico.
 * O sistema verifica dentro de uma tolerância de ±2% e, se errar,
 * mostra qual erro específico o aluno provavelmente cometeu, com base
 * na faixa em que o valor digitado se encontra.
 *
 * Estrutura de faixas de erro: mapeamos os erros mais comuns de cada
 * questão para intervalos de valor, de forma que o sistema possa dizer
 * "você provavelmente confundiu X com Y" em vez de só "errado".
 */

import type { QuestaoCalculo } from "./types";

export const QUESTOES_CALCULO: QuestaoCalculo[] = [
  // ═══════════════════════ 1ª LEI ═══════════════════════

  {
    id: "calc-lei1-f-01",
    assunto: "lei-1",
    subassunto: "Força resultante nula",
    dificuldade: "facil",
    tags: ["equilíbrio", "força resultante", "1ª Lei"],
    enunciado:
      "Um bloco está em repouso sobre uma mesa horizontal. O peso do bloco é de 30 N. Qual é o módulo da força normal que a mesa exerce sobre o bloco?",
    dados: [{ simbolo: "P", valor: "30 N" }],
    formula: "N = P (equilíbrio vertical)",
    passos: [
      {
        descricao: "Identificar as forças verticais atuando no bloco",
        calculo: "Peso (↓) e Normal (↑)",
      },
      {
        descricao: "Aplicar a 1ª Lei: como o bloco está em repouso, a força resultante é zero",
        calculo: "ΣFy = N − P = 0",
      },
      {
        descricao: "Isolar N",
        calculo: "N = P = 30 N",
      },
    ],
    valorCorreto: 30,
    unidade: "N",
    toleranciaPercent: 2,
    explicacaoFinal:
      "Como o bloco está em repouso, a 1ª Lei garante que a força resultante é nula. As únicas forças verticais são o peso (30 N para baixo) e a força normal (N para cima). Para que a resultante seja zero, N deve ser igual e oposta ao peso: N = 30 N.",
    faixasErro: [
      {
        min: 0,
        max: 1,
        diagnostico:
          "Você digitou zero ou um valor muito pequeno. A força normal não é nula, ela deve equilibrar o peso do bloco (30 N) para mantê-lo em repouso.",
      },
      {
        min: 15,
        max: 20,
        diagnostico:
          "Parece que você dividiu o peso por 2 (N = P/2). A força normal equilibra o peso inteiro, não metade dele, N = P = 30 N.",
      },
      {
        min: 60,
        max: 70,
        diagnostico:
          "Parece que você somou o peso com ele mesmo (N = 2P = 60 N). A força normal é igual ao peso, não o dobro.",
      },
    ],
  },

  {
    id: "calc-lei1-m-01",
    assunto: "lei-1",
    subassunto: "Equilíbrio com múltiplas forças",
    dificuldade: "medio",
    tags: ["equilíbrio", "força resultante", "horizontal"],
    enunciado:
      "Um caixote é puxado para a direita com uma força de 80 N. Para mantê-lo em repouso, uma segunda pessoa empurra para a esquerda. Além disso, há uma força de atrito estático de 20 N agindo também para a esquerda. Qual deve ser o módulo da força que a segunda pessoa aplica?",
    dados: [
      { simbolo: "F₁", valor: "80 N (→)" },
      { simbolo: "Fat", valor: "20 N (←)" },
    ],
    formula: "ΣF = 0 → F₂ = F₁ − Fat",
    passos: [
      {
        descricao: "Definir sentido positivo: direita = positivo",
        calculo: "+80 N − F₂ − 20 N = 0",
      },
      {
        descricao: "Isolar F₂",
        calculo: "F₂ = 80 − 20 = 60 N",
      },
    ],
    valorCorreto: 60,
    unidade: "N",
    toleranciaPercent: 2,
    explicacaoFinal:
      "Para o caixote estar em equilíbrio (1ª Lei), a soma de todas as forças horizontais deve ser zero. Para a direita: +80 N. Para a esquerda: F₂ + 20 N. Logo: 80 = F₂ + 20 → F₂ = 60 N.",
    faixasErro: [
      {
        min: 78,
        max: 82,
        diagnostico:
          "Você digitou ~80 N, que é a força da primeira pessoa. Mas o atrito (20 N) também age para a esquerda, a segunda pessoa só precisa complementar: F₂ = 80 − 20 = 60 N.",
      },
      {
        min: 98,
        max: 102,
        diagnostico:
          "Você somou as duas forças (80 + 20 = 100 N) em vez de subtrair. O atrito já ajuda a equilibrar a força de 80 N, a segunda pessoa só precisa fornecer a diferença.",
      },
      {
        min: 18,
        max: 22,
        diagnostico:
          "Você digitou apenas o valor do atrito (20 N). Mas 20 N não é suficiente para equilibrar os 80 N da outra pessoa, faltam mais 40 N.",
      },
    ],
  },

  {
    id: "calc-lei1-d-01",
    assunto: "lei-1",
    subassunto: "Equilíbrio em plano inclinado",
    dificuldade: "dificil",
    tags: ["equilíbrio", "plano inclinado", "componentes"],
    enunciado:
      "Um bloco de 10 kg repousa sobre um plano inclinado de 30°. Considere g = 10 m/s². Qual é o módulo da força de atrito necessária para manter o bloco em equilíbrio? (Dica: a componente do peso paralela ao plano é P·sen30°)",
    dados: [
      { simbolo: "m", valor: "10 kg" },
      { simbolo: "g", valor: "10 m/s²" },
      { simbolo: "θ", valor: "30°" },
      { simbolo: "sen 30°", valor: "0,5" },
    ],
    formula: "Fat = P · sen θ = m · g · sen θ",
    passos: [
      {
        descricao: "Calcular o peso",
        calculo: "P = m · g = 10 × 10 = 100 N",
      },
      {
        descricao: "Calcular a componente do peso paralela ao plano (que tende a deslizar o bloco)",
        calculo: "P‖ = P · sen 30° = 100 × 0,5 = 50 N",
      },
      {
        descricao: "Para equilíbrio, o atrito deve ser igual e oposto à componente paralela",
        calculo: "Fat = P‖ = 50 N",
      },
    ],
    valorCorreto: 50,
    unidade: "N",
    toleranciaPercent: 2,
    explicacaoFinal:
      "No plano inclinado, o peso se decompõe em duas componentes: paralela ao plano (P·sen30° = 50 N, que tende a deslizar o bloco) e perpendicular (P·cos30°, equilibrada pela normal). Para equilíbrio, a força de atrito deve igualar a componente paralela: Fat = 50 N.",
    faixasErro: [
      {
        min: 98,
        max: 102,
        diagnostico:
          "Você digitou 100 N, que é o peso total. No plano inclinado, só a componente paralela ao plano (P·sen30° = 50 N) tende a deslizar o bloco, não o peso inteiro.",
      },
      {
        min: 84,
        max: 88,
        diagnostico:
          "Você usou cos30° (≈0,87) em vez de sen30° (0,5). A componente que tende a deslizar o bloco ao longo do plano é P·senθ, não P·cosθ.",
      },
      {
        min: 28,
        max: 32,
        diagnostico:
          "Você pode ter usado o ângulo em vez do seno (Fat = P × 30° = 3000 N / 100 ≈ 30 N). O cálculo correto usa o sen do ângulo: sen30° = 0,5.",
      },
    ],
  },

  // ═══════════════════════ 2ª LEI ═══════════════════════

  {
    id: "calc-lei2-f-01",
    assunto: "lei-2",
    subassunto: "Cálculo direto de aceleração",
    dificuldade: "facil",
    tags: ["F = ma", "aceleração", "cálculo direto"],
    enunciado:
      "Uma força resultante de 36 N é aplicada sobre um corpo de massa 4 kg. Qual é a aceleração produzida?",
    dados: [
      { simbolo: "F", valor: "36 N" },
      { simbolo: "m", valor: "4 kg" },
    ],
    formula: "a = F / m",
    passos: [
      {
        descricao: "Aplicar a 2ª Lei de Newton",
        calculo: "F = m · a → a = F / m",
      },
      {
        descricao: "Substituir os valores",
        calculo: "a = 36 / 4 = 9 m/s²",
      },
    ],
    valorCorreto: 9,
    unidade: "m/s²",
    toleranciaPercent: 2,
    explicacaoFinal:
      "Pela 2ª Lei (F = m·a), isolamos a aceleração: a = F/m = 36/4 = 9 m/s². Note que a aceleração tem a mesma direção e sentido da força resultante.",
    faixasErro: [
      {
        min: 143,
        max: 145,
        diagnostico:
          "Você multiplicou F × m (36 × 4 = 144) em vez de dividir. A fórmula é a = F ÷ m, não F × m.",
      },
      {
        min: 0.1,
        max: 0.12,
        diagnostico:
          "Você inverteu a divisão (m/F = 4/36 ≈ 0,11). A aceleração é a = F/m, com a força no numerador e a massa no denominador.",
      },
      {
        min: 40,
        max: 40,
        diagnostico:
          "Você somou F + m (36 + 4 = 40). Força e massa têm unidades diferentes (N e kg) e não podem ser somadas, a relação entre elas é a = F/m.",
      },
    ],
  },

  {
    id: "calc-lei2-m-01",
    assunto: "lei-2",
    subassunto: "Força resultante com atrito",
    dificuldade: "medio",
    tags: ["F = ma", "atrito", "força resultante"],
    enunciado:
      "Um bloco de 5 kg é empurrado horizontalmente com uma força de 30 N. A força de atrito cinético é de 10 N. Calcule a aceleração do bloco.",
    dados: [
      { simbolo: "m", valor: "5 kg" },
      { simbolo: "Fapl", valor: "30 N" },
      { simbolo: "Fat", valor: "10 N (oposta ao movimento)" },
    ],
    formula: "a = (Fapl − Fat) / m",
    passos: [
      {
        descricao: "Calcular a força resultante horizontal",
        calculo: "Fres = 30 − 10 = 20 N",
      },
      {
        descricao: "Aplicar a 2ª Lei",
        calculo: "a = Fres / m = 20 / 5 = 4 m/s²",
      },
    ],
    valorCorreto: 4,
    unidade: "m/s²",
    toleranciaPercent: 2,
    explicacaoFinal:
      "A força resultante é a soma vetorial de todas as forças horizontais: Fres = 30 − 10 = 20 N (o atrito opõe-se ao movimento, então é subtraído). Pela 2ª Lei: a = Fres/m = 20/5 = 4 m/s².",
    faixasErro: [
      {
        min: 5.9,
        max: 6.1,
        diagnostico:
          "Você dividiu a força aplicada pelo quociente errado (30/5 = 6). Você ignorou o atrito, a força RESULTANTE é 30 − 10 = 20 N, não 30 N.",
      },
      {
        min: 7.9,
        max: 8.1,
        diagnostico:
          "Você somou as forças em vez de subtrair (30 + 10 = 40, 40/5 = 8). O atrito se opõe ao movimento, deve ser subtraído da força aplicada.",
      },
      {
        min: 1.9,
        max: 2.1,
        diagnostico:
          "Você usou só a força de atrito dividida pela massa (10/5 = 2). O atrito não é a força resultante, a resultante é a diferença entre a força aplicada e o atrito.",
      },
    ],
  },

  {
    id: "calc-lei2-d-01",
    assunto: "lei-2",
    subassunto: "Sistema com duas massas",
    dificuldade: "dificil",
    tags: ["sistema", "F = ma", "massa total"],
    enunciado:
      "Dois blocos, A (3 kg) e B (2 kg), estão ligados por um fio e puxados horizontalmente por uma força F = 25 N. Não há atrito. Calcule a aceleração do sistema.",
    dados: [
      { simbolo: "mA", valor: "3 kg" },
      { simbolo: "mB", valor: "2 kg" },
      { simbolo: "F", valor: "25 N" },
    ],
    formula: "a = F / (mA + mB)",
    passos: [
      {
        descricao: "Calcular a massa total do sistema",
        calculo: "mtotal = 3 + 2 = 5 kg",
      },
      {
        descricao: "Aplicar a 2ª Lei ao sistema inteiro",
        calculo: "a = F / mtotal = 25 / 5 = 5 m/s²",
      },
    ],
    valorCorreto: 5,
    unidade: "m/s²",
    toleranciaPercent: 2,
    explicacaoFinal:
      "Como os blocos estão ligados e se movem juntos, trata-se de um único sistema com massa total mA + mB = 5 kg. A força externa é F = 25 N. Pela 2ª Lei: a = F/mtotal = 25/5 = 5 m/s².",
    faixasErro: [
      {
        min: 8.2,
        max: 8.5,
        diagnostico:
          "Você dividiu F pela massa apenas do bloco A (25/3 ≈ 8,3). Quando dois corpos se movem juntos, a 2ª Lei se aplica à massa TOTAL do sistema: mA + mB = 5 kg.",
      },
      {
        min: 12.4,
        max: 12.6,
        diagnostico:
          "Você dividiu F pela massa apenas do bloco B (25/2 = 12,5). Os dois blocos se movem juntos, use a massa total: 3 + 2 = 5 kg.",
      },
      {
        min: 1.0,
        max: 1.1,
        diagnostico:
          "Você pode ter multiplicado as massas (3 × 2 = 6) ou feito outro cálculo errado. A massa do sistema é a SOMA das massas: 3 + 2 = 5 kg.",
      },
    ],
  },

  // ═══════════════════════ 3ª LEI ═══════════════════════

  {
    id: "calc-lei3-f-01",
    assunto: "lei-3",
    subassunto: "Par ação-reação, módulo da reação",
    dificuldade: "facil",
    tags: ["ação e reação", "par de forças"],
    enunciado:
      "Uma pessoa empurra uma parede com uma força de 150 N. Qual é o módulo da força que a parede exerce de volta sobre a pessoa?",
    dados: [{ simbolo: "Fação", valor: "150 N" }],
    formula: "|Freação| = |Fação|",
    passos: [
      {
        descricao: "Pela 3ª Lei de Newton, a força de reação tem o mesmo módulo da ação",
        calculo: "|Freação| = |Fação| = 150 N",
      },
    ],
    valorCorreto: 150,
    unidade: "N",
    toleranciaPercent: 2,
    explicacaoFinal:
      "A 3ª Lei estabelece que toda ação tem uma reação de igual módulo, mesma direção e sentido oposto. A pessoa empurra a parede com 150 N → a parede empurra a pessoa de volta com 150 N. O fato de a parede não se mover não muda a força que ela exerce.",
    faixasErro: [
      {
        min: 0,
        max: 1,
        diagnostico:
          "Você digitou zero, como se a parede não exercesse força. A 3ª Lei diz que toda ação gera uma reação de igual módulo, a parede imóvel ainda exerce 150 N sobre a pessoa.",
      },
      {
        min: 74,
        max: 76,
        diagnostico:
          "Você dividiu a força por 2 (75 N). A força de reação tem o MESMO módulo da ação, não metade.",
      },
      {
        min: 298,
        max: 302,
        diagnostico:
          "Você dobrou a força (300 N). A reação é igual à ação em módulo (150 N), não o dobro.",
      },
    ],
  },

  {
    id: "calc-lei3-m-01",
    assunto: "lei-3",
    subassunto: "Aceleração com par ação-reação e massas diferentes",
    dificuldade: "medio",
    tags: ["ação e reação", "aceleração", "massas diferentes"],
    enunciado:
      "Dois patinadores, A (60 kg) e B (40 kg), se empurram mutuamente. A força de interação entre eles é de 120 N. Calcule a aceleração do patinador B.",
    dados: [
      { simbolo: "mB", valor: "40 kg" },
      { simbolo: "F", valor: "120 N" },
    ],
    formula: "aB = F / mB",
    passos: [
      {
        descricao: "Pela 3ª Lei, a força sobre B tem módulo igual à força de interação",
        calculo: "FB = 120 N",
      },
      {
        descricao: "Aplicar a 2ª Lei a B",
        calculo: "aB = FB / mB = 120 / 40 = 3 m/s²",
      },
    ],
    valorCorreto: 3,
    unidade: "m/s²",
    toleranciaPercent: 2,
    explicacaoFinal:
      "A força sobre B é 120 N (pela 3ª Lei, igual em módulo à força de interação). Aplicando a 2ª Lei apenas ao patinador B: aB = 120/40 = 3 m/s². Note que a aceleração do patinador A seria diferente: aA = 120/60 = 2 m/s², pares ação-reação iguais produzem acelerações diferentes quando as massas diferem.",
    faixasErro: [
      {
        min: 1.9,
        max: 2.1,
        diagnostico:
          "Você calculou a aceleração do patinador A (120/60 = 2 m/s²). A questão pede a aceleração de B, cuja massa é 40 kg: aB = 120/40 = 3 m/s².",
      },
      {
        min: 1.19,
        max: 1.21,
        diagnostico:
          "Você dividiu a força pela massa TOTAL (120/100 = 1,2). Para a aceleração de B, use só a massa de B (40 kg), não a soma das massas.",
      },
    ],
  },

  {
    id: "calc-lei3-d-01",
    assunto: "lei-3",
    subassunto: "Propulsão por reação",
    dificuldade: "dificil",
    tags: ["ação e reação", "propulsão", "foguete"],
    enunciado:
      "Um foguete de 800 kg expele gases com uma força de reação de 16.000 N. Desconsidere a gravidade e o atrito. Qual é a aceleração inicial do foguete?",
    dados: [
      { simbolo: "m", valor: "800 kg" },
      { simbolo: "Freação", valor: "16.000 N" },
    ],
    formula: "a = F / m",
    passos: [
      {
        descricao:
          "A força que impulsiona o foguete é a força de reação dos gases expelidos (3ª Lei)",
        calculo: "F = 16.000 N",
      },
      {
        descricao: "Aplicar a 2ª Lei ao foguete",
        calculo: "a = F / m = 16.000 / 800 = 20 m/s²",
      },
    ],
    valorCorreto: 20,
    unidade: "m/s²",
    toleranciaPercent: 2,
    explicacaoFinal:
      "O foguete expele gases para trás (ação) e recebe uma força de reação para frente de 16.000 N (3ª Lei). Aplicando a 2ª Lei ao foguete: a = F/m = 16.000/800 = 20 m/s². Note que desconsideramos a gravidade para simplificar, num problema real, a força resultante seria F − Peso.",
    faixasErro: [
      {
        min: 12.799,
        max: 12.801,
        diagnostico:
          "Você pode ter usado uma massa diferente. Verifique: m = 800 kg, F = 16.000 N → a = 16.000 / 800 = 20 m/s².",
      },
      {
        min: 19.9,
        max: 20.1,
        diagnostico: "Correto! Sua resposta está dentro da margem de tolerância.",
      },
      {
        min: 0.049,
        max: 0.051,
        diagnostico:
          "Você inverteu a divisão (800/16.000 = 0,05). A fórmula é a = F/m, com a força no numerador.",
      },
    ],
  },
];
