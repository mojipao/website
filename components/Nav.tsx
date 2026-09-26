"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/content";

const items = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto flex max-w-5xl items-center justify-between px-6 transition-[padding,background-color,border-color] duration-300 ${
          scrolled ? "py-3" : "py-6"
        }`}
      >
        <a href="#top" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight">
          <span className="relative inline-flex size-2.5 rounded-full bg-linear-to-br from-nebula-indigo to-nebula-violet">
            <span className="absolute inset-0 rounded-full bg-nebula-indigo/60 blur-[3px]" aria-hidden />
          </span>
          {profile.initials}
        </a>
        <nav
          className={`flex items-center gap-1 rounded-full border px-1.5 py-1 transition-colors duration-300 ${
            scrolled ? "border-white/10 bg-space-900/70 backdrop-blur-md" : "border-transparent"
          }`}
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm text-dust transition-colors hover:bg-white/5 hover:text-star"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
