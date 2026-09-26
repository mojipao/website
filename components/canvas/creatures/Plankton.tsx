"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, type Points, type ShaderMaterial } from "three";
import { seeded } from "@/lib/random";
import { ZONE_SPACING } from "@/lib/depth";
import { diveFrame } from "../diveFrame";

const CENTER_Y = -3 * ZONE_SPACING;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uCenterY;
attribute vec3 aParams;
varying float vSeed;
varying float vFade;

void main() {
  float radius = aParams.x;
  float angle = aParams.y + uTime * 0.045;
  float seed = aParams.z;
  // Face-on disc, tilted back so the spiral arms read clearly.
  vec3 disc = vec3(cos(angle) * radius, sin(angle) * radius, position.y);
  float tilt = 0.5;
  vec3 world = vec3(
    disc.x,
    uCenterY - 2.0 + disc.y * cos(tilt) - disc.z * sin(tilt),
    -36.0 + disc.y * sin(tilt) + disc.z * cos(tilt)
  );
  world.y += sin(uTime * 0.4 + seed * 30.0) * 0.4;
  vec4 mv = viewMatrix * vec4(world, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = -mv.z;
  vFade = smoothstep(80.0, 10.0, dist) * smoothstep(0.5, 4.0, dist);
  vSeed = seed;
  gl_PointSize = (2.5 + seed * 4.5) * uPixelRatio * (40.0 / max(dist, 0.5));
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
varying float vSeed;
varying float vFade;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float core = smoothstep(0.5, 0.0, d);
  core *= core;
  vec3 a = vec3(0.15, 1.0, 0.95);
  vec3 b = vec3(0.35, 0.45, 1.0);
  vec3 c = vec3(0.85, 0.35, 1.0);
  vec3 col = vSeed < 0.5 ? mix(a, b, vSeed * 2.0) : mix(b, c, (vSeed - 0.5) * 2.0);
  float twinkle = 0.55 + 0.45 * pow(0.5 + 0.5 * sin(uTime * (0.8 + vSeed * 2.5) + vSeed * 80.0), 3.0);
  float alpha = core * vFade * twinkle * uOpacity;
  gl_FragColor = vec4(col * 5.5 * alpha, alpha);
}
`;

/** A slowly spiralling galaxy of bioluminescent plankton in the midnight zone. */
export default function Plankton({ count = 600 }: { count?: number }) {
  const points = useRef<Points>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  const geometry = useMemo(() => {
    const rand = seeded(99);
    const pos = new Float32Array(count * 3);
    const params = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const arm = Math.floor(rand() * 3);
      const radius = 1 + Math.pow(rand(), 0.8) * 26;
      pos[i * 3 + 1] = (rand() - 0.5) * (4 - radius * 0.1);
      params[i * 3] = radius;
      params[i * 3 + 1] = arm * ((Math.PI * 2) / 3) + radius * 0.22 + (rand() - 0.5) * (0.35 + 6 / (radius + 4));
      params[i * 3 + 2] = rand();
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    g.setAttribute("aParams", new BufferAttribute(params, 3));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uCenterY: { value: CENTER_Y },
      uOpacity: { value: 0 },
    }),
    [],
  );

  useFrame(() => {
    if (!points.current) return;
    const opacity = Math.max(0, 1 - Math.abs(diveFrame.zone - 3) / 1.3);
    points.current.visible = opacity > 0.001;
    const mat = points.current.material as ShaderMaterial;
    mat.uniforms.uTime.value = diveFrame.time;
    mat.uniforms.uPixelRatio.value = dpr;
    mat.uniforms.uOpacity.value = opacity;
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
