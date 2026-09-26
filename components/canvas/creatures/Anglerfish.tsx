"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, Vector3, type Group, type PointLight } from "three";
import { ZONE_SPACING } from "@/lib/depth";
import { seeded } from "@/lib/random";
import { diveFrame } from "../diveFrame";

const BASE_Y = -4 * ZONE_SPACING - 8;
const LURE_TIP = new Vector3(0, 1.7, 2.9);

function Teeth({ y, flip }: { y: number; flip?: boolean }) {
  const teeth = useMemo(() => {
    const rand = seeded(flip ? 5 : 3);
    return Array.from({ length: 11 }, (_, i) => {
      const a = (i / 10 - 0.5) * 2.2;
      return { x: Math.sin(a) * 1.05, z: 1.55 + Math.cos(a) * 0.35, h: 0.18 + rand() * 0.22 };
    });
  }, [flip]);
  return (
    <group position={[0, y, 0]}>
      {teeth.map((t, i) => (
        <mesh key={i} position={[t.x, 0, t.z]} rotation={[flip ? 0 : Math.PI, 0, 0]}>
          <coneGeometry args={[0.035, t.h, 5]} />
          <meshStandardMaterial color="#e8f4f2" emissive="#9fe8ff" emissiveIntensity={0.25} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

export default function Anglerfish() {
  const root = useRef<Group>(null);
  const fish = useRef<Group>(null);
  const jaw = useRef<Group>(null);
  const light = useRef<PointLight>(null);

  const stalk = useMemo(
    () => new CatmullRomCurve3([new Vector3(0, 0.9, 0.6), new Vector3(0, 2.1, 1.4), new Vector3(0, 2.2, 2.4), LURE_TIP]),
    [],
  );

  useFrame(() => {
    if (!root.current || !fish.current) return;
    const visible = diveFrame.zone > 3.1 && diveFrame.zone < 5;
    root.current.visible = visible;
    if (!visible) return;
    const t = diveFrame.time;
    const a = t * 0.07;
    const x = Math.sin(a) * 9;
    const z = -15 + Math.cos(a) * 5;
    fish.current.position.set(x, BASE_Y + Math.sin(t * 0.5) * 0.6, z);
    const dx = Math.cos(a) * 9;
    const dz = -Math.sin(a) * 5;
    fish.current.rotation.y = Math.atan2(dx, dz);
    fish.current.rotation.z = Math.sin(t * 0.8) * 0.05;
    if (jaw.current) jaw.current.rotation.x = 0.35 + Math.sin(t * 0.6) * 0.12;
    if (light.current) light.current.intensity = 26 + Math.sin(t * 2.3) * 6 + Math.sin(t * 7.1) * 2;
  });

  return (
    <group ref={root}>
      <group ref={fish} scale={1.4}>
        <mesh scale={[1.1, 1, 1.5]}>
          <sphereGeometry args={[1, 32, 24]} />
          <meshStandardMaterial color="#141b22" roughness={0.55} metalness={0.2} />
        </mesh>
        <group ref={jaw} position={[0, -0.25, 0.4]}>
          <mesh scale={[1.05, 0.35, 1.25]} position={[0, -0.2, 0.2]}>
            <sphereGeometry args={[1, 24, 16]} />
            <meshStandardMaterial color="#0e1318" roughness={0.6} />
          </mesh>
          <Teeth y={0.1} flip />
        </group>
        <Teeth y={-0.15} />
        <mesh position={[0.62, 0.35, 1.05]}>
          <sphereGeometry args={[0.13, 16, 12]} />
          <meshStandardMaterial color="#0a0a0a" emissive="#6fe3ff" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[-0.62, 0.35, 1.05]}>
          <sphereGeometry args={[0.13, 16, 12]} />
          <meshStandardMaterial color="#0a0a0a" emissive="#6fe3ff" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0, -1.9]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.2, 1, 1]}>
          <coneGeometry args={[0.9, 1.1, 4]} />
          <meshStandardMaterial color="#10161c" roughness={0.6} />
        </mesh>
        <mesh>
          <tubeGeometry args={[stalk, 24, 0.03, 6, false]} />
          <meshStandardMaterial color="#1c252d" roughness={0.5} />
        </mesh>
        <mesh position={LURE_TIP}>
          <sphereGeometry args={[0.16, 20, 16]} />
          <meshBasicMaterial color={[2.5, 6, 6.5]} toneMapped={false} fog={false} />
        </mesh>
        <pointLight ref={light} position={LURE_TIP} color="#8ff4ff" intensity={26} distance={14} decay={1.6} />
      </group>
    </group>
  );
}
