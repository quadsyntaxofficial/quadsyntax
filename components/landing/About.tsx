'use client'

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

const COPY = [
  { text: "WE CREATE IMPACTFUL DIGITAL", emphasis: false },
  { text: "EXPERIENCES THROUGH THOUGHTFUL", emphasis: false },
  { text: "DESIGN, INNOVATIVE TECHNOLOGY,", emphasis: false },
  { text: "AND PURPOSEFUL STRATEGY.", emphasis: false },
];

const ALL_WORDS = COPY.flatMap((line) => line.text.split(" "));

export interface AboutProps {
  // When provided (0..1), this section is embedded inside QuadScrollExpand's
  // sticky stage instead of scrolling normally — used only to detect that
  // mode (see `embedded` below) and to drive the container's own fade-in.
  revealProgress?: number;
  // 0..1 across the dedicated hold *after* the slide above has fully
  // finished — i.e. only once this section already fills the whole screen —
  // used to drive the word-by-word reveal below without it running mid-slide
  // while the section is still partially covered.
  wordProgress?: number;
}

const About = ({ revealProgress, wordProgress }: AboutProps) => {
  const embedded = revealProgress !== undefined;
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedded) return;
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const ctx = gsap.context(() => {
      const words = container.querySelectorAll<HTMLSpanElement>(".word");

      gsap.set(words, { opacity: 0.01 });

      // Pin the section once it fills the viewport, then reveal each word
      // at full opacity, in reading order, as the user scrolls through the
      // pinned duration.
      gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: true,
        },
      }).set(words, { opacity: 1, stagger: 0.1 }, 0.1);
    }, section);

    return () => ctx.revert();
  }, [embedded]);

  // Embedded mode: stagger each word's reveal across the incoming
  // wordProgress instead of GSAP's own ScrollTrigger, since the section
  // sits pinned inside QuadScrollExpand's stage and never scrolls past a
  // trigger point in the normal sense. wordProgress only starts advancing
  // once this section already fills the whole screen (see QuadScrollExpand's
  // readWordProgress), so this never runs while still mid-slide/covered.
  const wordStyle = (globalIndex: number): React.CSSProperties | undefined => {
    if (!embedded) return undefined;
    const wp = wordProgress ?? 0;
    const start = (globalIndex / ALL_WORDS.length) * 0.6;
    const t = smoothstep(start, start + 0.4, wp);
    return {
      opacity: 0.3 + 0.7 * t,
    };
  };

  let wordIndex = -1;

  return (
    <section
      ref={sectionRef}
      id="about"
      className={
        embedded
          ? "relative z-0 flex h-full w-full items-center justify-center overflow-hidden text-white"
          : "relative z-0 flex min-h-[60vh] w-full items-center justify-center overflow-hidden text-white xs:min-h-[50vh] sm:min-h-[70vh] md:min-h-[75vh] lg:h-screen"
      }
    >
      {/* Monogram — large, centered, cropped by the top of the viewport so
          only its lower half is visible peeking down into the section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 -top-12 z-0 w-[90vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 sm:w-[70vw] md:w-[45vw]"
        style={{ aspectRatio: "1 / 1" }}
      >
        <Image
          src="/logo-monogram.svg"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 90vw, (max-width: 768px) 70vw, 55vw"
          className="object-cover"
        />
      </div>

      {/* faint geometric motif, top of frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[620px] -translate-x-1/2 opacity-[0.06]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(90,110,180,0.10),transparent_70%)]"
      />

      <div
        ref={containerRef}
        className="relative z-10 max-w-[100rem] px-6 text-center"
      >
        <p className="relative isolate text-md font-inter uppercase leading-[1.08] tracking-wide sm:text-5xl md:text-6xl lg:text-6xl">
          {COPY.map((line, i) => (
            <span key={i} className="block">
              {line.text.split(" ").map((w, j) => {
                wordIndex += 1;
                return (
                  <span
                    key={j}
                    className="word relative mr-[0.3em] inline-block text-white"
                    style={wordStyle(wordIndex)}
                  >
                    {w}
                  </span>
                );
              })}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default About;
