'use client'

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import ThreeDSlider, {
  ThreeDSliderHandle,
} from "@/components/lightswind/3d-slider";

gsap.registerPlugin(ScrollTrigger);

const COPY = [
  { text: "WE CREATE IMPACTFUL DIGITAL", emphasis: false },
  { text: "EXPERIENCES THROUGH THOUGHTFUL", emphasis: false },
  { text: "DESIGN, INNOVATIVE TECHNOLOGY,", emphasis: false },
  { text: "AND PURPOSEFUL STRATEGY.", emphasis: false },
];

const sliderItems = [
  {
    title: "Web Development",
    num: "01",
    description: "We build fast, scalable web platforms tailored to your product goals.",
    tags: ["Architecture", "Performance", "Scaling"],
    data: { id: 1 },
  },
  {
    title: "UI/UX Designing",
    num: "02",
    description: "We design intuitive interfaces and user journeys that enhance usability.",
    tags: ["User Research", "Interface Design", "Product Scaling"],
    data: { id: 2 },
  },
  {
    title: "Wordpress",
    num: "03",
    description: "We design intuitive wordpress interfaces and user journeys that enhance usability.",
    tags: ["User Research", "Interface Design", "Product Scaling"],
    data: { id: 3 },
  },
  {
    title: "Frontend Development",
    num: "04",
    description: "We design intuitive frontend interfaces and user journeys that enhance usability.",
    tags: ["User Research", "Interface Design", "Product Scaling"],
    data: { id: 4 },
  },
  {
    title: "Backend Development",
    num: "05",
    description: "We design intuitive backend systems and workflows that enhance reliability.",
    tags: ["User Research", "Interface Design", "Product Scaling"],
    data: { id: 5 },
  },
];

const SCROLL_LENGTH_VH = 2.5;

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const servicesSectionRef = useRef<HTMLElement>(null);
  const servicesHeadingRef = useRef<HTMLHeadingElement>(null);
  const sliderRef = useRef<ThreeDSliderHandle>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const shine = shineRef.current;
    if (!section || !container || !shine) return;

    const ctx = gsap.context(() => {
      const words = container.querySelectorAll<HTMLSpanElement>(".word");

      gsap.set(words, { opacity: 0, y: 46, filter: "blur(10px)" });
      gsap.set(shine, { xPercent: -130 });

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

  useEffect(() => {
    const section = servicesSectionRef.current;
    const heading = servicesHeadingRef.current;
    if (!section || !heading) return;

    const ctx = gsap.context(() => {
      gsap.set(heading, { opacity: 0, y: 80, filter: "blur(14px)" });

      gsap.to(heading, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const section = servicesSectionRef.current;
    if (!section) return;

    ScrollTrigger.normalizeScroll(true);

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${Math.round(window.innerHeight * SCROLL_LENGTH_VH)}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          sliderRef.current?.setProgress(self.progress * 100);
        },
        
      });

      return () => trigger.kill();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
    <section
      ref={sectionRef}
      id="about"
      className="relative z-0 flex h-50 lg:h-screen w-full items-center justify-center overflow-hidden text-white"
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

    <section
      ref={servicesSectionRef}
      id="services"
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* faint background word, matches "SERVICES" watermark in the reference */}
      <Image src="/SERVICES.png" alt="Services" fill priority sizes="100vw" className="absolute h-full w-full object-contain object-top" />

      <ThreeDSlider ref={sliderRef} items={sliderItems} disableWheel />
    </section>
    </>
  );
};

export default About;