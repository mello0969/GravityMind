import { createFileRoute } from "@tanstack/react-router";
import { type LessonContent, NewtonLesson } from "@/components/newton-lesson";

const lesson: LessonContent = {
  number: "2ª",
  title: "Princípio Fundamental da Dinâmica",
  subtitle: "Como uma força altera o movimento de um corpo?",
  statement:
    "A força resultante que atua sobre um corpo é igual ao produto da sua massa pela aceleração que ele adquire.",
  summary: {
    keyPoint: "Mais força = mais aceleração. Mais massa = menos aceleração para a mesma força.",
    bullets: [
      "Fórmula: F = m · a. A força resultante determina diretamente a aceleração.",
      "1 Newton (N) é a força que acelera 1 kg a 1 m/s².",
      "A aceleração tem a mesma direção e sentido da força resultante.",
      "Várias forças? Some todas como vetores. O que importa é a resultante.",
    ],
  },
  formula: "F = m · a",
  paragraphs: [
    "A 2ª Lei de Newton estabelece a relação quantitativa entre força, massa e aceleração. Quanto maior a força aplicada em um corpo, maior será sua aceleração. Por outro lado, quanto maior a massa, menor será a aceleração para a mesma força.",
    "A unidade de força no SI é o Newton (N). 1 N é a força necessária para acelerar 1 kg a 1 m/s². A aceleração tem sempre a mesma direção e o mesmo sentido da força resultante.",
    "Quando várias forças atuam sobre um corpo, é a soma vetorial delas, chamada de força resultante, que determina o comportamento do movimento.",
  ],
  examples: [
    {
      title: "Empurrando um carrinho",
      desc: "Quanto mais forte você empurra, mais rápido ele acelera.",
    },
    {
      title: "Carrinho cheio vs vazio",
      desc: "Com a mesma força aplicada, o carrinho cheio (mais massa) acelera menos.",
    },
    {
      title: "Queda livre",
      desc: "A força da gravidade gera aceleração de aproximadamente 9,8 m/s² em qualquer corpo.",
    },
    {
      title: "Frenagem",
      desc: "Os freios aplicam uma força contrária ao movimento, gerando aceleração negativa.",
    },
  ],
  prev: { to: "/lei-1", label: "Anterior: 1ª Lei" },
  next: { to: "/lei-3", label: "Próxima: 3ª Lei" },
};

export const Route = createFileRoute("/lei-2")({
  head: () => ({
    meta: [
      { title: "2ª Lei de Newton, F = m·a | GRAVITYMIND" },
      {
        name: "description",
        content: "Aprenda a 2ª Lei de Newton com texto narrado em áudio e vídeo-aula.",
      },
    ],
  }),
  component: () => <NewtonLesson lesson={lesson} />,
});
