import { Color } from "three";

export const MAX_DEPTH = 10935;

/** World-space distance between the centers of consecutive content zones. */
export const ZONE_SPACING = 60;

export const ZONE_COUNT = 6;

/** World-space height of the ocean surface. */
export const SURFACE_Y = 14;

/** Camera height in the hero, standing just above the water. */
const ABOVE_WATER_Y = SURFACE_Y + 5;

/** Zone value where the plunge through the surface blends into the steady descent. */
const PLUNGE_END = 0.45;

/**
 * Camera height for a zone position. Starts above the surface and eases into
 * the linear descent with a matching slope (cubic Hermite), so there's no jolt.
 */
export function cameraYForZone(z: number): number {
  if (z >= PLUNGE_END) return -z * ZONE_SPACING;
  const t = Math.max(z, 0) / PLUNGE_END;
  const t2 = t * t;
  const t3 = t2 * t;
  const endY = -PLUNGE_END * ZONE_SPACING;
  const endSlope = -PLUNGE_END * ZONE_SPACING;
  return (2 * t3 - 3 * t2 + 1) * ABOVE_WATER_Y + (-2 * t3 + 3 * t2) * endY + (t3 - t2) * endSlope;
}

export type ZoneId = "surface" | "sunlight" | "twilight" | "midnight" | "abyss" | "hadal";

export interface Zone {
  id: ZoneId;
  name: string;
  range: string;
}

export const ZONES: Record<ZoneId, Zone> = {
  surface: { id: "surface", name: "Surface", range: "0 m" },
  sunlight: { id: "sunlight", name: "Sunlight Zone", range: "0 – 200 m" },
  twilight: { id: "twilight", name: "Twilight Zone", range: "200 – 1,000 m" },
  midnight: { id: "midnight", name: "Midnight Zone", range: "1,000 – 4,000 m" },
  abyss: { id: "abyss", name: "The Abyss", range: "4,000 – 6,000 m" },
  hadal: { id: "hadal", name: "Hadal Trench", range: "6,000 – 10,935 m" },
};

/** Depth in meters at each integer zone position (one per content section). */
const ZONE_DEPTHS = [0, 120, 600, 2500, 5000, MAX_DEPTH];

export function zoneToDepth(z: number): number {
  const clamped = Math.min(Math.max(z, 0), ZONE_DEPTHS.length - 1);
  const i = Math.min(Math.floor(clamped), ZONE_DEPTHS.length - 2);
  const t = clamped - i;
  const eased = t * t * (3 - 2 * t);
  return ZONE_DEPTHS[i] + (ZONE_DEPTHS[i + 1] - ZONE_DEPTHS[i]) * eased;
}

export function depthToZone(depth: number): Zone {
  if (depth < 8) return ZONES.surface;
  if (depth < 200) return ZONES.sunlight;
  if (depth < 1000) return ZONES.twilight;
  if (depth < 4000) return ZONES.midnight;
  if (depth < 6000) return ZONES.abyss;
  return ZONES.hadal;
}

const WATER_KEYS: [number, string][] = [
  [0, "#3cc7e6"],
  [40, "#1896c4"],
  [150, "#0c5d8f"],
  [400, "#073a66"],
  [1000, "#041d3a"],
  [2500, "#020c1e"],
  [5000, "#01050e"],
  [MAX_DEPTH, "#000103"],
];

const waterColors = WATER_KEYS.map(([d, c]) => [d, new Color(c)] as const);

export function waterColorAt(depth: number, target: Color): Color {
  if (depth <= waterColors[0][0]) return target.copy(waterColors[0][1]);
  for (let i = 0; i < waterColors.length - 1; i++) {
    const [d0, c0] = waterColors[i];
    const [d1, c1] = waterColors[i + 1];
    if (depth <= d1) return target.copy(c0).lerp(c1, (depth - d0) / (d1 - d0));
  }
  return target.copy(waterColors[waterColors.length - 1][1]);
}

export function waterColorCss(depth: number): string {
  return `#${waterColorAt(depth, new Color()).getHexString()}`;
}

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(Math.max((x - e0) / (e1 - e0), 0), 1);
  return t * t * (3 - 2 * t);
};

/** 1 at the surface, fading to 0 as sunlight disappears. */
export const sunlightAt = (depth: number) => 1 - smooth(0, 450, depth);

/** 0 in bright water, rising to 1 where bioluminescence dominates. */
export const bioluminescenceAt = (depth: number) => smooth(250, 1800, depth);

export const formatDepth = (depth: number) =>
  Math.round(depth).toLocaleString("en-US");
