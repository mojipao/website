/**
 * All site copy lives here. Replace the placeholders with real details;
 * no component changes are needed.
 */

export interface Role {
  title: string;
  company: string;
  period: string;
  location?: string;
  highlights: string[];
}

export interface Project {
  name: string;
  tagline: string;
  description: string;
  tags: string[];
  href?: string;
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  detail?: string;
}

export interface Link {
  label: string;
  href: string;
  handle: string;
}

export const profile = {
  name: "Your Name",
  firstName: "Your",
  initials: "YN",
  role: "Software Engineer",
  tagline: "Building thoughtful software, one layer deeper at a time.",
  location: "City, State",
  bio: "I'm a placeholder bio. I love turning complex problems into simple, beautiful experiences. My work sits where engineering meets design, and I'm happiest when I'm exploring something I don't understand yet. Outside of work you'll find me reading, building side projects, and chasing the next good idea.",
  stats: [
    { value: "3+", label: "Years of experience" },
    { value: "12", label: "Projects shipped" },
    { value: "∞", label: "Curiosity" },
  ],
};

export const experience: Role[] = [
  {
    title: "Senior Role Title",
    company: "Company One",
    period: "2024 — Present",
    location: "Remote",
    highlights: [
      "Led a placeholder initiative that improved a key metric by 40%.",
      "Designed and shipped a system used by thousands of people daily.",
      "Mentored engineers and set the bar for quality across the team.",
    ],
  },
  {
    title: "Role Title",
    company: "Company Two",
    period: "2022 — 2024",
    location: "City, State",
    highlights: [
      "Built a placeholder product feature from zero to launch.",
      "Cut page load times in half through a performance overhaul.",
      "Partnered with design to create a new component library.",
    ],
  },
  {
    title: "Intern Title",
    company: "Company Three",
    period: "Summer 2021",
    location: "City, State",
    highlights: [
      "Prototyped an internal tool adopted by the wider org.",
      "Automated a manual workflow, saving hours every week.",
      "Presented results to leadership at the end of the internship.",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "Project Aurora",
    tagline: "A placeholder flagship project.",
    description: "Short description of what this project does, the problem it solves, and what makes it interesting.",
    tags: ["TypeScript", "React", "WebGL"],
    href: "#",
  },
  {
    name: "Project Tide",
    tagline: "Something useful, beautifully made.",
    description: "Short description of the project. Mention the impact, the users, or a clever technical detail.",
    tags: ["Python", "ML", "APIs"],
    href: "#",
  },
  {
    name: "Project Abyss",
    tagline: "An experiment that went deep.",
    description: "Short description of the project. What you learned, what you built, and why it matters.",
    tags: ["Rust", "Systems"],
    href: "#",
  },
  {
    name: "Project Current",
    tagline: "Small tool, big difference.",
    description: "Short description of the project. Keep it to one or two sentences for the cleanest look.",
    tags: ["Next.js", "Design"],
    href: "#",
  },
];

export const skills: string[] = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Three.js",
  "SQL",
  "AWS",
  "Figma",
  "System Design",
  "Git",
  "Tailwind CSS",
];

export const education: Education[] = [
  {
    school: "University Name",
    degree: "B.S. in Your Major",
    period: "2018 — 2022",
    detail: "Minor, honors, or relevant coursework goes here.",
  },
];

export const awards: { title: string; detail: string }[] = [
  { title: "Award or Certification", detail: "Issuer · Year" },
  { title: "Hackathon Winner", detail: "Event Name · Year" },
  { title: "Dean's List", detail: "University Name · Years" },
];

export const links: Link[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle", handle: "in/your-handle" },
  { label: "Email", href: "mailto:you@example.com", handle: "you@example.com" },
  { label: "GitHub", href: "https://github.com/your-handle", handle: "@your-handle" },
];
