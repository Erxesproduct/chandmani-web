import type { Metadata } from "next";
import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { collabs, colours, getCollab, getColour, getKind, getMaterial, getPattern, kinds, materials, patterns, products, soldOut, type Product } from "@/lib/catalog";
import { countLabel } from "@/lib/format";

type Search = { q?: string; k?: string; c?: string; m?: string; pt?: string; x?: string; w?: string; sort?: string; all?: string; page?: string };
const PER_PAGE = 48;

function heading(s: Search) {
  if (s.q) return `«${s.q.slice(0, 60)}»`;
  const x = getCollab(s.x ?? "");
  if (x) return x.name;
  const parts = [getKind(s.k ?? "")?.name, s.w === "1" && "Эмэгтэй", getPattern(s.pt ?? "")?.name, getMaterial(s.m ?? "")?.name, getColour(s.c ?? "")?.name].filter(Boolean) as string[];
  return parts.length ? parts.join(" · ") : "Бүх бүтээгдэхүүн";
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }): Promise<Metadata> {
  const s = await searchParams;
  return { title: heading(s), alternates: { canonical: "/shop" }, robots: s.q || s.page || s.c || s.m ? { index: false } : undefined };
}

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
const haystack = new Map(
  products.map((p) => {
    const text = norm([p.name, p.zochilName, String(p.id), getKind(p.kind)?.name, getCollab(p.collab ?? "")?.name, ...p.patterns.map((x) => getPattern(x)?.name), ...p.materials.map((x) => getMaterial(x)?.name), getColour(p.colour ?? "")?.name, ...p.options.flatMap((o) => o.values)].filter(Boolean).join(" "));
    return [p.id, text];
  }),
);

