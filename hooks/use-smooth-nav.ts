'use client'

import { useCallback } from "react";
import { useLenis } from "../providers/SmoothScroll";

// Routes in-page anchor clicks through the shared Lenis instance so they
// animate like the rest of the page's scrolling, instead of the browser's
// instant jump. Falls back to a native smooth scroll if Lenis isn't ready
// yet, and is a no-op for sections that don't exist (yet) so the link
// doesn't jump to the top of the page.
export const useSmoothNav = (offset = -96) => {
  const lenis = useLenis();

  return useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith("#")) return;

      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();

      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [lenis, offset]
  );
};
