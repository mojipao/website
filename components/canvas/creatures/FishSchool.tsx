"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  ConeGeometry,
  MeshStandardMaterial,
  Object3D,
  SphereGeometry,
  Vector3,
  type InstancedMesh,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { seeded } from "@/lib/random";
import { ZONE_SPACING } from "@/lib/depth";
import { diveFrame } from "../diveFrame";

const BASE_Y = -0.8 * ZONE_SPACING;

function createFishGeometry() {
  const body = new SphereGeometry(1, 12, 8);
  body.scale(0.07, 0.16, 0.42);
  const tail = new ConeGeometry(0.14, 0.24, 4);
  tail.rotateX(Math.PI / 2);
  tail.scale(0.25, 1, 1);
  tail.translate(0, 0, -0.5);
  const merged = mergeGeometries([body.toNonIndexed(), tail.toNonIndexed()]);
  merged.computeVertexNormals();
  return merged;
}

function createFishMaterial(uTime: { value: number }) {
  const mat = new MeshStandardMaterial({ color: "#d4eef5", metalness: 0.85, roughness: 0.28 });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        float phase = uTime * 11.0 + float(gl_InstanceID) * 1.7;
        float bend = max(-position.z, 0.0);
        transformed.x += sin(phase + position.z * 5.0) * 0.12 * bend;`,
      );
  };
  return mat;
}

interface Fish {
  offset: Vector3;
  pos: Vector3;
  vel: Vector3;
  speed: number;
}

export default function FishSchool({ count = 150 }: { count?: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const uTime = useMemo(() => ({ value: 0 }), []);
  const geometry = useMemo(() => createFishGeometry(), []);
  const material = useMemo(() => createFishMaterial(uTime), [uTime]);
  const dummy = useMemo(() => new Object3D(), []);
  const center = useMemo(() => new Vector3(), []);
  const steer = useMemo(() => new Vector3(), []);

  const fish = useMemo<Fish[]>(() => {
    const rand = seeded(11);
    return Array.from({ length: count }, () => {
      const offset = new Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5)
        .normalize()
        .multiplyScalar(1.5 + rand() * 4.5);
      offset.y *= 0.45;
      return {
        offset,
        pos: new Vector3(offset.x, BASE_Y + offset.y, -18 + offset.z),
        vel: new Vector3(),
        speed: 0.8 + rand() * 0.5,
      };
    });
  }, [count]);

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const visible = diveFrame.zone < 2.2;
    mesh.current.visible = visible;
    if (!visible) return;
    const dt = Math.min(delta, 0.05);
    const t = diveFrame.time;
    uTime.value = t;
    center.set(Math.sin(t * 0.13) * 16, BASE_Y + Math.sin(t * 0.21) * 5, -20 + Math.cos(t * 0.13) * 9);
    const swirl = t * 0.35;

    for (let i = 0; i < fish.length; i++) {
      const f = fish[i];
      const cs = Math.cos(swirl * f.speed);
      const sn = Math.sin(swirl * f.speed);
      steer.set(
        center.x + f.offset.x * cs - f.offset.z * sn,
        center.y + f.offset.y + Math.sin(t + i) * 0.3,
        center.z + f.offset.x * sn + f.offset.z * cs,
      );
      steer.sub(f.pos).multiplyScalar(1.6 * f.speed);
      f.vel.lerp(steer, 1 - Math.exp(-2.2 * dt));
      f.pos.addScaledVector(f.vel, dt);

      dummy.position.copy(f.pos);
      dummy.lookAt(f.pos.x + f.vel.x, f.pos.y + f.vel.y, f.pos.z + f.vel.z);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} />;
}
