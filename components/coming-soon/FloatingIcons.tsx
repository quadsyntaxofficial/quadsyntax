"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

const icons = [
  // code brackets
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9 18L3 12L9 6M15 6L21 12L15 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  // layers
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  // gear
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M19.4 13.5a7.9 7.9 0 000-3l1.9-1.5-2-3.4-2.3.6a8 8 0 00-2.6-1.5L14 2h-4l-.4 2.7a8 8 0 00-2.6 1.5l-2.3-.6-2 3.4L4.6 10.5a7.9 7.9 0 000 3L2.7 15l2 3.4 2.3-.6a8 8 0 002.6 1.5L10 22h4l.4-2.7a8 8 0 002.6-1.5l2.3.6 2-3.4-1.9-1.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  ),
  // hexagon / diamond echoing the logo
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2L22 12L12 22L2 12L12 2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  // cursor / pointer
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M5 3L19 10.5L12 12.5L10 19.5L5 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  // sparkle
  (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
];

type FloatingIconConfig = {
  id: number;
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  color: string;
};

const configs: FloatingIconConfig[] = [
  { id: 0, Icon: icons[0], top: "12%", left: "8%", size: 34, duration: 7, delay: 0, color: "#2c48df" },
  { id: 1, Icon: icons[1], top: "22%", left: "88%", size: 40, duration: 8.5, delay: 0.6, color: "#6d35dd" },
  { id: 2, Icon: icons[2], top: "72%", left: "10%", size: 30, duration: 9, delay: 1.1, color: "#6d35dd" },
  { id: 3, Icon: icons[3], top: "78%", left: "85%", size: 36, duration: 7.5, delay: 0.3, color: "#2c48df" },
  { id: 4, Icon: icons[4], top: "45%", left: "5%", size: 24, duration: 6.5, delay: 0.8, color: "#8a5cf6" },
  { id: 5, Icon: icons[5], top: "15%", left: "50%", size: 22, duration: 6, delay: 1.4, color: "#2c48df" },
  { id: 6, Icon: icons[1], top: "85%", left: "45%", size: 26, duration: 8, delay: 0.2, color: "#6d35dd" },
  { id: 7, Icon: icons[3], top: "55%", left: "93%", size: 28, duration: 7.2, delay: 1.6, color: "#8a5cf6" },
];

function FloatingIcon({
  Icon,
  top,
  left,
  size,
  duration,
  delay,
  color,
  mouseX,
  mouseY,
}: FloatingIconConfig & { mouseX: MotionValue<number>; mouseY: MotionValue<number> }) {
  // Closer to center of screen (0) = subtler drift; further from 0 = larger parallax.
  const depth = size / 26;
  const parallaxX = useTransform(mouseX, (v) => v * depth);
  const parallaxY = useTransform(mouseY, (v) => v * depth);

  return (
    <motion.div
      className="pointer-events-auto absolute cursor-pointer"
      style={{ top, left, color, x: parallaxX, y: parallaxY }}
      whileHover={{ scale: 1.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 0, rotate: 0 }}
        animate={{
          opacity: [0, 0.55, 0.55, 0],
          y: [-10, -30, -10],
          x: [0, 10, 0],
          rotate: [0, 12, 0],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Icon width={size} height={size} />
      </motion.div>
    </motion.div>
  );
}

export default function FloatingIcons() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 60, damping: 20, mass: 0.5 });
  const mouseY = useSpring(rawY, { stiffness: 60, damping: 20, mass: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      rawX.set(relX * -40);
      rawY.set(relY * -40);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawX, rawY]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {configs.map((config) => (
        <FloatingIcon key={config.id} {...config} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
}
