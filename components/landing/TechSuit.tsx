'use client'

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import { Search } from "lucide-react";
import { useLenis } from "@/providers/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

type Tool = { name: string; icon: string };

const ROW_A: Tool[] = [
  { name: "React", icon: "/tools/REACT.svg" },
  { name: "Node JS", icon: "/tools/NODE JS.svg" },
  { name: "Python", icon: "/tools/PYTHON.svg" },
  { name: "JavaScript", icon: "/tools/JAVASCRIPT.svg" },
  { name: "TypeScript", icon: "/tools/TYPESCRIPT.svg" },
  { name: "Angular", icon: "/tools/ANGULAR.svg" },
  { name: "Vue JS", icon: "/tools/VUE JS.svg" },
  { name: "GitHub", icon: "/tools/GITHUB.svg" },
  { name: "Git", icon: "/tools/GIT.svg" },
  { name: "Mongo DB", icon: "/tools/MONGO DB.svg" },
  { name: "Redis", icon: "/tools/REDIS.svg" },
  { name: "GraphQL", icon: "/tools/GRAPHQL.svg" },
  { name: "Tailwind", icon: "/tools/TAILWIND.svg" },
  { name: "Firebase", icon: "/tools/FIREBASE.svg" },
  { name: "Flutter", icon: "/tools/FLUTTER.svg" },
];

const ROW_B: Tool[] = [
  { name: "PHP", icon: "/tools/PHP.svg" },
  { name: "Java", icon: "/tools/JAVA.svg" },
  { name: "Kotlin", icon: "/tools/KOTLIN.svg" },
  { name: "Swift", icon: "/tools/SWIFT.svg" },
  { name: "Go", icon: "/tools/GO.svg" },
  { name: "Ruby", icon: "/tools/RUBY.svg" },
  { name: "Ruby on Rails", icon: "/tools/RUBY ON RAILS.svg" },
  { name: "Django", icon: "/tools/DJANGO.svg" },
  { name: "Nest JS", icon: "/tools/NEST JS.svg" },
  { name: "jQuery", icon: "/tools/JQUERY.svg" },
  { name: "Bootstrap", icon: "/tools/BOOTSTRAP.svg" },
  { name: "Sass", icon: "/tools/SASS.svg" },
  { name: "WordPress", icon: "/tools/WORDPRESS.svg" },
  { name: "Shopify", icon: "/tools/SHOPIFY.svg" },
  { name: "Stripe", icon: "/tools/STRIPE.svg" },
];

const MIN_HALF_WIDTH_PX = 2000;
const APPROX_TAG_WIDTH_PX = 160;

const MarqueeRow = ({
  tags,
  direction = "left",
  rowRef,
}: {
  tags: Tool[];
  direction?: "left" | "right";
  rowRef?: React.Ref<HTMLDivElement>;
}) => {
  // Recomputing this array (and re-mounting 60+ children) on every parent
  // render was pure waste — tags/direction never change after mount.
  const loop = useMemo(() => {
    const repeats = Math.max(2, Math.ceil(MIN_HALF_WIDTH_PX / (tags.length * APPROX_TAG_WIDTH_PX)));
    const half = Array.from({ length: repeats }, () => tags).flat();
    return [...half, ...half];
  }, [tags]);

  return (
    <div
      ref={rowRef}
      className={`flex w-max items-center whitespace-nowrap py-1 lg:py-5 backface-hidden transform-[translateZ(0)] will-change-transform ${
        direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
      }`}
    >
      {loop.map((tool, i) => (
        <span
          key={`${tool.name}-${i}`}
          className="mr-3 inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-1 text-xs font-medium sm:text-sm"
        >
          {/* Plain <img>, not next/image: these are small, already-optimized
              SVG icons repeated dozens of times purely to fill the marquee
              loop — next/image's per-instance lazy-load/observer overhead
              costs far more here than it saves. */}
          <img
            src={tool.icon}
            alt=""
            width={20}
            height={20}
            loading="lazy"
            decoding="async"
            className="h-4 w-4 shrink-0 object-contain sm:h-5 sm:w-5"
          />
          {tool.name}
        </span>
      ))}
    </div>
  );
};

