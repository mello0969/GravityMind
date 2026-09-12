# Analise da referencia: maca vermelha

## Identificacao

- Objeto: maca vermelha inteira com haste.
- Dominio: `object`.
- Classe formal: organica, botanica, corpo unico com apendice.
- Confianca: 0.98 para identificacao e 0.82 para a forma frontal.

## Forma e silhueta

- Corpo aproximadamente bilateral, mais largo no terco superior e afunilado na base.
- Volume principal proximo de um esferoide oblato, deformado por cinco lobos verticais suaves.
- Ombros altos e arredondados ao redor de uma cavidade superior central.
- Base com duas saliencias frontais separadas por um sulco raso.
- Haste estreita, cilindrica, inclinada e levemente curva no eixo vertical.
- Proporcao observada do fruto sem haste: aproximadamente 1.02 de largura para 1.00 de altura.

## Decomposicao

- Macro: corpo do fruto; haste.
- Meso: cavidade superior; cinco lobos longitudinais; sulcos entre lobos; base afunilada; encaixe da haste.
- Micro: pintas claras distribuidas de modo irregular; duas faixas especulares verticais; variacao vermelha entre regioes; textura fibrosa da haste.

## Relacoes espaciais

- A haste esta encaixada na cavidade superior do corpo.
- A cavidade recua para dentro do polo superior.
- Os sulcos percorrem o corpo da regiao superior em direcao a base e separam os lobos.
- As pintas ficam aderidas a superficie e acompanham sua curvatura.

## Materiais PBR

- Casca: dieletrica, metalness 0, roughness media-baixa, clearcoat alto e clearcoat roughness baixo.
- Albedo da casca: vermelho saturado com regioes bordô nas cavidades e vermelho claro nos ombros iluminados.
- Pintas: material claro, fosco a acetinado, sem relevo relevante na escala do hero.
- Haste: marrom quente, metalness 0, roughness alta, relevo longitudinal discreto.

## Identidade visual

- Silhueta larga com ombros altos e base bipartida.
- Cavidade superior profunda e claramente visivel.
- Lobos verticais largos, sem facetas duras.
- Haste curta e curva, com topo irregular.
- Grande densidade de lenticelas claras, pequenas e nao uniformes.
- Destaques especulares alongados no lado frontal esquerdo e perto do centro-direito.

## Limites da referencia

- A imagem mostra uma unica vista frontal quase ortografica.
- Verso, laterais extremas, profundidade da cavidade e base inferior estao ocultos.
- As pintas do verso e a curvatura posterior serao distribuidas proceduralmente.
- A iluminacao esta incorporada na fotografia; albedo e roughness sao inferidos, nao medidos.
- A entrega e uma aproximacao procedural para navegador, nao fotogrametria nem geometria de fabricacao.

## Contrato de qualidade

- A silhueta frontal deve preservar ombros largos, cintura inferior e base lobada.
- A cavidade superior precisa permanecer legivel em vista frontal e tres quartos.
- O corpo deve ser uma superficie continua, sem primitivas flutuantes formando os lobos.
- A haste deve estar fisicamente encaixada na cavidade e acompanhar uma curva suave.
- Pelo menos 160 pintas devem usar instanciacao, com escala e distribuicao deterministicas.
- O material deve responder a duas fontes de luz com clearcoat visivel sem halo emissivo.
- O modelo deve manter leitura coerente em vistas frontal, lateral, traseira e tres quartos.
- O grupo deve aceitar rotacao por ponteiro e exposicao de partes para depuracao.
