'use client'

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_LENGTH_VH = 2.5;

const Services = () => {
  const servicesSectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = servicesSectionRef.current;
    const box = boxRef.current;

    if (!section || !box) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${Math.round(
            window.innerHeight * SCROLL_LENGTH_VH
          )}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          markers: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /*
       * The initial block is approximately the same
       * visual size as one letter.
       */
      gsap.set(box, {
        width: "1em",
        height: "0.9em",
      });

      /*
       * Expand the D into the viewport.
       *
       * Because the block is inside the same flex row,
       * QUA and SYNTAX are pushed apart equally.
       */
      tl.to(box, {
        width: "100vw",
        height: "100vh",
        duration: 1,
        ease: "none",
      });

      return () => tl.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={servicesSectionRef}
      id="services"
      className="
        relative
        flex
        h-screen
        w-full
        items-center
        justify-center
        overflow-hidden
      "
    >
      <div
        className="
          absolute
          left-1/2
          top-1/2
          flex
          w-max
          -translate-x-1/2
          -translate-y-1/2
          items-center
          text-[12vw]
          font-bold
          leading-[0.8]
          text-white
        "
      >
        {/* QUA */}
        <span className="shrink-0 whitespace-nowrap">
          QUA
        </span>

        {/* D */}
        <div
          ref={boxRef}
          className="
            mx-[0.08em]
            shrink-0
            bg-white
          "
        />

        {/* SYNTAX */}
        <span className="shrink-0 whitespace-nowrap">
          SYNTAX
        </span>
      </div>
    </section>
  );
};

export default Services;