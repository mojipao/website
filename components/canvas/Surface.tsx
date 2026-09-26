"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Vector3, type Mesh, type ShaderMaterial } from "three";
import { SURFACE_Y } from "@/lib/depth";
import { causticGLSL } from "./glsl";
import { diveFrame } from "./diveFrame";
import { SKY_HORIZON, SUN_DIRECTION } from "./Sky";

const vertexShader = /* glsl */ `
uniform float uTime;
varying vec3 vWorld;
varying float vHeight;
varying vec3 vNormalW;

// Returns height in x and its partial derivatives (d/dx, d/dy) in yz.
vec3 waves(vec2 p, float t) {
  vec3 h = vec3(0.0);
  float a;
  a = p.x * 0.18 + t * 0.9;           h += vec3(sin(a) * 0.55, cos(a) * 0.55 * 0.18, 0.0);
  a = p.y * 0.23 - t * 0.7;           h += vec3(sin(a) * 0.45, 0.0, cos(a) * 0.45 * 0.23);
  a = (p.x + p.y) * 0.41 + t * 1.3;   h += vec3(sin(a), cos(a) * 0.41, cos(a) * 0.41) * vec3(0.22, 0.22, 0.22);
  a = (p.x - p.y) * 0.77 - t * 1.7;   h += vec3(sin(a), cos(a) * 0.77, -cos(a) * 0.77) * vec3(0.1, 0.1, 0.1);
  a = (p.x * 0.6 + p.y) * 1.3 + t * 2.1; h += vec3(sin(a), cos(a) * 0.78, cos(a) * 1.3) * vec3(0.05, 0.05, 0.05);
  return h;
}

void main() {
  vec3 pos = position;
  vec3 w = waves(pos.xy, uTime);
  float h = w.x;
  pos.z += h;
  vHeight = h;
  // Local xy maps to world xz and local +z to world -y, so world height is -h.
  vNormalW = normalize(vec3(w.y, 1.0, w.z));
  vec4 world = modelMatrix * vec4(pos, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform vec3 uCamera;
uniform float uAbove;
uniform vec3 uSunDir;
uniform vec3 uHorizon;
varying vec3 vWorld;
varying float vHeight;
varying vec3 vNormalW;
${causticGLSL}

vec4 seenFromAbove(float dist) {
  vec3 n = normalize(vNormalW);
  vec3 viewDir = normalize(uCamera - vWorld);
  float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 5.0);
  vec3 deep = vec3(0.01, 0.12, 0.2);
  vec3 crest = vec3(0.04, 0.3, 0.38);
  vec3 col = mix(deep, crest, smoothstep(-0.4, 1.0, -vHeight));
  col = mix(col, uHorizon * 0.9, fresnel * 0.85);
  vec3 halfDir = normalize(uSunDir + viewDir);
  float spec = pow(max(dot(n, halfDir), 0.0), 700.0);
  col += vec3(1.0, 0.97, 0.9) * spec * 0.9;
  float sparkle = caustic(vWorld.xz * 0.05, uTime * 0.6);
  col += sparkle * 0.04 * (1.0 - fresnel);
  col = mix(col, uHorizon, smoothstep(50.0, 115.0, dist));
  return vec4(col, 1.0);
}

void main() {
  float dist = length(vWorld.xz - uCamera.xz);
  if (uAbove > 0.5) {
    gl_FragColor = seenFromAbove(dist);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    return;
  }
  // Snell's window: the sky is only visible in a cone straight overhead.
  float window = smoothstep(40.0, 4.0, dist);
  vec3 deep = vec3(0.04, 0.32, 0.5);
  vec3 sky = vec3(0.45, 0.78, 0.9);
  vec3 col = mix(deep, sky, window * 0.6);

  float c = caustic(vWorld.xz * 0.035, uTime * 0.45);
  col += c * vec3(0.55, 0.9, 1.0) * (0.2 + window * 0.35);
  col += smoothstep(0.6, 1.2, vHeight) * 0.12 * window;

  float sun = smoothstep(16.0, 0.0, length(vWorld.xz - vec2(10.0, -30.0)));
  col += vec3(1.0, 0.98, 0.9) * sun * sun * 0.6;

  float alpha = smoothstep(110.0, 40.0, dist) * uOpacity;
  gl_FragColor = vec4(col, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export default function Surface() {
  const mesh = useRef<Mesh>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uCamera: { value: new Vector3() },
      uAbove: { value: 1 },
      uSunDir: { value: SUN_DIRECTION },
      uHorizon: { value: SKY_HORIZON },
    }),
    [],
  );

  useFrame(({ camera }) => {
    const mat = mesh.current?.material as ShaderMaterial | undefined;
    if (!mat || !mesh.current) return;
    mat.uniforms.uTime.value = diveFrame.time;
    mat.uniforms.uCamera.value.copy(camera.position);
    mat.uniforms.uOpacity.value = diveFrame.sunlight;
    mat.uniforms.uAbove.value = camera.position.y > SURFACE_Y ? 1 : 0;
    mesh.current.visible = diveFrame.zone < 1.6;
  });

  return (
    <mesh ref={mesh} position={[0, SURFACE_Y, -20]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[240, 240, 144, 144]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={DoubleSide}
      />
    </mesh>
  );
}
