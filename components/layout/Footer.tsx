'use client'

import Image from "next/image";
import { useSmoothNav } from "../../hooks/use-smooth-nav";

const FOOTER_LINKS = ["Home", "About", "Projects", "Services", "Team", "Contact"];
const linkHref = (link: string) => `#${link.toLowerCase()}`;

const Footer = () => {
  const handleNav = useSmoothNav();

  return (
    <footer className="relative w-full overflow-hidden pt-20 pb-10">
      {/* decorative corner + rule lines, matches the reference frame */}
      <Image
        src="/footer-bg-frame.png"
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-bottom"
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <Image
          src="/quadsyntax-logo.png"
          alt="QuadSyntax"
          width={285}
          height={69}
          className="h-auto w-40 sm:w-48"
        />

        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-inter text-xs uppercase tracking-widest text-white/60">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link}
              href={linkHref(link)}
              onClick={(e) => handleNav(e, linkHref(link))}
              className="transition-colors hover:text-white"
            >
              {link}
            </a>
          ))}
        </nav>

        <p className="text-xs text-white/40">
          © All rights reserved by <span className="text-gradient font-medium">QUADSYNTAX</span>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
