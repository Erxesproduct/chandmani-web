"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sticky header that slides away while the visitor scrolls down and comes back as soon as they scroll up.
 * It stays put near the top of the page and while the pointer is over it (an open mega menu).
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        const dy = y - last;
        // an open mega menu (pointer over the header) keeps it in place
        const busy = !!ref.current?.matches(":hover");
        if (y < 140 || busy) setHidden(false);
        else if (dy > 6) setHidden(true);
        else if (dy < -6) setHidden(false);
        if (Math.abs(dy) > 6) last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header ref={ref} data-hidden={hidden} className="site-header sticky top-0 z-40">
      {children}
    </header>
  );
}
