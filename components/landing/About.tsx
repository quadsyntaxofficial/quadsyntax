'use client'

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const COPY = [
  { text: "WE CREATE IMPACTFUL DIGITAL", emphasis: false },
  { text: "EXPERIENCES THROUGH THOUGHTFUL", emphasis: false },
  { text: "DESIGN, INNOVATIVE TECHNOLOGY,", emphasis: false },
  { text: "AND PURPOSEFUL STRATEGY.", emphasis: false },
];

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    const ctx = gsap.context(() => {
      const words = container.querySelectorAll<HTMLSpanElement>(".word");

      gsap.set(words, { opacity: 0, y: 46, filter: "blur(10px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // Word-by-word rise + blur reveal
      tl.to(words, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.045,
      })
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-0 flex min-h-[60vh] w-full items-center justify-center overflow-hidden text-white xs:min-h-[65vh] sm:min-h-[70vh] md:min-h-[75vh] lg:h-screen"
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
        <p className="relative isolate text-2xl font-inter uppercase leading-[1.08] tracking-wide sm:text-5xl md:text-6xl lg:text-7xl">
          {COPY.map((line, i) => (
            <span key={i} className="block">
              {line.text.split(" ").map((w, j) => (
                <span
                  key={j}
                  className={`word relative mr-[0.3em] inline-block ${
                    line.emphasis ? "text-white" : "text-white/45"
                  }`}
                >
                  {w}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};

export default About;
