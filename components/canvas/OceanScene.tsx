"use client";

import { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { ACESFilmicToneMapping } from "three";
import DepthRig from "./DepthRig";
import Surface from "./Surface";
import GodRays from "./GodRays";
import Caustics from "./Caustics";
import MarineSnow from "./MarineSnow";
import FishSchool from "./creatures/FishSchool";
import Jellyfish from "./creatures/Jellyfish";
import Anglerfish from "./creatures/Anglerfish";
import Plankton from "./creatures/Plankton";
import Trench from "./Trench";
import Sky from "./Sky";
import Iceberg from "./Iceberg";
import FramePacer from "./FramePacer";

export type Quality = "low" | "high";

/** Above 1.5x the extra pixels are barely visible but cost proportionally more GPU time. */
const MAX_DPR = 1.5;

export default function OceanScene() {
  const [quality, setQuality] = useState<Quality>(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? "low" : "high",
  );
  const [dpr, setDpr] = useState(() =>
    typeof window !== "undefined" ? Math.min(window.devicePixelRatio, MAX_DPR) : 1,
  );
  const demote = useCallback(() => {
    setDpr(1);
    setQuality("low");
  }, []);

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={dpr}
        frameloop="demand"
        camera={{ fov: 55, near: 0.1, far: 200, position: [0, 0, 10] }}
        gl={{ antialias: false, powerPreference: "default", toneMapping: ACESFilmicToneMapping }}
      >
        <FramePacer onOverload={demote} />
        <DepthRig />
        <Suspense fallback={null}>
          <Environment resolution={128} frames={1}>
            <Lightformer form="rect" intensity={1.1} color="#dcf1fb" position={[0, 25, 0]} rotation-x={Math.PI / 2} scale={[60, 60, 1]} />
            <Lightformer form="circle" intensity={7} color="#fff4df" position={[14, 10, -30]} scale={5} />
            <Lightformer form="ring" intensity={0.7} color="#c6e4f1" position={[0, 2, -40]} scale={50} />
            <Lightformer form="rect" intensity={0.35} color="#1e5b75" position={[0, -15, 0]} rotation-x={-Math.PI / 2} scale={[60, 60, 1]} />
          </Environment>
          <Sky />
          <Surface />
          <Iceberg detail={quality === "high" ? 48 : 32} />
          <GodRays />
          <Caustics />
          <MarineSnow count={quality === "high" ? 1500 : 700} />
          <FishSchool count={quality === "high" ? 140 : 60} />
          <Jellyfish count={quality === "high" ? 8 : 5} />
          <Plankton count={quality === "high" ? 1000 : 500} />
          <Anglerfish />
          <Trench />
        </Suspense>
        <EffectComposer multisampling={2}>
          <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.85} luminanceSmoothing={0.25} />
          <Noise opacity={0.02} premultiply />
          <Vignette offset={0.25} darkness={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
