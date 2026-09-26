"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
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

export type Quality = "low" | "high";

export default function OceanScene() {
  const [quality, setQuality] = useState<Quality>(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? "low" : "high",
  );
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, dpr]}
        camera={{ fov: 55, near: 0.1, far: 200, position: [0, 0, 10] }}
        gl={{ antialias: false, powerPreference: "high-performance", toneMapping: ACESFilmicToneMapping }}
      >
        <PerformanceMonitor
          onDecline={() => {
            setDpr(1);
            setQuality("low");
          }}
          onIncline={() => setDpr(Math.min(window.devicePixelRatio, 2))}
        />
        <AdaptiveDpr pixelated={false} />
        <DepthRig />
        <Suspense fallback={null}>
          <Surface />
          <GodRays />
          <Caustics />
          <MarineSnow count={quality === "high" ? 2200 : 900} />
          <FishSchool count={quality === "high" ? 160 : 70} />
          <Jellyfish count={quality === "high" ? 9 : 5} />
          <Plankton count={quality === "high" ? 1400 : 600} />
          <Anglerfish />
          <Trench />
        </Suspense>
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.85} luminanceSmoothing={0.25} />
          <Noise opacity={0.035} premultiply />
          <Vignette offset={0.25} darkness={0.75} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
