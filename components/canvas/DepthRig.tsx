"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, Fog, MathUtils, type HemisphereLight, type DirectionalLight } from "three";
import { useDive } from "@/lib/store";
import {
  ZONE_SPACING,
  bioluminescenceAt,
  sunlightAt,
  waterColorAt,
  zoneToDepth,
} from "@/lib/depth";
import { diveFrame } from "./diveFrame";

export default function DepthRig() {
  const { scene, camera } = useThree();
  const water = useMemo(() => new Color(), []);
  const pointer = useRef({ x: 0, y: 0 });
  const hemi = useRef<HemisphereLight>(null);
  const sun = useRef<DirectionalLight>(null);

  useEffect(() => {
    scene.background = water;
    scene.fog = new Fog(water, 4, 80);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [scene, water]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const target = useDive.getState().zone;
    diveFrame.zone = MathUtils.damp(diveFrame.zone, target, 3.2, dt);
    diveFrame.depth = zoneToDepth(diveFrame.zone);
    diveFrame.sunlight = sunlightAt(diveFrame.depth);
    diveFrame.biolum = bioluminescenceAt(diveFrame.depth);
    diveFrame.time = state.clock.elapsedTime;
    diveFrame.cameraY = -diveFrame.zone * ZONE_SPACING;

    waterColorAt(diveFrame.depth, water);
    const fog = scene.fog as Fog;
    fog.color.copy(water);
    fog.far = MathUtils.lerp(60, 85, diveFrame.sunlight);

    const lookUp =
      0.5 * (1 - MathUtils.smoothstep(diveFrame.zone, 0, 0.85)) -
      0.22 * MathUtils.smoothstep(diveFrame.zone, 4.2, 5);
    camera.position.x = MathUtils.damp(camera.position.x, pointer.current.x * 1.2, 2, dt);
    camera.position.y = diveFrame.cameraY - pointer.current.y * 0.6;
    camera.rotation.x = MathUtils.damp(camera.rotation.x, lookUp - pointer.current.y * 0.04, 4, dt);
    camera.rotation.y = MathUtils.damp(camera.rotation.y, -pointer.current.x * 0.05, 3, dt);

    if (hemi.current) {
      hemi.current.position.y = diveFrame.cameraY + 20;
      hemi.current.intensity = 0.25 + diveFrame.sunlight * 1.6;
    }
    if (sun.current) {
      sun.current.position.set(4, diveFrame.cameraY + 30, 6);
      sun.current.target.position.set(0, diveFrame.cameraY, 0);
      sun.current.target.updateMatrixWorld();
      sun.current.intensity = diveFrame.sunlight * 2.2;
    }
  }, -1);

  return (
    <>
      <hemisphereLight ref={hemi} args={["#bff4ff", "#02101f", 1.8]} />
      <directionalLight ref={sun} color="#e8fbff" intensity={2} />
    </>
  );
}
