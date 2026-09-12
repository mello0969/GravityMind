/**
 * Converte o perfil de aprendizagem real (já calculado por
 * lib/profile/engine.ts) em uma frase compacta para o system prompt do
 * Gravity. Não inventa nada: só descreve em texto os mesmos dados que
 * já aparecem no dashboard.
 */
import { montarPerfilAprendizagem } from "@/lib/profile/engine";
import { ASSUNTO_LABEL } from "@/lib/questions/types";

export function gerarResumoPerfilParaGravity(): string | undefined {
  const perfil = montarPerfilAprendizagem();

  if (perfil.totalRespostas === 0) {
    return "O aluno ainda não respondeu nenhuma questão na plataforma.";
  }

  const partes: string[] = [];

  if (perfil.dominados.length > 0) {
    const lista = perfil.dominados
      .map(
        (d) =>
          `${ASSUNTO_LABEL[d.assunto as keyof typeof ASSUNTO_LABEL]} (${d.taxaAcerto}% de acerto)`,
      )
      .join(", ");
    partes.push(`domina bem: ${lista}`);
  }

  if (perfil.precisamRevisao.length > 0) {
    const lista = perfil.precisamRevisao
      .map(
        (d) =>
          `${ASSUNTO_LABEL[d.assunto as keyof typeof ASSUNTO_LABEL]} (${d.taxaAcerto}% de acerto)`,
      )
      .join(", ");
    partes.push(`tem dificuldade em: ${lista}`);
  }

  if (partes.length === 0) {
    return `O aluno já respondeu ${perfil.totalRespostas} questões, mas ainda não há dados suficientes por assunto para identificar pontos fortes/fracos.`;
  }

  return `O aluno já respondeu ${perfil.totalRespostas} questões. Com base nisso, ${partes.join("; ")}.`;
}
