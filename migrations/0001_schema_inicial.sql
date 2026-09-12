-- GRAVITYMIND, schema inicial do banco de dados (Cloudflare D1 / SQLite)
-- ----------------------------------------------------------------
-- Espelha os dados que hoje vivem só em localStorage, agora com dono
-- (user_id) e persistência real entre dispositivos.

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  senha_salt TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessoes (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expira_em TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_sessoes_user ON sessoes(user_id);

-- Respostas de questões de múltipla escolha (histórico completo)
CREATE TABLE IF NOT EXISTS respostas_questoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  questao_id TEXT NOT NULL,
  letra_escolhida TEXT NOT NULL,
  correta INTEGER NOT NULL, -- 0 ou 1
  tempo_segundos INTEGER NOT NULL,
  respondido_em TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_respostas_user ON respostas_questoes(user_id);

-- Respostas de questões de cálculo numérico
CREATE TABLE IF NOT EXISTS respostas_calculo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  questao_id TEXT NOT NULL,
  valor_digitado REAL NOT NULL,
  correta INTEGER NOT NULL,
  diagnostico TEXT,
  tempo_segundos INTEGER NOT NULL,
  respondido_em TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_respostas_calc_user ON respostas_calculo(user_id);

-- Anotações pessoais
CREATE TABLE IF NOT EXISTS notas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL DEFAULT '',
  assunto TEXT NOT NULL DEFAULT 'geral',
  criada_em TEXT NOT NULL,
  atualizada_em TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notas_user ON notas(user_id);

-- Histórico de versões de anotações (para restaurar)
CREATE TABLE IF NOT EXISTS notas_historico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nota_id TEXT NOT NULL REFERENCES notas(id) ON DELETE CASCADE,
  conteudo_anterior TEXT NOT NULL,
  salvo_em TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_notas_hist ON notas_historico(nota_id);

-- Progresso de lições (marcos concluídos: texto, resumo, visual, video, narracao, animacao)
CREATE TABLE IF NOT EXISTS progresso_licoes (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assunto TEXT NOT NULL,
  marco TEXT NOT NULL,
  concluido_em TEXT NOT NULL,
  PRIMARY KEY (user_id, assunto, marco)
);

-- Nível de dificuldade adaptativa atual, por assunto
CREATE TABLE IF NOT EXISTS dificuldade_adaptativa (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assunto TEXT NOT NULL,
  nivel TEXT NOT NULL,
  PRIMARY KEY (user_id, assunto)
);

-- Resultados de quiz de verificação de conteúdo
CREATE TABLE IF NOT EXISTS quiz_resultados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assunto TEXT NOT NULL,
  formato TEXT NOT NULL,
  acertos INTEGER NOT NULL,
  total INTEGER NOT NULL,
  aprovado INTEGER NOT NULL,
  respondido_em TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_quiz_user ON quiz_resultados(user_id);
