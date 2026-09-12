import { p as performance } from "../_libs/unenv.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { W as WebGLRenderer, S as SRGBColorSpace, A as ACESFilmicToneMapping, a as Scene, P as PerspectiveCamera, H as HemisphereLight, R as RectAreaLight, D as DirectionalLight, b as PointLight, G as Group, M as Mesh, c as MeshPhysicalMaterial, d as DoubleSide, V as Vector2, e as SphereGeometry, f as MeshStandardMaterial, C as CatmullRomCurve3, g as Vector3, T as TubeGeometry, h as MathUtils, B as BufferGeometry, F as Float32BufferAttribute, i as TextureLoader, j as ClampToEdgeWrapping } from "../_libs/three.mjs";



const TAU = Math.PI * 2;
function gaussian(value, center, width) {
  return Math.exp(-(((value - center) / width) ** 2));
}
function appleSurfacePoint(vertical, angle) {
  const profileExponent = 0.7 - 0.1 * vertical;
  const profile = Math.max(0, Math.sin(Math.PI * vertical)) ** profileExponent;
  const shoulder = 1 + 0.36 * gaussian(vertical, 0.2, 0.2);
  const lowerTaper = 1 - 0.08 * gaussian(vertical, 0.83, 0.17);
  const ribStrength = 0.012 + 0.022 * Math.sin(Math.PI * vertical) ** 2;
  const radius = 0.76 * profile * shoulder * lowerTaper * (1 + Math.cos(angle * 5) * ribStrength);
  const upperLobes = 0.022 * Math.cos(angle * 5) * gaussian(vertical, 0.13, 0.1);
  const lowerLobes = 0.026 * Math.cos(angle * 5) * gaussian(vertical, 0.89, 0.12);
  const topDimple = 0.16 * gaussian(vertical, 0, 0.09);
  const lowerCup = 0.06 * gaussian(vertical, 1, 0.06);
  const y = 0.94 * Math.cos(Math.PI * vertical) - 0.13 - topDimple + lowerCup + upperLobes + lowerLobes;
  return new Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.95);
}
function createAppleGeometry(radialSegments = 144, verticalSegments = 96) {
  const positions = [];
  const uvs = [];
  const indices = [];
  for (let row = 0; row <= verticalSegments; row += 1) {
    const vertical = row / verticalSegments;
    for (let column = 0; column <= radialSegments; column += 1) {
      const angle = column / radialSegments * TAU;
      const point = appleSurfacePoint(vertical, angle);
      positions.push(point.x, point.y, point.z);
      uvs.push(
        MathUtils.clamp(0.5 + point.x / 2.05, 0, 1),
        MathUtils.clamp((point.y + 1) / 1.75, 0, 1)
      );
    }
  }
  for (let row = 0; row < verticalSegments; row += 1) {
    for (let column = 0; column < radialSegments; column += 1) {
      const current = row * (radialSegments + 1) + column;
      const next = current + radialSegments + 1;
      indices.push(current, next, current + 1, next, next + 1, current + 1);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geometry.setAttribute("uv1", new Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
function configureReferenceTexture(texture, color = false) {
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.anisotropy = 8;
  if (color) texture.colorSpace = SRGBColorSpace;
  return texture;
}
function loadSkinTextures() {
  const loader = new TextureLoader();
  return {
    map: configureReferenceTexture(loader.load("/assets/apple/skin-projection-albedo.webp"), true),
    roughnessMap: configureReferenceTexture(
      loader.load("/assets/apple/skin-projection-roughness.webp")
    ),
    normalMap: configureReferenceTexture(loader.load("/assets/apple/skin-projection-normal.webp"))
  };
}
function createAppleModel() {
  const group = new Group();
  group.name = "gravitymind-apple";
  const fruit = new Mesh(
    createAppleGeometry(),
    new MeshPhysicalMaterial({
      ...loadSkinTextures(),
      color: 16777215,
      roughness: 0.42,
      metalness: 0,
      clearcoat: 0.58,
      clearcoatRoughness: 0.14,
      normalScale: new Vector2(0.1, 0.1),
      side: DoubleSide
    })
  );
  fruit.name = "apple-fruit";
  fruit.userData.partId = "fruitBody";
  fruit.userData.explodeAxis = [0, 0, 0];
  fruit.castShadow = true;
  fruit.receiveShadow = true;
  group.add(fruit);
  const socket = new Mesh(
    new SphereGeometry(0.17, 32, 14),
    new MeshStandardMaterial({ color: 3474702, roughness: 0.76 })
  );
  socket.name = "apple-top-rim";
  socket.userData.partId = "topRim";
  socket.userData.explodeAxis = [0, 0.18, 0];
  socket.position.set(0, 0.7, 0);
  socket.scale.set(1, 0.22, 0.76);
  group.add(socket);
  const stemCurve = new CatmullRomCurve3([
    new Vector3(0, 0.69, 0),
    new Vector3(5e-3, 0.8, 5e-3),
    new Vector3(-0.02, 0.9, 0.012),
    new Vector3(-0.06, 1, 0.02)
  ]);
  const stem = new Mesh(
    new TubeGeometry(stemCurve, 32, 0.032, 10, false),
    new MeshStandardMaterial({
      color: 7357481,
      roughness: 0.92,
      metalness: 0
    })
  );
  stem.name = "apple-stem";
  stem.userData.partId = "stem";
  stem.userData.explodeAxis = [0, 0.34, 0];
  stem.castShadow = true;
  group.add(stem);
  group.rotation.set(-0.025, -0.2, -0.01);
  group.userData.sculptRuntime = {
    version: 1,
    clickableParts: ["fruitBody", "topRim", "stem"],
    explodeOrigin: [0, 0, 0],
    collider: { type: "sphere", radius: 1.05, center: [0, -0.08, 0] }
  };
  return group;
}
function disposeAppleModel(group) {
  group.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      if (material instanceof MeshStandardMaterial) {
        material.map?.dispose();
        material.roughnessMap?.dispose();
        material.normalMap?.dispose();
      }
      material.dispose();
    });
  });
}
function AppleHeroScene({ reducedMotion }) {
  const hostRef = reactExports.useRef(null);
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: new URLSearchParams(window.location.search).has("visualTest"),
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.94;
    const scene = new Scene();
    const camera = new PerspectiveCamera(32, 1, 0.1, 20);
    camera.position.set(0, 0.04, 4.25);
    const apple = createAppleModel();
    scene.add(apple);
    const hemisphere = new HemisphereLight(16771557, 5707561, 1.55);
    const key = new RectAreaLight(16770268, 4.8, 2.1, 4.4);
    key.position.set(-2.7, 1.6, 3.5);
    key.lookAt(0, -0.05, 0);
    const side = new RectAreaLight(16767198, 1.2, 1, 3.4);
    side.position.set(2.7, 0.7, 3.1);
    side.lookAt(0.15, -0.12, 0);
    const rim = new DirectionalLight(10213824, 1.35);
    rim.position.set(3.2, 1.7, -2.6);
    const cavityFill = new PointLight(16740717, 0.72, 4);
    cavityFill.position.set(-0.2, 2.8, 2);
    scene.add(hemisphere, key, side, rim, cavityFill);
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let visible = true;
    let frame = 0;
    let previous = performance.now();
    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const mobile = width < 720;
      apple.position.set(0, mobile ? -0.27 : 0.14, 0);
      const verticalScale = mobile ? 0.65 : 0.98;
      const horizontalScale = mobile ? 0.75 : 1.18;
      apple.scale.set(horizontalScale, verticalScale, horizontalScale);
    };
    const handlePointer = (event) => {
      const rect = host.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const render = (now) => {
      const delta = Math.min(0.05, (now - previous) / 1e3);
      previous = now;
      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;
      if (!reducedMotion && visible) {
        apple.rotation.y += delta * 0.16;
        apple.rotation.x += (pointer.y * 0.1 - apple.rotation.x) * 0.035;
        apple.rotation.z += (-pointer.x * 0.055 - apple.rotation.z) * 0.035;
      }
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    resizeObserver.observe(host);
    visibilityObserver.observe(host);
    host.addEventListener("pointermove", handlePointer, { passive: true });
    resize();
    frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", handlePointer);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      disposeAppleModel(apple);
      renderer.dispose();
    };
  }, [reducedMotion]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: hostRef, className: "absolute inset-0", "data-apple-scene": true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      className: "block h-full w-full",
      role: "img",
      "aria-label": "Maçã tridimensional usada para explorar gravidade e movimento"
    }
  ) });
}
export {
  AppleHeroScene
};
