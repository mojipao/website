"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, DoubleSide, ShaderMaterial, type Group } from "three";
import { seeded } from "@/lib/random";
import { SURFACE_Y } from "@/lib/depth";
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
uniform float uSeed;
varying vec2 vUv;
void main() {
  // Clamp: multisampled edge fragments extrapolate uv slightly outside 0..1, and pow() of a negative is NaN.
  vec2 uv = clamp(vUv, 0.0, 1.0);
  float edge = pow(sin(uv.x * 3.14159), 2.5);
  float fall = pow(uv.y, 1.8);
  float flicker = 0.65 + 0.35 * sin(uTime * 0.6 + uSeed * 12.0 + vUv.y * 3.0);
  float a = edge * fall * flicker * uOpacity;
  gl_FragColor = vec4(vec3(0.75, 0.97, 1.0) * a, a);
}
`;

export default function GodRays({ count = 12 }: { count?: number }) {
  const group = useRef<Group>(null);
  const rays = useMemo(() => {
    const rand = seeded(7);
    return Array.from({ length: count }, (_, i) => {
      const material = new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uTime: { value: 0 }, uOpacity: { value: 0.3 }, uSeed: { value: rand() } },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
      });
      return {
        x: (i / (count - 1) - 0.5) * 56 + (rand() - 0.5) * 6,
        z: -8 - rand() * 30,
        width: 1.5 + rand() * 4.5,
        tilt: 0.12 + rand() * 0.12,
        material,
      };
    });
  }, [count]);

  useFrame(() => {
    if (!group.current) return;
    const visible = diveFrame.sunlight > 0.01 && diveFrame.above < 0.5;
    group.current.visible = visible;
    if (!visible) return;
    group.current.position.y = Math.min(diveFrame.cameraY, 0) * 0.8;
    for (const r of rays) {
      r.material.uniforms.uTime.value = diveFrame.time;
      r.material.uniforms.uOpacity.value = diveFrame.sunlight * 0.32;
    }
  });

  return (
    <group ref={group}>
      {rays.map((r, i) => (
        <mesh key={i} position={[r.x, SURFACE_Y - 30, r.z]} rotation={[0, 0, r.tilt]} material={r.material}>
          <planeGeometry args={[r.width, 64]} />
        </mesh>
      ))}
    </group>
  );
}
