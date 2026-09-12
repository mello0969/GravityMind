"""Run inside Blender with the original Poly Haven .blend already open."""

from pathlib import Path
import sys

import bpy
import numpy as np


output = Path(sys.argv[sys.argv.index("--") + 1]).resolve()
output.parent.mkdir(parents=True, exist_ok=True)

# A float EXR becomes a 32 MB 16-bit PNG in glTF. Keep 4K resolution,
# but use an ordinary 8-bit, non-color normal map for browser delivery.
for material in bpy.data.materials:
    if not material.use_nodes:
        continue
    for node in material.node_tree.nodes:
        if node.type != "TEX_IMAGE" or not node.image:
            continue
        source = node.image
        if not source.filepath.lower().endswith(".exr"):
            continue
        width, height = source.size
        pixels = np.empty(width * height * 4, dtype=np.float32)
        source.pixels.foreach_get(pixels)
        normal = bpy.data.images.new(
            source.name + "_web", width=width, height=height,
            alpha=False, float_buffer=False,
        )
        normal.colorspace_settings.name = "Non-Color"
        normal.pixels.foreach_set(pixels)
        normal.filepath_raw = bpy.path.abspath("//textures/food_apple_01_nor_gl_4k_web.png")
        normal.file_format = "PNG"
        normal.save()
        node.image = normal

bpy.ops.export_scene.gltf(
    filepath=str(output), export_format="GLB", export_materials="EXPORT",
)
print(f"Exported {output}: {output.stat().st_size:,} bytes")
