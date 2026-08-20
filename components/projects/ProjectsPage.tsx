"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Category = "UI/UX Design" | "Logo & Branding" | "Graphic Design" | "WordPress" | "Frontend" | "Backend";

const CATEGORIES: readonly ("All" | Category)[] = [
  "All",
  "UI/UX Design",
  "Logo & Branding",
  "Graphic Design",
  "WordPress",
  "Frontend",
  "Backend",
] as const;

// Accent colors reused from the same palette the rest of the site draws its
// category colors from (see Hero.tsx's WORK_CATEGORIES).
const CATEGORY_COLOR: Record<Category, string> = {
  "UI/UX Design": "#902FF7",
  "Logo & Branding": "#06b6d4",
  "Graphic Design": "#f59e0b",
  WordPress: "#22c55e",
  Frontend: "#0A41F3",
  Backend: "#902FF7",
};

interface Project {
  title: string;
  category: Category;
  // Short project-type label shown on the card itself (e.g. "SaaS Product") —
  // more specific than the broader filter category.
  tag: string;
  description: string;
}

// Placeholder catalogue — swap in real project data/thumbnails when
// available. Deliberately spans every filter category at least twice so
// the filtering UI has something real to demonstrate.
const PROJECTS: Project[] = [
  { title: "Orbit Flow Dashboard", category: "UI/UX Design", tag: "SaaS Product", description: "A clean control-room dashboard redesign for a logistics team drowning in cluttered legacy tooling." },
  { title: "Kindred Studio Site", category: "Frontend", tag: "Portfolio Website", description: "A fast, content-first marketing site built for a boutique design studio's rebrand." },
  { title: "MeraTap Ordering App", category: "UI/UX Design", tag: "Food App", description: "Mobile ordering flow for a regional food delivery brand, rebuilt around speed and clarity." },
  { title: "InsightHub Analytics", category: "Frontend", tag: "SaaS Product", description: "A real-time analytics dashboard with dense data made legible at a glance." },
  { title: "Silverline Booking", category: "Frontend", tag: "Web App", description: "Booking and scheduling platform for a boutique consultancy, streamlined to three steps." },
  { title: "HatchDeck MVP", category: "Backend", tag: "API Platform", description: "Backend and API architecture for an early-stage startup's first shippable product." },
  { title: "Wired Mental Health", category: "Graphic Design", tag: "Campaign", description: "Brand visuals and campaign artwork for a mental wellness awareness initiative." },
  { title: "Echo Finance UI", category: "UI/UX Design", tag: "Finance App", description: "Personal finance app interface focused on calm, confidence-building visuals." },
  { title: "LoopBack Timeline", category: "Backend", tag: "API Platform", description: "Event-sourced timeline service powering a customer support platform's audit trail." },
  { title: "Clearcase Portfolio", category: "Logo & Branding", tag: "Brand Identity", description: "Full brand identity and logo system for an independent photography studio." },
  { title: "MeraTax Filing App", category: "Frontend", tag: "Web App", description: "Tax filing web app redesigned for a friendlier, guided step-by-step experience." },
  { title: "Nurture Child Care", category: "WordPress", tag: "WordPress Site", description: "WordPress site and booking system for a childcare network across multiple locations." },
];

// Small "visit project" diagonal arrow, shown in the hover circle on each
// card's artwork.
const DiagonalArrow = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className}>
    <path
      d="M35.81 2.53C35.81 1.13 34.68 0 33.29 0H10.56C9.17 0 8.04 1.13 8.04 2.53C8.04 3.92 9.17 5.05 10.56 5.05H30.76V25.25C30.76 26.64 31.89 27.78 33.29 27.78C34.68 27.78 35.81 26.64 35.81 25.25V2.53ZM1.79 34.03L3.57 35.81L35.07 4.31L33.29 2.53L31.5 0.74L0 32.24L1.79 34.03Z"
      fill="currentColor"
    />
  </svg>
);

const ProjectCard = ({ project, featured = false }: { project: Project; featured?: boolean }) => {
  const color = CATEGORY_COLOR[project.category];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group relative flex flex-col gap-4", featured && "lg:col-span-2 lg:h-full")}
    >
      {/* Placeholder artwork — a moody colored glow on dark, matching the
          rest of the site's card treatment, until real thumbnails exist.
          The featured card is double-width but matches its row-mates'
          height (via the grid's own row stretch) rather than getting
          taller too — aspect-ratio gives way to flex-1 fill at lg. */}
      <div
        className={cn(
          "relative aspect-[4/3.4] w-full overflow-hidden rounded-3xl border border-border",
          featured && "lg:aspect-auto lg:flex-1"
        )}
      >
        

        {/* type tag, floating over the top-left of the artwork */}
        <span className="absolute left-3 top-3 rounded-full bg-white/10 px-3 py-2 font-inter text-[11px] leading-none tracking-[-0.01em] text-white backdrop-blur-sm sm:text-[13px]">
          {project.tag}
        </span>

        {/* hover-reveal "view project" button, centered on the artwork */}
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <span
            className={cn(
              "flex items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md",
              featured ? "h-16 w-16 sm:h-20 sm:w-20" : "h-14 w-14 sm:h-16 sm:w-16"
            )}
          >
            <DiagonalArrow className={featured ? "h-6 w-6 sm:h-7 sm:w-7" : "h-5 w-5 sm:h-6 sm:w-6"} />
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="font-inter text-lg font-medium leading-[1.3] text-white sm:text-xl">{project.title}</h3>
        <p className="line-clamp-2 font-inter text-sm leading-[1.4] text-white/50">{project.description}</p>
      </div>
    </motion.article>
  );
};

