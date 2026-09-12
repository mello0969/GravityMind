-- Persistent study profile, idempotent reward events and Plus entitlement.

CREATE TABLE IF NOT EXISTS perfis_estudo (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  meta_diaria INTEGER NOT NULL DEFAULT 5 CHECK (meta_diaria BETWEEN 1 AND 40),
  ofensiva_dias INTEGER NOT NULL DEFAULT 0 CHECK (ofensiva_dias >= 0),
  ultimo_estudo_em TEXT,
  sequencia_acertos INTEGER NOT NULL DEFAULT 0 CHECK (sequencia_acertos >= 0),
  melhor_sequencia INTEGER NOT NULL DEFAULT 0 CHECK (melhor_sequencia >= 0),
  total_xp INTEGER NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS atividade_estudo (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  data_local TEXT NOT NULL,
  respostas INTEGER NOT NULL DEFAULT 0 CHECK (respostas >= 0),
  acertos INTEGER NOT NULL DEFAULT 0 CHECK (acertos >= 0),
  xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
  PRIMARY KEY (user_id, data_local)
);

CREATE TABLE IF NOT EXISTS eventos_recompensa (
  id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  correta INTEGER NOT NULL CHECK (correta IN (0, 1)),
  corrigida INTEGER NOT NULL CHECK (corrigida IN (0, 1)),
  xp INTEGER NOT NULL CHECK (xp BETWEEN 0 AND 100),
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, id)
);

CREATE TABLE IF NOT EXISTS assinaturas (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  plano TEXT NOT NULL DEFAULT 'free' CHECK (plano IN ('free', 'plus')),
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'past_due', 'canceled')),
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  valida_ate TEXT,
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_atividade_estudo_user_data
ON atividade_estudo(user_id, data_local DESC);

CREATE INDEX IF NOT EXISTS idx_eventos_recompensa_user_data
ON eventos_recompensa(user_id, criado_em DESC);

PRAGMA optimize;
