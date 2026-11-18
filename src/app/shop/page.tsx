import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CloseIcon, SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { Sparkles } from "@/components/sparkles";
import { collabs, colours, getCollab, getColour, getKind, getMaterial, getPattern, inStock, kinds, materials, patterns, products, soldOut, type Product } from "@/lib/catalog";
import { countLabel } from "@/lib/format";

type Search = { q?: string; k?: string; c?: string; m?: string; pt?: string; x?: string; w?: string; sort?: string; all?: string; page?: string };
const PER_PAGE = 48;

function heading(s: Search) {
  if (s.q) return `«${s.q.slice(0, 60)}»`;
  const x = getCollab(s.x ?? "");
  if (x) return x.name;
  const parts = [getKind(s.k ?? "")?.name, s.w === "1" && "Эмэгтэй"].filter(Boolean) as string[];
  return parts.length ? parts.join(" · ") : "Бүх бүтээгдэхүүн";
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<Search> }): Promise<Metadata> {
  const s = await searchParams;
  return { title: heading(s), alternates: { canonical: "/shop" }, robots: s.q || s.page || s.c || s.m || s.pt ? { index: false } : undefined };
}

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ").trim();
const haystack = new Map(
  products.map((p) => {
    const text = norm([p.name, p.zochilName, String(p.id), getKind(p.kind)?.name, getCollab(p.collab ?? "")?.name, ...p.patterns.map((x) => getPattern(x)?.name), ...p.materials.map((x) => getMaterial(x)?.name), getColour(p.colour ?? "")?.name, ...p.options.flatMap((o) => o.values)].filter(Boolean).join(" "));
    return [p.id, text];
  }),
);
const newest = (list: Product[]) => [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
const thumbOf = (pred: (p: Product) => boolean) => newest(inStock).find((p) => pred(p) && p.images.length)?.images[0] ?? newest(products).find((p) => pred(p) && p.images.length)?.images[0];

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
  else list = newest(list);
  const hidden = showAll ? 0 : pool.filter((p) => match(p) && soldOut(p)).length;

  // facet counts: everything else chosen stays, only that facet is left open
  const visible = (p: Product) => showAll || !soldOut(p);
  const facet = (f: (p: Product) => boolean, skip: "c" | "m" | "pt") =>
    pool.filter((p) => visible(p) && f(p) && (skip === "c" || !colour || p.colour === colour.id) && (skip === "m" || !material || p.materials.includes(material.id)) && (skip === "pt" || !pattern || p.patterns.includes(pattern.id))).length;
  const colourList = colours.map((c) => ({ ...c, n: facet((p) => p.colour === c.id, "c") })).filter((c) => c.n > 0);
  const materialList = materials.map((m) => ({ ...m, n: facet((p) => p.materials.includes(m.id), "m") })).filter((m) => m.n > 0);
  const patternList = patterns.map((m) => ({ ...m, n: facet((p) => p.patterns.includes(m.id), "pt") })).filter((m) => m.n > 0);

  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(s.page) || 1));
  const shown = list.slice(0, page * PER_PAGE);

  const href = (patch: Partial<Search>) => {
    const next = { ...s, ...patch };
    if (!("page" in patch)) delete next.page;
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  const heroPics = newest(pool.filter((p) => p.images.length && !soldOut(p))).slice(0, 3);
  const active = [
    colour && { label: colour.name, swatch: colour.hex, href: href({ c: undefined }) },
    pattern && { label: pattern.name, href: href({ pt: undefined }) },
    material && { label: material.name, href: href({ m: undefined }) },
    women && kind && { label: "Эмэгтэй", href: href({ w: undefined }) },
    q && { label: `«${q}»`, href: href({ q: undefined }) },
    showAll && { label: "Дууссан ч харуулна", href: href({ all: undefined }) },
  ].filter(Boolean) as { label: string; href: string; swatch?: string }[];

  const facetLink = "group flex items-center gap-3 py-1.5 text-[15px] text-ink-2 transition-colors hover:text-oxblood aria-[current=true]:text-ink";
  const tick = (on: boolean) => <span className={`grid h-3.5 w-3.5 shrink-0 rotate-45 place-items-center border transition ${on ? "border-gold bg-gold" : "border-ink/25 group-hover:border-gold"}`} aria-hidden />;

  const filters = (
    <div className="space-y-9">
      <form action="/shop" role="search" className="relative">
        {kind && <input type="hidden" name="k" value={kind.id} />}
        {collab && <input type="hidden" name="x" value={collab.id} />}
        {women && <input type="hidden" name="w" value="1" />}
        <SearchIcon size={16} className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-mute" />
        <input name="q" type="search" defaultValue={q} placeholder="Paisley, хээтэй, № …" aria-label="Хайх" className="h-11 w-full border-b border-ink/25 bg-transparent pr-2 pl-7 text-[15.5px] outline-none placeholder:text-mute focus:border-gold" />
      </form>
      {colourList.length > 0 && (
        <section>
          <h2 className="caps text-[10px] text-gold">Өнгө</h2>
          <p className="mt-1 text-[12.5px] text-mute">Зургаас тооцсон, ойролцоо</p>
          <div className="mt-3">
            {colourList.map((c) => (
              <Link key={c.id} href={href({ c: colour?.id === c.id ? undefined : c.id })} className={facetLink} aria-current={colour?.id === c.id}>
                <span className={`h-4 w-4 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.18)] ring-offset-2 ring-offset-paper ${colour?.id === c.id ? "ring-1 ring-gold" : ""}`} style={{ background: c.hex }} />
                <span className="flex-1">{c.name}</span>
                <span className="text-[12px] text-mute tabular-nums">{c.n}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {patternList.length > 0 && (
        <section>
          <h2 className="caps text-[10px] text-gold">Хээ</h2>
          <div className="mt-3">
            {patternList.map((m) => (
              <Link key={m.id} href={href({ pt: pattern?.id === m.id ? undefined : m.id })} className={facetLink} aria-current={pattern?.id === m.id}>
                {tick(pattern?.id === m.id)}
                <span className="flex-1">{m.name}</span>
                <span className="text-[12px] text-mute tabular-nums">{m.n}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {materialList.length > 0 && (
        <section>
          <h2 className="caps text-[10px] text-gold">Материал</h2>
          <div className="mt-3">
            {materialList.map((m) => (
              <Link key={m.id} href={href({ m: material?.id === m.id ? undefined : m.id })} className={facetLink} aria-current={material?.id === m.id}>
                {tick(material?.id === m.id)}
                <span className="flex-1">{m.name}</span>
                <span className="text-[12px] text-mute tabular-nums">{m.n}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      <section>
        <h2 className="caps text-[10px] text-gold">Хамтын бүтээл</h2>
        <div className="mt-3">
          {collabs.map((c) => (
            <Link key={c.id} href={href({ x: collab?.id === c.id ? undefined : c.id, k: undefined })} className={facetLink} aria-current={collab?.id === c.id}>
              {tick(collab?.id === c.id)}
              <span className="flex-1">{c.name}</span>
              <span className="text-[12px] text-mute tabular-nums">{c.count}</span>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="caps text-[10px] text-gold">Нэмэлт</h2>
        <div className="mt-3">
          <Link href={href({ w: women ? undefined : "1" })} className={facetLink} aria-current={women}>
            {tick(women)}
            <span className="flex-1">Эмэгтэй шугам</span>
          </Link>
          <Link href={href({ all: showAll ? undefined : "1" })} className={facetLink} aria-current={showAll}>
            {tick(showAll)}
            <span className="flex-1">Дууссан бараа харуулах</span>
          </Link>
        </div>
      </section>
    </div>
  );

  return (
    <>
      {/* Starlit band with the collection's name and three of its newest pieces */}
      <section className="panel-dark relative overflow-hidden">
        <Sparkles count={18} seed={(kind?.id.length ?? 3) * 11 + (collab ? 5 : 0)} />
        <div className="wrap relative grid items-center gap-10 py-14 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <nav className="caps flex flex-wrap items-center gap-2 text-[10px] text-ivory/50" aria-label="Зам">
              <Link href="/" className="hover:text-gilt-2">
                Нүүр
              </Link>
              <span aria-hidden>·</span>
              <Link href="/shop" className="hover:text-gilt-2">
                Цуглуулга
              </Link>
            </nav>
            <p className="caps rise mt-8 text-gilt">{q ? "Хайлтын үр дүн" : collab ? "Хамтын бүтээл" : kind ? kind.line : "Chandmani цуглуулга"}</p>
            <h1 className="display rise mt-4 text-[44px] text-ivory md:text-[72px]" style={{ "--d": "120ms" } as React.CSSProperties}>
              {heading(s)}
            </h1>
            <span className="draw mt-7 block h-px w-32 bg-gilt" style={{ "--d": "400ms" } as React.CSSProperties} aria-hidden />
            <p className="rise mt-6 text-[16px] text-ivory/70" style={{ "--d": "300ms" } as React.CSSProperties}>
              {countLabel(pool.filter((p) => !soldOut(p)).length, "бэлэн загвар")} · нийт {pool.length}
            </p>
          </div>
          {heroPics.length > 0 && (
            <div className="rise relative hidden h-[300px] md:block" style={{ "--d": "300ms" } as React.CSSProperties}>
              {heroPics.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/p/${p.slug}`}
                  className="absolute top-1/2 aspect-square w-[46%] overflow-hidden border border-gilt-2/40 bg-ivory shadow-[0_30px_50px_-20px_rgb(0_0_0/0.7)] transition-[translate] duration-700 hover:z-10 hover:-translate-y-3"
                  style={{ left: `${i * 27}%`, transform: `translateY(-50%) rotate(${(i - 1) * 5}deg)`, zIndex: i === 1 ? 2 : 1 }}
                >
                  <Image src={p.images[0].thumb.src} alt={p.name} fill sizes="260px" className="object-cover" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Kinds as small tiles */}
      <div className="border-b border-line bg-ivory">
        <div className="wrap py-5">
          <Scroller as="nav" label="Төрөл" small className="flex gap-2 overflow-x-auto select-none [scrollbar-width:none]">
            <Link href={href({ k: undefined, x: undefined })} className="group flex shrink-0 flex-col items-center gap-2 px-2 py-1" aria-current={!kind && !collab}>
              <span className={`grid h-14 w-14 place-items-center rounded-full border transition ${!kind && !collab ? "border-gold bg-night text-gilt-2" : "border-line bg-paper text-gold group-hover:border-gold"}`}>
                <span className="diamond" />
              </span>
              <span className={`caps text-[9.5px] ${!kind && !collab ? "text-ink" : "text-ink-2"}`}>Бүгд</span>
            </Link>
            {kinds.map((k) => {
              const t = thumbOf((p) => p.kind === k.id);
              const on = kind?.id === k.id;
              return (
                <Link key={k.id} href={href({ k: on ? undefined : k.id, x: undefined })} className="group flex w-[86px] shrink-0 flex-col items-center gap-2 px-1 py-1 text-center" aria-current={on}>
                  <span className={`relative h-14 w-14 overflow-hidden rounded-full border-2 transition ${on ? "border-gold" : "border-transparent group-hover:border-gilt"}`}>
                    {t && <Image src={t.thumb.src} alt="" fill sizes="56px" className="object-cover" />}
                  </span>
                  <span className={`caps line-clamp-2 text-[9px] leading-snug ${on ? "text-ink" : "text-ink-2"}`}>{k.name}</span>
                </Link>
              );
            })}
          </Scroller>
        </div>
      </div>

      <div className="wrap pt-10">
        <div className="grid gap-10 lg:grid-cols-[250px_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-8">{filters}</div>
          </aside>

          <div>
            <details className="group border border-line bg-white lg:hidden">
              <summary className="caps flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[11px] [&::-webkit-details-marker]:hidden">
                Шүүлтүүр {active.length > 0 && <span className="text-gold">({active.length})</span>}
                <span className="diamond text-gold transition-transform duration-300 group-open:rotate-[225deg]" aria-hidden />
              </summary>
              <div className="border-t border-line px-5 py-6">{filters}</div>
            </details>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5 lg:mt-0">
              <p className="text-[15px] text-ink-2">
                <span className="display text-[22px] text-ink tabular-nums">{list.length}</span> бүтээгдэхүүн
                {hidden > 0 && (
                  <>
                    {" · "}
                    <Link href={href({ all: "1" })} className="text-gold underline underline-offset-4">
                      дууссан {hidden}
                    </Link>
                  </>
                )}
              </p>
              <div className="flex items-center gap-4" aria-label="Эрэмбэ">
                <span className="caps hidden text-[10px] text-mute sm:inline">Эрэмбэ</span>
                {(
                  [
                    ["new", "Шинэ"],
                    ["cheap", "Хямд"],
                    ["dear", "Үнэтэй"],
                  ] as const
                ).map(([id, label]) => (
                  <Link key={id} href={href({ sort: id === "new" ? undefined : id })} className={`caps text-[10.5px] transition-colors ${sort === id ? "border-b border-gold pb-0.5 text-ink" : "text-ink-2 hover:text-gold"}`} aria-current={sort === id}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {active.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {active.map((a) => (
                  <Link key={a.label} href={a.href} className="chip min-h-[32px] gap-2 border-gilt bg-ivory px-3 text-[10px] hover:border-oxblood hover:text-oxblood">
                    {a.swatch && <span className="h-3 w-3 rounded-full" style={{ background: a.swatch }} />}
                    {a.label}
                    <CloseIcon size={12} />
                  </Link>
                ))}
                <Link href={href({ c: undefined, pt: undefined, m: undefined, q: undefined, all: undefined })} className="caps ml-1 text-[10px] text-mute underline underline-offset-4 hover:text-oxblood">
                  Цэвэрлэх
                </Link>
              </div>
            )}

            {shown.length ? (
              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
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
        </div>
      </div>
    </>
  );
}
