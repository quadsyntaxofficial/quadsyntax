'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import { useLenis } from "@/providers/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
  {
    name: "Saad Minhas",
    role: "Lead Developer",
    image: "/Saad.png",
    bio: "Architecting robust, scalable systems and leading the engineering team through every sprint — turning ambitious product ideas into shipped, reliable software.",
    linkedin: "#",
    portfolio: "#",
  },
  {
    name: "Wafa Manan",
    role: "Head of Design",
    image: "/Wafa.png",
    bio: "Overseeing the complete design direction — from branding and visual identity to UI/UX, graphics, and digital experiences — bringing strategy, creativity, and consistency to every project.",
    linkedin: "#",
    portfolio: "#",
  },
  {
    name: "Samra Murtaza",
    role: "Project Manager",
    image: "/Samra.png",
    bio: "Keeping every project on time and on budget — coordinating between design, development, and clients so nothing falls through the cracks.",
    linkedin: "#",
    portfolio: "#",
  },
  {
    name: "Saqalain Abid",
    role: "Founder & CEO",
    image: "/Saqalain.png",
    bio: "Setting the vision and direction for QuadSyntax — building the team, the culture, and the client relationships that make great work possible.",
    linkedin: "#",
    portfolio: "#",
  },
];

const STATS = [
  { value: "150+", label: "Projects Completed" },
  { value: "99+", label: "Customer Satisfaction" },
  { value: "5+", label: "Years Experience" },
  { value: "120+", label: "Brands Transformed" },
];

const AUTO_INTERVAL_MS = 4800;
const FLOW = { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };

const parseStat = (raw: string) => {
  const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
  return match ? { number: parseFloat(match[1]), suffix: match[2] } : { number: 0, suffix: raw };
};

const countdownStart = (target: number) =>
  target <= 10 ? target + 20 : Math.round(target * 2);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V21H9z" />
  </svg>
);

