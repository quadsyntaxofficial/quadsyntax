'use client'

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const COPY = [
  { text: "WE CREATE IMPACTFUL DIGITAL" },
  { text: "EXPERIENCES THROUGH THOUGHTFUL" },
  { text: "DESIGN, INNOVATIVE TECHNOLOGY," },
  { text: "AND PURPOSEFUL STRATEGY." },
];

// Precompute how many words come before each line, so each word's global
// index (used to drive its individual reveal timing) is a simple lookup
// instead of a per-render findIndex scan.
const LINE_WORD_COUNTS = COPY.map((line) => line.text.split(" ").length);
const LINE_START_INDEX = LINE_WORD_COUNTS.reduce<number[]>((acc, count, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + LINE_WORD_COUNTS[i - 1]);
  return acc;
}, []);
const TOTAL_WORDS = LINE_WORD_COUNTS.reduce((a, b) => a + b, 0);

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

      gsap.set(words, { opacity: 0.3 });
      // Container itself must be visible in the non-embedded path — only the
      // words fade individually. Previously this stayed at opacity: 0 forever
      // because nothing tweened it back up, hiding the whole block.
      gsap.set(container, { opacity: 1 });

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
      }).to(words, { opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.1 }, 0.1);
    }, section);

    return () => ctx.revert();
  }, [embedded]);

  // Embedded mode: stagger each word's reveal across the incoming
  // wordProgress instead of GSAP's own ScrollTrigger, since the section
  // sits pinned inside QuadScrollExpand's stage and never scrolls past a
  // trigger point in the normal sense. wordProgress only starts advancing
  // once this section already fills the whole screen (see QuadScrollExpand's
  // readWordProgress), so this never runs while still mid-slide/covered.
  //
  // Matches the non-embedded path's own reveal: each word crosses its own
  // threshold one at a time (not the old smoothstep window, which was wide
  // enough that dozens of words faded in together, reading as whole lines).
  // Unlike a plain threshold flip, the CSS transition below still gives
  // each crossing a short, smooth fade instead of an instant snap — same
  // duration as the non-embedded path's own tween.
  const wordStyle = (globalIndex: number): React.CSSProperties | undefined => {
    if (!embedded) return undefined;
    const wp = wordProgress ?? 0;
    const threshold = globalIndex / TOTAL_WORDS;
    return {
      opacity: wp > threshold ? 1 : 0.3,
      transition: "opacity 0.4s ease-out",
    };
  };

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

      {/* Top utility bar — studio link, edition mark, agency label */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 text-xs uppercase tracking-wide text-white/80 sm:px-10">
        <a
          href="#"
          className="flex items-center gap-2 transition-colors hover:text-white"
        >
          <span aria-hidden className="text-sm leading-none">
            +
          </span>
          <span>Inside The Studio</span>
        </a>
        <span className="text-white/60">(©19-26)</span>
        <span>Digital Agency</span>
      </div>

      <div
        ref={containerRef}
        className="relative z-10 max-w-[100rem] px-6 text-center"
      >
        <p className="relative isolate text-md font-inter uppercase leading-[1.08] tracking-wide sm:text-5xl md:text-6xl lg:text-6xl">
          {COPY.map((line, i) => {
            const words = line.text.split(" ");
            const lineStart = LINE_START_INDEX[i];
            return (
              <span key={i} className="block">
                {words.map((w, j) => {
                  const globalIndex = lineStart + j;
                  return (
                    <span
                      key={`${i}-${j}`}
                      className="word relative mr-[0.3em] inline-block text-white"
                      style={wordStyle(globalIndex)}
                    >
                      {w}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
};

export default About;