/**
 * All site copy lives here. Replace the placeholders with your own details;
 * the components only read from this file.
 */

export const profile = {
  name: "Your Name",
  initials: "YN",
  role: "Software Engineer",
  location: "City, State",
  tagline: "Building thoughtful software with a focus on clarity, craft, and the people who use it.",
  bio: [
    "I'm a placeholder bio. I love turning complex problems into simple, well-made experiences, and my work sits where engineering meets design.",
    "I'm happiest when I'm learning something I don't understand yet. Outside of work you'll find me reading, building side projects, and chasing the next good idea.",
  ],
  facts: [
    { label: "Based in", value: "City, State" },
    { label: "Focus", value: "Full-stack & product engineering" },
    { label: "Currently", value: "Open to new opportunities" },
  ],
  email: "you@example.com",
  resumeUrl: "#",
};

export const links = [
  { label: "LinkedIn", href: "https://linkedin.com/in/your-handle" },
  { label: "GitHub", href: "https://github.com/your-handle" },
  { label: "Email", href: `mailto:${profile.email}` },
];

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  tags: string[];
}

export const experience: Experience[] = [
  {
    company: "Company One",
    role: "Senior Role Title",
    period: "2024 — Present",
    location: "Remote",
    summary: "One line on what the team does and what you own there.",
    highlights: [
      "Led a placeholder initiative that improved a key metric by X%.",
      "Designed and shipped a system used by N teams across the company.",
      "Mentored engineers and helped shape the team's technical direction.",
    ],
    tags: ["TypeScript", "React", "Node.js", "PostgreSQL"],
  },
  {
    company: "Company Two",
    role: "Role Title",
    period: "2022 — 2024",
    location: "City, State",
    summary: "One line on the product and your part in it.",
    highlights: [
      "Built a placeholder feature end to end, from design through launch.",
      "Reduced build or response times by X% through targeted optimization.",
      "Collaborated closely with design and product on roadmap and scope.",
    ],
    tags: ["Python", "Django", "AWS"],
  },
  {
    company: "Company Three",
    role: "Junior Role Title",
    period: "2020 — 2022",
    location: "City, State",
    summary: "Where it started.",
    highlights: [
      "Shipped features across a placeholder web application.",
      "Wrote tests, fixed bugs, and learned how real software gets made.",
    ],
    tags: ["JavaScript", "Vue", "MySQL"],
  },
];

export interface Project {
  name: string;
  description: string;
  tags: string[];
  href: string;
  year: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    name: "Project Aurora",
    description:
      "A placeholder flagship project. Short description of what it does, the problem it solves, and what makes it interesting.",
    tags: ["TypeScript", "React", "Design systems"],
    href: "#",
    year: "2025",
    featured: true,
  },
  {
    name: "Project Kepler",
    description: "Something you built to scratch an itch. What it does and who it's for.",
    tags: ["Python", "FastAPI", "Data"],
    href: "#",
    year: "2024",
  },
  {
    name: "Project Halo",
    description: "A tool, a library, or an experiment. One or two sentences.",
    tags: ["Go", "CLI"],
    href: "#",
    year: "2024",
  },
  {
    name: "Project Orbit",
    description: "A collaboration, a hackathon win, or an open-source contribution.",
    tags: ["Next.js", "Open source"],
    href: "#",
    year: "2023",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["TypeScript", "Python", "Go", "SQL"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Accessibility"] },
  { group: "Backend", items: ["Node.js", "PostgreSQL", "Redis", "REST & GraphQL"] },
  { group: "Tooling", items: ["AWS", "Docker", "CI/CD", "Observability"] },
];

export const education = [
  {
    school: "University Name",
    degree: "B.S. in Computer Science",
    period: "2016 — 2020",
    note: "Placeholder honors, thesis, or a favorite course.",
  },
];

export const recognition = [
  { title: "Placeholder Award", by: "Organization", year: "2024" },
  { title: "Speaker, Placeholder Conference", by: "Talk title goes here", year: "2023" },
  { title: "Certification Name", by: "Issuing body", year: "2022" },
];
