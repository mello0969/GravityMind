-- Preserve the learning signals used by adaptive review and rewards.

ALTER TABLE respostas_questoes
ADD COLUMN confianca TEXT CHECK (confianca IS NULL OR confianca IN ('baixa', 'media', 'alta'));

ALTER TABLE respostas_questoes
ADD COLUMN corrigida INTEGER NOT NULL DEFAULT 0 CHECK (corrigida IN (0, 1));
