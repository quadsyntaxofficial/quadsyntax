"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { motion } from "framer-motion";
import CountdownTimer from "./components/CountdownTimer";
import DecorativeFlipStrip from "./components/DecorativeFlipStrip";
import FloatingIcons from "./components/FloatingIcons";
import logo from "@/public/quad-logo-transparent.png";

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".gsap-logo", { opacity: 0, y: -24, scale: 0.85, duration: 0.8 })
        .from(
          ".gsap-heading",
          { opacity: 0, y: 24, duration: 0.7 },
          "-=0.4"
        )
        .from(
          ".gsap-subheading",
          { opacity: 0, y: 20, duration: 0.6 },
          "-=0.35"
        )
        .from(
          ".gsap-countdown",
          { opacity: 0, y: 30, scale: 0.95, duration: 0.7 },
          "-=0.3"
        )
        .from(
          ".gsap-strip",
          { opacity: 0, y: 16, duration: 0.5 },
          "-=0.35"
        )
        .from(
          ".gsap-form",
          { opacity: 0, y: 20, duration: 0.6 },
          "-=0.3"
        )
        .from(
          ".gsap-footer",
          { opacity: 0, duration: 0.6 },
          "-=0.3"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <main
      ref={rootRef}
      className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-background px-4 py-4"
    >
      {/* Animated gradient blobs */}
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
        <div className="gsap-logo mb-4 h-20 w-40 sm:h-56 sm:w-56 md:h-24 md:w-44">
          <Image
            src={logo}
            alt="QuadSyntax logo"
            className="h-full w-full object-cover drop-shadow-[0_0_25px_rgba(109,53,221,0.55)]"
            priority
          />
        </div>

        <h1 className="gsap-heading text-3xl font-extrabold tracking-tight sm:text-6xl">
          <span className="text-gradient">Coming Soon</span>
        </h1>

        <p className="gsap-subheading mt-3 max-w-xl text-xs text-white/60 sm:mt-4 sm:text-base">
          QuadSyntax is crafting something exceptional — custom software,
          digital experiences, and solutions built to scale. Stay tuned.
        </p>

        <div className="gsap-countdown glass-card mt-6 w-full max-w-full rounded-2xl px-3 py-4 xs:px-4 sm:mt-10 sm:px-10 sm:py-8">
          <CountdownTimer />
        </div>

        {/* <div className="gsap-strip mt-6">
          <DecorativeFlipStrip />
        </div> */}

        {/* <form
          onSubmit={handleSubmit}
          className="gsap-form mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="glass-card flex-1 rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-[#6d35dd]"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="bg-brand-gradient rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(44,72,223,0.35)]"
          >
            {submitted ? "You're on the list" : "Notify Me"}
          </motion.button>
        </form> */}

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
