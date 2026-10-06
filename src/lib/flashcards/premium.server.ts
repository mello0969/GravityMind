import "@tanstack/react-start/server-only";
import type { FlashcardDeck } from "./decks";
export const PREMIUM_DECK: FlashcardDeck = {
  id: "desafios",
  name: "Desafios integrados",
  description: "Sistemas, referenciais e peso aparente",
  plusOnly: true,
  cards: [
    {
      id: "fc-plus-elevador",
      topic: "Peso aparente",
      prompt:
        "Qual equação organiza as forças sobre uma pessoa em um elevador que acelera para cima?",
      answer:
        "Escolhendo para cima como positivo, a normal supera o peso e a diferença produz a aceleração.",
      formula: "N − mg = ma",
    },
    {
      id: "fc-plus-blocos",
      topic: "Sistemas",
      prompt: "Qual é a primeira decisão ao resolver dois blocos em contato?",
      answer:
        "Tratar os blocos como um sistema para achar a aceleração comum. Depois, isolar um deles para encontrar a força de contato.",
    },
    {
      id: "fc-plus-referencial",
      topic: "Referenciais",
      prompt: "Quando um referencial deixa de ser inercial?",
      answer:
        "Quando ele acelera ou gira em relação a um referencial inercial. Nesse caso, forças de inércia podem ser introduzidas para descrever o movimento dentro dele.",
    },
    {
      id: "fc-plus-plano",
      topic: "Plano inclinado",
      prompt: "Qual componente do peso acelera um bloco ao longo de um plano inclinado sem atrito?",
      answer:
        "A componente paralela ao plano. A componente perpendicular é equilibrada pela normal.",
      formula: "P∥ = mg · sen θ",
    },
    {
      id: "fc-plus-foguete",
      topic: "Propulsão",
      prompt: "Por que um foguete não precisa empurrar o ar para acelerar?",
      answer:
        "Ele empurra os próprios gases para trás e recebe deles uma força para frente. O par de interação existe mesmo no vácuo.",
    },
  ],
};