export default async function ShopPage({ searchParams }: { searchParams: Promise<Search> }) {
  const s = await searchParams;
  const q = (s.q ?? "").slice(0, 60);
  const kind = getKind(s.k ?? "");
  const colour = getColour(s.c ?? "");
  const material = getMaterial(s.m ?? "");
  const pattern = getPattern(s.pt ?? "");
  const collab = getCollab(s.x ?? "");
  const women = s.w === "1";
  const showAll = s.all === "1";
  const sort = s.sort === "cheap" || s.sort === "dear" ? s.sort : "new";

  const words = norm(q).split(" ").filter(Boolean);
  const base = (p: Product) => (!kind || p.kind === kind.id) && (!collab || p.collab === collab.id) && (!women || p.women) && words.every((w) => haystack.get(p.id)!.includes(w));
  const pool = products.filter(base);
  const match = (p: Product) => (!colour || p.colour === colour.id) && (!material || p.materials.includes(material.id)) && (!pattern || p.patterns.includes(pattern.id));
  let list = pool.filter((p) => match(p) && (showAll || !soldOut(p)));
  if (sort === "cheap") list = [...list].sort((a, b) => a.price - b.price);
  else if (sort === "dear") list = [...list].sort((a, b) => b.price - a.price);
  else list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
  const hidden = showAll ? 0 : pool.filter((p) => match(p) && soldOut(p)).length;

  const live = (pred: (p: Product) => boolean) => pool.some((p) => pred(p) && (showAll || !soldOut(p)));
  const colourList = colours.filter((c) => live((p) => p.colour === c.id));
  const materialList = materials.filter((m) => live((p) => p.materials.includes(m.id)));
  const patternList = patterns.filter((m) => live((p) => p.patterns.includes(m.id)));

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(s.page) || 1));
  const shown = list.slice(0, page * PER_PAGE);

  const href = (patch: Partial<Search>) => {
    const next = { ...s, ...patch };
    if (!("page" in patch)) delete next.page;
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
    return qs ? `/shop?${qs}` : "/shop";
  };
  const small = "chip min-h-[34px] px-3 text-[10.5px]";

  return (
    <div className="wrap pt-12 md:pt-16">
      <div className="flex flex-col items-center text-center">
        <p className="caps text-gold">{q ? "Хайлтын үр дүн" : collab ? "Хамтын бүтээл" : kind ? kind.line : "Chandmani"}</p>
        <h1 className="display mt-4 text-[42px] md:text-[68px]">{heading(s)}</h1>
        <div className="rule mt-6 w-48">
          <span className="diamond" />
        </div>
        <form action="/shop" role="search" className="relative mt-8 w-full max-w-lg">
          {kind && <input type="hidden" name="k" value={kind.id} />}
          {women && <input type="hidden" name="w" value="1" />}
          <SearchIcon size={18} className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-mute" />
          <input name="q" type="search" defaultValue={q} placeholder="Paisley, хээтэй, бэлгийн багц, № …" aria-label="Хайх" className="h-12 w-full border-b border-ink/30 bg-transparent pr-24 pl-8 text-[16.5px] outline-none placeholder:text-mute focus:border-gold" />
          <button className="caps absolute top-1/2 right-0 -translate-y-1/2 px-2 py-2 text-[11px] text-gold hover:text-ink">Хайх</button>
        </form>
      </div>

      <nav className="-mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-center md:px-0" aria-label="Төрөл">
        <Link href={href({ k: undefined, x: undefined })} className="chip" aria-current={!kind && !collab}>
          Бүгд
        </Link>
        {kinds.map((k) => (
          <Link key={k.id} href={href({ k: k.id, x: undefined })} className="chip" aria-current={kind?.id === k.id}>
            {k.name}
          </Link>
        ))}
        <Link href={href({ w: women ? undefined : "1" })} className="chip" aria-current={women}>
          Эмэгтэй
        </Link>
      </nav>
      <div className="-mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:justify-center md:px-0" aria-label="Хамтын бүтээл">
        {collabs.map((c) => (
          <Link key={c.id} href={href({ x: collab?.id === c.id ? undefined : c.id, k: undefined })} className={small} aria-current={collab?.id === c.id}>
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 border-y border-line py-6 md:grid-cols-[auto_1fr] md:gap-x-10">
        {colourList.length > 1 && (
          <>
            <p className="caps self-center text-[10px] text-mute">Өнгө</p>
            <div className="flex flex-wrap items-center gap-3">
              {colourList.map((c) => (
                <Link key={c.id} href={href({ c: colour?.id === c.id ? undefined : c.id })} className="swatch" style={{ background: c.hex }} aria-current={colour?.id === c.id} title={c.name} aria-label={c.name}>
                  {colour?.id === c.id && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </Link>
              ))}
            </div>
          </>
        )}
        {patternList.length > 1 && (
          <>
            <p className="caps self-center text-[10px] text-mute">Хээ</p>
            <div className="flex flex-wrap gap-2">
              {patternList.map((m) => (
                <Link key={m.id} href={href({ pt: pattern?.id === m.id ? undefined : m.id })} className={small} aria-current={pattern?.id === m.id}>
                  {m.name}
                </Link>
              ))}
            </div>
          </>
        )}
        {materialList.length > 1 && (
          <>
            <p className="caps self-center text-[10px] text-mute">Материал</p>
            <div className="flex flex-wrap gap-2">
              {materialList.map((m) => (
                <Link key={m.id} href={href({ m: material?.id === m.id ? undefined : m.id })} className={small} aria-current={material?.id === m.id}>
                  {m.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[14.5px]">
        <p className="text-ink-2">
          {countLabel(list.length, "бүтээгдэхүүн")}
          {hidden > 0 && (
            <>
              {" · "}
              <Link href={href({ all: "1" })} className="text-gold underline underline-offset-4">
                дууссан {hidden}-г харуулах
              </Link>
            </>
          )}
          {showAll && (
            <>
              {" · "}
              <Link href={href({ all: undefined })} className="text-gold underline underline-offset-4">
                зөвхөн бэлэн байгаа
              </Link>
            </>
          )}
          {colour && <span className="text-mute"> · өнгийг зургаас тооцсон</span>}
        </p>
        <div className="flex flex-wrap gap-1.5" aria-label="Эрэмбэ">
          {(
            [
              ["new", "Шинэ"],
              ["cheap", "Үнэ ↑"],
              ["dear", "Үнэ ↓"],
            ] as const
          ).map(([id, label]) => (
            <Link key={id} href={href({ sort: id === "new" ? undefined : id })} className={small} aria-current={sort === id}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {shown.length ? (
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {shown.map((p, i) => (
            <li key={p.id}>
              <ProductCard p={p} priority={i < 4} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mx-auto mt-14 max-w-md border border-line bg-white p-10 text-center">
          <p className="display text-[32px]">Олдсонгүй</p>
          <p className="mt-2 text-ink-2">Хүссэн өнгө, хээгээрээ тусгай захиалгаар хийлгэж болно.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/shop" className="btn btn-ink">
              Бүгд
            </Link>
            <Link href="/bespoke" className="btn btn-line">
              Тусгай захиалга
            </Link>
          </div>
        </div>
      )}

      {page < pages && (
        <div className="mt-16 text-center">
          <Link href={href({ page: String(page + 1) })} scroll={false} className="btn btn-line">
            Цааш үзэх ({list.length - shown.length})
          </Link>
        </div>
      )}
    </div>
  );
}
