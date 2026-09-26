/**
 * Smoothed per-frame dive values, written once per frame by `DepthRig`
 * (which runs before every other `useFrame`) and read by scene objects.
 * Kept outside React state so the render loop never triggers re-renders.
 */
export const diveFrame = {
  zone: 0,
  depth: 0,
  cameraY: 0,
  sunlight: 1,
  biolum: 0,
  time: 0,
};
