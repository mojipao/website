"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Vector3, type Mesh, type ShaderMaterial } from "three";
import { causticGLSL } from "./glsl";
import { diveFrame } from "./diveFrame";

export const SURFACE_Y = 14;

const vertexShader = /* glsl */ `
uniform float uTime;
varying vec3 vWorld;
varying float vHeight;

float waves(vec2 p, float t) {
  float h = 0.0;
  h += sin(p.x * 0.18 + t * 0.9) * 0.55;
  h += sin(p.y * 0.23 - t * 0.7) * 0.45;
  h += sin((p.x + p.y) * 0.41 + t * 1.3) * 0.22;
  h += sin((p.x - p.y) * 0.77 - t * 1.7) * 0.1;
  return h;
}

void main() {
  vec3 pos = position;
  float h = waves(pos.xy, uTime);
  pos.z += h;
  vHeight = h;
  vec4 world = modelMatrix * vec4(pos, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uCamera;
varying vec3 vWorld;
varying float vHeight;
${causticGLSL}

void main() {
  float dist = length(vWorld.xz - uCamera.xz);
  // Snell's window: the sky is only visible in a cone straight overhead.
  float window = smoothstep(40.0, 4.0, dist);
  vec3 deep = vec3(0.04, 0.32, 0.5);
  vec3 sky = vec3(0.45, 0.78, 0.9);
  vec3 col = mix(deep, sky, window * 0.6);

  float c = caustic(vWorld.xz * 0.035, uTime * 0.45);
  col += c * vec3(0.55, 0.9, 1.0) * (0.2 + window * 0.35);
  col += smoothstep(0.6, 1.2, vHeight) * 0.12 * window;

  float sun = smoothstep(16.0, 0.0, length(vWorld.xz - vec2(10.0, -30.0)));
  col += vec3(1.0, 0.98, 0.9) * sun * sun * 0.6;

  float alpha = smoothstep(110.0, 40.0, dist) * uOpacity;
  gl_FragColor = vec4(col, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export default function Surface() {
  const mesh = useRef<Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uCamera: { value: new Vector3() },
    }),
    [],
  );

  useFrame(({ camera }) => {
    const mat = mesh.current?.material as ShaderMaterial | undefined;
    if (!mat || !mesh.current) return;
    mat.uniforms.uTime.value = diveFrame.time;
    mat.uniforms.uCamera.value.copy(camera.position);
    mat.uniforms.uOpacity.value = diveFrame.sunlight;
    mesh.current.visible = diveFrame.zone < 1.6;
  });

  return (
    <mesh ref={mesh} position={[0, SURFACE_Y, -20]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[240, 240, 160, 160]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={DoubleSide}
      />
    </mesh>
  );
}
