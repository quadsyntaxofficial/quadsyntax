"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { motion } from "framer-motion";
import FlipDigit from "./components/FlipDigit";
import FloatingIcons from "./components/FloatingIcons";

export default function NotFound() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".gsap-404", { opacity: 0, y: -24, scale: 0.9, duration: 0.8 })
        .from(".gsap-heading", { opacity: 0, y: 24, duration: 0.7 }, "-=0.4")
        .from(
          ".gsap-subheading",
          { opacity: 0, y: 20, duration: 0.6 },
          "-=0.35"
        )
        .from(
          ".gsap-cta",
          { opacity: 0, y: 20, duration: 0.6 },
          "-=0.3"
        )
        .from(".gsap-footer", { opacity: 0, duration: 0.6 }, "-=0.3");
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={rootRef}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-4 py-4"
    >
      <motion.div
        className="glow-blob absolute -top-32 -left-24 h-72 w-72 rounded-full bg-[#2c48df] sm:h-96 sm:w-96"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="glow-blob absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-[#6d35dd] sm:h-96 sm:w-96"
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <FloatingIcons />

      <div className="relative z-10 flex h-full w-full max-w-3xl flex-col items-center justify-center text-center">
        <div className="gsap-404 mb-4 flex gap-1.5 sm:gap-2">
          <FlipDigit digit="4" />
          <FlipDigit digit="0" />
          <FlipDigit digit="4" />
        </div>

        <h1 className="gsap-heading text-2xl font-extrabold tracking-tight sm:text-5xl">
          <span className="text-gradient">Page Not Found</span>
        </h1>

        <p className="gsap-subheading mt-3 max-w-xl text-xs text-white/60 sm:mt-4 sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back on track.
        </p>

        <div className="gsap-cta mt-6 sm:mt-10">
          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-brand-gradient inline-block rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(44,72,223,0.35)]"
            >
              Back to Home
            </motion.span>
          </Link>
        </div>

        <div className="gsap-footer mt-6 flex flex-col items-center gap-1 text-white/40 sm:mt-14">
          <span className="text-xs font-semibold tracking-[0.3em]">
            QUADSYNTAX
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">
            Design · Development · Solutions
          </span>
        </div>
      </div>
    </main>
  );
}
