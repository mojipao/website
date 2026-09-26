"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, PlaneGeometry, type Group, type PointLight } from "three";
import { MathUtils } from "three";
import { ZONE_SPACING } from "@/lib/depth";
import { seeded } from "@/lib/random";
import { diveFrame } from "./diveFrame";

const FLOOR_Y = -5 * ZONE_SPACING - 16;

function rockNoise(x: number, y: number) {
  return (
    Math.sin(x * 0.35 + Math.sin(y * 0.2) * 2) * 1.6 +
    Math.sin(y * 0.55 + x * 0.12) * 1.1 +
    Math.sin(x * 1.3 + y * 1.7) * 0.35 +
    Math.sin(x * 2.9 - y * 2.3) * 0.15
  );
}

function createWall(seed: number) {
  const g = new PlaneGeometry(60, 70, 90, 100);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, rockNoise(x + seed * 13, y + seed * 7) * 1.4);
  }
  g.computeVertexNormals();
  return g;
}

function createVentSparks(count: number) {
  const rand = seeded(77);
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const h = Math.pow(rand(), 1.4) * 12;
    const spread = 0.6 + h * 0.45;
    pos[i * 3] = (rand() - 0.5) * spread;
    pos[i * 3 + 1] = h;
    pos[i * 3 + 2] = (rand() - 0.5) * spread;
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  return g;
}

/** Canyon walls, a faint hydrothermal vent, and the submersible's lamp for the hadal zone. */
export default function Trench() {
  const root = useRef<Group>(null);
  const lamp = useRef<PointLight>(null);
  const vent = useRef<PointLight>(null);
  const sparks = useRef<Group>(null);
  const left = useMemo(() => createWall(1), []);
  const right = useMemo(() => createWall(2), []);
  const floor = useMemo(() => createWall(3), []);
  const sparkGeo = useMemo(() => createVentSparks(160), []);

  useFrame(({ camera }) => {
    const t = diveFrame.time;
    const presence = MathUtils.smoothstep(diveFrame.zone, 3.6, 4.8);
    if (root.current) root.current.visible = presence > 0.001;
    if (lamp.current) {
      lamp.current.position.set(camera.position.x, camera.position.y + 1, camera.position.z - 2);
      lamp.current.intensity = presence * 90;
    }
    if (vent.current) vent.current.intensity = presence * (120 + Math.sin(t * 3) * 25 + Math.sin(t * 11) * 8);
    if (sparks.current) {
      sparks.current.position.y = FLOOR_Y + ((t * 0.6) % 2);
    }
  });

  return (
    <>
      <pointLight ref={lamp} color="#bfe9ff" intensity={0} distance={50} decay={1.3} />
      <group ref={root} visible={false}>
        <mesh geometry={left} position={[-17, FLOOR_Y + 20, -18]} rotation={[0, Math.PI / 2.6, 0]}>
          <meshStandardMaterial color="#56687a" roughness={0.9} metalness={0.05} />
        </mesh>
        <mesh geometry={right} position={[17, FLOOR_Y + 20, -18]} rotation={[0, -Math.PI / 2.6, 0]}>
          <meshStandardMaterial color="#56687a" roughness={0.9} metalness={0.05} />
        </mesh>
        <mesh geometry={floor} position={[0, FLOOR_Y, -22]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#4a5864" roughness={1} />
        </mesh>
        <pointLight ref={vent} position={[4, FLOOR_Y + 2.5, -24]} color="#ff7a3c" intensity={0} distance={34} decay={1.4} />
        <mesh position={[4, FLOOR_Y + 0.4, -24]} scale={[1.2, 0.5, 1.2]}>
          <sphereGeometry args={[1, 20, 12]} />
          <meshBasicMaterial color={[4, 1.4, 0.4]} toneMapped={false} />
        </mesh>
        <group ref={sparks} position={[4, FLOOR_Y, -24]}>
          <points geometry={sparkGeo}>
            <pointsMaterial
              color={[3, 1.3, 0.5]}
              size={0.12}
              transparent
              opacity={0.8}
              blending={AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </points>
        </group>
      </group>
    </>
  );
}
