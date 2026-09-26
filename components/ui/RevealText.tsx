"use client";

import { useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RevealTextProps {
  text: string;
  className?: string;
  /** Element whose scroll range drives the reveal; defaults to the text itself. */
  trigger?: RefObject<HTMLElement | null>;
  start?: string;
  end?: string;
}

/** Apple-style copy that brightens word by word as you scroll through it. */
export default function RevealText({
  text,
  className,
  trigger,
  start = "top 75%",
  end = "bottom 35%",
}: RevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: trigger?.current ?? ref.current, start, end, scrub: 0.6 },
          },
        );
      });
    },
    { scope: ref, dependencies: [text] },
  );

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} data-word className="inline-block will-change-[opacity]">
          {word}
          {"\u00A0"}
        </span>
      ))}
    </p>
  );
}
