'use client'

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  {
    label: "Website",
    href: "#",
    icon: "/globe.svg",
  },
  {
    label: "Twitter",
    href: "#",
    icon: "/twitter.svg",
  },
  {
    label: "Instagram",
    href: "#",
    icon: "/insta.svg",
  },
];

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const items = content.querySelectorAll<HTMLElement>(".reveal");

      gsap.set(items, { opacity: 0, y: 40, filter: "blur(10px)" });

      gsap.to(items, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex w-full items-center overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      {/* faint background word, matches the "CONTACT" watermark in the reference */}
      <Image
        src="/contact.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none absolute inset-0 h-full w-full object-contain object-top"
      />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-col items-center gap-10 px-6 sm:px-10 lg:max-w-7xl lg:flex-row lg:justify-center lg:gap-6 lg:px-16"
      >
        {/* left column: copy + contact details */}
        <div className="flex flex-col items-start text-left md:shrink-0">
          <h2 className="reveal text-3xl font-bold uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
            Need a digital boost?
          </h2>

          <p className="reveal mt-4 max-w-md text-sm text-white/60 sm:text-base">
            Tell us what you&apos;re building. We&apos;ll bring the ideas, design &amp; technology to make it happen.
          </p>

          <p className="reveal mt-3 text-sm font-bold italic uppercase tracking-wide text-white sm:text-base">
            Press. Connect. Create.
          </p>

          <div className="reveal mt-10 w-full">
            <p className="text-xs font-semibold uppercase tracking-widest text-white sm:text-sm">
              Contact Info
            </p>

            <div className="mt-4 flex flex-col gap-4">
              <a href="mailto:info@quadsytax.com" className="flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wide text-white/40">Mail Us</span>
                  <span className="text-sm">info@quadsytax.com</span>
                </span>
              </a>

              <a href="tel:+923227780622" className="flex items-center gap-3 text-white/80 transition-colors hover:text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wide text-white/40">Contact Us</span>
                  <span className="text-sm">+923 227 780622</span>
                </span>
              </a>
            </div>
          </div>

          <div className="reveal mt-8 w-full">
            <p className="text-xs font-semibold uppercase tracking-widest text-white sm:text-sm">
              Social Info
            </p>

            <div className="mt-4 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-colors hover:border-white/30"
                >
                  <Image src={social.icon} alt="" width={16} height={16} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* right column: character illustration with the "press here" button */}
        <div className="reveal relative h-56 w-full shrink-0 xs:h-64 sm:h-90 md:h-105 md:w-105 lg:h-120 lg:w-120 xl:h-140 xl:w-140">
          <Image
            src="/footer-img.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 80vw, (max-width: 1280px) 40vw, 560px"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
