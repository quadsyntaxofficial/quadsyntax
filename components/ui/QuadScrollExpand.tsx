"use client";

import {
  useLayoutEffect,
  useRef,
  useCallback,
  useState,
  isValidElement,
  cloneElement,
  type ReactNode,
} from "react";
import QuadWordmark, {
  QUAD_VIEWBOX,
  D_BOX_RECT,
  D_BOX_PERCENT,
  D_LETTER_SLOT,
  LETTER_STAGGER,
} from "./QuadWordMark";
import { useMotionValue } from "framer-motion";

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

// Shared with QuadWordmark's `revealDelay` prop (and its per-letter
// duration/ease) below so the D-box's own entrance lands in the correct
// slot of the letter-by-letter sequence, rising up in lockstep with them.
const WORDMARK_REVEAL_DELAY = 0.5;
const D_REVEAL_DURATION = 0.75;
const D_REVEAL_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const D_REVEAL_DELAY = WORDMARK_REVEAL_DELAY + D_LETTER_SLOT * LETTER_STAGGER;

// left/top are relative to the wordmark container (which shares its aspect
// ratio 1:1 with the SVG viewBox, so D_BOX_PERCENT maps onto it exactly).
// originLeft/originTop are the wordmark's own offset within the stage —
// needed once the box grows past the wordmark's bounds to fill the stage.
type DRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  originLeft: number;
  originTop: number;
};

export interface QuadScrollExpandProps {
  imageSrc: string;
  imageAlt?: string;
  heroBackground?: ReactNode;
  heroForeground?: ReactNode; // tagline etc — fades/lifts away as the box expands
  expandedContent?: ReactNode; // carousel / categories — fades in once expanded
  revealContent?: ReactNode; // section pinned underneath — revealed as the expanded box slides up and away
  scrollDistance?: number; // viewport-heights of scroll needed to fully expand
  holdDistance?: number; // extra viewport-heights held at full expansion
  slideDistance?: number; // viewport-heights of scroll to slide the expanded box off, revealing revealContent
  revealHoldDistance?: number; // viewport-heights held, revealContent filling the screen, after the slide finishes — drives revealContent's own wordProgress
  smoothing?: number; // 0 = snap to scroll, higher = laggier/smoother
  letterSplit?: number; // px the wordmark halves separate by at full expansion
  startRadius?: number; // corner radius (px) of the box at rest
  className?: string;
}

