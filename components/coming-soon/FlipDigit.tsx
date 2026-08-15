"use client";

import { AnimatePresence, motion } from "framer-motion";

export default function FlipDigit({ digit }: { digit: string }) {
  return (
    <div className="flip-card-digit relative w-7 h-10 xs:w-9 xs:h-12 sm:w-14 sm:h-20 rounded-lg shrink-0 bg-linear-to-b from-[#1c1f33] to-[#101223] shadow-[0_10px_25px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden flex items-center justify-center">
      <div className="flip-card-fold-line" />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ rotateX: -100, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.45, 0, 0.55, 1] }}
          style={{ transformPerspective: 300, willChange: "transform" }}
          className="flip-card-digit-number text-base xs:text-2xl sm:text-5xl font-bold text-white"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
