export type FlashcardRating = "review" | "almost" | "mastered";

type Flashcard = {
  id: string;
  topic: string;
  prompt: string;
  answer: string;
  formula?: string;
};

export type FlashcardDeck = {
  id: "fundamentos" | "desafios";
  name: string;
  description: string;
  plusOnly: boolean;
  cards: readonly Flashcard[];
};

export const FLASHCARD_DECKS: readonly FlashcardDeck[] = [
  {
    id: "fundamentos",
    name: "Fundamentos de Mecânica",
    description: "Vetores, forças e as três Leis de Newton",
    plusOnly: false,
    cards: [
      {
        id: "fc-inercia",
        topic: "1ª Lei",
        prompt: "Por que o passageiro se inclina para a frente quando o ônibus freia?",
        answer:
          "Por inércia, o corpo do passageiro tende a manter a velocidade que tinha antes da freada, enquanto o ônibus reduz sua velocidade.",
        formula: "ΣF = 0  →  velocidade constante",
      },
      {
        id: "fc-resultante",
        topic: "Vetores",
        prompt: "Por que duas forças de 5 N nem sempre produzem uma resultante de 10 N?",
        answer:
          "Porque força é vetorial. A soma depende também da direção e do sentido: forças opostas podem se cancelar e forças perpendiculares formam uma diagonal.",
      },
      {
        id: "fc-segunda-lei",
        topic: "2ª Lei",
        prompt: "Se a força resultante dobra e a massa não muda, o que acontece com a aceleração?",
        answer:
          "A aceleração dobra. Para massa constante, força resultante e aceleração são diretamente proporcionais.",
        formula: "a = ΣF / m",
      },
      {
        id: "fc-normal",
        topic: "Contato",
        prompt: "A força normal é sempre igual ao peso?",
        answer:
          "Não. Ela é uma força de contato e assume o valor exigido pela dinâmica perpendicular à superfície. Em um elevador acelerado, por exemplo, pode superar ou ficar abaixo do peso.",
      },
      {
        id: "fc-atrito",
        topic: "Atrito",
        prompt: "Como o atrito estático se comporta antes de um objeto deslizar?",
        answer:
          "Ele se ajusta à tendência de deslizamento até um valor máximo. Não atua sempre com seu módulo máximo.",
        formula: "Fat,est ≤ μe · N",
      },
      {
        id: "fc-terceira-lei",
        topic: "3ª Lei",
        prompt: "Por que forças de ação e reação não se cancelam?",
        answer:
          "Porque atuam em corpos diferentes. Para calcular a resultante, somamos apenas as forças que agem sobre o mesmo corpo.",
      },
      {
        id: "fc-curva",
        topic: "Movimento",
        prompt: "Um carro pode acelerar mesmo com o velocímetro constante?",
        answer:
          "Sim. Em uma curva, a direção do vetor velocidade muda. Essa variação já caracteriza aceleração.",
      },
      {
        id: "fc-newton",
        topic: "Unidades",
        prompt: "O que significa dizer que uma força tem módulo de 1 newton?",
        answer:
          "Significa que ela pode produzir aceleração de 1 m/s² em uma massa de 1 kg, quando é a força resultante.",
        formula: "1 N = 1 kg · m/s²",
      },
      {
        id: "fc-impulso",
        topic: "Impulso",
        prompt: "Por que aumentar o tempo de uma colisão pode reduzir a força média?",
        answer:
          "Para a mesma variação de quantidade de movimento, distribuir o impulso por mais tempo reduz a força média.",
        formula: "I = Fmédia · Δt = Δp",
      },
      {
        id: "fc-peso-massa",
        topic: "Gravitação",
        prompt: "Qual é a diferença entre massa e peso?",
        answer:
          "Massa mede a inércia do corpo. Peso é a força gravitacional exercida sobre essa massa e depende do campo gravitacional local.",
        formula: "P = m · g",
      },
      {
        id: "fc-energia",
        topic: "Energia",
        prompt:
          "O que acontece com a energia potencial gravitacional durante uma queda sem resistência do ar?",
        answer:
          "Ela se transforma em energia cinética, enquanto a energia mecânica total permanece constante.",
        formula: "mgh + mv²/2 = constante",
      },
      {
        id: "fc-curva-forca",
        topic: "Movimento circular",
        prompt: "Para onde aponta a força resultante em uma curva uniforme?",
        answer:
          "Ela aponta para o centro da trajetória e muda continuamente a direção da velocidade.",
        formula: "Fc = m · v²/r",
      },
    ],
  },
  {
    id: "desafios",
    name: "Desafios integrados",
    description: "Sistemas, referenciais e peso aparente",
    plusOnly: true,
    cards: [],
  },
];