const TOUCH_WORD = "GET IN TOUCH";
const TOUCH_REPEATS = 6;

// Fanned strip of placeholder tiles under the marquee — alternating tilt
// and vertical offset to read as a loosely scattered filmstrip, matching
// the reference. Swap the gradients for real thumbnails when available.
const TOUCH_TILES = [
  { rotate: -8, offset: 18, colors: ["#902FF7", "#3b1660"] },
  { rotate: 5, offset: -10, colors: ["#0A41F3", "#0b1440"] },
  { rotate: -4, offset: 6, colors: ["#f59e0b", "#3a2408"] },
  { rotate: 6, offset: -16, colors: ["#ef4444", "#3a0d0d"] },
  { rotate: -3, offset: 10, colors: ["#22c55e", "#0d2a16"] },
  { rotate: 4, offset: -6, colors: ["#06b6d4", "#0a2e34"] },
];

// Infinite "GET IN TOUCH" marquee with a fanned image strip overlapping its
// bottom edge. Reuses the same .animate-marquee-left keyframe (and its
// hover-pause / prefers-reduced-motion handling) already defined in
// globals.css for TechSuit's tech-stack ribbons, and pauses entirely while
// scrolled out of view the same way that one does.
const GetInTouchMarquee = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => section.classList.toggle("marquee-offscreen", !entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const words = useMemo(() => Array.from({ length: TOUCH_REPEATS * 2 }, (_, i) => i), []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-28">
      <div className="animate-marquee-left flex w-max items-center whitespace-nowrap backface-hidden will-change-transform">
        {words.map((i) => (
          <span
            key={i}
            className="mx-2 flex shrink-0 items-center gap-4 font-bold text-4xl uppercase leading-none text-white sm:text-6xl lg:text-7xl"
          >
            {TOUCH_WORD}
            <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-[#ff5a3c] sm:h-3 sm:w-3" />
          </span>
        ))}
      </div>

      <div className="relative z-10 mt-6 flex items-end justify-center gap-3 px-6 sm:-mt-10 sm:gap-4 lg:mt-14 lg:gap-5">
        {TOUCH_TILES.map((tile, i) => (
          <div
            key={i}
            className="h-24 w-16 shrink-0 overflow-hidden rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.45)] sm:h-36 sm:w-24 sm:rounded-2xl lg:h-48 lg:w-32"
            style={{
              transform: `rotate(${tile.rotate}deg) translateY(${tile.offset}px)`,
              background: `linear-gradient(160deg, ${tile.colors[0]} 0%, ${tile.colors[1]} 100%)`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

const ProjectsPage = () => {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(
    () => (active === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === active)),
    [active]
  );

  return (
    <>
      {/* Hero — full-bleed, edge-to-edge like the home page's hero, with
          enough top clearance for the absolutely-positioned/z-indexed
          Header to sit over it without colliding with the watermark. */}
      <section className="relative flex w-full flex-col items-center overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-14 lg:mt-40 lg:pb-26">

        {/* faint background word — same watermark-image treatment as the
            other sections' SERVICES.png/contact.png/creators.png. */}
        <Image
          src="/Projects.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none absolute inset-0 h-full w-full object-contain object-top"
        />

        {/* segmented filter control — one pill, "All" filled, the rest
            plain text separated by dividers, matching the reference. */}
        <div className="relative z-10 mt-6 flex max-w-full items-center overflow-x-auto rounded-full px-1.5 py-1.5 backdrop-blur-sm sm:mt-20">
          {CATEGORIES.map((category, i) => (
            <div key={category} className="flex items-center">
              {i > 0 && <span aria-hidden className="mx-1 h-4 w-px shrink-0 bg-white/15 sm:mx-4" />}
              <button
                type="button"
                onClick={() => setActive(category)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-medium transition-colors sm:px-8 sm:text-sm",
                  active === category
                    ? "bg-brand-gradient text-white"
                    : "text-white/60 hover:text-white"
                )}
              >
                {category}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Grid — full page width, not boxed into the same max-width the
          rest of the site's sections use. */}
      <section className="relative w-full pb-20 sm:pb-24">
        <div className="mx-auto w-full px-6 sm:px-10 lg:px-16">
          <LayoutGroup>
            <motion.div
              layout
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((project, i) => (
                  <ProjectCard key={project.title} project={project} featured={i === 0} />
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>

          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-white/50">No projects in this category yet.</p>
          ) : null}
        </div>
      </section>

      <GetInTouchMarquee />
    </>
  );
};

export default ProjectsPage;
