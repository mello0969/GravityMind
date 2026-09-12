import { readFileSync } from "node:fs";
import * as THREE from "three";
import { type GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { disposeAppleModel, loadAppleModel } from "@/lib/three/create-apple-model";

afterEach(() => vi.restoreAllMocks());

describe("Poly Haven apple", () => {
  it("ships a self-contained GLB with three embedded PBR textures", () => {
    const bytes = readFileSync("public/models/apple.glb");
    expect(bytes.toString("ascii", 0, 4)).toBe("glTF");
    expect(bytes.readUInt32LE(4)).toBe(2);
    expect(bytes.readUInt32LE(8)).toBe(bytes.length);
    expect(bytes.length).toBeLessThan(25 * 1024 * 1024);
    const jsonLength = bytes.readUInt32LE(12);
    const gltf = JSON.parse(bytes.toString("utf8", 20, 20 + jsonLength));
    const material = gltf.materials[0];
    expect(material.normalTexture.index).toBeTypeOf("number");
    expect(material.pbrMetallicRoughness.baseColorTexture.index).toBeTypeOf("number");
    expect(material.pbrMetallicRoughness.metallicRoughnessTexture.index).toBeTypeOf("number");
    expect(gltf.buffers[0].uri).toBeUndefined();
    expect(gltf.images).toHaveLength(3);
    for (const image of gltf.images) {
      expect(image.uri).toBeUndefined();
      const view = gltf.bufferViews[image.bufferView];
      expect(view.byteLength).toBeGreaterThan(100_000);
      if (image.mimeType === "image/png") {
        const offset = 28 + jsonLength + (view.byteOffset ?? 0);
        expect(bytes.readUInt32BE(offset + 16)).toBe(4096);
        expect(bytes.readUInt32BE(offset + 20)).toBe(4096);
        expect(bytes[offset + 24]).toBe(8);
      }
    }
  });

  it("normalizes metric geometry without replacing its material or stretching it", async () => {
    const scene = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ map: new THREE.Texture() });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.09), material);
    mesh.position.set(0, 0.04, 0);
    scene.add(mesh);
    const loader = vi.spyOn(GLTFLoader.prototype, "loadAsync").mockResolvedValue({ scene } as GLTF);
    const apple = await loadAppleModel();
    apple.rotation.set(0, 0, 0);
    const bounds = new THREE.Box3().setFromObject(apple);
    const size = bounds.getSize(new THREE.Vector3());
    expect(loader).toHaveBeenCalledWith("/models/apple.glb");
    expect(size.x).toBeCloseTo(1.8);
    expect(size.y / size.x).toBeCloseTo(0.8);
    expect(bounds.getCenter(new THREE.Vector3()).length()).toBeCloseTo(0);
    expect(mesh.material).toBe(material);
    disposeAppleModel(apple);
  });

  it("disposes shared geometry, materials and textures only once", () => {
    const group = new THREE.Group();
    const texture = new THREE.Texture();
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ map: texture, roughnessMap: texture });
    group.add(new THREE.Mesh(geometry, material), new THREE.Mesh(geometry, material));
    const disposeTexture = vi.spyOn(texture, "dispose");
    const disposeGeometry = vi.spyOn(geometry, "dispose");
    const disposeMaterial = vi.spyOn(material, "dispose");
    disposeAppleModel(group);
    expect(disposeTexture).toHaveBeenCalledTimes(1);
    expect(disposeGeometry).toHaveBeenCalledTimes(1);
    expect(disposeMaterial).toHaveBeenCalledTimes(1);
  });
});
