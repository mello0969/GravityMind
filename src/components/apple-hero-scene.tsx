import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { disposeAppleModel, loadAppleModel } from "@/lib/three/create-apple-model";

export function AppleHeroScene({ reducedMotion }: { reducedMotion: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotionRef = useRef(reducedMotion);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: new URLSearchParams(window.location.search).has("visualTest"),
        powerPreference: "high-performance",
      });
    } catch {
      setStatus("error");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.94;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
    camera.position.set(0, 0.04, 4.25);

    const apple = new THREE.Group();
    apple.rotation.set(-0.025, -0.2, -0.01);
    scene.add(apple);
    let disposed = false;

    loadAppleModel()
      .then((model) => {
        if (disposed) {
          disposeAppleModel(model);
          return;
        }
        model.rotation.set(0, 0, 0);
        apple.add(model);
        renderer.render(scene, camera);
        setStatus("ready");
      })
      .catch(() => {
        if (!disposed) setStatus("error");
      });

    RectAreaLightUniformsLib.init();
    const hemisphere = new THREE.HemisphereLight(0xffe9e5, 0x571729, 1.55);
    const key = new THREE.RectAreaLight(0xffe4dc, 4.8, 2.1, 4.4);
    key.position.set(-2.7, 1.6, 3.5);
    key.lookAt(0, -0.05, 0);
    const side = new THREE.RectAreaLight(0xffd8de, 1.2, 1, 3.4);
    side.position.set(2.7, 0.7, 3.1);
    side.lookAt(0.15, -0.12, 0);
    const rim = new THREE.DirectionalLight(0x9bd9c0, 1.35);
    rim.position.set(3.2, 1.7, -2.6);
    const cavityFill = new THREE.PointLight(0xff716d, 0.72, 4);
    cavityFill.position.set(-0.2, 2.8, 2);
    scene.add(hemisphere, key, side, rim, cavityFill);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let visible = true;

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const mobile = width < 720;
      apple.position.set(0, mobile ? -0.27 : 0.14, 0);
      apple.scale.setScalar(mobile ? 0.7 : 1.05);
      renderer.render(scene, camera);
    };

    const handlePointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const render = (_time: number, deltaTime: number) => {
      if (reducedMotionRef.current || !visible || document.hidden || apple.children.length === 0)
        return;
      const delta = Math.min(0.05, deltaTime / 1_000);
      pointer.x += (target.x - pointer.x) * 0.045;
      pointer.y += (target.y - pointer.y) * 0.045;

      apple.rotation.y += delta * 0.16;
      apple.rotation.x += (pointer.y * 0.1 - apple.rotation.x) * 0.035;
      apple.rotation.z += (-pointer.x * 0.055 - apple.rotation.z) * 0.035;
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    resizeObserver.observe(host);
    visibilityObserver.observe(host);
    host.addEventListener("pointermove", handlePointer, { passive: true });
    resize();
    gsap.ticker.add(render);

    return () => {
      disposed = true;
      gsap.ticker.remove(render);
      host.removeEventListener("pointermove", handlePointer);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      disposeAppleModel(apple);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0" data-apple-scene data-state={status}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        role="img"
        aria-label="Maçã tridimensional usada para explorar gravidade e movimento"
      />
      {status !== "ready" && (
        <p
          role="status"
          className="absolute inset-x-0 bottom-5 text-center text-xs text-muted-foreground"
        >
          {status === "loading" ? "Carregando modelo 3D..." : "Modelo 3D indisponível."}
        </p>
      )}
    </div>
  );
}
