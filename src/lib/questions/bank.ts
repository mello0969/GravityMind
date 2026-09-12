/**
 * Sistema de Questões, Banco
 * ----------------------------------------------------------------
 * DE ONDE VÊM AS QUESTÕES, análise das estratégias possíveis:
 *
 * 1) Banco próprio em JSON/TS (ESCOLHIDO)
 *    + Controle pedagógico total: cada explicação é escrita e revisada
 *      por quem entende o erro conceitual que está sendo ensinado.
 *    + Sem custo de API, sem latência, funciona offline.
 *    + Fácil de versionar e fazer code review (é só um arquivo de dados).
 *    - Escala manualmente: criar 1000 questões boas exige trabalho humano.
 *    - Não se adapta automaticamente a assuntos fora do escopo do banco.
 *
 * 2) Cadastro manual via painel admin
 *    + Mesmo controle de qualidade do banco próprio, mas sem precisar
 *      editar código, um professor poderia cadastrar direto na UI.
 *    - Exige construir um CRUD e validação antes de ter qualquer conteúdo.
 *    - No MVP isso é puro custo de desenvolvimento sem ganho imediato.
 *
 * 3) Banco SQL / NoSQL
 *    + Necessário no momento em que houver multi-usuário real, busca por
 *      tags em escala, ou edição concorrente.
 *    - Hoje não há backend (decisão já tomada: tudo client-side/mock).
 *      Adicionar um banco agora seria infraestrutura sem necessidade real.
 *
 * 4) API externa de questões
 *    + Volume pronto, zero esforço de criação de conteúdo.
 *    - Risco de licenciamento/direitos autorais sobre questões de terceiros.
 *    - Gabarito explicativo raramente vem no nível de detalhe pedagógico
 *      que este produto promete (explicar CADA alternativa errada).
 *    - Dependência de serviço externo e de tradução/adequação ao currículo PT-BR.
 *
 * 5) Geração por IA em tempo real
 *    + Volume infinito, personalização por aluno.
 *    - Risco de erro conceitual de física não revisado, grave em uma
 *      plataforma cujo diferencial é justamente explicar o porquê certo.
 *    - Custo e latência por questão gerada.
 *    - Mais adequado como COMPLEMENTO depois que o banco próprio validar
 *      o formato (ex: gerar variações de uma questão já revisada por humano).
 *
 * DECISÃO: banco próprio (1) como fundação, é o que garante qualidade
 * pedagógica e gabarito explicativo confiável, que é o objetivo central
 * do produto. (2) entra depois como ferramenta de autoria. (5) entra
 * depois como gerador de VARIAÇÕES sobre questões-modelo já aprovadas,
 * nunca como fonte primária de conceitos físicos não revisados.
 *
 * ESTRUTURA DE ARMAZENAMENTO (ver types.ts):
 * Questao { id, assunto, subassunto, dificuldade, tags, enunciado,
 *           formula?, alternativas[{letra, texto, explicacao}], correta }
 *, cada alternativa já carrega sua própria explicação, então o gabarito
 * explicativo completo nunca precisa ser "montado" depois: nasce com a questão.
 */

import type { Questao } from "./types";