const QuadScrollExpand = ({
  imageSrc,
  imageAlt = "",
  heroBackground,
  heroForeground,
  expandedContent,
  revealContent,
  scrollDistance = 1.1,
  holdDistance = 0.5,
  slideDistance = 1,
  revealHoldDistance = 0.8,
  smoothing = 0.12,
  letterSplit = 200,
  startRadius = 1,
  className = "",
}: QuadScrollExpandProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const leftGroupRef = useRef<SVGGElement | null>(null);
  const rightGroupRef = useRef<SVGGElement | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const revealMV = useMotionValue(0);
  const wordMV = useMotionValue(0);

  const rectRef = useRef<DRect>({ left: 0, top: 0, width: 0, height: 0, originLeft: 0, originTop: 0 });
  const configRef = useRef({ scrollDistance, holdDistance, slideDistance, revealHoldDistance, smoothing, letterSplit, startRadius });
  const [revealProgress, setRevealProgress] = useState(0);
  // 0..1 across the hold *after* the slide has fully finished — i.e. only
  // once revealContent already fills the whole screen — for driving its own
  // scroll-linked reveal (e.g. word-by-word) without that reveal running
  // mid-slide, while revealContent is still partially covered.
  const [wordProgress, setWordProgress] = useState(0);

  // Measure the D-box's real rendered position/size, in px relative to the
  // wordmark container (its resting CSS position, via D_BOX_PERCENT, is
  // already relative to that same container — see the JSX below). Because
  // this reads the actual SVG bounding rect, it's correct at every
  // breakpoint automatically — no matchMedia tables required.
  const measureRect = useCallback(() => {
    const stage = stageRef.current;
    const wordmark = wordmarkRef.current;
    if (!stage || !wordmark) return;
    const svg = wordmark.querySelector("svg");
    if (!svg) return;

    const svgRect = svg.getBoundingClientRect();
    const wordmarkRect = wordmark.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const scaleX = svgRect.width / QUAD_VIEWBOX.width;
    const scaleY = svgRect.height / QUAD_VIEWBOX.height;

    rectRef.current = {
      left: svgRect.left - wordmarkRect.left + D_BOX_RECT.x * scaleX,
      top: svgRect.top - wordmarkRect.top + D_BOX_RECT.y * scaleY,
      width: D_BOX_RECT.width * scaleX,
      height: D_BOX_RECT.height * scaleY,
      originLeft: wordmarkRect.left - stageRect.left,
      originTop: wordmarkRect.top - stageRect.top,
    };
  }, []);

  const applyProgress = useCallback((p: number, sp: number = 0, wp: number = 0) => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;

    if (frontRef.current) {
      frontRef.current.style.transform = `translate3d(0, ${-sp * 100}%, 0)`;
      frontRef.current.style.pointerEvents = sp > 0.5 ? "none" : "auto";
    }
    if (revealRef.current) {
      revealRef.current.style.opacity = `${smoothstep(0, 0.12, sp)}`;
      revealRef.current.style.pointerEvents = sp > 0.5 ? "auto" : "none";
    }

    // in applyProgress:
    revealMV.set(sp);
    wordMV.set(wp);
    // setRevealProgress((prev) => (Math.abs(prev - sp) > 0.0009 ? sp : prev));
    // setWordProgress((prev) => (Math.abs(prev - wp) > 0.0009 ? wp : prev));

    const c = configRef.current;
    const e = smoothstep(0, 1, p);
    const rect = rectRef.current;
    const stageW = stage.clientWidth;
    const stageH = stage.clientHeight;

    // rect.left/top are relative to the wordmark container, which is where
    // the resting CSS position (D_BOX_PERCENT) also lives — so at e=0 this
    // lines up exactly with the pre-JS/SSR position, no jump on handoff.
    // At e=1 we offset by -origin to land at the stage's own (0,0), since
    // the box's positioning context is still the wordmark, not the stage.
    const left = rect.left * (1 - e) + -rect.originLeft * e;
    const top = rect.top * (1 - e) + -rect.originTop * e;
    const width = rect.width + (stageW - rect.width) * e;
    const height = rect.height + (stageH - rect.height) * e;

    // Once JS drives layout, all positioning happens via transform; reset
    // the CSS left/top base (used only for the blink-free first paint) to 0.
    frame.style.left = "0px";
    frame.style.top = "0px";
    frame.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    frame.style.width = `${Math.max(width, 1)}px`;
    frame.style.height = `${Math.max(height, 1)}px`;
    frame.style.borderRadius = `${c.startRadius * (1 - e)}px`;

    if (imageRef.current) {
      imageRef.current.style.opacity = `${smoothstep(0.15, 0.9, p)}`;
    }

    const split = smoothstep(0, 0.75, p);
    const wordmarkOut = smoothstep(0.35, 0.85, p);
    if (leftGroupRef.current) {
      leftGroupRef.current.style.transform = `translate3d(${-c.letterSplit * split}px, 0, 0)`;
      leftGroupRef.current.style.opacity = `${1 - wordmarkOut}`;
    }
    if (rightGroupRef.current) {
      rightGroupRef.current.style.transform = `translate3d(${c.letterSplit * split}px, 0, 0)`;
      rightGroupRef.current.style.opacity = `${1 - wordmarkOut}`;
    }

    if (bgRef.current) {
      bgRef.current.style.opacity = `${1 - smoothstep(0.1, 0.45, p)}`;
    }
    if (foregroundRef.current) {
      const out = smoothstep(0.35, 0.85, p);
      foregroundRef.current.style.opacity = `${1 - out}`;
      foregroundRef.current.style.transform = `translate3d(0, ${-40 * out}px, 0)`;
    }
    if (contentRef.current) {
      const inn = smoothstep(0.72, 1, p);
      contentRef.current.style.opacity = `${inn}`;
      contentRef.current.style.transform = `scale(${0.85 + 0.15 * inn})`;
      contentRef.current.style.pointerEvents = inn > 0.6 ? "auto" : "none";
    }
  }, []);

  useLayoutEffect(() => {
    configRef.current = { scrollDistance, holdDistance, slideDistance, revealHoldDistance, smoothing, letterSplit, startRadius };

    const track = trackRef.current;
    const stage = stageRef.current;
    const wordmark = wordmarkRef.current;
    if (!track || !stage || !wordmark) return;

    leftGroupRef.current = wordmark.querySelector<SVGGElement>("#wordmark-left");
    rightGroupRef.current = wordmark.querySelector<SVGGElement>("#wordmark-right");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let currentSlide = 0;
    let targetSlide = 0;
    let currentWord = 0;
    let targetWord = 0;
    let running = false;

    const setTrackHeight = () => {
      const c = configRef.current;
      const vh = window.innerHeight;
      track.style.height = `${vh * (1 + Math.max(0.2, c.scrollDistance) + Math.max(0, c.holdDistance) + Math.max(0, c.slideDistance) + Math.max(0, c.revealHoldDistance))}px`;
    };

    const readProgress = () => {
      const c = configRef.current;
      const span = window.innerHeight * Math.max(0.2, c.scrollDistance);
      const top = track.getBoundingClientRect().top;
      return clamp(-top / span, 0, 1);
    };

    const readSlideProgress = () => {
      const c = configRef.current;
      const vh = window.innerHeight;
      const expandHold = vh * (Math.max(0.2, c.scrollDistance) + Math.max(0, c.holdDistance));
      const span = vh * Math.max(0.001, c.slideDistance);
      const top = track.getBoundingClientRect().top;
      return clamp((-top - expandHold) / span, 0, 1);
    };

    // Only starts advancing once the slide above has fully finished (i.e.
    // revealContent already fills the whole screen), over its own dedicated
    // scroll span — so anything driven by this (About's word reveal) only
    // ever runs while the section is fully in view, not mid-slide.
    const readWordProgress = () => {
      const c = configRef.current;
      const vh = window.innerHeight;
      const expandHoldSlide = vh * (Math.max(0.2, c.scrollDistance) + Math.max(0, c.holdDistance) + Math.max(0, c.slideDistance));
      const span = vh * Math.max(0.001, c.revealHoldDistance);
      const top = track.getBoundingClientRect().top;
      return clamp((-top - expandHoldSlide) / span, 0, 1);
    };

    const tick = () => {
      const c = configRef.current;
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      currentSlide += (targetSlide - currentSlide) * k;
      currentWord += (targetWord - currentWord) * k;
      if (
        Math.abs(target - current) < 0.0006 &&
        Math.abs(targetSlide - currentSlide) < 0.0006 &&
        Math.abs(targetWord - currentWord) < 0.0006
      ) {
        current = target;
        currentSlide = targetSlide;
        currentWord = targetWord;
        running = false;
      }
      applyProgress(current, currentSlide, currentWord);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      targetSlide = readSlideProgress();
      targetWord = readWordProgress();
      if (configRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        currentSlide = targetSlide;
        currentWord = targetWord;
        applyProgress(current, currentSlide, currentWord);
        return;
      }
      kick();
    };

    const onResize = () => {
      measureRect();
      setTrackHeight();
      target = readProgress();
      targetSlide = readSlideProgress();
      targetWord = readWordProgress();
      current = target;
      currentSlide = targetSlide;
      currentWord = targetWord;
      applyProgress(current, currentSlide, currentWord);
    };

    measureRect();
    setTrackHeight();
    target = readProgress();
    targetSlide = readSlideProgress();
    targetWord = readWordProgress();
    current = target;
    currentSlide = targetSlide;
    currentWord = targetWord;
    applyProgress(current, currentSlide, currentWord);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(onResize);
    ro.observe(stage);
    ro.observe(wordmark);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [applyProgress, measureRect]);

  return (
    <section id="home" className={`relative w-full ${className}`.trim()}>
      {/* Mobile/tablet: no sticky pin, no scroll-driven expand — just a
          plain stacked hero (wordmark heading + tagline) followed by the
          carousel, so the section behaves like every other normal section. */}
      <div className="lg:hidden">
        <div className="relative flex h-[70vh] w-full flex-col justify-center gap-6 overflow-hidden bg-[#06070f] px-5 py-10 text-white xs:h-[68vh] sm:h-[65vh] sm:gap-8 sm:bg-transparent sm:px-6 sm:py-14 md:h-[60vh] md:bg-transparent md:px-10">
          {heroBackground ? <div className="absolute inset-0 sm:hidden">{heroBackground}</div> : null}
          <div className="relative z-10 flex flex-col gap-6 sm:gap-8">
            <QuadWordmark className="h-auto w-full" />
            {heroForeground}
          </div>
        </div>
        {expandedContent ? (
          <div
            data-header-theme="light"
            className="relative flex h-[60vh] w-full flex-col overflow-hidden bg-white text-black xs:h-[58vh] sm:h-[55vh] md:h-[50vh]"
          >
            {expandedContent}
          </div>
        ) : null}
        {revealContent}
      </div>

      <div ref={trackRef} className="relative hidden w-full lg:block">
        <div
          ref={stageRef}
          className="sticky top-0 h-dvh w-full overflow-hidden text-white"
        >
          {revealContent ? (
            <div
              ref={revealRef}
              className="absolute inset-0 z-0"
              style={{ pointerEvents: "none", opacity: 0 }}
            >
              {isValidElement(revealContent)
                ? cloneElement(
                  revealContent as React.ReactElement<{ revealProgress?: number; wordProgress?: number }>,
                  { revealProgress, wordProgress }
                )
                : revealContent}
            </div>
          ) : null}

          <div
            ref={frontRef}
            className="absolute inset-0 z-20 will-change-transform"
          >
            {heroBackground ? (
              <div ref={bgRef} className="absolute inset-0">
                {heroBackground}
              </div>
            ) : null}

            <div className="relative z-10 flex h-full flex-col justify-center gap-6 px-5 py-10 sm:gap-8 sm:px-6 sm:py-14 md:px-10">
              <div
                ref={wordmarkRef}
                className="relative w-full select-none"
                style={{ aspectRatio: `${QUAD_VIEWBOX.width} / ${QUAD_VIEWBOX.height}` }}
              >
                <QuadWordmark
                  className="h-auto w-full"
                  hideBox
                  revealLetters
                  revealDelay={WORDMARK_REVEAL_DELAY}
                />

                {/* THE D-BOX — rendered at rest via pure CSS percentages (D_BOX_PERCENT),
                  so it's correctly positioned on the very first paint with no JS
                  measurement needed (no blink on refresh). The outer div is what JS
                  drives (transform/width/height) for the scroll expansion, so the
                  entrance itself — rising up from below like every other letter, as
                  the literal "D" in the QUADSYNTAX sequence — animates on an inner
                  wrapper instead, leaving the outer transform free. */}
                <div
                  ref={frameRef}
                  data-header-theme="light"
                  className="absolute z-30 origin-top-left overflow-hidden will-change-[transform,width,height]"
                  style={{
                    left: `${D_BOX_PERCENT.left}%`,
                    top: `${D_BOX_PERCENT.top}%`,
                    width: `${D_BOX_PERCENT.width}%`,
                    height: `${D_BOX_PERCENT.height}%`,
                    borderRadius: `${startRadius}px`,
                  }}
                >
                  <div
                    className="quad-d-reveal absolute inset-0 bg-white will-change-[transform,opacity]"
                    style={{
                      animation: `quad-d-reveal ${D_REVEAL_DURATION}s ${D_REVEAL_EASE} ${D_REVEAL_DELAY}s both`,
                    }}
                  >
                    <img
                      ref={imageRef}
                      src={imageSrc}
                      alt={imageAlt}
                      className="absolute inset-0 h-full w-full object-cover opacity-0 will-change-[opacity]"
                      draggable={false}
                    />
                    {expandedContent ? (
                      <div
                        ref={contentRef}
                        className="absolute inset-0 flex flex-col opacity-0 [will-change:opacity,transform]"
                      >
                        {expandedContent}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {heroForeground ? (
                <div ref={foregroundRef} className="will-change-transform">
                  {heroForeground}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuadScrollExpand;