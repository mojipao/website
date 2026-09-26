"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BackSide, Color, Vector3, type Mesh } from "three";
import { diveFrame } from "./diveFrame";

export const SKY_HORIZON = new Color("#cfe6f2");
export const SUN_DIRECTION = new Vector3(0.45, 0.32, -1).normalize();

const vertexShader = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 world = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uHorizon;
uniform vec3 uZenith;
uniform vec3 uOcean;
uniform vec3 uSunDir;
varying vec3 vDir;

void main() {
  vec3 d = normalize(vDir);
  vec3 col = d.y > 0.0
    ? mix(uHorizon, uZenith, pow(d.y, 0.55))
    : mix(uHorizon, uOcean, pow(-d.y, 1.5));
  float s = max(dot(d, uSunDir), 0.0);
  col += vec3(1.0, 0.96, 0.85) * (pow(s, 900.0) * 4.0 + pow(s, 24.0) * 0.25);
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

/** Arctic sky dome, only drawn while the camera is above the water. */
export default function Sky() {
  const mesh = useRef<Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uHorizon: { value: SKY_HORIZON },
      uZenith: { value: new Color("#4f9fd6") },
      uOcean: { value: new Color("#3f7d9a") },
      uSunDir: { value: SUN_DIRECTION },
    }),
    [],
  );

  useFrame(({ camera }) => {
    if (!mesh.current) return;
    mesh.current.visible = diveFrame.above > 0.001;
    mesh.current.position.copy(camera.position);
  });

  return (
    <mesh ref={mesh} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[180, 48, 24]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}
