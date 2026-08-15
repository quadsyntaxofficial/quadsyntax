"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  CSSProperties,
} from "react";
import SliderCard, {
  SliderItemData,
} from "./SliderCard";

export type { SliderItemData };

export interface ThreeDSliderHandle {
  /** Set slider progress directly, 0–100. Used to drive the deck from an external scroll trigger. */
  setProgress: (progress: number) => void;
}

interface ThreeDSliderProps {
  items: SliderItemData[];
  speedWheel?: number;
  speedDrag?: number;
  spreadX?: number;
  spreadY?: number;
  spreadRotation?: number;
  containerStyle?: CSSProperties;
  className?: string;
  onItemClick?: (item: SliderItemData, index: number) => void;
  /** When true, disables the internal wheel handler so an external
   *  scroll-driven controller (e.g. GSAP ScrollTrigger) owns progress. */
  disableWheel?: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────
const ThreeDSlider = forwardRef<ThreeDSliderHandle, ThreeDSliderProps>(
  (
    {
      items,
      speedWheel = 0.04,
      speedDrag = -0.05,
      spreadX = 580,
      spreadY = 70,
      spreadRotation = 65,
      containerStyle = {},
      className = "",
      onItemClick,
      disableWheel = false,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const onItemClickRef = useRef(onItemClick);
    // spreadX/spreadY are authored as desktop px values; on a narrow
    // viewport that same spread pushes most cards past the (clipped)
    // container edge, leaving only the center card visible. Scale both
    // down proportionally to the container's own width instead of
    // hardcoding breakpoint tables — this keeps the fan visible and
    // proportioned at any width.
    const spreadScaleRef = useRef(1);

    useEffect(() => {
      onItemClickRef.current = onItemClick;
    }, [onItemClick]);

    // Holds the live control functions created inside the effect below,
    // so the imperative handle (stable identity) can always reach the
    // current closure without re-creating itself every render.
    const controlRef = useRef<{ setProgress: (p: number) => void } | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        setProgress: (p: number) => controlRef.current?.setProgress(p),
      }),
      []
    );

