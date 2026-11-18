"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/lib/catalog";

/** Large square photo with a hairline gold frame, thumbnails beside it. */
export function Gallery({ images, name }: { images: Photo[]; name: string }) {
  const [i, setI] = useState(0);
  const img = images[i] ?? images[0];
  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-0.5 md:flex-col" role="tablist" aria-label="Зургууд">
          {images.map((m, k) => (
            <button key={m.src} type="button" role="tab" aria-selected={k === i} aria-label={`Зураг ${k + 1}`} onClick={() => setI(k)} className="relative h-[72px] w-[72px] shrink-0 overflow-hidden bg-ivory opacity-60 outline-1 outline-offset-2 outline-transparent transition hover:opacity-100 aria-selected:opacity-100 aria-selected:outline-gilt md:h-20 md:w-20">
              <Image src={m.thumb.src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-square flex-1 overflow-hidden bg-ivory">
        {img ? (
          <Image key={img.src} src={img.src} alt={name} width={img.w} height={img.h} priority sizes="(min-width: 1024px) 620px, 100vw" className="fade-in absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="display absolute inset-0 grid place-items-center text-[40px] text-ink/15">Chandmani</span>
        )}
        <span className="pointer-events-none absolute inset-3 border border-gilt-2/70" aria-hidden />
      </div>
    </div>
  );
}
