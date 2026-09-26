"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Vector3, type Points, type ShaderMaterial } from "three";
import { seeded } from "@/lib/random";
import { diveFrame } from "./diveFrame";

const BOX = new Vector3(70, 46, 60);

const vertexShader = /* glsl */ `
uniform float uTime;
uniform vec3 uCamera;
uniform vec3 uBox;
uniform float uPixelRatio;
attribute float aSeed;
varying float vSeed;
varying float vFade;

void main() {
  vec3 drift = vec3(
    sin(uTime * 0.2 + aSeed * 40.0) * 0.02,
    -uTime * (0.006 + aSeed * 0.01),
    cos(uTime * 0.15 + aSeed * 25.0) * 0.02
  );
  vec3 local = fract(position + drift - uCamera / uBox) - 0.5;
  vec3 world = uCamera + local * uBox;
  world.z -= uBox.z * 0.3;
  vec4 mv = viewMatrix * vec4(world, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = -mv.z;
  vFade = smoothstep(uBox.z * 0.9, 4.0, dist) * smoothstep(0.5, 3.0, dist);
  vSeed = aSeed;
  gl_PointSize = (0.8 + aSeed * 2.2) * uPixelRatio * (40.0 / max(dist, 0.5));
}
`;

const fragmentShader = /* glsl */ `
uniform float uBio;
uniform float uTime;
varying float vSeed;
varying float vFade;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float disc = smoothstep(0.5, 0.0, d);
  vec3 snow = vec3(0.85, 0.95, 1.0);
  vec3 glow = mix(vec3(0.2, 0.95, 1.0), vec3(0.45, 0.4, 1.0), step(0.7, vSeed));
  float glowing = step(0.82, vSeed) * uBio;
  float pulse = 0.55 + 0.45 * sin(uTime * (1.0 + vSeed * 2.0) + vSeed * 50.0);
  vec3 col = mix(snow * 0.55, glow * (1.4 + pulse * 1.6), glowing);
  float a = disc * vFade * mix(0.55, 1.0, glowing);
  gl_FragColor = vec4(col * a, a);
}
`;

export default function MarineSnow({ count = 2000 }: { count?: number }) {
  const points = useRef<Points>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const rand = seeded(42);
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = rand();
      pos[i * 3 + 1] = rand();
      pos[i * 3 + 2] = rand();
      seed[i] = rand();
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCamera: { value: new Vector3() },
      uBox: { value: BOX },
      uPixelRatio: { value: 1 },
      uBio: { value: 0 },
    }),
    [],
  );

  useFrame(({ camera }) => {
    const mat = points.current?.material as ShaderMaterial | undefined;
    if (!mat) return;
    mat.uniforms.uTime.value = diveFrame.time;
    mat.uniforms.uCamera.value.copy(camera.position);
    mat.uniforms.uPixelRatio.value = dpr;
    mat.uniforms.uBio.value = diveFrame.biolum;
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
