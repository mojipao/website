# Ocean Dive Portfolio

A personal website where scrolling is a dive from the ocean surface to the bottom of the Mariana Trench. A full-screen Three.js scene (React Three Fiber) sits behind Apple-style, scroll-driven content sections.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

All copy (name, bio, experience, projects, skills, education, awards, links) lives in [`lib/content.ts`](lib/content.ts). Edit that file; no component changes are needed.

## How it fits together

| Depth zone | Section | Scene |
| --- | --- | --- |
| Surface | `Hero` | Wave surface, god rays, caustics |
| Sunlight (0–200 m) | `Bio` | Fish school |
| Twilight (200–1,000 m) | `Experience` | Jellyfish |
| Midnight (1,000–4,000 m) | `Projects` | Bioluminescent plankton spiral |
| Abyss (4,000–6,000 m) | `Education` | Anglerfish |
| Hadal (6,000–10,935 m) | `Contact` | Trench walls and hydrothermal vent |

- `components/ScrollProvider.tsx` runs Lenis smooth scrolling and converts section positions (`[data-zone]`) into a continuous zone value and depth in the `useDive` store (`lib/store.ts`).
- `lib/depth.ts` maps zones to depth in meters, water color, sunlight, and bioluminescence.
- `components/canvas/` holds the 3D scene. `DepthRig` moves the camera and updates fog and lighting each frame; every creature reads the shared `diveFrame` values.
- Users with `prefers-reduced-motion` or no WebGL get a static gradient that still follows depth.

## Stack

Next.js, TypeScript, Tailwind CSS, three / @react-three/fiber / drei / postprocessing, GSAP ScrollTrigger, Lenis, zustand.
