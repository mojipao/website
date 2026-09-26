"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, Fog, MathUtils, type HemisphereLight, type DirectionalLight } from "three";
import { useDive } from "@/lib/store";
import {
  SURFACE_Y,
  bioluminescenceAt,
  cameraYForZone,
  sunlightAt,
  waterColorAt,
  zoneToDepth,
} from "@/lib/depth";
import { diveFrame } from "./diveFrame";

const SKY_HAZE = new Color("#cfe6f2");
/** Looking slightly down puts the horizon in the upper third, framing the iceberg above the name. */
const ABOVE_WATER_PITCH = -0.3;

export default function DepthRig() {
  const { scene, camera } = useThree();
  const water = useMemo(() => new Color(), []);
  const background = useMemo(() => new Color(), []);
  const pointer = useRef({ x: 0, y: 0 });
  const hemi = useRef<HemisphereLight>(null);
  const sun = useRef<DirectionalLight>(null);

  useEffect(() => {
    scene.background = background;
    scene.fog = new Fog(background, 4, 80);
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [scene, background]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const target = useDive.getState().zone;
    diveFrame.zone = MathUtils.damp(diveFrame.zone, target, 3.2, dt);
    diveFrame.depth = zoneToDepth(diveFrame.zone);
    diveFrame.sunlight = sunlightAt(diveFrame.depth);
    diveFrame.biolum = bioluminescenceAt(diveFrame.depth);
    diveFrame.time = state.clock.elapsedTime;
    diveFrame.cameraY = cameraYForZone(diveFrame.zone);
    diveFrame.above = MathUtils.smoothstep(diveFrame.cameraY, SURFACE_Y - 0.4, SURFACE_Y + 0.6);

    scene.environmentIntensity = diveFrame.sunlight * MathUtils.lerp(0.5, 1, diveFrame.above);

    waterColorAt(diveFrame.depth, water);
    background.copy(water).lerp(SKY_HAZE, diveFrame.above);
    const fog = scene.fog as Fog;
    fog.color.copy(background);
    fog.near = MathUtils.lerp(4, 45, diveFrame.above);
    fog.far = MathUtils.lerp(MathUtils.lerp(60, 85, diveFrame.sunlight), 230, diveFrame.above);

    const underwaterPitch =
      0.5 * (1 - MathUtils.smoothstep(diveFrame.zone, 0.1, 0.9)) -
      0.22 * MathUtils.smoothstep(diveFrame.zone, 4.2, 5);
    const pitch = MathUtils.lerp(underwaterPitch, ABOVE_WATER_PITCH, diveFrame.above);
    camera.position.x = MathUtils.damp(camera.position.x, pointer.current.x * 1.2, 2, dt);
    camera.position.y = diveFrame.cameraY - pointer.current.y * 0.6 * (1 - diveFrame.above * 0.6);
    camera.rotation.x = MathUtils.damp(camera.rotation.x, pitch - pointer.current.y * 0.04, 4, dt);
    camera.rotation.y = MathUtils.damp(camera.rotation.y, -pointer.current.x * 0.05, 3, dt);

    if (hemi.current) {
      hemi.current.position.y = diveFrame.cameraY + 20;
      hemi.current.intensity = (0.25 + diveFrame.sunlight * 1.6) * MathUtils.lerp(1, 0.45, diveFrame.above);
    }    if (sun.current) {
      sun.current.position.set(12, diveFrame.cameraY + 30, 10);
      sun.current.target.position.set(0, diveFrame.cameraY, -20);
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
