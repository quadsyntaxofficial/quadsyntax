"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@/public/logo-transparent.png";

const FRAMES = [
  "/logo-svg/Frame-1.svg",
  "/logo-svg/Frame-2.svg",
  "/logo-svg/Frame-3.svg",
  "/logo-svg/Frame-4.svg",
  "/logo-svg/Frame-5.svg",
];

const FRAME_DURATION = 260;
const HOLD_DURATION = 850;
const pieceEase = [0.16, 1, 0.3, 1] as const;

export default function GlobalLoader() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const isFinal = step >= FRAMES.length;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frameTimers = FRAMES.map((_, i) =>
      setTimeout(() => setStep(i + 1), FRAME_DURATION * (i + 1))
    );
    const hideTimer = setTimeout(
      () => setVisible(false),
      FRAME_DURATION * FRAMES.length + HOLD_DURATION
    );

    return () => {
      frameTimers.forEach(clearTimeout);
      clearTimeout(hideTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
      }}
    >
      {visible && (
        <motion.div
          key="global-loader"
          className="fixed inset-0 z-100 flex h-dvh w-dvw items-center justify-center overflow-hidden bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* living gradient glow */}
          <motion.div
            className="absolute h-56 w-56 rounded-full bg-brand-gradient blur-[70px] sm:h-72 sm:w-72"
            animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute h-56 w-56 rounded-full sm:h-72 sm:w-72"
            style={{
              background: "conic-gradient(from 0deg, #2c48df, #6d35dd, #2c48df)",
              filter: "blur(45px)",
              opacity: 0.35,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative flex h-28 w-28 items-center justify-center xs:h-32 xs:w-32 sm:h-44 sm:w-44">
            <AnimatePresence mode="wait">
              {!isFinal ? (
                <motion.img
                  key={`frame-${step}`}
                  src={FRAMES[step]}
                  alt=""
                  className="h-full w-full object-contain drop-shadow-[0_0_20px_rgba(109,53,221,0.45)]"
                  initial={{ opacity: 0, scale: 0.75, rotate: -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.08 }}
                  transition={{ duration: 0.28, ease: pieceEase }}
                />
              ) : (
                <motion.div
                  key="final-logo"
                  className="h-full w-full"
                  initial={{ opacity: 0, scale: 0.82 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: pieceEase }}
                >
                  <Image
                    src={logo}
                    alt="QuadSyntax logo"
                    className="h-full w-full object-contain drop-shadow-[0_0_25px_rgba(109,53,221,0.55)]"
                    priority
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
