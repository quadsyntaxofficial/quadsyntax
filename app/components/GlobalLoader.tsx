"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const pieceEase = [0.16, 1, 0.3, 1] as const;

export default function GlobalLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), 2300);
    return () => clearTimeout(hide);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="global-loader"
          className="fixed inset-0 z-100 flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <svg
            viewBox="0 0 240 240"
            className="h-24 w-24 sm:h-36 sm:w-36"
            fill="none"
          >
            <defs>
              <linearGradient id="loader-top" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6d35dd" />
              </linearGradient>
              <linearGradient id="loader-right" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4c6ef5" />
                <stop offset="100%" stopColor="#2c48df" />
              </linearGradient>
              <linearGradient id="loader-bottom" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6d35dd" />
                <stop offset="100%" stopColor="#2c48df" />
              </linearGradient>
              <linearGradient id="loader-tail" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6d35dd" />
                <stop offset="100%" stopColor="#2c48df" />
              </linearGradient>
            </defs>

            {/* top-right edge — flies in from the top-right corner */}
            <motion.path
              d="M120,48 L192,120 L166,120 L120,74 Z"
              fill="url(#loader-top)"
              initial={{ x: "75vw", y: "-75vh", opacity: 0, rotate: -25 }}
              animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: pieceEase }}
            />

            {/* right-bottom edge — flies in from the bottom-right corner */}
            <motion.path
              d="M192,120 L120,192 L120,166 L166,120 Z"
              fill="url(#loader-right)"
              initial={{ x: "75vw", y: "75vh", opacity: 0, rotate: 25 }}
              animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: pieceEase }}
            />

            {/* bottom-left edge — flies in from the bottom-left corner */}
            <motion.path
              d="M120,192 L64,124 L88,124 L120,166 Z"
              fill="url(#loader-bottom)"
              initial={{ x: "-75vw", y: "75vh", opacity: 0, rotate: -25 }}
              animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: pieceEase }}
            />

            {/* top-left edge — flies in from the top-left corner */}
            <motion.path
              d="M64,124 L120,48 L120,74 L88,124 Z"
              fill="#e9e9f2"
              initial={{ x: "-75vw", y: "-75vh", opacity: 0, rotate: 25 }}
              animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.9, ease: pieceEase }}
            />

            {/* diagonal tail "\" — enters last, from the bottom-right corner */}
            <motion.line
              x1="148"
              y1="150"
              x2="206"
              y2="208"
              stroke="url(#loader-tail)"
              strokeWidth="16"
              strokeLinecap="round"
              initial={{ x: "60vw", y: "60vh", opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: pieceEase, delay: 0.85 }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
