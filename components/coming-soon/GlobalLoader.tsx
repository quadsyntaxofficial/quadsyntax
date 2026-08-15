"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

// Every image the app can paint on first render, so the loader's progress
// (and its exit) is tied to real readiness — not a guess. Fonts are covered
// separately via document.fonts.ready.
const CRITICAL_ASSETS = [
  "/quadsyntax-logo.png",
  "/bg-hero.png",
  "/bg-1.png",
  "/characters-hero.png",
  "/TechSuit.png",
  "/characters-techsuit.png",
  "/logo-monogram.svg",
  "/SERVICES.png",
  "/contact.png",
  "/footer-img.png",
  "/footer-bg-frame.png",
  "/creators.png",
  "/Saad.png",
  "/Wafa.png",
  "/Samra.png",
  "/Saqalain.png",
  "/black-logo.svg",
  "/white-logo.svg",
  "/svg/circle-arrow.svg",
];

const SESSION_KEY = "quadsyntax-intro-seen";
const MIN_VISIBLE_MS = 1500;
const READY_TIMEOUT_MS = 6000;
const BLUE = new THREE.Color("#2c48df");
const PURPLE = new THREE.Color("#6d35dd");

const preloadImage = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // a missing/failed asset shouldn't block the reveal forever
    img.src = src;
  });

export default function GlobalLoader() {
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(true);
  const [displayPct, setDisplayPct] = useState(0);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Decide once, synchronously on mount, whether this tab has already seen
  // the intro this session — skips both the DOM and the WebGL setup below.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // sessionStorage unavailable (privacy mode etc.) — fall through and show it.
    }
    setShouldRender(true);
  }, []);

  useEffect(() => {
    if (!shouldRender) return;
    const host = canvasHostRef.current;
    if (!host) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── three.js scene ────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    const lightA = new THREE.PointLight(BLUE, 12, 12);
    lightA.position.set(2.5, 1.5, 2);
    const lightB = new THREE.PointLight(PURPLE, 12, 12);
    lightB.position.set(-2.5, -1.5, 2);
    scene.add(ambient, lightA, lightB);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.85, 1),
      new THREE.MeshStandardMaterial({
        color: 0x0a0b12,
        emissive: BLUE.clone(),
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.4,
        flatShading: true,
      })
    );
    scene.add(core);

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.45, 1),
      new THREE.MeshBasicMaterial({ color: BLUE.clone(), wireframe: true, transparent: true, opacity: 0.55 })
    );
    scene.add(shell);

    const particleCount = reduceMotion ? 0 : 500;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const r = 2.4 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, transparent: true, opacity: 0.5, sizeAttenuation: true })
    );
    scene.add(particles);

    // slow ambient rotation + light color drift — paused entirely under
    // prefers-reduced-motion instead of just toned down.
    let rotate = !reduceMotion;
    const colorTween = reduceMotion
      ? null
      : gsap.to([lightA.color, core.material.emissive], {
          r: PURPLE.r,
          g: PURPLE.g,
          b: PURPLE.b,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

    const render = () => {
      if (rotate) {
        core.rotation.x += 0.006;
        core.rotation.y += 0.008;
        shell.rotation.x -= 0.003;
        shell.rotation.y -= 0.004;
        particles.rotation.y += 0.0007;
      }
      renderer.render(scene, camera);
    };
    gsap.ticker.add(render);

    const onResize = () => {
      if (!host) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ── real asset/font readiness → smoothed 0–100 display ──────────
    const total = CRITICAL_ASSETS.length + 1; // +1 for fonts
    let loaded = 0;
    const counter = { value: 0 };
    const bumpDisplay = (target: number) => {
      gsap.to(counter, {
        value: target,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
        onUpdate: () => setDisplayPct(Math.round(counter.value)),
      });
    };
    const markLoaded = () => {
      loaded += 1;
      bumpDisplay((loaded / total) * 100);
    };

    const fontsReady =
      "fonts" in document ? document.fonts.ready.catch(() => undefined) : Promise.resolve();
    fontsReady.then(markLoaded);
    const imagesReady = Promise.all(CRITICAL_ASSETS.map((src) => preloadImage(src).then(markLoaded)));

    const readiness = Promise.all([fontsReady, imagesReady]);
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, READY_TIMEOUT_MS));
    const minTime = new Promise<void>((resolve) => setTimeout(resolve, MIN_VISIBLE_MS));

    let cancelled = false;
    Promise.all([Promise.race([readiness.then(() => undefined), timeout]), minTime]).then(() => {
      if (cancelled) return;
      bumpDisplay(100);
      rotate = false;

      const exitTl = gsap.timeline({
        delay: 0.35,
        onComplete: () => {
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            // ignore — worst case the intro just plays again next load
          }
          setVisible(false);
        },
      });
      exitTl
        .to(camera.position, { z: 1.6, duration: 0.9, ease: "power2.in" }, 0)
        .to([core.scale, shell.scale], { x: 0.001, y: 0.001, z: 0.001, duration: 0.6, ease: "power3.in" }, 0.25)
        .to(
          rootRef.current,
          { opacity: 0, duration: 0.5, ease: "power2.inOut" },
          0.45
        );
    });

    return () => {
      cancelled = true;
      colorTween?.kill();
      gsap.ticker.remove(render);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      shell.geometry.dispose();
      (shell.material as THREE.Material).dispose();
      particleGeo.dispose();
      (particles.material as THREE.Material).dispose();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender]);

  if (!shouldRender || !visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-100 flex h-dvh w-dvw flex-col items-center justify-center overflow-hidden bg-background"
    >
      <div ref={canvasHostRef} className="absolute inset-0" />

      <div className="relative flex flex-col items-center gap-4">
        <span className="text-4xl font-bold tabular-nums text-white xs:text-5xl sm:text-6xl">
          {displayPct}
          <span className="text-white/40">%</span>
        </span>
        <div className="h-px w-40 overflow-hidden rounded-full bg-white/10 sm:w-56">
          <div
            className="h-full bg-brand-gradient"
            style={{ width: `${displayPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
