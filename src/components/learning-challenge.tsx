import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { LawAnimation } from "@/components/law-animation";

export function LearningChallenge() {
  const [answer, setAnswer] = useState<number | null>(null);
  return (
    <>
      <div className="mb-3 flex items-center gap-3 text-sm">
        <span className="font-semibold text-primary">Laboratório de ideias</span>
        <span className="text-muted-foreground">2ª Lei de Newton</span>
      </div>
      <h2 id="challenge-title" className="max-w-2xl text-3xl font-semibold leading-tight">
        Mesma força. O dobro da massa.
        <br className="hidden sm:block" /> O que acontece com a aceleração?
      </h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Faça uma previsão antes de experimentar. Considere a mesma força resultante nos dois casos.
      </p>
      <fieldset className="mt-5">
        <legend className="sr-only">Sua previsão sobre a aceleração</legend>
        <div className="flex flex-wrap gap-2">
          {["Dobra", "Cai pela metade", "Não muda"].map((label, index) => (
            <button
              type="button"
              key={label}
              aria-pressed={answer === index}
              onClick={() => setAnswer(index)}
              className={`min-h-11 border px-4 text-sm ${answer === index ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
      {answer !== null && (
        <div role="status" className="mt-4 border-y border-border py-4 text-sm leading-relaxed">
          <strong>
            {answer === 1 ? "Isso: a aceleração cai pela metade." : "Observe a relação a = F/m."}
          </strong>{" "}
          Mantendo F, dobrar m divide a aceleração por dois. Compare agora os blocos na simulação.
        </div>
      )}
      <div className="mt-6">
        <LawAnimation assunto="lei-2" />
      </div>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        <Link to="/lei-2" className="font-semibold text-primary underline underline-offset-4">
          Estudar a explicação
        </Link>
        <Link
          to="/questoes"
          search={{ assunto: "lei-2" }}
          className="text-primary underline underline-offset-4"
        >
          Aplicar em uma questão
        </Link>
      </div>
    </>
  );
}
