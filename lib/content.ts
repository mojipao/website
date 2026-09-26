import type { LogoAsset } from "@/components/Logo";

/**
 * All site copy lives here; the components only read from this file.
 * Logo images live in public/logos/. Entries without a logo show a lettered tile.
 */

const logos = {
  aws: { src: "/logos/aws.png", onWhite: true },
  expedia: { src: "/logos/expedia.png" },
  agrilife: { src: "/logos/agrilife.png" },
  clubcentric: { src: "/logos/clubcentric.png" },
  hsl: { src: "/logos/hsl.webp", onWhite: true },
  imuslims: { src: "/logos/imuslims.png" },
  uw: { src: "/logos/uw.webp", onWhite: true },
} satisfies Record<string, LogoAsset>;

export const profile = {
  name: "Mohriz Murad",
  school: "University of Washington",
  description: "Informatics at the University of Washington. Software Development Engineer Intern at AWS.",
  /** The About section reveals this word by word, so keep it to two or three sentences. */
  statement:
    "I'm an Informatics student at the University of Washington, minoring in Applied Mathematics. I'm drawn to the unglamorous parts of software: tracing a slow request through a chain of services, or teaching a model when to say it doesn't know. Right now I'm on EC2 Edge Frontier at AWS, building an LLM agent that diagnoses faults on on-prem racks.",
  email: "mohrizmurad@gmail.com",
};

export const links = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mohriz-murad" },
  { label: "GitHub", href: "https://github.com/mojipao" },
];

export interface Experience {
  company: string;
  role: string;
  period: string;
  summary: string;
  logo?: LogoAsset;
}

export const experience: Experience[] = [
  {
    company: "Amazon Web Services",
    logo: logos.aws,
    role: "Software Development Engineer Intern",
    period: "Sep 2026 — Now",
    summary:
      "On EC2 Edge Frontier, building an autonomous LLM agent that investigates faults on on-prem racks and finds their root cause.",
  },
  {
    company: "Expedia Group",
    logo: logos.expedia,
    role: "Software Development Engineer Intern",
    period: "Jun — Aug 2026",
    summary: "On Lodging Reservations, cut latency by 48% on a booking retrieval service handling ~19.4M reads a day.",
  },
  {
    company: "Texas A&M AgriLife",
    logo: logos.agrilife,
    role: "Machine Learning Research Intern",
    period: "Mar 2025 — Jan 2026",
    summary:
      "Built a reinforcement learning system for precision irrigation in cotton, accepted as a first-author abstract at AGU25.",
  },
  {
    company: "ClubCentric",
    logo: logos.clubcentric,
    role: "Software Engineer",
    period: "Sep 2024 — Jun 2025",
    summary: "Built the data pipelines and document search behind a platform for student organizations.",
  },
];

export interface Activity {
  name: string;
  role: string;
  team?: string;
  logo?: LogoAsset;
}

export const activities: Activity[] = [
  {
    name: "Husky Satellite Lab",
    role: "Software Engineer",
    team: "Flight Software",
    logo: logos.hsl,
  },
  {
    name: "iMuslims",
    role: "Social Events Coordinator",
    logo: logos.imuslims,
  },
];

export interface Project {
  name: string;
  description: string;
  stack: string[];
  href?: string;
  year: string;
}

export const projects: Project[] = [
  {
    name: "Precision Irrigation with RL",
    description:
      "An end-to-end reinforcement learning system that combines UAV imagery, sensor data, and physics-guided crop models to make plot-level irrigation decisions. Presented at AGU25 in New Orleans.",
    stack: ["Python", "PPO", "Gymnasium", "UAV imagery"],
    year: "2025",
  },
  {
    name: "SPARCS Healthcare Forecasting",
    description:
      "Gradient-boosted models forecasting hospital discharges, costs, and charges across New York State, with SHAP interpretability and R² up to 0.97. Top 5 of 300+ teams at the UW iSchool Datathon.",
    stack: ["Python", "scikit-learn", "SHAP"],
    href: "https://github.com/mojipao/SPARCS-Healthcare-Data-Analysis-and-Prediction",
    year: "2025",
  },
  {
    name: "Reddit Topic Modeling",
    description:
      "An NLP pipeline over 8,000+ Reddit posts comparing TF-IDF + K-Means against BERTopic and Word2Vec + HDBSCAN, surfacing 10+ discussion themes across three languages.",
    stack: ["Python", "spaCy", "BERTopic"],
    year: "2025",
  },
];

export const education = {
  school: "University of Washington",
  department: "Information School",
  logo: logos.uw,
  period: "September 2024 — June 2028",
  degrees: [
    { label: "Major", value: "B.S. Informatics" },
    { label: "Minor", value: "Applied Mathematics" },
  ],
  honors: "3.9 GPA · Dean's List every quarter",
};

export const skills = [
  "Python",
  "Java",
  "Kotlin",
  "TypeScript",
  "C++",
  "SQL",
  "React",
  "Next.js",
  "Spring Boot",
  "PyTorch",
  "scikit-learn",
  "AWS",
  "Docker",
  "Kubernetes",
  "PostgreSQL",
];

export const recognition: { title: string; detail: string; period: string; href?: string }[] = [
  {
    title: "First-author abstract",
    detail: "AGU25",
    period: "2025",
    href: "https://studio.m-anage.com/agu/agu25/meetingapp.cgi/Paper/1849541",
  },
  { title: "Special Mention, Top 5", detail: "DubsTech Datathon", period: "2025" },
  { title: "4th Place, Video Game Design", detail: "TSA Nationals", period: "2024" },
];
