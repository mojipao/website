"use client";

import { profile } from "@/lib/content";
import { scrollToTarget } from "@/lib/store";

const ITEMS = [
  { label: "About", target: "#about" },
  { label: "Experience", target: "#experience" },
  { label: "Projects", target: "#projects" },
  { label: "Education", target: "#education" },
  { label: "Contact", target: "#contact" },
];

export default function Nav() {
  const go = (e: React.MouseEvent<HTMLAnchorElement>, target: string | number) => {
    e.preventDefault();
    scrollToTarget(target);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="nav-glass mx-auto flex h-12 max-w-5xl items-center justify-between px-5 text-[13px] sm:mt-3 sm:rounded-full">
        <a href="#top" onClick={(e) => go(e, 0)} className="font-semibold tracking-tight text-white">
          {profile.initials}
          <span className="text-cyan-200">.</span>
        </a>
        <ul className="hidden items-center gap-7 sm:flex">
          {ITEMS.map((item) => (
            <li key={item.target}>
              <a
                href={item.target}
                onClick={(e) => go(e, item.target)}
                className="text-white/70 transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          onClick={(e) => go(e, "#contact")}
          className="rounded-full bg-white px-3.5 py-1 text-xs font-medium text-slate-950 transition-transform duration-300 hover:scale-105"
        >
          Say hi
        </a>
      </nav>
    </header>
  );
}