    useEffect(() => {
      const container = containerRef.current;
      if (!container || items.length === 0) return;

      const numItems = items.length;

      let progress = 50;
      let targetProgress = 50;
      let isDown = false;
      let startX = 0;
      let rafId: number | null = null;
      let isAnimating = false;
      let externalDrive = false; // true while progress is being set externally (skips easing lag)

      const cache: { tx: string; ty: string; rot: string; z: string; op: string }[] = items.map(
        () => ({ tx: "", ty: "", rot: "", z: "", op: "" })
      );

      const REFERENCE_WIDTH = 1000; // container width the authored spreadX/spreadY assume full-strength
      const MIN_SPREAD_SCALE = 0.32; // never shrink the fan so much it collapses into one stack
      const computeSpreadScale = () => {
        const width = container.getBoundingClientRect().width;
        spreadScaleRef.current = Math.max(MIN_SPREAD_SCALE, Math.min(1, width / REFERENCE_WIDTH));
      };
      computeSpreadScale();

      function update() {
        // Snap instantly when driven externally (scroll scrub already
        // provides its own smoothing) — otherwise ease as before.
        const lerpFactor = externalDrive ? 1 : isDown ? 1 : 0.1;
        progress += (targetProgress - progress) * lerpFactor;

        const clamped = Math.max(0, Math.min(100, progress));
        const activeFloat = (clamped / 100) * (numItems - 1);
        const denom = numItems > 1 ? numItems - 1 : 1;

        for (let i = 0; i < numItems; i++) {
          const card = cardRefs.current[i];
          if (!card) continue;

          const scale = spreadScaleRef.current;
          const ratio = (i - activeFloat) / denom;
          const tx = (ratio * spreadX * scale).toFixed(2);
          const ty = (ratio * spreadY * scale).toFixed(2);
          const rot = (ratio * spreadRotation).toFixed(2);

          const dist = Math.abs(i - activeFloat);
          const z = numItems - dist;
          const op = Math.max(0, Math.min(1, (z / numItems) * 3 - 1.8)).toFixed(2);
          const zStr = Math.round(z * 10).toString();

          const c = cache[i];

          if (c.tx !== tx || c.ty !== ty || c.rot !== rot) {
            card.style.transform = `translate3d(${tx}%, ${ty}%, 0) rotate(${rot}deg)`;
            c.tx = tx;
            c.ty = ty;
            c.rot = rot;
          }
          if (c.z !== zStr) {
            card.style.zIndex = zStr;
            c.z = zStr;
          }
          if (c.op !== op) {
            card.style.opacity = op;
            c.op = op;
          }
        }
      }

      function loop() {
        update();
        const diff = Math.abs(targetProgress - progress);
        if (diff > 0.01 || isDown) {
          rafId = requestAnimationFrame(loop);
        } else {
          progress = targetProgress;
          update();
          isAnimating = false;
          rafId = null;
        }
      }

      function startLoop() {
        if (isAnimating) return;
        isAnimating = true;
        rafId = requestAnimationFrame(loop);
      }

      update();

      function getX(e: MouseEvent | TouchEvent): number | undefined {
        return "touches" in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      }

      function onWheel(e: WheelEvent) {
        const delta = e.deltaY * speedWheel;
        const next = targetProgress + delta;
        if ((next <= 0 && e.deltaY < 0) || (next >= 100 && e.deltaY > 0)) return;
        e.preventDefault();
        externalDrive = false;
        targetProgress = Math.max(0, Math.min(100, next));
        startLoop();
      }

      function onDown(e: MouseEvent | TouchEvent) {
        isDown = true;
        externalDrive = false;
        const x = getX(e);
        if (x !== undefined) startX = x;
        if (!isAnimating) {
          isAnimating = true;
          rafId = requestAnimationFrame(loop);
        }
      }

      function onMove(e: MouseEvent | TouchEvent) {
        if (!isDown) return;
        const x = getX(e);
        if (x === undefined) return;
        const diff = (x - startX) * speedDrag;
        targetProgress = Math.max(0, Math.min(100, targetProgress + diff));
        startX = x;
      }

      function onUp() {
        if (!isDown) return;
        isDown = false;
      }

      // Wire up click-to-navigate on each mounted card, using the same
      // eased loop (rather than the external-drive jump used by ref.setProgress).
      const clickHandlers: (() => void)[] = [];
      cardRefs.current.forEach((cardEl, i) => {
        if (!cardEl) return;
        const handler = () => {
          const denom = numItems > 1 ? numItems - 1 : 1;
          externalDrive = false;
          targetProgress = (i / denom) * 100;
          startLoop();
          onItemClickRef.current?.(items[i], i);
        };
        cardEl.addEventListener("click", handler, { passive: true });
        clickHandlers.push(() => cardEl.removeEventListener("click", handler));
      });

      if (!disableWheel) {
        container.addEventListener("wheel", onWheel, { passive: false });
      }
      container.addEventListener("mousedown", onDown, { passive: true });
      container.addEventListener("touchstart", onDown, { passive: true });
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseup", onUp, { passive: true });
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchend", onUp, { passive: true });

      const ro = new ResizeObserver(() => {
        computeSpreadScale();
        update();
      });
      ro.observe(container);

      // Expose the external control surface used by setProgress().
      controlRef.current = {
        setProgress: (p: number) => {
          const clamped = Math.max(0, Math.min(100, p));
          externalDrive = true;
          targetProgress = clamped;
          progress = clamped; // no easing lag — the scrub already smooths this
          update();
        },
      };

      return () => {
        controlRef.current = null;
        clickHandlers.forEach((remove) => remove());
        container.removeEventListener("wheel", onWheel);
        container.removeEventListener("mousedown", onDown);
        container.removeEventListener("touchstart", onDown);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onUp);
        ro.disconnect();
        if (rafId) cancelAnimationFrame(rafId);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, speedWheel, speedDrag, spreadX, spreadY, spreadRotation, disableWheel]);

    return (
      <div
        ref={containerRef}
        className={`relative w-full h-[58vh] xs:h-[62vh] sm:h-[68vh] md:h-[72vh] lg:h-screen overflow-hidden rounded-2xl ${className}`}
        style={{ ...containerStyle, touchAction: "pan-y" }}
      >
        {items.map((item, i) => (
          <SliderCard
            key={i}
            ref={(el:any) => {
              cardRefs.current[i] = el;
            }}
            item={item}
          />
        ))}
      </div>
    );
  }
);

ThreeDSlider.displayName = "ThreeDSlider";

export default ThreeDSlider;