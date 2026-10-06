PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS "d1_migrations"(
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		name       TEXT UNIQUE,
		applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  senha_salt TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE sessoes (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expira_em TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE respostas_questoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  questao_id TEXT NOT NULL,
  letra_escolhida TEXT NOT NULL,
  correta INTEGER NOT NULL, 
  tempo_segundos INTEGER NOT NULL,
  respondido_em TEXT NOT NULL
, confianca TEXT CHECK (confianca IS NULL OR confianca IN ('baixa', 'media', 'alta')), corrigida INTEGER NOT NULL DEFAULT 0 CHECK (corrigida IN (0, 1)));
CREATE TABLE respostas_calculo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  questao_id TEXT NOT NULL,
  valor_digitado REAL NOT NULL,
  correta INTEGER NOT NULL,
  diagnostico TEXT,
  tempo_segundos INTEGER NOT NULL,
  respondido_em TEXT NOT NULL
);
CREATE TABLE notas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL DEFAULT '',
  assunto TEXT NOT NULL DEFAULT 'geral',
  criada_em TEXT NOT NULL,
  atualizada_em TEXT NOT NULL
);
CREATE TABLE notas_historico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nota_id TEXT NOT NULL REFERENCES notas(id) ON DELETE CASCADE,
  conteudo_anterior TEXT NOT NULL,
  salvo_em TEXT NOT NULL
);
CREATE TABLE progresso_licoes (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assunto TEXT NOT NULL,
  marco TEXT NOT NULL,
  concluido_em TEXT NOT NULL,
  PRIMARY KEY (user_id, assunto, marco)
);
CREATE TABLE dificuldade_adaptativa (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assunto TEXT NOT NULL,
  nivel TEXT NOT NULL,
  PRIMARY KEY (user_id, assunto)
);
CREATE TABLE quiz_resultados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assunto TEXT NOT NULL,
  formato TEXT NOT NULL,
  acertos INTEGER NOT NULL,
  total INTEGER NOT NULL,
  aprovado INTEGER NOT NULL,
  respondido_em TEXT NOT NULL
);
CREATE TABLE rate_limits (
  chave_hash TEXT NOT NULL,
  janela_inicio TEXT NOT NULL,
  requisicoes INTEGER NOT NULL DEFAULT 1 CHECK (requisicoes >= 0),
  expira_em TEXT NOT NULL,
  PRIMARY KEY (chave_hash, janela_inicio)
);
ANALYZE sqlite_schema;
CREATE TABLE perfis_estudo (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  meta_diaria INTEGER NOT NULL DEFAULT 5 CHECK (meta_diaria BETWEEN 1 AND 40),
  ofensiva_dias INTEGER NOT NULL DEFAULT 0 CHECK (ofensiva_dias >= 0),
  ultimo_estudo_em TEXT,
  sequencia_acertos INTEGER NOT NULL DEFAULT 0 CHECK (sequencia_acertos >= 0),
  melhor_sequencia INTEGER NOT NULL DEFAULT 0 CHECK (melhor_sequencia >= 0),
  total_xp INTEGER NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE atividade_estudo (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data_local TEXT NOT NULL,
  respostas INTEGER NOT NULL DEFAULT 0 CHECK (respostas >= 0),
  acertos INTEGER NOT NULL DEFAULT 0 CHECK (acertos >= 0),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  PRIMARY KEY (user_id, data_local)
);
CREATE TABLE eventos_recompensa (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  correta INTEGER NOT NULL CHECK (correta IN (0, 1)),
  corrigida INTEGER NOT NULL CHECK (corrigida IN (0, 1)),
  xp INTEGER NOT NULL CHECK (xp BETWEEN 0 AND 100),
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, id)
);
CREATE TABLE assinaturas (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  plano TEXT NOT NULL DEFAULT 'free' CHECK (plano IN ('free', 'plus')),
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'past_due', 'canceled')),
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  valida_ate TEXT,
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);
DELETE FROM sqlite_sequence;
CREATE INDEX idx_sessoes_user ON sessoes(user_id);
CREATE INDEX idx_respostas_user ON respostas_questoes(user_id);
CREATE INDEX idx_respostas_calc_user ON respostas_calculo(user_id);
CREATE INDEX idx_notas_user ON notas(user_id);
CREATE INDEX idx_notas_hist ON notas_historico(nota_id);
CREATE INDEX idx_quiz_user ON quiz_resultados(user_id);
CREATE INDEX idx_rate_limits_expira
ON rate_limits(expira_em);
CREATE UNIQUE INDEX idx_respostas_questoes_evento
ON respostas_questoes(user_id, questao_id, respondido_em);
CREATE UNIQUE INDEX idx_respostas_calculo_evento
ON respostas_calculo(user_id, questao_id, respondido_em);
CREATE UNIQUE INDEX idx_quiz_resultados_evento
ON quiz_resultados(user_id, assunto, formato, respondido_em);
CREATE INDEX idx_sessoes_expira
ON sessoes(expira_em);
CREATE INDEX idx_notas_user_atualizada
ON notas(user_id, atualizada_em DESC);
CREATE INDEX idx_atividade_estudo_user_data
ON atividade_estudo(user_id, data_local DESC);
CREATE INDEX idx_eventos_recompensa_user_data
ON eventos_recompensa(user_id, criado_em DESC);