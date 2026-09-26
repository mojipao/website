# Personal website

A minimal, space-themed personal site: a short bio and LinkedIn-style highlights (experience, projects, skills, education) on a quiet starfield with a CSS-built planet.

Built with Next.js (App Router) and Tailwind CSS v4. No animation or 3D libraries; the starfield is a small 2D canvas and everything else is CSS.

## Develop

```bash
npm install
npm run dev
```

## Fill in your details

All copy lives in `lib/content.ts`: name, role, bio, experience, projects, skills, education, recognition, and links. The components only read from that file.

## Structure

- `app/` — layout, page, global styles, favicon
- `components/` — `Starfield`, `Planet`, `Nav`, `Section`, `Reveal`, `Footer`
- `components/sections/` — Hero, About, Experience, Projects, Skills, Education, Contact
- `lib/content.ts` — all site content

The previous 3D ocean-dive version of this site is preserved on the `ocean-dive-3d` branch.
