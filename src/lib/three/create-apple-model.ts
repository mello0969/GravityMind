import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export async function loadAppleModel() {
  const { scene } = await new GLTFLoader().loadAsync("/models/apple.glb");
  const bounds = new THREE.Box3().setFromObject(scene);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());

  // The scan is in metres. Fit its natural proportions to the previous fruit's width.
  const fitted = new THREE.Group();
  fitted.add(scene);
  scene.position.sub(center);
  fitted.scale.setScalar(1.8 / size.x);

  const apple = new THREE.Group();
  apple.name = "gravitymind-apple";
  apple.add(fitted);
  apple.rotation.set(-0.025, -0.2, -0.01);
  return apple;
}

export function disposeAppleModel(group: THREE.Group) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const bitmaps = new Set<ImageBitmap>();

  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
      for (const value of Object.values(material)) {
        if (!(value instanceof THREE.Texture)) continue;
        textures.add(value);
        if (typeof ImageBitmap !== "undefined" && value.source.data instanceof ImageBitmap) {
          bitmaps.add(value.source.data);
        }
      }
    }
  });

  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();
  for (const texture of textures) texture.dispose();
  for (const bitmap of bitmaps) bitmap.close();
}
