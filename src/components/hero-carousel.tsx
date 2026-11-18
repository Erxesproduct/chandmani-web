"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Img } from "@/lib/catalog";

/** The shop's wide banners shown whole (no cropping), crossfading every 6 s, with gold progress ticks. */
export function HeroCarousel({ slides }: { slides: Img[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % slides.length), 6000);
    return () => window.clearInterval(t);
  }, [paused, slides.length]);
  const first = slides[0];
  if (!first) return null;
  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="relative w-full overflow-hidden bg-night" style={{ aspectRatio: `${first.w} / ${first.h}` }}>
        {slides.map((s, k) => (
          <Image key={s.src} src={s.src} alt="" width={s.w} height={s.h} priority={k === 0} sizes="100vw" data-on={k === i} className="slide absolute inset-0 h-full w-full object-contain" />
        ))}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-night/70 to-transparent" aria-hidden />
      </div>
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2 md:bottom-5" role="tablist" aria-label="Баннер">
          {slides.map((s, k) => (
            <button key={s.src} type="button" role="tab" aria-selected={k === i} aria-label={`Баннер ${k + 1}`} onClick={() => setI(k)} className="group grid h-6 place-items-center px-1">
              <span className={`block h-px transition-all duration-500 ${k === i ? "w-10 bg-gilt-2" : "w-5 bg-ivory/45 group-hover:bg-ivory/80"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
