"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute,
  Color,
  IcosahedronGeometry,
  Mesh,
  MeshPhysicalMaterial,
  Raycaster,
  Vector3,
  type BufferGeometry,
  type Group,
} from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { SURFACE_Y } from "@/lib/depth";
import { fbm, ridged, smin } from "@/lib/noise";
import { diveFrame } from "./diveFrame";
import Penguin from "./creatures/Penguin";

const PENGUIN_XZ: [number, number] = [-2.6, 4.2];

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
};

const ICE_TOP = new Color("#f4fafd");
const ICE_CREVICE = new Color("#a8d6ea");
const ICE_WATERLINE = new Color("#74c6dc");
const ICE_SUBMERGED = new Color("#5fb6d2");
const ICE_DEEP = new Color("#23729b");

/**
 * One continuous, densely tessellated iceberg: a sphere pushed into cliffs and
 * a sloping plateau above the waterline, a broad eroded mass below it, and a
 * wave-cut notch at the waterline. Vertex colors carry the glacial tinting.
 */
function createIceberg(detail: number): BufferGeometry {
  let g: BufferGeometry = new IcosahedronGeometry(1, detail);
  g.deleteAttribute("normal");
  g.deleteAttribute("uv");
  g = mergeVertices(g);

  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new Color();
  const d = new Vector3();

  for (let i = 0; i < pos.count; i++) {
    d.fromBufferAttribute(pos, i).normalize();
    const macro = fbm(d.x * 1.3 + 3.1, d.y * 1.3, d.z * 1.3 - 1.7, 4);
    const crease = ridged(d.x * 3.2, d.y * 3.2 + 7, d.z * 3.2, 4);
    const r = 1 + macro * 0.3 + (crease - 0.5) * 0.05;

    let x = d.x * r * 9.5;
    let z = d.z * r * 7.5;
    let y: number;

    if (d.y >= 0) {
      const dome = d.y * r * 13;
      const plateau =
        2.4 +
        5.6 * smoothstep(-3, 7, x - z * 0.35) +
        3.4 * ridged(x * 0.11 + 5, 1, z * 0.11, 4) * smoothstep(-1, 6, x) +
        0.7 * fbm(x * 0.14, 2, z * 0.14, 3);
      y = smin(dome, plateau, 0.9);
    } else {
      y = d.y * r * 24;
      const belly = 1 + 0.42 * Math.sin(Math.PI * Math.min(-d.y * 1.25, 1));
      x *= belly;
      z *= belly;
    }

    const notch = Math.exp(-((y / 0.8) ** 2));
    x *= 1 - 0.06 * notch;
    z *= 1 - 0.06 * notch;

    const detailAmp = y > 0 ? 0.22 : 0.5;
    x += fbm(x * 0.28, y * 0.28, z * 0.28 + 11, 3) * detailAmp;
    z += fbm(x * 0.28 + 17, y * 0.28, z * 0.28, 3) * detailAmp;
    y += fbm(x * 0.3 + 23, y * 0.3, z * 0.3, 2) * detailAmp * 0.4;

    pos.setXYZ(i, x, y, z);

    if (y >= 0) {
      c.copy(ICE_TOP).lerp(ICE_CREVICE, smoothstep(0.35, 0.75, crease) * 0.55 + smoothstep(0.2, -0.4, macro) * 0.25);
      c.lerp(ICE_WATERLINE, Math.exp(-((y / 1.3) ** 2)) * 0.7);
    } else {
      c.copy(ICE_SUBMERGED).lerp(ICE_DEEP, smoothstep(0, -22, y));
      c.lerp(ICE_WATERLINE, Math.exp(-((y / 1.5) ** 2)) * 0.5);
    }
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  g.setAttribute("color", new BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

function surfaceHeightAt(geometry: BufferGeometry, x: number, z: number): number {
  const probe = new Mesh(geometry);
  const ray = new Raycaster(new Vector3(x, 50, z), new Vector3(0, -1, 0));
  return ray.intersectObject(probe)[0]?.point.y ?? 3;
}

/** The opening scene's iceberg, with a penguin waving from its plateau. */
export default function Iceberg({ detail = 56 }: { detail?: number }) {
  const root = useRef<Group>(null);
  const bob = useRef<Group>(null);

  const geometry = useMemo(() => createIceberg(detail), [detail]);
  const penguinY = useMemo(() => surfaceHeightAt(geometry, ...PENGUIN_XZ), [geometry]);

  const material = useMemo(
    () =>
      new MeshPhysicalMaterial({
        vertexColors: true,
        roughness: 0.5,
        metalness: 0,
        clearcoat: 0.3,
        clearcoatRoughness: 0.4,
        sheen: 0.4,
        sheenColor: new Color("#bfe8f5"),
        sheenRoughness: 0.6,
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame(() => {
    if (!root.current || !bob.current) return;
    const visible = diveFrame.zone < 1.4;
    root.current.visible = visible;
    if (!visible) return;
    const t = diveFrame.time;
    bob.current.position.y = Math.sin(t * 0.55) * 0.1;
    bob.current.rotation.z = Math.sin(t * 0.4) * 0.008;
    bob.current.rotation.x = Math.cos(t * 0.47) * 0.006;
  });

  return (
    <group ref={root} position={[2, SURFACE_Y, -32]} rotation={[0, -0.2, 0]}>
      <group ref={bob}>
        <mesh geometry={geometry} material={material} />
        <Penguin position={[PENGUIN_XZ[0], penguinY - 0.03, PENGUIN_XZ[1]]} rotation={[0, 0.15, 0]} scale={2.8} />
      </group>
    </group>
  );
}
