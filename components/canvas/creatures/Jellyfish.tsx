"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  LineBasicMaterial,
  ShaderMaterial,
  SphereGeometry,
  type Group,
} from "three";
import { seeded } from "@/lib/random";
import { ZONE_SPACING } from "@/lib/depth";
import { diveFrame } from "../diveFrame";

const CENTER_Y = -2 * ZONE_SPACING;
const RANGE = 34;
const TENTACLES = 10;
const SEGMENTS = 22;

const bellVertex = /* glsl */ `
uniform float uTime;
uniform float uSeed;
varying vec3 vNormalV;
varying vec3 vViewDir;
varying float vHeight;

void main() {
  float pulse = sin(uTime * 1.8 + uSeed * 6.2831);
  vec3 p = position;
  float rim = 1.0 - clamp(p.y, 0.0, 1.0);
  p.xz *= 1.0 + pulse * 0.14 * rim;
  p.y *= 1.0 - pulse * 0.12;
  p.y += sin(atan(p.z, p.x) * 8.0) * 0.04 * rim;
  vHeight = position.y;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vNormalV = normalize(normalMatrix * normal);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const bellFragment = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uRimColor;
uniform float uGlow;
varying vec3 vNormalV;
varying vec3 vViewDir;
varying float vHeight;

void main() {
  float fres = pow(1.0 - abs(dot(normalize(vNormalV), vViewDir)), 2.2);
  vec3 col = mix(uColor * 0.5, uRimColor * 2.6, fres);
  col += uColor * smoothstep(0.55, 0.95, vHeight) * 1.2;
  float a = (0.14 + fres * 0.9) * uGlow;
  gl_FragColor = vec4(col * a, a);
}
`;

const PALETTE: [string, string][] = [
  ["#ff7ad9", "#9fd8ff"],
  ["#8a7dff", "#7cf7ff"],
  ["#ff9f6b", "#ffd6f5"],
  ["#5cf2d6", "#c1a8ff"],
];

interface Jelly {
  x: number;
  y: number;
  z: number;
  scale: number;
  seed: number;
  bell: ShaderMaterial;
  tentacleGeo: BufferGeometry;
  tentacleMat: LineBasicMaterial;
}

export default function Jellyfish({ count = 8 }: { count?: number }) {
  const groups = useRef<(Group | null)[]>([]);
  const root = useRef<Group>(null);
  const bellGeo = useMemo(() => new SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.5), []);

  const jellies = useMemo<Jelly[]>(() => {
    const rand = seeded(23);
    return Array.from({ length: count }, (_, i) => {
      const [c, rim] = PALETTE[i % PALETTE.length];
      const seed = rand();
      const bell = new ShaderMaterial({
        vertexShader: bellVertex,
        fragmentShader: bellFragment,
        uniforms: {
          uTime: { value: 0 },
          uSeed: { value: seed },
          uColor: { value: new Color(c) },
          uRimColor: { value: new Color(rim) },
          uGlow: { value: 1 },
        },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
      });
      const tentacleGeo = new BufferGeometry();
      tentacleGeo.setAttribute(
        "position",
        new BufferAttribute(new Float32Array(TENTACLES * SEGMENTS * 2 * 3), 3),
      );
      const tentacleMat = new LineBasicMaterial({
        color: new Color(c).lerp(new Color(rim), 0.3).multiplyScalar(1.6),
        transparent: true,
        opacity: 0.55,
        toneMapped: false,
        blending: AdditiveBlending,
        depthWrite: false,
      });
      return {
        x: (rand() - 0.5) * 36,
        y: CENTER_Y + (rand() - 0.5) * RANGE * 2,
        z: -8 - rand() * 26,
        scale: 0.8 + rand() * 1.6,
        seed,
        bell,
        tentacleGeo,
        tentacleMat,
      };
    });
  }, [count]);

  useEffect(
    () => () => {
      bellGeo.dispose();
      for (const j of jellies) {
        j.bell.dispose();
        j.tentacleGeo.dispose();
        j.tentacleMat.dispose();
      }
    },
    [bellGeo, jellies],
  );

  useFrame((_, delta) => {
    if (!root.current) return;
    const visible = diveFrame.zone > 1 && diveFrame.zone < 3.3;
    root.current.visible = visible;
    if (!visible) return;
    const t = diveFrame.time;
    const dt = Math.min(delta, 0.05);

    for (let i = 0; i < jellies.length; i++) {
      const j = jellies[i];
      const g = groups.current[i];
      if (!g) continue;
      const pulse = Math.sin(t * 1.8 + j.seed * Math.PI * 2);
      j.y += (0.35 + Math.max(pulse, 0) * 0.9) * dt;
      if (j.y > CENTER_Y + RANGE) j.y -= RANGE * 2;
      g.position.set(j.x + Math.sin(t * 0.2 + j.seed * 9) * 1.5, j.y, j.z);
      g.rotation.z = Math.sin(t * 0.3 + j.seed * 5) * 0.18;
      g.rotation.x = Math.cos(t * 0.25 + j.seed * 3) * 0.12;
      j.bell.uniforms.uTime.value = t;

      const arr = j.tentacleGeo.attributes.position.array as Float32Array;
      let k = 0;
      for (let n = 0; n < TENTACLES; n++) {
        const a = (n / TENTACLES) * Math.PI * 2;
        const r = 0.75 + 0.1 * pulse;
        let px = Math.cos(a) * r;
        let py = 0;
        let pz = Math.sin(a) * r;
        for (let s = 1; s <= SEGMENTS; s++) {
          const sway = Math.sin(t * 1.4 - s * 0.35 + n + j.seed * 10) * s * 0.012;
          const nx = Math.cos(a) * (r - s * 0.018) + sway;
          const ny = -s * 0.16 - Math.max(pulse, 0) * s * 0.01;
          const nz = Math.sin(a) * (r - s * 0.018) + Math.cos(t * 1.1 - s * 0.3 + n) * s * 0.01;
          arr[k++] = px;
          arr[k++] = py;
          arr[k++] = pz;
          arr[k++] = nx;
          arr[k++] = ny;
          arr[k++] = nz;
          px = nx;
          py = ny;
          pz = nz;
        }
      }
      j.tentacleGeo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={root}>
      {jellies.map((j, i) => (
        <group
          key={i}
          ref={(g) => {
            groups.current[i] = g;
          }}
          scale={j.scale}
        >
          <mesh geometry={bellGeo} material={j.bell} />
          <lineSegments geometry={j.tentacleGeo} material={j.tentacleMat} frustumCulled={false} />
        </group>
      ))}
    </group>
  );
}
