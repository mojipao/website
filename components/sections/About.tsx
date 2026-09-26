"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Label from "@/components/Label";
import { profile } from "@/lib/content";

const words = profile.statement.split(" ");

export default function About() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add("is-playing");
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" className="flex min-h-svh items-center py-28">
      <div className="mx-auto w-full max-w-4xl px-6">
        <Label>About</Label>
        <p ref={ref} className="statement text-[clamp(1.6rem,3.8vw,2.9rem)] leading-[1.22] font-medium tracking-[-0.025em]">
          {words.map((word, i) => (
            <span key={i} className="word" style={{ "--i": i } as CSSProperties}>
              {word}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
