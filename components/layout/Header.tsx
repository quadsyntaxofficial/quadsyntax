'use client'
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSmoothNav } from "@/hooks/use-smooth-nav";

const navLinks = ["Home", "About", "Services", "Team", "Projects"];
const linkHref = (link: string) => `#${link.toLowerCase()}`;

const EASE = [0.16, 1, 0.3, 1] as const;

const navContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.7,
    },
  },
};
const navItem = {
  hidden: { opacity: 0, y: -14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE },
  },
};

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);

  const [light, setLight] = useState(false);
  const handleNav = useSmoothNav();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let rafId: number;
    // Right at a light/dark section boundary, the probe point below the
    // header can read either side from one frame to the next (scroll
    // settling, sub-pixel jitter), which flips `light` back and forth and
    // makes the icon/logo strobe between colors. Require a reading to hold
    // for a few consecutive frames before it actually commits, the same
    // hysteresis trick used for the scroll-direction detection below.
    const THEME_COMMIT_FRAMES = 4;
    let pendingTheme: boolean | null = null;
    let pendingStreak = 0;

    const sample = () => {
      const header = headerRef.current;
      if (!header) {
        rafId = requestAnimationFrame(sample);
        return;
      }
      const rect = header.getBoundingClientRect();
      const probeX = rect.left + rect.width / 2;
      const probeY = rect.bottom + 1;
      const stack = document.elementsFromPoint(probeX, probeY);
      const behind = stack.find((el) => !header.contains(el));
      const theme = behind
        ?.closest<HTMLElement>("[data-header-theme]")
        ?.dataset.headerTheme;
      const reading = theme === "light";

      if (reading === pendingTheme) {
        pendingStreak += 1;
      } else {
        pendingTheme = reading;
        pendingStreak = 1;
      }
      if (pendingStreak >= THEME_COMMIT_FRAMES) {
        setLight((prev) => (prev === reading ? prev : reading));
      }

      rafId = requestAnimationFrame(sample);
    };

    rafId = requestAnimationFrame(sample);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  return (
    <motion.header
      ref={headerRef}
      className={` absolute inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 transition-[background-color,border-color,backdrop-filter] duration-500 bg-transparent sm:px-6 sm:py-5 md:px-8 lg:px-10 lg:py-6`}
    >
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        initial={{ y: -100, opacity: 0 }}
        transition={{ ease: EASE, duration: 1.1 }}
      >
        <div className="flex items-center gap-3">
          <Image
            src={light ? "/black-logo.svg" : "/white-logo.svg"}
            alt="QuadSyntax"
            width={40}
            height={40}
            className="h-8 w-40 object-cover sm:h-10 sm:w-50"
          />
        </div>
      </motion.div>

      <motion.div
        className="flex items-center space-x-4"
        variants={navContainer}
        initial="hidden"
        animate="visible"
      >
        <nav
          className={`hidden items-center gap-6 font-inter text-[14px] transition-colors duration-300 md:flex ${
            light ? "text-black/60" : "text-white/60"
          }`}
        >
          {navLinks.map((link) => (
            <motion.a
              key={link}
              href={linkHref(link)}
              variants={navItem}
              onClick={(e) => {
                setActiveLink(link);
                handleNav(e, linkHref(link));
              }}
              className={`relative transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:transition-all after:duration-300 hover:after:w-full ${
                light
                  ? "hover:text-black after:bg-black"
                  : "hover:text-white after:bg-white"
              } ${
                activeLink === link
                  ? `after:w-full ${light ? "text-black" : "text-white"}`
                  : "after:w-0"
              }`}
            >
              {link}
            </motion.a>
          ))}
        </nav>

        <motion.button
          variants={navItem}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="hidden items-center gap-2 rounded-full bg-brand-gradient px-5 py-3 font-inter text-sm font-medium cursor-pointer text-white sm:px-8 lg:flex"
        >
          <span className="hidden sm:inline">Let&apos;s talk</span>
          <span className="sm:hidden">Talk</span>
          <motion.span
            aria-hidden
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
          >
            <Image width={20} height={20} src="/svg/circle-arrow.svg" alt="" />
          </motion.span>
        </motion.button>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="relative flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className={`h-px w-6 transition-colors duration-300 ${light ? "bg-black" : "bg-white"}`}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className={`h-px w-6 transition-colors duration-300 ${light ? "bg-black" : "bg-white"}`}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className={`h-px w-6 transition-colors duration-300 ${light ? "bg-black" : "bg-white"}`}
          />
        </button>
      </motion.div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-white/10 bg-black/90 px-4 py-4 font-inter text-sm text-white/70 backdrop-blur-xl md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link}
                href={linkHref(link)}
                onClick={(e) => {
                  setActiveLink(link);
                  setMenuOpen(false);
                  handleNav(e, linkHref(link));
                }}
                className={`rounded-lg px-3 py-3 transition-colors hover:bg-white/5 hover:text-white ${
                  activeLink === link ? "text-white" : ""
                }`}
              >
                {link}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;