const Creators = () => {
  const [order, setOrder] = useState(() => TEAM.map((_, i) => i));
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const lenis = useLenis();

  useEffect(() => {
    if (paused || hovered) return;
    const id = setInterval(() => {
      setOrder((o) => [...o.slice(1), o[0]]);
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, hovered]);

  useEffect(() => {
    if (!lenis) return;
    let resumeTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      setPaused(true);
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => setPaused(false), 900);
    };

    lenis.on("scroll", handleScroll);
    return () => {
      lenis.off("scroll", handleScroll);
      clearTimeout(resumeTimeout);
    };
  }, [lenis]);

  const select = useCallback((i: number) => {
    setOrder((o) => {
      const at = o.indexOf(i);
      return [...o.slice(at), ...o.slice(0, at)];
    });
  }, []);

  const active = TEAM[order[0]];
  const otherIndexes = order.slice(1);

  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const bigCardWrapRef = useRef<HTMLDivElement>(null);
  const rightColWrapRef = useRef<HTMLDivElement>(null);
  const thumbsWrapRef = useRef<HTMLDivElement>(null);
  const statsWrapRef = useRef<HTMLDivElement>(null);

  // onReveal timeline — everything except the stats, which now has its
  // own dedicated ScrollTrigger below so its timing tracks the stats row
  // entering the viewport, not the section's top edge.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      if (watermarkRef.current) {
        tl.fromTo(
          watermarkRef.current,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" },
          0
        );
      }

      if (bigCardWrapRef.current) {
        tl.fromTo(
          bigCardWrapRef.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 1 },
          { clipPath: "inset(0 0% 0 0)", duration: 1.3, ease: "power4.inOut" },
          0.15
        );
      }

      if (rightColWrapRef.current) {
        tl.fromTo(
          rightColWrapRef.current,
          { opacity: 0, x: 60 },
          { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
          0.4
        );
      }

      if (thumbsWrapRef.current) {
        const thumbs = thumbsWrapRef.current.children;
        tl.fromTo(
          thumbs,
          { opacity: 0, y: 30, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "back.out(1.6)", stagger: 0.12 },
          0.6
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // stats: own ScrollTrigger keyed to the stats row itself, so on a tall
  // section the countdown only fires once the row is actually in view —
  // not the moment the section's top edge crosses 70%. toggleActions'
  // "reverse" segment plays this same timeline backward on scroll-up,
  // which GSAP resolves correctly for the plain-object counter tween too:
  // the numbers visibly count back up to their inflated starting point.
  useEffect(() => {
    const statsWrap = statsWrapRef.current;
    if (!statsWrap) return;

    const ctx = gsap.context(() => {
      const statEls = Array.from(statsWrap.children) as HTMLElement[];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: statsWrap,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        statEls,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", stagger: 0.15 },
        0
      );

      // slowed countdown: longer duration, power2.inOut so it eases in,
      // holds pace through the middle, then eases out into a soft landing
      // on the true value — reads as a deliberate settle, not a snap.
      statEls.forEach((el, i) => {
        const valueEl = el.querySelector<HTMLElement>("[data-stat-value]");
        if (!valueEl) return;
        const { number, suffix } = parseStat(STATS[i].value);
        const counter = { val: countdownStart(number) };

        tl.to(
          counter,
          {
            val: number,
            duration: 2.6,
            ease: "power2.inOut",
            onUpdate: () => {
              valueEl.textContent = `${Math.round(counter.val)}${suffix}`;
            },
          },
          0.25 + i * 0.12 // slight stagger so the four numbers don't land in lockstep
        );
      });
    }, statsWrap);

    return () => ctx.revert();
  }, []);

  // velocity-reactive stats: fast scroll blurs the numbers slightly
  useEffect(() => {
    if (!lenis || !statsWrapRef.current) return;

    const valueEls = Array.from(
      statsWrapRef.current.querySelectorAll<HTMLElement>("[data-stat-value]")
    );
    if (!valueEls.length) return;

    const handleScroll = ({ velocity }: { velocity: number }) => {
      const blur = gsap.utils.clamp(0, 6, Math.abs(velocity) * 0.5);
      gsap.to(valueEls, {
        filter: `blur(${blur}px)`,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    lenis.on("scroll", handleScroll);
    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis]);

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative w-full overflow-hidden pt-28 pb-16 sm:pt-40 sm:pb-20 md:pt-52 lg:pt-60 lg:pb-24"
    >
      <div ref={watermarkRef} className="absolute inset-0 h-full w-full">
        <Image
          src="/creators.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none h-full w-full object-contain object-top"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl lg:max-w-7xl flex-col gap-16 px-6 sm:px-10 lg:px-16">
        <LayoutGroup>
          <div
            className="flex flex-col gap-6 lg:flex-row lg:items-stretch"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div
              ref={bigCardWrapRef}
              className="relative h-75 w-full overflow-hidden rounded-3xl xs:h-85 sm:h-105 md:h-120 lg:h-150 lg:w-[40%]"
            >
              <motion.div
                key={active.name}
                layoutId={`creator-card-${active.name}`}
                layout
                transition={FLOW}
                className="relative h-full w-full overflow-hidden rounded-3xl"
              >
                <Image
                  src={active.image}
                  alt={active.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>

            <div ref={rightColWrapRef} className="flex flex-1 flex-col justify-between gap-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.name}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-left lg:text-right"
                >
                  <h3 className="text-xl font-bold text-white xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl">{active.name}</h3>
                  <p className="mt-1 text-base font-medium uppercase tracking-wide text-white/50 sm:text-xl md:text-2xl">
                    {active.role}
                  </p>
                  <p className="mt-4 max-w-xl text-sm text-white/60 sm:text-base md:text-lg lg:ml-auto">{active.bio}</p>

                  <div className="mt-5 flex items-center gap-3 lg:justify-end">
                    <a
                      href={active.linkedin}
                      aria-label={`${active.name} on LinkedIn`}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/30 hover:text-white"
                    >
                      <LinkedinIcon />
                    </a>
                    <a
                      href={active.portfolio}
                      className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
                    >
                      Portfolio
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div ref={thumbsWrapRef} className="flex gap-3">
                {otherIndexes.map((i) => {
                  const person = TEAM[i];
                  return (
                    <motion.button
                      key={person.name}
                      layoutId={`creator-card-${person.name}`}
                      layout
                      transition={FLOW}
                      onClick={() => select(i)}
                      aria-label={`Show ${person.name}`}
                      className="group relative h-24 w-full flex-1 overflow-hidden rounded-2xl xs:h-28 sm:h-56 md:h-72"
                    >
                      <Image
                        src={person.image}
                        alt={person.name}
                        fill
                        sizes="200px"
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </LayoutGroup>

        {/* stats */}
        <div ref={statsWrapRef} className="flex flex-wrap justify-between gap-x-6 gap-y-10 pt-10">
          {STATS.map((stat) => {
            const { number, suffix } = parseStat(stat.value);
            return (
              <div key={stat.label}>
                <p
                  data-stat-value
                  className="text-2xl font-extrabold text-white xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl will-change-[filter]"
                >
                  {countdownStart(number)}
                  {suffix}
                </p>
                <p className="mt-1 text-xs text-white/50 sm:text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Creators;