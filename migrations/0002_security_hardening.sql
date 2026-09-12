-- Security controls and query indexes for Cloudflare D1.

CREATE TABLE IF NOT EXISTS rate_limits (
  chave_hash TEXT NOT NULL,
  janela_inicio TEXT NOT NULL,
  requisicoes INTEGER NOT NULL DEFAULT 1 CHECK (requisicoes >= 0),
  expira_em TEXT NOT NULL,
  PRIMARY KEY (chave_hash, janela_inicio)
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_expira
ON rate_limits(expira_em);

CREATE UNIQUE INDEX IF NOT EXISTS idx_respostas_questoes_evento
ON respostas_questoes(user_id, questao_id, respondido_em);

CREATE UNIQUE INDEX IF NOT EXISTS idx_respostas_calculo_evento
ON respostas_calculo(user_id, questao_id, respondido_em);

CREATE UNIQUE INDEX IF NOT EXISTS idx_quiz_resultados_evento
ON quiz_resultados(user_id, assunto, formato, respondido_em);

CREATE INDEX IF NOT EXISTS idx_sessoes_expira
ON sessoes(expira_em);

CREATE INDEX IF NOT EXISTS idx_notas_user_atualizada
ON notas(user_id, atualizada_em DESC);

PRAGMA optimize;

