"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const images = [
  "https://picsum.photos/seed/wheel-a/500/560",
  "https://picsum.photos/seed/wheel-b/500/560",
  "https://picsum.photos/seed/wheel-c/500/560",
  "https://picsum.photos/seed/wheel-d/500/560",
  "https://picsum.photos/seed/wheel-e/500/560",
  "https://picsum.photos/seed/wheel-f/500/560",
  "https://picsum.photos/seed/wheel-g/500/560",
  "https://picsum.photos/seed/wheel-h/500/560",
  "https://picsum.photos/seed/wheel-e/500/560",
  "https://picsum.photos/seed/wheel-f/500/560",
  "https://picsum.photos/seed/wheel-g/500/560",
  "https://picsum.photos/seed/wheel-h/500/560",
  "https://picsum.photos/seed/wheel-e/500/560",
  "https://picsum.photos/seed/wheel-f/500/560",
  "https://picsum.photos/seed/wheel-g/500/560",
  "https://picsum.photos/seed/wheel-h/500/560",
];

export default function Panorama() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --------------------------------------------------
    // SCENE
    // --------------------------------------------------

    const scene = new THREE.Scene();

    const width = container.clientWidth;
    const height = container.clientHeight;

    // --------------------------------------------------
    // CAMERA
    // --------------------------------------------------

    const camera = new THREE.PerspectiveCamera(
      42,
      width / height,
      0.1,
      100
    );

    /*
      IMPORTANT:

      Camera is OUTSIDE the carousel.

      This creates actual perspective/depth.
    */
    camera.position.set(0, 0.7, 7);

    camera.lookAt(0, 0.3, 0);

    // --------------------------------------------------
    // RENDERER
    // --------------------------------------------------

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(width, height);

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";

    container.appendChild(renderer.domElement);

    // --------------------------------------------------
    // CAROUSEL
    // --------------------------------------------------

    const carousel = new THREE.Group();

    scene.add(carousel);

    /*
      Increase this to push the carousel deeper.

      10  = relatively close
      14  = medium depth
      18  = deep
      22  = very deep
    */
    const radius = 14;

    const cardWidth = 3.0;
    const cardHeight = 3.0;

    const cardMeshes: THREE.Mesh[] = [];

    const textureLoader = new THREE.TextureLoader();

    // --------------------------------------------------
    // CREATE CARDS
    // --------------------------------------------------

    images.forEach((image, index) => {
      const angle =
        (index / images.length) * Math.PI * 2;

      const texture = textureLoader.load(image);

      texture.colorSpace = THREE.SRGBColorSpace;

      const geometry = new THREE.PlaneGeometry(
        cardWidth,
        cardHeight
      );

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });

      const card = new THREE.Mesh(
        geometry,
        material
      );

      /*
        Place cards around a deep circular arc.
      */

      card.position.set(
        Math.sin(angle) * radius,
        0,
        Math.cos(angle) * radius
      );

      /*
        Make each card face outward
        from the center of the circle.
      */

      card.rotation.y = angle;

      carousel.add(card);

      cardMeshes.push(card);
    });

    // --------------------------------------------------
    // CARD SIZE
    // --------------------------------------------------

    const updateCardScale = () => {
      /*
        Angular distance between cards.
      */

      const angleStep =
        (Math.PI * 2) / images.length;

      /*
        Width available on the circular arc.
      */

      const arcWidth =
        radius * angleStep;

      /*
        Leave visible space between cards.

        Increase this value for larger gaps.
      */

      const gap = 0.18;

      const desiredWidth =
        arcWidth * (1 - gap);

      const scale =
        desiredWidth / cardWidth;

      cardMeshes.forEach((card) => {
        card.scale.set(
          scale,
          scale,
          1
        );
      });
    };

    updateCardScale();

    // --------------------------------------------------
    // DRAG
    // --------------------------------------------------

    let currentRotation = 0;
    let targetRotation = 0;

    let velocity = 0;

    let isDragging = false;

    let previousX = 0;

    /*
      Drag sensitivity
    */

    const sensitivity = 0.006;

    const handlePointerDown = (
      event: PointerEvent
    ) => {
      isDragging = true;

      previousX = event.clientX;

      velocity = 0;

      renderer.domElement.setPointerCapture?.(
        event.pointerId
      );
    };

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      if (!isDragging) return;

      const delta =
        event.clientX - previousX;

      previousX = event.clientX;

      const movement =
        delta * sensitivity;

      targetRotation += movement;

      velocity = movement;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );

    // --------------------------------------------------
    // RESIZE
    // --------------------------------------------------

    const handleResize = () => {
      const newWidth =
        container.clientWidth;

      const newHeight =
        container.clientHeight;

      if (!newWidth || !newHeight) return;

      camera.aspect =
        newWidth / newHeight;

      camera.updateProjectionMatrix();

      renderer.setSize(
        newWidth,
        newHeight
      );

      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
      );

      updateCardScale();
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    const resizeObserver =
      new ResizeObserver(() => {
        handleResize();
      });

    resizeObserver.observe(container);

    // --------------------------------------------------
    // ANIMATION
    // --------------------------------------------------

    let animationId = 0;

    const animate = () => {
      animationId =
        requestAnimationFrame(animate);

      if (!isDragging) {
        targetRotation += velocity;

        velocity *= 0.94;
      }

      currentRotation +=
        (targetRotation - currentRotation) *
        0.08;

      carousel.rotation.y =
        currentRotation;

      renderer.render(
        scene,
        camera
      );
    };

    handleResize();

    animate();

    // --------------------------------------------------
    // CLEANUP
    // --------------------------------------------------

    return () => {
      cancelAnimationFrame(animationId);

      resizeObserver.disconnect();

      window.removeEventListener(
        "resize",
        handleResize
      );

      renderer.domElement.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );

      carousel.children.forEach(
        (child) => {
          const mesh =
            child as THREE.Mesh;

          mesh.geometry.dispose();

          const material =
            mesh.material as THREE.MeshBasicMaterial;

          if (material.map) {
            material.map.dispose();
          }

          material.dispose();
        }
      );

      renderer.dispose();

      if (
        renderer.domElement.parentNode ===
        container
      ) {
        container.removeChild(
          renderer.domElement
        );
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    />
  );
}