export const QUESTOES: Questao[] = [
  // ───────────────────────── 1ª LEI, FÁCIL ─────────────────────────
  {
    id: "lei1-f-01",
    assunto: "lei-1",
    subassunto: "Conceito de inércia",
    dificuldade: "facil",
    tags: ["inércia", "repouso", "conceito"],
    enunciado:
      "Um livro está em repouso sobre uma mesa, e nenhuma força horizontal atua sobre ele. De acordo com a 1ª Lei de Newton, o que acontece com o livro?",
    alternativas: [
      {
        letra: "A",
        texto: "Ele permanece em repouso indefinidamente.",
        explicacao:
          "Correto. O Princípio da Inércia diz que um corpo em repouso permanece em repouso a menos que uma força resultante atue sobre ele. Como não há força horizontal resultante, o livro não tem motivo para sair do lugar, ele simplesmente continua parado.",
      },
      {
        letra: "B",
        texto: "Ele começa a se mover sozinho, pois todo corpo tende a se mover.",
        explicacao:
          "Errado. Essa é exatamente a inversão da 1ª Lei: o corpo tende a manter seu ESTADO atual, e o estado dele é repouso. Não existe uma tendência universal ao movimento, o que existe é a tendência a continuar fazendo o que já estava fazendo.",
      },
      {
        letra: "C",
        texto: "Ele acelera lentamente por causa do seu próprio peso.",
        explicacao:
          "Errado. O peso é uma força vertical, equilibrada pela força normal da mesa. Essa confusão mistura forças verticais (que já estão em equilíbrio) com a ausência de força horizontal, que é o que de fato garante o repouso aqui.",
      },
      {
        letra: "D",
        texto: "Ele permanece em repouso apenas enquanto alguém o observa.",
        explicacao:
          "Errado. A Física não depende de observação para acontecer. Esse erro confunde um conceito de física clássica com ideias (equivocadas, neste contexto) de mecânica quântica sobre observação, que não se aplicam aqui.",
      },
    ],
    correta: "A",
  },
  {
    id: "lei1-f-02",
    assunto: "lei-1",
    subassunto: "Identificação de exemplos",
    dificuldade: "facil",
    tags: ["inércia", "cotidiano"],
    enunciado: "Em qual situação a inércia do corpo é o motivo direto do que ocorre?",
    alternativas: [
      {
        letra: "A",
        texto:
          "Um carrinho de compras fica mais difícil de empurrar quando carregado de itens pesados.",
        explicacao:
          "Errado. Essa situação envolve principalmente a relação entre força e massa para produzir aceleração (2ª Lei), não a tendência de manter o estado de movimento sem força aplicada.",
      },
      {
        letra: "B",
        texto:
          "Ao puxar rapidamente uma toalha de baixo de copos parados, os copos quase não se movem.",
        explicacao:
          "Correto. Os copos estavam em repouso e, como a força de atrito atua por um tempo muito curto durante a puxada rápida, eles tendem a permanecer parados, é a inércia se manifestando como resistência à mudança do estado de repouso.",
      },
      {
        letra: "C",
        texto: "Uma bola lançada para cima desce de volta ao solo.",
        explicacao:
          "Errado. Esse movimento é causado pela força peso (gravidade) atuando continuamente sobre a bola, mudando sua velocidade, isso é justamente o OPOSTO de inércia, é a presença de uma força resultante não nula.",
      },
      {
        letra: "D",
        texto: "Dois patinadores se empurram e saem em direções opostas.",
        explicacao:
          "Errado. Essa é uma aplicação clássica da 3ª Lei de Newton (ação e reação), não da 1ª. O par de forças mútuas é o ponto central aqui, não a tendência a manter o estado de movimento.",
      },
    ],
    correta: "B",
  },

  // ───────────────────────── 1ª LEI, MÉDIO ─────────────────────────
  {
    id: "lei1-m-01",
    assunto: "lei-1",
    subassunto: "Equilíbrio de forças",
    dificuldade: "medio",
    tags: ["inércia", "equilíbrio", "força resultante"],
    enunciado:
      "Um bloco se move em linha reta sobre uma superfície horizontal com velocidade constante de 4 m/s. O que se pode concluir sobre a força resultante sobre o bloco?",
    formula: "ΣF = 0",
    alternativas: [
      {
        letra: "A",
        texto: "A força resultante é nula, pois a velocidade é constante.",
        explicacao:
          "Correto. Pela 1ª Lei, um corpo só mantém velocidade constante (em módulo, direção e sentido) quando a força resultante sobre ele é zero. Isso não significa ausência de forças individuais, significa que elas se cancelam (ex: força motora e atrito se equilibram).",
      },
      {
        letra: "B",
        texto: "A força resultante aumenta proporcionalmente à velocidade.",
        explicacao:
          "Errado. Esse raciocínio confunde força com velocidade. Pela 2ª Lei, força resultante se relaciona com ACELERAÇÃO (F = m·a), não com velocidade diretamente. Velocidade constante implica aceleração zero, e portanto força resultante zero, o oposto do que a alternativa afirma.",
      },
      {
        letra: "C",
        texto: "Não existe nenhuma força atuando sobre o bloco.",
        explicacao:
          "Errado. Forças individuais (como peso, normal, atrito, força motora) podem perfeitamente existir e atuar sobre o bloco. O que a 1ª Lei garante é que a SOMA vetorial delas é zero, não que elas estejam ausentes.",
      },
      {
        letra: "D",
        texto: "A força resultante é constante e igual ao peso do bloco.",
        explicacao:
          "Errado. O peso é apenas uma das forças verticais, equilibrada pela normal. Ele não determina a força resultante HORIZONTAL, que é a relevante para o movimento retilíneo descrito. A força resultante total continua sendo zero.",
      },
    ],
    correta: "A",
  },
  {
    id: "lei1-m-02",
    assunto: "lei-1",
    subassunto: "Inércia e massa",
    dificuldade: "medio",
    tags: ["inércia", "massa"],
    enunciado:
      "Por que é mais difícil mudar a direção do movimento de um caminhão carregado do que de uma motocicleta, mesmo que ambos estejam à mesma velocidade?",
    alternativas: [
      {
        letra: "A",
        texto: "Porque o caminhão tem mais massa, e por isso tem maior inércia.",
        explicacao:
          "Correto. A inércia é diretamente proporcional à massa: quanto maior a massa, maior a resistência do corpo a qualquer mudança no seu estado de movimento (seja em módulo, direção ou sentido da velocidade). Mais massa exige mais força para produzir a mesma mudança.",
      },
      {
        letra: "B",
        texto: "Porque o caminhão tem motor mais potente.",
        explicacao:
          "Errado. A potência do motor influencia a capacidade de ACELERAR o veículo, mas a dificuldade de MUDAR a direção do movimento já em curso é uma propriedade do próprio corpo (sua massa/inércia), não do motor que o impulsiona.",
      },
      {
        letra: "C",
        texto: "Porque o caminhão tem pneus maiores, que geram mais atrito com o solo.",
        explicacao:
          "Errado. O atrito dos pneus influencia a capacidade de FRENAGEM e tração, mas não é a causa da resistência à mudança de direção descrita aqui, essa resistência vem da inércia, ligada à massa do veículo.",
      },
      {
        letra: "D",
        texto: "Porque a velocidade do caminhão é sempre maior.",
        explicacao:
          "Errado. O enunciado já estabelece que ambos estão na mesma velocidade. A dificuldade de mudar de direção não depende da velocidade ser maior ou menor, ela depende da massa do corpo, que determina sua inércia.",
      },
    ],
    correta: "A",
  },

  // ───────────────────────── 1ª LEI, DIFÍCIL ─────────────────────────
  {
    id: "lei1-d-01",
    assunto: "lei-1",
    subassunto: "Referenciais inerciais",
    dificuldade: "dificil",
    tags: ["inércia", "referencial", "conceito avançado"],
    enunciado:
      "Um passageiro em pé dentro de um ônibus sente seu corpo ser 'lançado' para frente quando o ônibus freia bruscamente. Do ponto de vista da 1ª Lei de Newton, qual é a explicação correta para essa sensação?",
    alternativas: [
      {
        letra: "A",
        texto:
          "O corpo do passageiro tende a manter seu estado de movimento retilíneo uniforme, enquanto o ônibus (e o chão sob seus pés) desacelera; o efeito percebido é a continuação da inércia do passageiro em relação ao referencial do ônibus, que deixou de ser inercial durante a freada.",
        explicacao:
          "Correto. Antes da freada, passageiro e ônibus se moviam juntos com a mesma velocidade. Quando o ônibus desacelera, atua sobre ele uma força (do freio/atrito), mas essa força não atua diretamente sobre o corpo do passageiro (exceto pelo contato dos pés e eventual cinto). Por inércia, o passageiro tende a continuar com a velocidade anterior, e por isso parece 'avançar' em relação ao ônibus, que agora está mais lento. O referencial do ônibus, ao desacelerar, deixa de ser inercial, é por isso que dentro dele parece haver uma força 'empurrando' o passageiro para frente, quando na realidade é apenas a inércia do passageiro mantendo seu movimento original.",
      },
      {
        letra: "B",
        texto: "Uma força para frente é gerada pela freada e empurra o passageiro.",
        explicacao:
          "Errado. A freada gera uma força de atrito que desacelera o ônibus, e essa força atua no sentido contrário ao movimento (para trás), não para frente. Não existe uma força real 'para frente' agindo sobre o passageiro, a sensação de ser empurrado para frente é resultado da inércia do corpo dele, não de uma força nova sendo criada.",
      },
      {
        letra: "C",
        texto: "O passageiro perde a inércia no momento da freada.",
        explicacao:
          "Errado. A inércia não é algo que se 'perde', ela é uma propriedade permanente da matéria, ligada à massa do corpo. O que muda na freada não é a inércia do passageiro, e sim a velocidade do ônibus em relação a ele, que segue tentando manter seu movimento anterior.",
      },
      {
        letra: "D",
        texto: "A 1ª Lei não se aplica dentro de veículos em movimento.",
        explicacao:
          "Errado. A 1ª Lei se aplica normalmente em qualquer referencial inercial (que se move com velocidade constante). O que acontece aqui é justamente que o referencial do ônibus, ao FREAR, deixa de ser inercial temporariamente, e é essa mudança de referencial que faz a inércia do passageiro parecer uma força extra, fenômeno estudado como 'força fictícia' ou 'pseudo-força'.",
      },
    ],
    correta: "A",
  },

  // ───────────────────────── 2ª LEI, FÁCIL ─────────────────────────
  {
    id: "lei2-f-01",
    assunto: "lei-2",
    subassunto: "Fórmula F = m·a",
    dificuldade: "facil",
    tags: ["força", "massa", "aceleração", "fórmula"],
    enunciado: "Qual é a expressão matemática correta da 2ª Lei de Newton?",
    formula: "F = m·a",
    alternativas: [
      {
        letra: "A",
        texto: "F = m · a",
        explicacao:
          "Correto. A força resultante (F) sobre um corpo é igual ao produto da sua massa (m) pela aceleração (a) que ela produz. É a relação central da dinâmica: para uma mesma força, corpos com mais massa aceleram menos.",
      },
      {
        letra: "B",
        texto: "F = m + a",
        explicacao:
          "Errado. Força não é uma soma de massa e aceleração, essas grandezas têm unidades diferentes (kg e m/s²) e não podem ser somadas diretamente. A relação correta entre elas é de multiplicação, não de adição.",
      },
      {
        letra: "C",
        texto: "F = a / m",
        explicacao:
          "Errado. Essa fórmula inverteria a relação: diria que, para uma mesma aceleração, quanto MAIOR a massa, MENOR a força, o que é o contrário do que a física observa. Na realidade, para produzir a mesma aceleração em um corpo de maior massa, é preciso MAIS força, não menos.",
      },
      {
        letra: "D",
        texto: "F = m² · a",
        explicacao:
          "Errado. Não há elevação ao quadrado na relação entre massa e força. A 2ª Lei estabelece uma proporcionalidade direta e simples (linear) entre massa e força para uma dada aceleração.",
      },
    ],
    correta: "A",
  },
  {
    id: "lei2-f-02",
    assunto: "lei-2",
    subassunto: "Cálculo direto",
    dificuldade: "facil",
    tags: ["força", "cálculo"],
    enunciado:
      "Uma força resultante de 20 N é aplicada sobre um corpo de massa 4 kg. Qual é a aceleração produzida?",
    formula: "a = F / m",
    alternativas: [
      {
        letra: "A",
        texto: "5 m/s²",
        explicacao:
          "Correto. Usando F = m·a, isolamos a = F/m = 20/4 = 5 m/s². Esse é exatamente o tipo de substituição direta que a 2ª Lei permite fazer.",
      },
      {
        letra: "B",
        texto: "80 m/s²",
        explicacao:
          "Errado. Esse valor vem de multiplicar F por m (20 × 4 = 80) em vez de dividir. A fórmula correta isola a aceleração como a = F/m, não como F × m.",
      },
      {
        letra: "C",
        texto: "24 m/s²",
        explicacao:
          "Errado. Esse valor vem de somar força e massa (20 + 4 = 24), uma operação que não tem sentido físico aqui, força e massa têm unidades diferentes e a relação entre elas na 2ª Lei é de divisão, não de soma.",
      },
      {
        letra: "D",
        texto: "0,2 m/s²",
        explicacao:
          "Errado. Esse valor inverte a divisão (4/20 em vez de 20/4). A fórmula é a = F/m: a força vai no numerador, a massa no denominador.",
      },
    ],
    correta: "A",
  },

  // ───────────────────────── 2ª LEI, MÉDIO ─────────────────────────
  {
    id: "lei2-m-01",
    assunto: "lei-2",
    subassunto: "Proporcionalidade",
    dificuldade: "medio",
    tags: ["força", "massa", "proporcionalidade"],
    enunciado:
      "Se a massa de um corpo é dobrada e a força resultante aplicada sobre ele permanece a mesma, o que ocorre com sua aceleração?",
    formula: "a = F / m",
    alternativas: [
      {
        letra: "A",
        texto: "A aceleração é reduzida à metade.",
        explicacao:
          "Correto. Como a = F/m, e a força (F) é constante, dobrar a massa (m) no denominador reduz a aceleração resultante à metade. Essa é a relação de proporcionalidade inversa entre massa e aceleração, para força constante.",
      },
      {
        letra: "B",
        texto: "A aceleração dobra também.",
        explicacao:
          "Errado. Esse seria o comportamento se a relação entre massa e aceleração fosse diretamente proporcional, mas na 2ª Lei, para força CONSTANTE, a relação entre massa e aceleração é inversamente proporcional: aumentar a massa diminui a aceleração.",
      },
      {
        letra: "C",
        texto: "A aceleração permanece igual, pois a força não mudou.",
        explicacao:
          "Errado. A força sozinha não determina a aceleração, é a relação entre força E massa que determina (a = F/m). Mesmo com a força fixa, mudar a massa muda necessariamente a aceleração resultante.",
      },
      {
        letra: "D",
        texto: "A aceleração se torna nula.",
        explicacao:
          "Errado. A aceleração só seria nula se a força resultante fosse zero. Dobrar a massa reduz a aceleração, mas não a zera, ela continua existindo, só que com metade do valor anterior.",
      },
    ],
    correta: "A",
  },

  // ───────────────────────── 2ª LEI, DIFÍCIL ─────────────────────────
  {
    id: "lei2-d-01",
    assunto: "lei-2",
    subassunto: "Sistemas com múltiplas forças",
    dificuldade: "dificil",
    tags: ["força resultante", "atrito", "plano inclinado"],
    enunciado:
      "Um bloco de 10 kg é empurrado horizontalmente por uma força de 50 N. A força de atrito que se opõe ao movimento é de 30 N. Qual é a aceleração do bloco?",
    formula: "a = (F − Fat) / m",
    alternativas: [
      {
        letra: "A",
        texto: "2 m/s²",
        explicacao:
          "Correto. A força resultante é a soma vetorial das forças horizontais: F_res = 50 − 30 = 20 N (o atrito age no sentido contrário ao movimento). Aplicando a 2ª Lei: a = F_res/m = 20/10 = 2 m/s².",
      },
      {
        letra: "B",
        texto: "5 m/s², usando apenas a força aplicada de 50 N.",
        explicacao:
          "Errado. Esse cálculo (50/10) ignora completamente a força de atrito. A 2ª Lei exige usar a força RESULTANTE, ou seja, a soma de TODAS as forças que atuam na direção do movimento, não apenas a força que foi aplicada pela pessoa.",
      },
      {
        letra: "C",
        texto: "8 m/s², somando as duas forças (50 + 30 = 80, dividido por 10).",
        explicacao:
          "Errado. O atrito se opõe ao movimento, então ele deve ser SUBTRAÍDO da força aplicada, não somado a ela. Somar as duas forças trataria o atrito como se ele estivesse ajudando o movimento, quando na verdade ele o dificulta.",
      },
      {
        letra: "D",
        texto: "3 m/s², usando apenas a força de atrito de 30 N.",
        explicacao:
          "Errado. Esse cálculo (30/10) usa só o atrito e ignora a força aplicada que está movendo o bloco. É preciso considerar AMBAS as forças horizontais e calcular sua resultante antes de aplicar F = m·a.",
      },
    ],
    correta: "A",
  },

  // ───────────────────────── 3ª LEI, FÁCIL ─────────────────────────
  {
    id: "lei3-f-01",
    assunto: "lei-3",
    subassunto: "Conceito de ação e reação",
    dificuldade: "facil",
    tags: ["ação e reação", "conceito"],
    enunciado:
      "Segundo a 3ª Lei de Newton, quando um corpo A exerce uma força sobre um corpo B, o que ocorre?",
    alternativas: [
      {
        letra: "A",
        texto: "B exerce sobre A uma força de mesma intensidade, mesma direção e sentido oposto.",
        explicacao:
          "Correto. Esse é exatamente o Princípio da Ação e Reação: as forças sempre aparecem em pares, atuando em corpos diferentes, com mesma intensidade e direção, mas sentidos opostos. Elas nunca se cancelam entre si porque atuam em corpos distintos.",
      },
      {
        letra: "B",
        texto: "B exerce sobre A uma força menor, pois parte da força se 'perde' no processo.",
        explicacao:
          "Errado. Não existe perda de força no par ação-reação, as duas forças têm exatamente a MESMA intensidade. A ideia de força 'se perdendo' não tem respaldo na 3ª Lei; é uma confusão com situações de atrito ou dissipação de energia, que são fenômenos diferentes.",
      },
      {
        letra: "C",
        texto: "B fica impedido de se mover até que A pare de agir.",
        explicacao:
          "Errado. A 3ª Lei trata do par de forças entre os corpos, não do movimento resultante de cada um, o movimento depende também da massa de cada corpo e de outras forças envolvidas (2ª Lei). B pode perfeitamente se mover enquanto A continua agindo.",
      },
      {
        letra: "D",
        texto: "Apenas A sofre o efeito da força, pois B é o corpo passivo.",
        explicacao:
          "Errado. Essa alternativa nega o próprio princípio: na 3ª Lei, AMBOS os corpos exercem força um sobre o outro simultaneamente. Não existe corpo 'passivo' que só recebe força sem também exercê-la de volta.",
      },
    ],
    correta: "A",
  },
  {
    id: "lei3-f-02",
    assunto: "lei-3",
    subassunto: "Identificação de pares",
    dificuldade: "facil",
    tags: ["ação e reação", "cotidiano"],
    enunciado:
      "Uma pessoa empurra uma parede com as mãos. Qual é a reação a essa força, segundo a 3ª Lei?",
    alternativas: [
      {
        letra: "A",
        texto: "A parede empurra a pessoa de volta, com a mesma intensidade.",
        explicacao:
          "Correto. A força que a pessoa exerce na parede (ação) e a força que a parede exerce na pessoa (reação) formam exatamente o par previsto pela 3ª Lei: mesma intensidade, mesma direção, sentidos opostos.",
      },
      {
        letra: "B",
        texto: "O peso da pessoa aumenta.",
        explicacao:
          "Errado. O peso é a força gravitacional sobre a pessoa e não tem relação com a força horizontal aplicada na parede. Essa alternativa confunde duas forças completamente independentes.",
      },
      {
        letra: "C",
        texto: "A pessoa não sente nenhuma força de volta, pois a parede é fixa.",
        explicacao:
          "Errado. O fato de a parede ser fixa (não se mover) não significa que ela não exerce força, ela exerce, sim, e com a mesma intensidade da força recebida. 'Não se mover' está relacionado à 2ª Lei (massa enorme e estrutura fixa resultam em aceleração desprezível), não à ausência de força de reação.",
      },
      {
        letra: "D",
        texto: "A força se transforma em calor e desaparece.",
        explicacao:
          "Errado. Embora possa haver alguma dissipação de energia em forma de calor por atrito nas mãos, isso é irrelevante para o par ação-reação da 3ª Lei, que continua existindo entre pessoa e parede independentemente disso.",
      },
    ],
    correta: "A",
  },

  // ───────────────────────── 3ª LEI, MÉDIO ─────────────────────────
  {
    id: "lei3-m-01",
    assunto: "lei-3",
    subassunto: "Ação e reação não se cancelam",
    dificuldade: "medio",
    tags: ["ação e reação", "equilíbrio", "erro comum"],
    enunciado:
      "Um cavalo puxa uma carroça. Pela 3ª Lei, a carroça puxa o cavalo de volta com força igual e oposta. Por que, então, o conjunto consegue se mover para frente?",
    alternativas: [
      {
        letra: "A",
        texto:
          "Porque o par ação-reação entre cavalo e carroça atua em corpos diferentes e não se cancela; o movimento depende da força resultante sobre CADA corpo, incluindo o atrito do cavalo com o solo.",
        explicacao:
          "Correto. As forças de ação e reação da 3ª Lei nunca se cancelam, pois atuam em corpos DIFERENTES (cavalo e carroça), não no mesmo corpo. Para saber se o conjunto se move, é preciso analisar a força resultante sobre cada corpo separadamente: o cavalo empurra o solo para trás e recebe uma reação para frente (atrito), e essa força extra é o que faz o conjunto avançar, superando a tração da carroça.",
      },
      {
        letra: "B",
        texto:
          "Porque a força do cavalo é, na prática, maior que a da carroça, apesar do que a 3ª Lei diz.",
        explicacao:
          "Errado. Isso contradiz a própria 3ª Lei: as forças do par ação-reação têm SEMPRE a mesma intensidade, sem exceção. Não é uma questão de uma força ser 'um pouco maior', elas são rigorosamente iguais. A explicação do movimento está em outro lugar (no atrito com o solo), não numa violação da 3ª Lei.",
      },
      {
        letra: "C",
        texto: "Porque as forças se cancelam, mas a inércia do cavalo continua o movimento.",
        explicacao:
          "Errado. Isso reintroduz a 1ª Lei (inércia) onde não se aplica: se as forças realmente se cancelassem completamente para o sistema cavalo-carroça, o conjunto continuaria com velocidade constante, mas não haveria como ele ACELERAR a partir do repouso. O erro é ignorar a força externa essencial: o atrito entre os pés do cavalo e o solo.",
      },
      {
        letra: "D",
        texto: "Porque a 3ª Lei só vale para objetos em repouso, não em movimento.",
        explicacao:
          "Errado. A 3ª Lei vale sempre, independentemente de os corpos estarem em repouso ou em movimento, ela descreve uma propriedade das interações entre corpos, não do estado de movimento deles.",
      },
    ],
    correta: "A",
  },

  // ───────────────────────── 3ª LEI, DIFÍCIL ─────────────────────────
  {
    id: "lei3-d-01",
    assunto: "lei-3",
    subassunto: "Integração das três leis",
    dificuldade: "dificil",
    tags: ["ação e reação", "integração", "foguete"],
    enunciado:
      "Um foguete no espaço (sem atrito com nenhum meio externo) expele gases de combustão para trás a alta velocidade. Usando as três Leis de Newton em conjunto, explique por que o foguete acelera para frente.",
    alternativas: [
      {
        letra: "A",
        texto:
          "O foguete exerce força sobre os gases para expeli-los para trás (ação); pela 3ª Lei, os gases exercem força de mesma intensidade e sentido oposto sobre o foguete (reação), empurrando-o para frente; como essa é a força resultante sobre o foguete, pela 2ª Lei ele acelera, e essa aceleração mantém-se enquanto não houver outra força (1ª Lei) cancelando-a.",
        explicacao:
          "Correto. Esse raciocínio integra as três leis corretamente: (3ª) o par ação-reação entre foguete e gases expelidos é o que gera a força propulsora, sem precisar de nenhum meio externo (ar, solo) para 'empurrar contra', diferente do que muita gente imagina; (2ª) essa força resultante sobre o foguete, dividida por sua massa, determina sua aceleração; (1ª) no vácuo do espaço, sem forças de atrito ou resistência, essa aceleração resultante de fato muda o estado de movimento do foguete, e ele mantém a nova velocidade até a próxima força atuar.",
      },
      {
        letra: "B",
        texto:
          "O foguete empurra o ar atrás dele, e o ar o impulsiona para frente, como uma hélice.",
        explicacao:
          "Errado. Esse é um erro conceitual muito comum: foguetes funcionam mesmo no vácuo do espaço, onde não há ar para 'empurrar contra'. A propulsão vem do par ação-reação entre o foguete e os PRÓPRIOS GASES que ele expele, não de uma interação com o meio externo.",
      },
      {
        letra: "C",
        texto:
          "A força da explosão se distribui igualmente em todas as direções, e o foguete vai para onde há menos resistência.",
        explicacao:
          "Errado. A combustão é direcionada propositalmente para trás (pelo bocal do motor), e é justamente essa direção específica que define, pela 3ª Lei, a direção oposta da reação sobre o foguete. Não é uma questão de 'menor resistência', mas de uma força de reação bem definida e direcionada.",
      },
      {
        letra: "D",
        texto:
          "O foguete acelera porque perde massa ao expelir combustível, e menos massa significa mais velocidade automaticamente.",
        explicacao:
          "Errado. Embora a perda de massa realmente facilite a aceleração futura (pois a = F/m, e m diminui), essa não é a CAUSA da aceleração, é apenas um fator que a intensifica ao longo do tempo. A causa fundamental do impulso é a força de reação dos gases expelidos (3ª Lei), que existe mesmo no primeiro instante, antes de qualquer perda significativa de massa.",
      },
    ],
    correta: "A",
  },
  {
    id: "mec-f-01",
    assunto: "lei-1",
    subassunto: "Diagrama de corpo livre",
    dificuldade: "facil",
    tags: ["mecânica", "forças", "diagrama"],
    enunciado:
      "Uma caixa está parada sobre um piso horizontal. Quais forças devem aparecer no diagrama de corpo livre da caixa?",
    alternativas: [
      {
        letra: "A",
        texto: "O peso para baixo e a força normal do piso para cima.",
        explicacao:
          "Correto. O peso representa a atração gravitacional da Terra e a normal representa o contato do piso. Como a caixa permanece em repouso, essas forças verticais têm módulos iguais.",
      },
      {
        letra: "B",
        texto: "Somente o peso, porque a caixa não está em movimento.",
        explicacao:
          "Movimento não determina se uma força existe. Sem a normal do piso, o peso produziria aceleração para baixo e a caixa atravessaria a superfície.",
      },
      {
        letra: "C",
        texto: "Peso, normal e uma força de movimento para a direita.",
        explicacao:
          "Não existe uma força de movimento. Velocidade não é força e, neste caso, a caixa está parada sem ação horizontal descrita.",
      },
      {
        letra: "D",
        texto: "Apenas a normal, porque o piso sustenta a caixa.",
        explicacao:
          "A normal só é necessária porque a gravidade puxa a caixa para baixo. Retirar o peso do diagrama impede explicar o equilíbrio vertical.",
      },
    ],
    correta: "A",
    dicas: [
      "Liste apenas as interações que agem sobre a caixa, não as forças que ela exerce em outros corpos.",
      "Há uma interação à distância com a Terra e uma interação de contato com o piso.",
    ],
  },
  {
    id: "mec-f-02",
    assunto: "lei-2",
    subassunto: "Grandezas vetoriais",
    dificuldade: "facil",
    tags: ["mecânica", "vetores", "aceleração"],
    enunciado:
      "Um carrinho faz uma curva mantendo 6 m/s no velocímetro. É correto afirmar que sua aceleração é nula?",
    alternativas: [
      {
        letra: "A",
        texto: "Não. A direção da velocidade muda, então existe aceleração.",
        explicacao:
          "Correto. A velocidade é vetorial. Mesmo com módulo constante, mudar a direção significa variar a velocidade e, portanto, ter aceleração.",
      },
      {
        letra: "B",
        texto: "Sim. Aceleração só existe quando o velocímetro aumenta.",
        explicacao:
          "O velocímetro mostra o módulo da velocidade. Aceleração também pode mudar sua direção, como acontece em uma curva.",
      },
      {
        letra: "C",
        texto: "Sim. Toda curva feita em velocidade constante é equilíbrio.",
        explicacao:
          "Equilíbrio exige velocidade vetorial constante. Em uma curva, a direção varia continuamente, então a resultante não é nula.",
      },
      {
        letra: "D",
        texto: "Não, porque a massa do carrinho aumenta durante a curva.",
        explicacao:
          "A massa não aumenta por causa da curva. A aceleração surge da mudança da direção do vetor velocidade.",
      },
    ],
    correta: "A",
    dicas: [
      "Compare módulo e direção da velocidade antes e depois de um pequeno trecho da curva.",
      "Uma grandeza vetorial pode variar mesmo quando o número mostrado no velocímetro não muda.",
    ],
  },
  {
    id: "mec-m-01",
    assunto: "lei-2",
    subassunto: "Resultante em duas direções",
    dificuldade: "medio",
    tags: ["mecânica", "vetores", "força resultante"],
    formula: "|Fᵣ| = √(Fₓ² + Fᵧ²)",
    enunciado:
      "Duas forças perpendiculares de 6 N e 8 N atuam sobre o mesmo ponto de um corpo. Qual é o módulo da força resultante?",
    alternativas: [
      {
        letra: "A",
        texto: "10 N",
        explicacao:
          "Correto. Como as forças são perpendiculares, elas formam os catetos de um triângulo retângulo: √(6² + 8²) = √100 = 10 N.",
      },
      {
        letra: "B",
        texto: "14 N",
        explicacao:
          "Somar 6 e 8 diretamente só seria correto se as forças tivessem a mesma direção e o mesmo sentido.",
      },
      {
        letra: "C",
        texto: "2 N",
        explicacao:
          "Subtrair os módulos só representa forças colineares em sentidos opostos. Aqui elas são perpendiculares.",
      },
      {
        letra: "D",
        texto: "48 N",
        explicacao:
          "Multiplicar os módulos não produz uma força resultante e ainda gera uma relação dimensional sem significado neste problema.",
      },
    ],
    correta: "A",
    dicas: [
      "Desenhe as duas forças como os lados perpendiculares de um retângulo.",
      "A diagonal é a resultante. Use o teorema de Pitágoras nos módulos 6 e 8.",
    ],
  },
  {
    id: "mec-m-02",
    assunto: "lei-1",
    subassunto: "Atrito estático",
    dificuldade: "medio",
    tags: ["mecânica", "atrito", "equilíbrio"],
    enunciado:
      "Uma pessoa empurra uma caixa com 30 N, mas ela não se move. O que o atrito estático faz nessa situação?",
    alternativas: [
      {
        letra: "A",
        texto: "Ajusta-se para 30 N no sentido oposto, mantendo a resultante nula.",
        explicacao:
          "Correto. Antes do limite máximo, o atrito estático acompanha a força aplicada. Com 30 N opostos, a resultante horizontal é zero.",
      },
      {
        letra: "B",
        texto: "É sempre igual ao seu valor máximo, mesmo com forças pequenas.",
        explicacao:
          "O atrito estático tem um valor máximo, mas não atua sempre nesse máximo. Ele se ajusta ao necessário para impedir o deslizamento.",
      },
      {
        letra: "C",
        texto: "É zero porque não existe movimento.",
        explicacao:
          "O atrito estático existe justamente antes do movimento. Sem ele, a força de 30 N aceleraria a caixa.",
      },
      {
        letra: "D",
        texto: "Atua no mesmo sentido do empurrão e dobra a força resultante.",
        explicacao:
          "Nesta situação, a tendência de deslizamento é no sentido do empurrão. O atrito se opõe a essa tendência.",
      },
    ],
    correta: "A",
    dicas: [
      "Se a caixa continua parada, qual deve ser o valor da força resultante horizontal?",
      "Antes do deslizamento, o atrito estático assume o módulo necessário até alcançar seu limite.",
    ],
  },
  {
    id: "mec-d-01",
    assunto: "lei-2",
    subassunto: "Peso aparente",
    dificuldade: "dificil",
    tags: ["mecânica", "elevador", "força normal"],
    formula: "N − mg = ma",
    enunciado:
      "Uma estudante de 60 kg está sobre uma balança em um elevador que acelera para cima a 2 m/s². Adote g = 10 m/s². Qual leitura a balança indica?",
    alternativas: [
      {
        letra: "A",
        texto: "720 N",
        explicacao:
          "Correto. Para cima positivo: N − mg = ma. Logo N = m(g + a) = 60(10 + 2) = 720 N. A balança mede a normal, não a massa diretamente.",
      },
      {
        letra: "B",
        texto: "600 N",
        explicacao:
          "600 N é apenas o peso mg. Como há aceleração para cima, a normal precisa superar o peso para produzir a resultante.",
      },
      {
        letra: "C",
        texto: "480 N",
        explicacao:
          "Subtrair a aceleração corresponde ao caso de aceleração para baixo. O enunciado informa aceleração para cima.",
      },
      {
        letra: "D",
        texto: "120 N",
        explicacao:
          "120 N é ma, a força resultante. A leitura da balança é a normal, que também precisa equilibrar o peso.",
      },
    ],
    correta: "A",
    dicas: [
      "A balança mede a força normal. Desenhe normal para cima e peso para baixo.",
      "Como a aceleração aponta para cima, N deve ser maior que mg por uma diferença igual a ma.",
    ],
  },
  {
    id: "mec-d-02",
    assunto: "lei-3",
    subassunto: "Sistema de dois blocos",
    dificuldade: "dificil",
    tags: ["mecânica", "sistemas", "ação e reação"],
    enunciado:
      "Dois blocos encostados, A de 2 kg e B de 3 kg, são empurrados por 20 N em uma superfície sem atrito. Qual força A exerce sobre B?",
    formula: "a = F/(mA + mB)",
    alternativas: [
      {
        letra: "A",
        texto: "12 N",
        explicacao:
          "Correto. O conjunto acelera a 20/(2 + 3) = 4 m/s². Em B, a força de contato exercida por A é a resultante: 3 · 4 = 12 N.",
      },
      {
        letra: "B",
        texto: "20 N",
        explicacao:
          "Os 20 N aceleram o sistema inteiro. A força de contato precisa acelerar apenas o bloco B, por isso é menor.",
      },
      {
        letra: "C",
        texto: "8 N",
        explicacao:
          "8 N é o valor mA·a associado à resultante sobre A, não a força que A aplica em B.",
      },
      {
        letra: "D",
        texto: "4 N",
        explicacao:
          "4 é a aceleração em m/s². Confundir aceleração com força elimina a massa de B do cálculo.",
      },
    ],
    correta: "A",
    dicas: [
      "Primeiro trate os dois blocos como um único sistema para encontrar a aceleração comum.",
      "Depois isole apenas B. Na horizontal, a força de A sobre B é a resultante que acelera seus 3 kg.",
    ],
  },
];
