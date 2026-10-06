# Tutor e segurança

## Groq
O Tutor usa a Groq, sem fallback para a API paga da OpenAI.
Uma chave enviada em conversa deve ser revogada no painel do respectivo provedor e substituída.
Configure GROQ_API_KEY apenas no servidor. Não use prefixo VITE_.
No desenvolvimento, o campo foi preparado em .env.development, ignorado pelo Git.
Em produção use `wrangler secret put GROQ_API_KEY`, sem publicar o arquivo local.
GROQ_MODEL tem como padrão openai/gpt-oss-20b, executado pela Groq, não pela API da OpenAI.
Crie a conta no plano Free em https://console.groq.com/keys. Não ative Developer nem adicione pagamento para este uso gratuito.
A configuração do código não verifica o plano de cobrança da conta: confirme Free no painel.

O Tutor usa POST https://api.groq.com/openai/v1/responses, store:false, saída limitada a 1024 tokens e timeout de 25 segundos.
O orçamento inclui a geração de raciocínio do modelo, configurada em esforço baixo; somente o texto da resposta é entregue ao estudante.
O navegador recebe somente o texto filtrado ou um erro genérico, nunca a resposta completa do provedor.
Limites: 20 mensagens por conta/10 min, 40 por IP/10 min, 80 por conta/dia e 300 no site/dia.
As janelas são fixas. As cotas da Groq, inclusive tokens por minuto/dia, valem para toda a organização e podem limitar o site antes dessas janelas.
O HTTP 429 gera uma mensagem de limite de uso, sem retentativas automáticas ou troca para provedor pago.
Não há ferramentas para o modelo consultar ou modificar o banco.
Histórico limitado às últimas 11 mensagens; conversa apenas na memória da página.
Não há fine-tuning nem treinamento feito com mensagens dos estudantes.
As instruções pedagógicas e o conteúdo autoral estão em src/lib/gravity/teaching.ts.
Os testes regulares do adaptador são simulados. Após configurar a chave, `npm run test:tutor:live` faz uma consulta real e limitada usando o mesmo adaptador do servidor.
Sem chave Groq, não é possível validar uma resposta real. Qualidade pedagógica exige também revisão das respostas pelo professor.
O provedor pode reter mensagens para investigação de abuso e falhas; confira https://console.groq.com/docs/your-data.

## Dados
Supabase PostgreSQL é acessado somente pelo servidor, com Secret key fora do bundle público.
As 14 tabelas têm RLS e bloqueiam anon/authenticated. A autenticação própria foi preservada.
A service_role ignora RLS; o servidor obrigatoriamente obtém o usuário da sessão e filtra por proprietário.
Consultas usam o SDK estruturado e RPCs privadas, sem SQL fornecido pelo navegador.
Veja banco-de-dados.md para distinguir esse modelo de uma aplicação que usa Supabase Auth e auth.uid().
Notas sincronizadas usam AES-256-GCM com contexto de usuário/nota/campo; sem chave o envio é bloqueado.
A chave local de criptografia foi criada em .env.local sem exibição do seu valor. Não a troque se já houver dados criptografados.
Cópias antigas em texto simples ainda podem ser lidas para compatibilidade; uma migração de dados antigos em produção precisa de backup e validação.
O cache local agora é separado por conta. Não é criptografia do navegador: alguém com acesso ao perfil do navegador pode ler localStorage.
Os dados antigos sem proprietário foram preservados na área de visitante, sem enviá-los automaticamente a outra conta.
O exportador inclui apenas a área atual e as preferências do aparelho.
Dados de estudo enviados pelo cliente são registros de autoestudo, não prova antifraude de desempenho.

## Contas
Senhas: PBKDF2-HMAC-SHA256, salt aleatório, 600 mil iterações e comparação constante.
Cookies de sessão: HttpOnly, SameSite=Strict; Secure e prefixo __Host- em produção.
Tokens aleatórios são guardados no banco apenas como hash, com expiração de 14 dias.
Login e cadastro limitados separadamente por IP e identidade; Turnstile validado no servidor.
O modo de teste do Turnstile só é permitido em desenvolvimento local.
Os campos recebidos usam schemas estritos, sem atribuição indiscriminada de propriedades.

## Transporte e limites
HTTPS/HSTS fora do localhost; headers anti-frame, MIME sniffing, permissões e política de origem.
Pedidos com corpo acima de 1,1 MB são rejeitados, inclusive sem Content-Length.
Não há endpoint público para upload arbitrário. Importação de imagem do quadro valida tipo, assinatura, tamanho e dimensões.
O deck exclusivo do Plus só é entregue após conferir assinatura ativa no servidor.
A CSP ainda permite scripts inline exigidos pela integração atual do framework; isso não substitui prevenção de XSS.
Notas e mensagens são renderizadas como texto; não executar HTML fornecido por usuário/modelo.

## Pendências de publicação
O diretório não é um repositório Git. O scanner verificou arquivos atuais, mas não há histórico local para limpar.
Nenhuma chave pode ser considerada revogada por apagar um arquivo: a revogação é feita no provedor.
O projeto Supabase GRAVITYMIND foi criado em 26/09/2026. O D1 remoto e local foram preservados.
Configurar origem HTTPS e chaves reais de Turnstile e Groq antes de publicar o Worker.
O desenvolvimento passa a usar o Supabase indicado em SUPABASE_URL; confira a Secret key antes de testar.
Configurar Stripe antes de disponibilizar cobrança e Sentry antes de ativar observabilidade.
Os textos legais existentes são informativos e precisam de revisão pelo responsável antes da publicação.
Validar limites de CPU e hashing no Worker publicado. Consulte supabase-verification.md para os testes da migracao.

## Referências
- https://console.groq.com/docs/responses-api
- https://console.groq.com/docs/rate-limits
- https://console.groq.com/docs/your-data
- https://developers.cloudflare.com/d1/best-practices/query-d1/
- https://developers.cloudflare.com/d1/reference/data-security/
- https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- https://www.alura.com.br/challenges
- https://creative.starbucks.com/color/
- https://www.apple.com/br/