const TechSuit = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const leftMonoRef = useRef<HTMLDivElement>(null);
  const rightMonoRef = useRef<HTMLDivElement>(null);
  const charactersWrapRef = useRef<HTMLDivElement>(null);
  const marqueeARef = useRef<HTMLDivElement>(null);
  const marqueeBRef = useRef<HTMLDivElement>(null);
  const marqueeAInnerRef = useRef<HTMLDivElement>(null);
  const marqueeBInnerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Tracks whether the reveal timeline has finished at least once, so the
  // scrub effect below knows it's safe to take control of the same
  // transform properties (x/y/rotate/scale) without visibly fighting the
  // reveal's own tweens on those properties.
  const revealedRef = useRef(false);

  const lenis = useLenis();

  // ── onReveal: staggered entrance for every element in the hero, in one
  // timeline. Order: monograms slide in from off-screen -> characters rise
  // and settle -> marquee ribbons swing into their resting tilt -> heading
  // -> paragraph -> search. toggleActions replays it in reverse on scroll-up
  // and re-plays forward on re-entry, matching the rest of the site.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
          onEnter: () => { revealedRef.current = true; },
          onLeaveBack: () => { revealedRef.current = false; },
        },
      });

      // set resting states up front so nothing flashes at full opacity
      // before its turn in the stagger
      tl.set(
        [
          leftMonoRef.current,
          rightMonoRef.current,
          charactersWrapRef.current,
          marqueeARef.current,
          marqueeBRef.current,
          headingRef.current,
          paraRef.current,
          searchRef.current,
        ].filter(Boolean),
        { opacity: 0 }
      );

      if (leftMonoRef.current) {
        tl.from(
          leftMonoRef.current,
          { x: -160, opacity: 0, rotate: -20, duration: 1.2, ease: "power3.out" },
          0
        ).to(leftMonoRef.current, { opacity: 1, duration: 0.01 }, 0);
      }
      if (rightMonoRef.current) {
        tl.from(
          rightMonoRef.current,
          { x: 160, opacity: 0, rotate: 20, duration: 1.2, ease: "power3.out" },
          0
        ).to(rightMonoRef.current, { opacity: 1, duration: 0.01 }, 0);
      }
      if (charactersWrapRef.current) {
        tl.from(
          charactersWrapRef.current,
          { y: 100, opacity: 0, scale: 0.92, duration: 1.1, ease: "power3.out" },
          0.15
        ).to(charactersWrapRef.current, { opacity: 1, duration: 0.01 }, 0.15);
      }
      if (marqueeARef.current) {
        tl.from(
          marqueeARef.current,
          { x: -80, opacity: 0, rotate: 5, duration: 1, ease: "power2.out" },
          0.5
        ).to(marqueeARef.current, { opacity: 1, duration: 0.01 }, 0.5);
      }
      if (marqueeBRef.current) {
        tl.from(
          marqueeBRef.current,
          { x: 80, opacity: 0, rotate: -5, duration: 1, ease: "power2.out" },
          0.55
        ).to(marqueeBRef.current, { opacity: 1, duration: 0.01 }, 0.55);
      }
      if (headingRef.current) {
        tl.from(
          headingRef.current,
          { y: 80, filter: "blur(14px)", opacity: 0, duration: 1.4, ease: "power3.out" },
          0.85
        ).to(headingRef.current, { opacity: 1, duration: 0.01 }, 0.85);
      }
      if (paraRef.current) {
        tl.from(
          paraRef.current,
          { y: 24, opacity: 0, duration: 0.8, ease: "power2.out" },
          1.1
        ).to(paraRef.current, { opacity: 1, duration: 0.01 }, 1.1);
      }
      if (searchRef.current) {
        tl.from(
          searchRef.current,
          { y: 30, opacity: 0, duration: 0.9, ease: "power2.out" },
          1.25
        ).to(searchRef.current, { opacity: 1, duration: 0.01 }, 1.25);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // scrub-based parallax: monograms drift apart, characters float, ribbons tilt.
  // Deliberately a *separate* timeline/trigger from the reveal above — this
  // one is scrub-linked to scroll position and only meaningfully engages
  // once the section is mostly in view, by which point the reveal timeline
  // has already finished and released these properties.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      if (leftMonoRef.current) {
        tl.to(leftMonoRef.current, { y: -120, x: -40, rotate: -8, ease: "none" }, 0);
      }
      if (rightMonoRef.current) {
        tl.to(rightMonoRef.current, { y: 120, x: 40, rotate: 8, ease: "none" }, 0);
      }
      if (charactersWrapRef.current) {
        tl.to(charactersWrapRef.current, { y: -60, scale: 1.04, ease: "none" }, 0);
      }
      if (marqueeARef.current) {
        tl.to(marqueeARef.current, { rotate: 10, ease: "none" }, 0);
      }
      if (marqueeBRef.current) {
        tl.to(marqueeBRef.current, { rotate: -10, ease: "none" }, 0);
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // Pause the (otherwise infinite) marquee CSS animation while the section
  // is scrolled out of view — it keeps compositing for nothing otherwise.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        section.classList.toggle("marquee-offscreen", !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // velocity-reactive marquee: scrolling faster nudges the loop speed up briefly
  // useEffect(() => {
  //   if (!lenis) return;

  //   const rows = [marqueeAInnerRef.current, marqueeBInnerRef.current].filter(
  //     (el): el is HTMLDivElement => !!el
  //   );
  //   if (!rows.length) return;

  //   const handleScroll = ({ velocity }: { velocity: number }) => {
  //     const boost = gsap.utils.clamp(0.6, 2.6, 1 + Math.abs(velocity) * 0.03);
  //     rows.forEach((row) => {
  //       gsap.to(row, {
  //         animationDuration: `${26 / boost}s`,
  //         duration: 0.4,
  //         ease: "power2.out",
  //         overwrite: "auto",
  //       });
  //     });
  //   };

  //   lenis.on("scroll", handleScroll);
  //   return () => {
  //     lenis.off("scroll", handleScroll);
  //   };
  // }, [lenis]);

  return (
    <section
      ref={sectionRef}
      id="techsuit"
      className="relative flex min-h-[70vh] w-full flex-col items-center justify-center overflow-hidden py-14 my-8 xs:min-h-[75vh] sm:min-h-[85vh] sm:py-20 sm:my-12 md:py-24 md:my-16 lg:min-h-screen"
    >
      <Image
        src="/TechSuit.png"
        alt=""
        fill
        loading="lazy"
        sizes="100vw"
        className="pointer-events-none absolute inset-0 h-full w-full object-contain object-top"
      />

      <div
        ref={leftMonoRef}
        aria-hidden
        className="pointer-events-none absolute top-4/7 -left-24 z-0 w-[40vw] max-w-[520px] rotate-y-180 -translate-y-1/3 sm:-left-54 md:w-[76vw] will-change-transform"
        style={{ aspectRatio: "1 / 1" }}
      >
        <Image src="/logo-monogram.svg" alt="" fill sizes="40vw" className="object-contain" />
      </div>

      <div
        ref={rightMonoRef}
        aria-hidden
        className="pointer-events-none absolute top-4/7 -right-24 z-0 w-[40vw] max-w-[520px] -translate-y-1/2 sm:-right-54 md:w-[76vw] will-change-transform"
        style={{ aspectRatio: "1 / 1" }}
      >
        <Image src="/logo-monogram.svg" alt="" fill sizes="40vw" className="object-contain" />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        <div
          ref={charactersWrapRef}
          className="relative aspect-1163/791 w-full max-h-[55vh] will-change-transform lg:aspect-auto lg:h-152 lg:max-h-none"
        >
          <Image
            src="/characters-techsuit.png"
            alt=""
            fill
            loading="lazy"
            sizes="(max-width: 768px) 90vw, 900px"
            className="absolute z-30 object-contain object-top"
            style={{
              transform: "scale(1.1) translateY(-15%)",
              transformOrigin: "top center",
            }}
          />
          <div
            ref={marqueeARef}
            className="pointer-events-none absolute inset-x-[-15%] top-[42%] z-10 rotate-[5deg] bg-[#902FF7] text-white overflow-hidden will-change-transform"
          >
            <MarqueeRow tags={ROW_A} direction="left" rowRef={marqueeAInnerRef} />
          </div>
          <div
            ref={marqueeBRef}
            className="pointer-events-none absolute inset-x-[-15%] top-[40%] z-20 rotate-[-5deg] bg-white/10 backdrop-blur-sm text-white/90 ring-1 ring-white/10 overflow-hidden will-change-transform"
          >
            <MarqueeRow tags={ROW_B} direction="right" rowRef={marqueeBInnerRef} />
          </div>
        </div>

        <h1
          ref={headingRef}
          className="lg:-mt-16 max-w-2xl px-6 text-center text-2xl font-bold uppercase text-white md:text-3xl"
        >
          What tool you are looking for?
        </h1>

        <p ref={paraRef} className="mt-4 max-w-md px-6 text-center text-sm text-white/60">
          Our team use 20+ professional tech stacks, if you looking for a specific tool service search below...
        </p>

        <div ref={searchRef} className="relative mt-8 w-full max-w-md px-6">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-full border border-white/15 bg-white/5 py-3 pl-5 pr-12 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-sm focus:border-white/30"
          />
          <button
            type="button"
            aria-label="Search"
            className="absolute right-9 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#ffffff]"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TechSuit;