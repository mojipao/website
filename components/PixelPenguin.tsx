"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * A baby penguin chick, 10×11: oversized head, fluffy grey down, stubby orange beak.
 * H cap, F face, E eye, C closed eye, B beak, G down, L belly, O feet.
 */
const AWAKE = [
  "...HHHH...",
  "..HFFFFH..",
  ".HFEFFEFH.",
  ".HFFBBFFH.",
  "..HFFFFH..",
  "..GGLLGG..",
  ".GLLLLLLG.",
  "GGLLLLLLGG",
  ".GLLLLLLG.",
  "..GGGGGG..",
  "...OO.OO..",
];
const ASLEEP = AWAKE.map((row, y) => (y === 2 ? ".HFCFFCFH." : row));
const STEP_LEFT = AWAKE.map((row, y) => (y === 10 ? "..OO..OO.." : row));
const STEP_RIGHT = AWAKE.map((row, y) => (y === 10 ? "...OO..OO." : row));

const PALETTE: Record<string, string> = {
  H: "#2a2e38",
  F: "#f4f5f8",
  E: "#14161c",
  C: "#6b7080",
  B: "#e28a2a",
  G: "#b0b6c4",
  L: "#d8dce6",
  O: "#e28a2a",
};

const SCALE = 2;
const COLS = 10;
const ROWS = 11;
const WIDTH = COLS * SCALE;
const HEIGHT = ROWS * SCALE;
const WALK_SPEED = 170; // px per second
const GAP = 8;

function Sprite({ rows }: { rows: string[] }) {
  const rects: React.ReactNode[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let end = x;
      while (end < row.length && row[end] === c) end++;
      if (PALETTE[c]) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={end - x} height={1} fill={PALETTE[c]} />);
      x = end;
    }
  });
  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${COLS} ${ROWS}`} shapeRendering="crispEdges" aria-hidden>
      {rects}
    </svg>
  );
}

type Mode = "asleep" | "awake" | "walking" | "touching";
type Spot = "home" | "target";

interface PixelPenguinProps {
  containerRef: RefObject<HTMLElement | null>;
  /** The penguin naps just after this element... */
  homeRef: RefObject<HTMLElement | null>;
  /** ...and walks over to sleep just before this one. */
  targetRef: RefObject<HTMLElement | null>;
  /** Called when the penguin taps the target. */
  onTouch: () => void;
}

export default function PixelPenguin({ containerRef, homeRef, targetRef, onTouch }: PixelPenguinProps) {
  const el = useRef<HTMLButtonElement>(null);
  const spot = useRef<Spot>("home");
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  const [mode, setMode] = useState<Mode>("asleep");
  const [step, setStep] = useState(0);

  const xFor = (s: Spot) => {
    const box = containerRef.current?.getBoundingClientRect();
    const anchor = (s === "home" ? homeRef : targetRef).current?.getBoundingClientRect();
    if (!box || !anchor) return 0;
    return s === "home" ? anchor.right - box.left + GAP + 2 : anchor.left - box.left - WIDTH - GAP;
  };

  const moveTo = (x: number, ms: number) => {
    const node = el.current;
    if (!node) return;
    node.style.transition = ms ? `transform ${ms}ms linear` : "none";
    node.style.transform = `translate(${x}px, -50%)`;
  };

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  useEffect(() => {
    const node = el.current;
    const place = () => {
      if (!busy.current) moveTo(xFor(spot.current), 0);
    };
    place();
    if (node) node.style.opacity = "1";
    const ro = new ResizeObserver(place);
    if (containerRef.current) ro.observe(containerRef.current);
    if (homeRef.current) ro.observe(homeRef.current);
    window.addEventListener("resize", place);
    const pending = timers.current;
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
      pending.forEach(clearTimeout);
    };
    // Refs are stable; this only needs to run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const arrive = () => {
    setMode("touching");
    onTouch();
    later(() => {
      document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      setMode("awake");
    }, 450);
    later(() => {
      setMode("asleep");
      busy.current = false;
    }, 2200);
  };

  const onClick = () => {
    if (busy.current) return;
    busy.current = true;

    if (spot.current === "target") {
      arrive();
      return;
    }

    setMode("awake");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    later(() => {
      const from = xFor("home");
      const to = xFor("target");
      spot.current = "target";
      if (reduced) {
        moveTo(to, 0);
        arrive();
        return;
      }
      const ms = Math.min(Math.max((Math.abs(to - from) / WALK_SPEED) * 1000, 900), 4200);
      setMode("walking");
      const stepper = window.setInterval(() => setStep((s) => 1 - s), 170);
      moveTo(to, ms);
      later(() => {
        clearInterval(stepper);
        setStep(0);
        arrive();
      }, ms);
    }, 650);
  };

  const rows = mode === "asleep" ? ASLEEP : mode === "walking" ? (step ? STEP_RIGHT : STEP_LEFT) : AWAKE;

  return (
    <button
      ref={el}
      type="button"
      onClick={onClick}
      aria-label="Wake the penguin and go to the About section"
      title={mode === "asleep" ? "Shh… (click to wake)" : undefined}
      className="penguin absolute top-1/2 left-0 cursor-pointer opacity-0"
      style={{ transform: "translate(0px, -50%)" }}
    >
      <span
        className={`block ${mode === "touching" ? "penguin-hop" : ""} ${mode === "asleep" ? "penguin-breathe" : ""}`}
        style={mode === "walking" ? { transform: `rotate(${step ? 7 : -7}deg)`, transformOrigin: "50% 100%" } : undefined}
      >
        <Sprite rows={rows} />
      </span>
      {mode === "asleep" && (
        <span className="pointer-events-none absolute -top-2 left-full font-mono text-[9px] leading-none text-dust" aria-hidden>
          <span className="zzz absolute">z</span>
          <span className="zzz absolute" style={{ animationDelay: "1.3s" }}>
            z
          </span>
        </span>
      )}
    </button>
  );
}
