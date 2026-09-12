import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
precision mediump float;
uniform vec2 resolution;
uniform vec2 pointer;

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
  vec2 focus = (pointer * 2.0 - 1.0) * vec2(0.55, -0.45);
  float radius = length(uv - focus);
  float ringA = smoothstep(0.035, 0.0, abs(radius - 0.52));
  float ringB = smoothstep(0.025, 0.0, abs(radius - 0.82));
  float axis = smoothstep(0.018, 0.0, abs(uv.y + uv.x * 0.23));
  vec3 graphite = vec3(0.045, 0.085, 0.068);
  vec3 mineral = vec3(0.34, 0.58, 0.47);
  vec3 apple = vec3(0.56, 0.12, 0.11);
  vec3 color = graphite + mineral * ringA * 0.44 + mineral * ringB * 0.2 + apple * axis * 0.14;
  gl_FragColor = vec4(color, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function ShaderPlanSurface() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!canvas || !gl) return;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    const selectProgram = gl.useProgram.bind(gl);
    selectProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "resolution");
    const pointer = gl.getUniformLocation(program, "pointer");
    const cursor = { x: 0.67, y: 0.4 };

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
      gl.uniform2f(pointer, cursor.x, cursor.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursor.x = (event.clientX - rect.left) / rect.width;
      cursor.y = (event.clientY - rect.top) / rect.height;
      draw();
    };
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", handlePointer, { passive: true });
    draw();
    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointermove", handlePointer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}
