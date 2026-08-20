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
    // Leave scroll position alone when the URL carries a hash (e.g. a nav
    // link on another page sent the browser to "/#about") — the effect
    // below scrolls to that target itself, once it actually exists and
    // GlobalLoader has released the page.
    const initialHash = window.location.hash;
    if (!initialHash) window.scrollTo(0, 0);

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

    // Landed here with a hash in the URL (e.g. clicked "About" on the
    // /projects page, which links back to "/#about"): GlobalLoader still
    // holds the page at scroll 0 behind an overflow:hidden lock for its
    // own intro, and the target section may not have measured/laid out
    // yet either — so poll briefly rather than assuming either is ready
    // the instant this effect runs.
    let hashScrollTimer: ReturnType<typeof setTimeout> | undefined;
    if (initialHash) {
      const targetId = initialHash.slice(1);
      let attempts = 0;
      const tryScroll = () => {
        attempts += 1;
        const target = document.getElementById(targetId);
        const loaderActive = document.body.style.overflow === "hidden";
        if (target && !loaderActive) {
          lenisInstance.scrollTo(target, { offset: -anchorOffset, immediate: false });
          return;
        }
        if (attempts < 40) hashScrollTimer = setTimeout(tryScroll, 200);
      };
      tryScroll();
    }

    return () => {
      gsap.ticker.remove(tick);
      clearTimeout(hashScrollTimer);
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