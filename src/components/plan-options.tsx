import { Link } from "@tanstack/react-router";
import { ShaderPlanSurface } from "@/components/shader-plan-surface";
import { useAuth } from "@/lib/auth/use-auth";
import { usePlan } from "@/lib/billing/use-plan";

export const PLAN_FEATURES = [
  ["Aulas e simulações de Mecânica", "Incluído", "Incluído"],
  ["Questões de dificuldade fixa e revisão de erros", "Incluído", "Incluído"],
  ["Quadro, calculadora, anotações e progresso", "Incluído", "Incluído"],
  ["Flash Cards de fundamentos", "12 cartões", "12 cartões"],
  ["Prática com dificuldade adaptativa", "Incluído", "Incluído"],
  ["Tutor de IA", "Com conta e limite de uso", "Com conta e limite de uso"],
  ["Deck de desafios integrados", "Não incluído", "5 cartões"],
] as const;

export function PlanOptions({ actions = false }: { actions?: boolean }) {
  const { usuario } = useAuth();
  const { hasPlus } = usePlan();
  return (
    <div className="gm-plan-options">
      <article className="gm-plan">
        <h3>Essencial</h3>
        <p>Uma base para começar e criar seu ritmo de estudo.</p>
        <strong className="gm-plan-price">Gratuito</strong>
        <ul>
          <li>Aulas e simulações de Mecânica</li>
          <li>Prática adaptativa e questões de nível fixo</li>
          <li>Flash Cards de fundamentos</li>
          <li>Quadro, calculadora, anotações e progresso</li>
        </ul>
        <p className="gm-plan-exclusion">Tutor de IA incluído, com conta e limites de uso.</p>
        {actions && (
          <Link to={usuario ? "/aulas" : "/cadastro"} className="ff-btn-outline">
            {usuario ? "Ir para meus estudos" : "Começar grátis"}
          </Link>
        )}
      </article>
      <article className="gm-plan gm-plan-plus">
        <ShaderPlanSurface />
        <div className="gm-plan-content">
          <h3>Plus{hasPlus && <span className="gm-plan-label">Seu plano</span>}</h3>
          <p>Desafios adicionais para conectar o que você aprendeu.</p>
          <strong className="gm-plan-price">Revisão avançada</strong>
          <ul>
            <li>Todos os recursos do Essencial</li>
            <li>Tutor de IA para orientar suas resoluções</li>
            <li>Dificuldade adaptativa conforme seu desempenho</li>
            <li>Flash Cards com desafios integrados</li>
          </ul>
          <p className="gm-plan-exclusion">Consulte valor e condições antes de assinar.</p>
          {actions && (
            <Link to={hasPlus ? "/tutor" : "/plus"} className="ff-btn-primary">
              {hasPlus ? "Abrir meu Tutor" : "Conhecer o Plus"}
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
