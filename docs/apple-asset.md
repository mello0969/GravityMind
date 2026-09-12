# Maca Poly Haven

## Origem e conversao

- Arquivo fornecido pelo usuario: `food_apple_01_4k.blend.zip`.
- Fonte preservada em `artifacts/assets/polyhaven-apple/`.
- Blender 5.2.1 LTS portatil, obtido no servidor oficial e verificado por SHA-256. A tentativa inicial pelo winget aguardava elevacao do Windows.
- Saida: `public/models/apple.glb`, 14.077.356 bytes (13,43 MiB).
- SHA-256: `67c8b31761cf63bb22a2ce509d8b2032018f4f4aedc5575f9ec094f2f75c0376`.

```powershell
blender --background artifacts/assets/polyhaven-apple/food_apple_01_4k.blend --python scripts/export-apple.py -- public/models/apple.glb
```

O exportador padrao gerou inicialmente 36.047.468 bytes. O script converte apenas o normal EXR para PNG de 8 bits, mantendo 4096 x 4096 pixels e dados Non-Color. A textura de cor original em JPEG e o mapa de rugosidade tambem permanecem em 4K. O `.blend` original nao e sobrescrito. Nenhum mapa depende de arquivo externo ao GLB.

## Integracao

`loadAppleModel()` usa o GLTFLoader existente no Three.js. A malha em metros e centralizada e normalizada uniformemente para a largura da fruta anterior. Posicao, escala responsiva, camera, velocidade de 0,16 rad/s e inclinacao pelo ponteiro permanecem na cena. O ticker do GSAP respeita `reducedMotion`; nao existe pausa manual.

O carregamento tardio apos desmontar a rota descarta o modelo. Geometria, materiais, texturas compartilhadas e ImageBitmaps sao liberados uma unica vez. Uma falha de WebGL ou download apresenta estado de indisponibilidade sem substituir o asset por uma maca procedural.

## Evidencias

- `artifacts/visual/polyhaven-apple/apple-angle-1.png` e `apple-angle-2.png`: capturas do canvas real, separadas pela rotacao automatica, sem retoque.
- `home-angle-1.png`, `home-angle-2.png` e `home-mobile.png`: enquadramento na interface.
- `comparison.png`: foto original ao lado das duas vistas.
- `materials.json`: GLTFLoader confirmou cor sRGB, normal e rugosidade Non-Color, todos em 4096 x 4096.
- Testes: 32 unitarios aprovados, incluindo integridade do GLB e descarte; 4 E2E aprovados em desktop/mobile cobrindo pixels nao vazios, enquadramento, rotacao, movimento reduzido e falha de download.

Comparacao visual: a textura escaneada preserva manchas, poros e variacoes de brilho. O asset fornecido e mais arredondado, tem talo mais curto e nao tem as gotas da foto. Nao foi aplicado tint adicional nem alterada a malha para fingir igualdade com a referencia. A aprovacao visual permanece com o usuario.
