import Image from "next/image";
import Link from "next/link";
import { article, getKind, soldOut, type Product } from "@/lib/catalog";
import { Price } from "./price";

/** A square photo in a quiet ivory frame: the second photo fades in on hover and a gold inner frame appears. */
export function ProductCard({ p, priority = false, dark = false }: { p: Product; priority?: boolean; dark?: boolean }) {
  const [a, b] = p.images;
  const out = soldOut(p);
  const no = article(p);
  const choices = p.options[0]?.values.length ?? 0;
  const kindName = getKind(p.kind)?.name;
  return (
    <article className="group relative flex h-full flex-col">
      <Link href={`/p/${p.slug}`} className="frame block aspect-square">
        {a ? (
          <>
            <Image src={a.thumb.src} alt={p.name} width={a.thumb.w} height={a.thumb.h} priority={priority} sizes="(min-width: 1024px) 300px, 50vw" className={`absolute inset-0 h-full w-full object-cover ${out ? "opacity-45 grayscale" : ""}`} />
            {b && <Image src={b.thumb.src} alt="" width={b.thumb.w} height={b.thumb.h} sizes="(min-width: 1024px) 300px, 50vw" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />}
          </>
        ) : (
          <span className="display absolute inset-0 grid place-items-center text-[26px] text-ink/15">Chandmani</span>
        )}
        {(out || choices > 1) && (
          <span className={`caps absolute top-3 left-3 px-2 py-1 text-[9.5px] ${out ? "bg-paper text-ink" : "bg-night/80 text-gilt-2"}`}>{out ? "Дууссан" : `${choices} сонголт`}</span>
        )}
      </Link>
      <div className="mt-3.5 flex flex-1 flex-col">
        <p className={`caps text-[9.5px] ${dark ? "text-gilt" : "text-gold"}`}>
          {/* «Зангиа, алчуурын сэт № 852319»: the kind is already the name, so only the number is shown */}
          {kindName !== p.name && kindName}
          {no && <span className={dark ? "text-ivory/45" : "text-mute"}>{kindName !== p.name ? " · " : ""}{no}</span>}
        </p>
        <Link href={`/p/${p.slug}`} className={`display mt-1.5 line-clamp-2 text-[17px] leading-snug transition-colors ${dark ? "text-ivory hover:text-gilt-2" : "hover:text-oxblood"}`}>
          {p.name}
        </Link>
        <div className={`mt-auto pt-1.5 ${dark ? "text-ivory/80" : "text-ink-2"}`}>
          <Price price={p.price} compareAt={p.compareAt} size="sm" />
        </div>
      </div>
    </article>
  );
}
