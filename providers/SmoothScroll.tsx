'use client'

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export interface SmoothScrollOptions {
  duration?: number;
  easing?: (t: number) => number;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  /** Extra pixels above an anchor target, e.g. for a fixed header. */
  anchorOffset?: number;
  /** ms the scrollbar stays visible after motion stops. */
  scrollbarFadeDelay?: number;
}

const defaultEasing = (t: number) => 1 - Math.pow(1 - t, 4);

const SmoothScroll = ({
  children,
  duration = 1,
  easing = defaultEasing,
  wheelMultiplier = 1,
  touchMultiplier = 1,
  anchorOffset = 0,
  scrollbarFadeDelay = 600,
}: { children: React.ReactNode } & SmoothScrollOptions) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const lenisInstance = new Lenis({
      duration,
      easing,
      smoothWheel: true,
      wheelMultiplier,
      touchMultiplier,
    });
    lenisRef.current = lenisInstance;
    setLenis(lenisInstance);

    let scrollbarFadeTimeout: ReturnType<typeof setTimeout>;
    const root = document.documentElement;
    const handleScroll = () => {
      root.classList.add("is-scrolling");
      clearTimeout(scrollbarFadeTimeout);
      scrollbarFadeTimeout = setTimeout(() => {
        root.classList.remove("is-scrolling");
      }, scrollbarFadeDelay);
    };

    lenisInstance.on("scroll", ScrollTrigger.update);
    lenisInstance.on("scroll", handleScroll);

    const tick = (time: number) => lenisInstance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Route anchor-link clicks (<a href="#section">) through Lenis so
    // header/footer nav feels the same as wheel scrolling, instead of
    // the browser's instant jump-to-hash behavior.
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      lenisInstance.scrollTo(target as HTMLElement, { offset: -anchorOffset });
      // keep the URL hash in sync without triggering a native jump
      history.pushState(null, "", id);
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener("click", handleAnchorClick);
      lenisInstance.destroy();
      lenisRef.current = null;
      setLenis(null);
      clearTimeout(scrollbarFadeTimeout);
      root.classList.remove("is-scrolling");
    };
  }, [duration, easing, wheelMultiplier, touchMultiplier, anchorOffset, scrollbarFadeDelay]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
};

export default SmoothScroll;