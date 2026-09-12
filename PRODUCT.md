# GRAVITYMIND: produto

## Produto

GRAVITYMIND e uma plataforma web de estudo ativo de Fisica para estudantes do ensino medio. O projeto nasce na Escola Tecnica Estadual Monteiro Lobato, o CIMOL, em Taquara, Rio Grande do Sul.

## Publico e contexto

- Estudantes brasileiros do ensino medio estudando Mecanica e as Tres Leis de Newton.
- Pessoas que precisam de sessoes curtas, menos distracoes e apoio explicito para manter o foco, inclusive estudantes com TDAH.
- Uso principal em navegador, de celular a desktop, com continuidade entre sessoes para quem possui conta.

## Trabalho central

O estudante resolve uma questao antes de receber a resposta, informa sua confianca, recebe uma explicacao ligada ao erro e pode tentar corrigir o raciocinio. O sistema intercala conteudos, recupera dificuldades e aumenta o desafio conforme o desempenho.

## Capacidades confirmadas

- Aulas das Tres Leis de Newton com diagramas e simulacoes.
- Questoes adaptativas e modo de dificuldade fixa.
- Quadro de resolucao com desenho, formas, texto, importacao segura e exportacao.
- Notas criptografadas, progresso e respostas sincronizados pelo Cloudflare D1 para usuarios autenticados.
- Tema claro e escuro, texto maior, movimento reduzido e modo foco.
- Flash cards, metas de estudo, ofensiva diaria e sequencia de acertos.
- Tutor virtual em tela cheia e em formato compacto nas demais rotas.
- Plano Plus com liberacao de recursos por permissao persistida no servidor.

## Posicionamento

GRAVITYMIND deve parecer uma bancada de estudo bem editada: preciso, concentrado e util. O produto se diferencia por usar confianca, segunda tentativa e analise pedagogica para transformar o erro em proximo passo concreto.

## Identidade e referencias aprovadas

- Nome de marca: GRAVITYMIND.
- Base visual: grafite profundo, bordas finas, tipografia nitida e microinteracoes contidas.
- Navegacao: limpeza e previsibilidade inspiradas nos menus da Apple, sem copiar sua marca.
- Marca geometrica: construcao modular inspirada na clareza da identidade da Alura.
- Contraste: profundidade de verdes inspirada no uso de cor da Starbucks, sem reproduzir seus elementos proprietarios.
- Objeto central da home: maca tridimensional procedural baseada na referencia fornecida pelo usuario.
- Regras detalhadas: `DESIGN.md` e as skills locais citadas no pedido.

## Verdade e limites

- Nao existem depoimentos, avaliacoes, parceiros, metricas de resultado ou numeros de usuarios fornecidos. A interface nao deve inventa-los.
- Preco, moeda, nome comercial final do Plano Plus e identificadores do provedor de pagamento nao foram fornecidos. A interface pode usar configuracao de ambiente e deve identificar qualquer valor demonstrativo.
- Pagamentos reais devem ser processados por pagina hospedada de um provedor PCI. O aplicativo nao armazena numero completo, CVC ou senha de cartao.
- O tutor depende de um provedor configurado no servidor. Sem essa configuracao, deve oferecer orientacao local ou um estado indisponivel honesto.
- A interface pode mostrar passos pedagogicos produzidos para o aluno, mas nao deve alegar expor raciocinio interno privado de um modelo.
- Recursos Plus sao liberados apenas por estado de assinatura validado no servidor.

## Stack e restricoes tecnicas

- TanStack Start, React 19, TypeScript e Tailwind CSS v4.
- Cloudflare Workers e D1.
- Animacao com GSAP e Motion, respeitando `prefers-reduced-motion` e a preferencia interna.
- Three.js para a maca procedural, isolado do restante da arvore React e pausado fora da viewport.
- Validacao no servidor, cookies de sessao inacessiveis ao JavaScript, queries parametrizadas e autorizacao por proprietario.
- Layout responsivo desde 320 px, navegacao por teclado e sem dependencia de movimento para compreender a interface.

## Evidencias fornecidas

- Capturas do estado atual de login, navegacao e pagina inicial.
- Referencia raster de uma maca vermelha frontal para forma, material, brilho, pintas e haste.
- Brief detalhado do usuario e historico de restricoes anti-template deste projeto.
