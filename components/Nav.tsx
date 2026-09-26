"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import PixelPenguin from "./PixelPenguin";

const items = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [aboutTapped, setAboutTapped] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLAnchorElement>(null);
  const about = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tapAbout = () => {
    setAboutTapped(true);
    window.setTimeout(() => setAboutTapped(false), 700);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
        scrolled ? "border-white/6 bg-ink/70 backdrop-blur-xl" : "border-transparent"
      }`}
    >
      <div ref={bar} className="relative mx-auto flex h-14 max-w-5xl items-center justify-between px-6 text-sm">
        <a ref={name} href="#top" className="font-medium tracking-tight">
          {profile.name}
        </a>
        <nav className="flex items-center gap-4 text-dust sm:gap-6">
          {items.map((item) => (
            <a
              key={item.href}
              ref={item.href === "#about" ? about : undefined}
              href={item.href}
              className={`transition-colors duration-300 hover:text-star ${
                item.href === "#about" && aboutTapped ? "text-star" : ""
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <PixelPenguin containerRef={bar} homeRef={name} targetRef={about} onTouch={tapAbout} />
      </div>
    </header>
  );
}
