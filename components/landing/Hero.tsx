"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import QuadScrollExpand from "../ui/QuadScrollExpand";
import { ThreeDImageSliderDemo } from "../ui/3d-slider";
import Panorama from "../ui/Panorama";

const EASE = [0.16, 1, 0.3, 1] as const;

const WORK_CATEGORIES = [
  { label: "Web development", color: "#902FF7" },
  { label: "eCommerce", color: "#0A41F3" },
  { label: "Application development", color: "#22c55e" },
  { label: "Artificial intelligence", color: "#f59e0b" },
  { label: "Blockchain", color: "#06b6d4" },
] as const;

const heroLine = {
  hidden: { opacity: 0, y: 30, x: -200 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: 1.5, ease: EASE, delay: 1.1 + i * 0.12 },
  }),
};
const heroLines = ["Building digital", "that people products", "remember."];

const Hero = () => (
  <QuadScrollExpand
    className="z-10"
    imageSrc="/bg-1.png"
    scrollDistance={1.1}
    holdDistance={0.5}
    smoothing={0.12}
    heroBackground={
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: EASE }}
      >
        <Image src="/bg-hero.png" alt="" fill priority sizes="100vw" className="h-full w-full object-cover object-center" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[42vh] w-[62vw] xs:h-[46vh] xs:w-[64vw] sm:h-[50vh] sm:w-[56vw] md:h-[52vh] md:w-[48vw] lg:h-144 lg:w-[min(85vw,900px)]">
          <Image src="/characters-hero.png" alt="" fill priority sizes="(max-width: 1023px) 75vw, 900px" className="object-contain object-bottom-right" />
        </div>
      </motion.div>
    }
    heroForeground={
      <p className="max-w-[85vw] select-none uppercase leading-tight text-white/90 text-2xl sm:max-w-sm sm:text-3xl md:max-w-md md:text-[33.84px] lg:max-w-lg">
        {heroLines.map((line, i) => (
          <motion.span key={line} custom={i} variants={heroLine} initial="hidden" animate="visible" className="block overflow-hidden">
            {line}
          </motion.span>
        ))}
      </p>
    }
    expandedContent={
      <div className="flex h-full w-full flex-col px-4 pt-14 pb-6 sm:px-6 sm:pt-20 sm:pb-8 md:px-10 md:pt-24 md:pb-10">
        <div className="relative z-10 -mx-4 min-h-0 flex-1 sm:-mx-6 md:-mx-10">
          <ThreeDImageSliderDemo />
          {/* <Panorama/> */}
        </div>
        <div className="relative z-20 flex min-h-[28px] shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-center text-[9px] text-black/60 sm:min-h-[32px] sm:gap-x-6 sm:pt-3 sm:text-[10px] md:gap-x-8 md:text-xs lg:gap-x-10">
          {WORK_CATEGORIES.map((category) => (
            <span key={category.label} className="flex items-center gap-1.5 whitespace-nowrap sm:gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: category.color }} />
              {category.label}
            </span>
          ))}
        </div>
      </div>
    }
  />
);

export default Hero;