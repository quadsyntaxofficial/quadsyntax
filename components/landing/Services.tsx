'use client'

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import ThreeDSlider, {
  ThreeDSliderHandle,
} from "@/components/lightswind/3d-slider";

gsap.registerPlugin(ScrollTrigger);

const sliderItems = [
  {
    title: "Web Development",
    num: "01",
    description: "We build fast, scalable web platforms tailored to your product goals.",
    tags: ["Architecture", "Performance", "Scaling"],
    data: { id: 1 },
  },
  {
    title: "UI/UX Designing",
    num: "02",
    description: "We design intuitive interfaces and user journeys that enhance usability.",
    tags: ["User Research", "Interface Design", "Product Scaling"],
    data: { id: 2 },
  },
  {
    title: "Wordpress",
    num: "03",
    description: "We design intuitive wordpress interfaces and user journeys that enhance usability.",
    tags: ["User Research", "Interface Design", "Product Scaling"],
    data: { id: 3 },
  },
  {
    title: "Frontend Development",
    num: "04",
    description: "We design intuitive frontend interfaces and user journeys that enhance usability.",
    tags: ["User Research", "Interface Design", "Product Scaling"],
    data: { id: 4 },
  },
  {
    title: "Backend Development",
    num: "05",
    description: "We design intuitive backend systems and workflows that enhance reliability.",
    tags: ["User Research", "Interface Design", "Product Scaling"],
    data: { id: 5 },
  },
];

const SCROLL_LENGTH_VH = 2.5;

const Services = () => {
  const servicesSectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<ThreeDSliderHandle>(null);

  useEffect(() => {
    const section = servicesSectionRef.current;
    if (!section) return;

    ScrollTrigger.normalizeScroll(true);

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${Math.round(window.innerHeight * SCROLL_LENGTH_VH)}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          sliderRef.current?.setProgress(self.progress * 100);
        },
      });

      return () => trigger.kill();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={servicesSectionRef}
      id="services"
      className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden xs:min-h-[65vh] sm:min-h-[70vh] md:min-h-[75vh] lg:h-screen"
    >
      {/* faint background word, matches "SERVICES" watermark in the reference */}
      <Image
        src="/SERVICES.png"
        alt="Services"
        fill
        priority
        sizes="100vw"
        className="absolute h-full w-full object-contain object-top"
      />

      <ThreeDSlider ref={sliderRef} items={sliderItems} disableWheel />
    </section>
  );
};

export default Services;
