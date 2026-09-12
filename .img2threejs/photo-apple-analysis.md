# New apple reference

Source: codex-clipboard-160c28af-f2c7-4527-86f1-3755f604da69.png.

Observed: a whole red apple, botanical object, one continuous organic skin and a curved woody stem. Body bounds approximately x=494..1223 and y=246..932 in the 1749x980 reference: width/height about 1.06. Including the stem (top y=139), width/height is about 0.92. These are projected measurements, not physical dimensions.

Macro: rounded shoulders and a gently tapered lower third, broad flattened contact region. Meso: recessed top socket, slightly unequal shoulder lobes, stem widening at the cut tip. Micro: pale irregular lenticels, short vertical yellow-red striations, fine dew/skin roughness, longitudinal stem fibers. The stem embeds below the shoulder rim; it is not attached on top of a solid sphere. No leaves are visible.

Skin is a nonmetallic red dielectric with cream/yellow markings and broad, soft highlights. The large white patch at upper left is illumination, not white albedo. Roughness and normal evidence must remain separate from color. Stem is ochre/brown, rougher and less reflective than the fruit.

Inference: approximately radial volume with small five-fold lobe modulation. The back, underside and exact distribution of surface markings are not visible and will be inferred. The background and table are not part of the model. A single image cannot determine exact BRDF or hidden geometry.

Root cause in current scene: desktop scale [1.18,0.98,1.18], mobile [0.75,0.65,0.75]. These distort the model laterally by 20.4% and 15.4%. New scene must use a uniform scalar, including when resizing.

Acceptance: near-square body in front and side views; stem follows a curved centerline from within the cavity; no horizontal scaling of the root; no flat/plastic solid-color skin; no painted-in stationary bright spot; continuous GSAP rotation respecting reducedMotion; desktop/mobile alpha bounds stay within the canvas.
