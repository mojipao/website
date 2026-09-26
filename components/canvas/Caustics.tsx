"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, type Mesh, type ShaderMaterial } from "three";
import { causticGLSL } from "./glsl";
import { diveFrame } from "./diveFrame";

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform float uScroll;
varying vec2 vUv;
${causticGLSL}
void main() {
  vec2 uv = vUv * vec2(2.2, 1.4) + vec2(0.0, uScroll);
  float c = caustic(uv, uTime * 0.35);
  float c2 = caustic(uv * 1.7 + 3.1, uTime * 0.28);
  float fadeTop = smoothstep(0.0, 1.0, vUv.y);
  float a = (c * 0.8 + c2 * 0.4) * fadeTop * uOpacity;
  gl_FragColor = vec4(vec3(0.6, 0.95, 1.0) * a, a);
}
`;

/** A camera-locked sheet of shimmering light, like sunlight refracting through the water volume. */
export default function Caustics() {
  const mesh = useRef<Mesh>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uOpacity: { value: 0.2 }, uScroll: { value: 0 } }),
    [],
  );

  useFrame(({ camera }) => {
    if (!mesh.current) return;
    const visible = diveFrame.sunlight > 0.01 && diveFrame.above < 0.5;
    mesh.current.visible = visible;
    if (!visible) return;
    mesh.current.position.copy(camera.position);
    mesh.current.quaternion.copy(camera.quaternion);
    mesh.current.translateZ(-45);
    const mat = mesh.current.material as ShaderMaterial;
    mat.uniforms.uTime.value = diveFrame.time;
    mat.uniforms.uOpacity.value = diveFrame.sunlight * 0.22;
    mat.uniforms.uScroll.value = diveFrame.cameraY * 0.004;
  });

  return (
    <mesh ref={mesh} renderOrder={-1}>
      <planeGeometry args={[110, 70]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}
