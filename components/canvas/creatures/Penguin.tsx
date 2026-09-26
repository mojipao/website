"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import {
  BufferAttribute,
  CatmullRomCurve3,
  Color,
  ExtrudeGeometry,
  LatheGeometry,
  MathUtils,
  MeshPhysicalMaterial,
  Shape,
  Vector2,
  Vector3,
  type Group,
} from "three";
import { diveFrame } from "../diveFrame";

/** Waves for this many seconds out of every `WAVE_CYCLE`. */
const WAVE_CYCLE = 7;
const WAVE_DURATION = 4;

const FEATHER_DARK = new Color("#0d1014");
const FEATHER_LIGHT = new Color("#f1f2ef");

/** Body silhouette as (radius, height) control points, from feet to neck. */
const BODY_PROFILE: [number, number][] = [
  [0.0, 0.0],
  [0.19, 0.012],
  [0.32, 0.075],
  [0.395, 0.21],
  [0.415, 0.39],
  [0.395, 0.6],
  [0.335, 0.8],
  [0.27, 0.97],
  [0.215, 1.1],
  [0.19, 1.2],
  [0.0, 1.3],
];

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
};

function createBody() {
  const curve = new CatmullRomCurve3(BODY_PROFILE.map(([r, y]) => new Vector3(r, y, 0)), false, "centripetal");
  const points = curve.getPoints(64).map((p) => new Vector2(Math.max(p.x, 0), p.y));
  const g = new LatheGeometry(points, 72);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new Color();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    let z = pos.getZ(i);
    const r = Math.hypot(x, z) || 1;
    const facing = z / r;
    // Slightly fuller chest, flatter back.
    z *= z > 0 ? 1.02 : 0.86;
    pos.setZ(i, z);

    const front = smoothstep(0.42, 0.62, facing);
    const belowThroat = 1 - smoothstep(1.0, 1.06, y);
    c.copy(FEATHER_DARK).lerp(FEATHER_LIGHT, front * belowThroat);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  g.setAttribute("color", new BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

function createFlipper() {
  const s = new Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.1, -0.02, 0.11, -0.3, 0.035, -0.54);
  s.bezierCurveTo(0.018, -0.59, -0.006, -0.59, -0.014, -0.53);
  s.bezierCurveTo(-0.055, -0.3, -0.06, -0.06, 0, 0);
  const g = new ExtrudeGeometry(s, {
    depth: 0.012,
    bevelEnabled: true,
    bevelThickness: 0.014,
    bevelSize: 0.012,
    bevelSegments: 5,
    curveSegments: 32,
  });
  g.translate(0, 0, -0.006);
  g.rotateY(Math.PI / 2);
  g.computeVertexNormals();
  return g;
}

function useFeatherMaterial(color: Color | null) {
  const material = useMemo(
    () =>
      new MeshPhysicalMaterial({
        vertexColors: color === null,
        color: color ?? new Color("#ffffff"),
        roughness: 0.6,
        sheen: 0.7,
        sheenRoughness: 0.4,
        sheenColor: new Color("#5d6b78"),
      }),
    [color],
  );
  useEffect(() => () => material.dispose(), [material]);
  return material;
}

export default function Penguin(props: ThreeElements["group"]) {
  const body = useRef<Group>(null);
  const head = useRef<Group>(null);
  const waving = useRef<Group>(null);
  const twist = useRef<Group>(null);
  const resting = useRef<Group>(null);

  const bodyGeo = useMemo(() => createBody(), []);
  const flipperGeo = useMemo(() => createFlipper(), []);
  useEffect(
    () => () => {
      bodyGeo.dispose();
      flipperGeo.dispose();
    },
    [bodyGeo, flipperGeo],
  );

  const bodyMat = useFeatherMaterial(null);
  const darkMat = useFeatherMaterial(FEATHER_DARK);
  const lightMat = useFeatherMaterial(FEATHER_LIGHT);

  useFrame(() => {
    if (!body.current) return;
    const t = diveFrame.time;
    const phase = t % WAVE_CYCLE;
    const wave =
      MathUtils.smoothstep(phase, 0, 0.6) * (1 - MathUtils.smoothstep(phase, WAVE_DURATION - 0.6, WAVE_DURATION));

    if (waving.current) {
      const raised = 2.25 + Math.sin(t * 7) * 0.32;
      waving.current.rotation.z = MathUtils.lerp(0.12, raised, wave);
    }
    if (twist.current) twist.current.rotation.y = -1.25 * wave;
    if (resting.current) resting.current.rotation.z = -0.12 - Math.sin(t * 1.8) * 0.025;

    body.current.rotation.z = Math.sin(t * 7) * 0.018 * wave + Math.sin(t * 0.9) * 0.015 * (1 - wave);
    body.current.rotation.x = -0.03 + Math.sin(t * 0.6) * 0.01;

    if (head.current) {
      head.current.rotation.z = Math.sin(t * 0.7) * 0.1 + wave * 0.1;
      head.current.rotation.y = Math.sin(t * 0.35) * 0.18;
      head.current.rotation.x = -0.06 + Math.sin(t * 0.5) * 0.04;
    }
  });

  return (
    <group {...props}>
      <group ref={body}>
        <mesh geometry={bodyGeo} material={bodyMat} />

        <group ref={head} position={[0, 1.2, 0.02]}>
          <mesh position={[0, 0.08, 0]} scale={[0.225, 0.215, 0.24]} material={darkMat}>
            <sphereGeometry args={[1, 48, 36]} />
          </mesh>
          {[-1, 1].map((s) => (
            <group key={s} position={[0.128 * s, 0.123, 0.185]} rotation={[0, 0.62 * s, 0]}>
              <mesh material={lightMat}>
                <torusGeometry args={[0.028, 0.008, 12, 32]} />
              </mesh>
              <mesh>
                <sphereGeometry args={[0.02, 16, 12]} />
                <meshPhysicalMaterial color="#050608" roughness={0.08} clearcoat={1} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, 0.06, 0.285]} rotation={[Math.PI / 2 - 0.18, 0, 0]} scale={[1, 1, 0.75]}>
            <coneGeometry args={[0.036, 0.11, 24]} />
            <meshPhysicalMaterial color="#3a2622" roughness={0.35} clearcoat={0.6} />
          </mesh>
        </group>

        <group ref={waving} position={[0.36, 0.93, 0.02]}>
          <group ref={twist}>
            <mesh geometry={flipperGeo} material={darkMat} />
          </group>
        </group>
        <group ref={resting} position={[-0.36, 0.93, 0.02]} scale={[-1, 1, 1]}>
          <mesh geometry={flipperGeo} material={darkMat} />
        </group>

        <mesh position={[0, 0.1, -0.33]} rotation={[-1.1, 0, 0]} scale={[0.12, 0.2, 0.04]} material={darkMat}>
          <sphereGeometry args={[1, 24, 16]} />
        </mesh>
      </group>

      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.13 * s, 0.018, 0.14]} rotation={[0, 0.2 * s, 0]} scale={[0.085, 0.022, 0.13]}>
          <sphereGeometry args={[1, 24, 16]} />
          <meshPhysicalMaterial color="#e3a39b" roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}
