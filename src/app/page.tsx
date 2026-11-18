import Image from "next/image";
import Link from "next/link";
import { GiftIcon, ScissorsIcon, TieIcon, TruckIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { banners, collabs, colours, inStock, kinds, posts, products, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const newest = (list: Product[]) => [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id);
const cover = (pred: (p: Product) => boolean) => (newest(inStock).find((p) => pred(p) && p.images.length) ?? newest(products).find((p) => pred(p) && p.images.length))?.images[0];

const HOME_KINDS = ["tie", "set", "bow", "pocket", "ascot", "gift"] as const;
const SPECS = [
  ["8", "см", "Стандарт өргөн"],
  ["145", "см", "Урт"],
  ["6 · 10", "см", "Нарийн, өргөнөөр захиална"],
  ["12", "орд", "Шигтгэн хатгана"],
] as const;

export default function HomePage() {
  const [hero, single] = [banners.find((b) => b.src.includes("41286")) ?? banners[0], banners.find((b) => b.src.includes("41282")) ?? banners[0]];
  const fresh = newest(inStock.filter((p) => p.kind === "tie")).slice(0, 12);
  const sets = newest(inStock.filter((p) => p.kind === "set" && p.images.length)).slice(0, 12);
  const clients = posts.filter((p) => p.custom && p.client);
  const articles = posts.filter((p) => !p.custom).slice(0, 3);
  const collabTiles = collabs.filter((c) => c.id !== "spooky");

  return (
    <>
      {/* Hero: the gift-box wall, slowly settling, with the title on the dark side */}
      <section className="panel-dark relative isolate overflow-hidden">
        {hero && <Image src={hero.src} alt="" width={hero.w} height={hero.h} priority sizes="100vw" className="kenburns absolute inset-0 -z-10 h-full w-full object-cover object-left opacity-80" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/80 to-night/10 md:via-night/60" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-night to-transparent" aria-hidden />
        <div className="wrap flex min-h-[78svh] flex-col justify-center py-24 md:min-h-[640px]">
          <p className="caps rise text-gilt" style={{ "--d": "100ms" } as React.CSSProperties}>
            Est. {business.founded} · Улаанбаатар
          </p>
          <h1 className="display rise mt-6 max-w-3xl text-[52px] text-ivory sm:text-[72px] md:text-[96px]" style={{ "--d": "250ms" } as React.CSSProperties}>
            Эрхэм хүний <em className="sheen">зангиа</em>
          </h1>
          <span className="draw mt-8 block h-px w-40 bg-gilt" style={{ "--d": "600ms" } as React.CSSProperties} aria-hidden />
          <p className="rise mt-8 max-w-md text-[17px] leading-relaxed text-ivory/75 md:text-[18.5px]" style={{ "--d": "450ms" } as React.CSSProperties}>
            Цэвэр торго, Монгол хээ, уламжлалт гар аргын хийц. Зангиа бүр Chandmani бэлгийн хайрцагтай.
          </p>
          <div className="rise mt-10 flex flex-wrap gap-3" style={{ "--d": "600ms" } as React.CSSProperties}>
            <Link href="/shop?k=tie" className="btn btn-gold">
              Цуглуулга үзэх
            </Link>
            <Link href="/bespoke" className="btn btn-line text-ivory">
              Тусгай захиалга
            </Link>
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="border-b border-line bg-ivory">
        <ul className="wrap grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4 md:py-10">
          {(
            [
              [ScissorsIcon, "Гар аргаар урласан", "Уламжлалт хийц"],
              [GiftIcon, "Бэлгийн хайрцагтай", "Зангиа бүр"],
              [TruckIcon, "24–48 цагт", "Улаанбаатар хотод"],
              [TieIcon, `${formatPrice(business.freeFrom)}-өөс дээш`, "Хүргэлт үнэгүй"],
            ] as const
          ).map(([Icon, t, s]) => (
            <li key={t} className="flex flex-col items-center gap-2 px-2 text-center">
              <Icon size={24} className="text-gold" />
              <span className="display text-[17px] leading-tight">{t}</span>
              <span className="caps text-[9.5px] text-mute">{s}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Collections */}
      <section className="wrap pt-24">
        <Reveal className="flex flex-col items-center text-center">
          <p className="caps text-gold">Цуглуулга</p>
          <h2 className="display mt-4 text-[40px] md:text-[56px]">Хувцасны шүүгээнд</h2>
          <div className="rule mt-6 w-48">
            <span className="diamond" />
          </div>
        </Reveal>
        <ul className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {HOME_KINDS.map((id, i) => {
            const k = kinds.find((x) => x.id === id)!;
            const img = cover((p) => p.kind === id);
            return (
              <Reveal as="li" key={id} delay={(i % 3) * 120}>
                <Link href={`/shop?k=${id}`} className="group relative block aspect-[4/5] overflow-hidden bg-night">
                  {img && <Image src={img.src} alt="" width={img.w} height={img.h} sizes="(min-width: 768px) 33vw, 50vw" className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-[1.4s] ease-out group-hover:scale-105 group-hover:opacity-100" />}
                  <span className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent" aria-hidden />
                  <span className="pointer-events-none absolute inset-3 border border-gilt-2/0 transition duration-700 group-hover:border-gilt-2/70" aria-hidden />
                  <span className="absolute inset-x-0 bottom-0 p-4 text-ivory md:p-7">
                    <span className="caps block text-[9.5px] text-gilt-2">{k.count} загвар</span>
                    <span className="display mt-1.5 block text-[22px] leading-tight md:text-[32px]">{k.name}</span>
                    <span className="mt-1 hidden text-[14.5px] text-ivory/70 md:block">{k.line}</span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* New ties */}
      <section className="wrap pt-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="caps text-gold">Шинэ бүтээл</p>
            <h2 className="display mt-3 text-[38px] md:text-[52px]">Шинээр урласан зангиа</h2>
          </div>
          <Link href="/shop?k=tie" className="caps link-gold pb-1 text-[11px] text-ink">
            Бүх зангиа →
          </Link>
        </Reveal>
        <Scroller label="Шинэ зангиа" className="scroller mt-10 select-none">
          {fresh.map((p, i) => (
            <ProductCard key={p.id} p={p} priority={i < 2} />
          ))}
        </Scroller>
      </section>

      {/* Atelier: the tie cabinet and the craft in numbers */}
      <section className="panel-dark mt-28">
        <div className="grid lg:grid-cols-[1.25fr_1fr]">
          <div className="relative min-h-[300px] overflow-hidden lg:min-h-[620px]">
            <Image src="/brand/atelier.webp" alt="Chandmani зангианы шүүгээ" width={1916} height={730} sizes="(min-width: 1024px) 56vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-night/70 to-transparent lg:bg-gradient-to-l" aria-hidden />
          </div>
          <div className="flex flex-col justify-center px-6 py-16 md:px-14 lg:py-20">
            <Reveal>
              <p className="caps text-gilt">Урлан</p>
              <h2 className="display mt-4 text-[38px] text-ivory md:text-[50px]">
                Хэмжээ бүр <em className="text-gilt-2">таны</em> хүссэнээр
              </h2>
              <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-ivory/70">
                Торгон зангиа бүрийг гар аргаар урлаж, Chandmani бэлгийн хайрцагт хийж хүргэнэ. Эрвээхэй зангиаг давхар, дан эсвэл өөрөө уядаг хэлбэрээр захиалж болно.
              </p>
            </Reveal>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-9">
              {SPECS.map(([n, u, t], i) => (
                <Reveal key={t} delay={i * 120}>
                  <dt className="sr-only">{t}</dt>
                  <dd>
                    <span className="display sheen text-[44px] leading-none md:text-[54px]">{n}</span>
                    <span className="caps ml-2 text-[10px] text-gilt">{u}</span>
                    <span className="mt-2 block border-t border-gilt/25 pt-2 text-[14px] text-ivory/65">{t}</span>
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Colours */}
      <section className="wrap pt-28">
        <Reveal className="flex flex-col items-center text-center">
          <p className="caps text-gold">Өнгөөр сонгох</p>
          <h2 className="display mt-4 text-[38px] md:text-[52px]">Костюмандаа тааруулаарай</h2>
          <p className="mt-4 max-w-lg text-[16px] text-ink-2">Хар хөх костюмд бордо, саарал костюмд хөх, хүрэн костюмд ногоон. Өнгийг зургаас тооцсон тул ойролцоо.</p>
        </Reveal>
        <ul className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-8 md:gap-x-10">
          {colours.map((c, i) => (
            <Reveal as="li" key={c.id} delay={i * 60}>
              <Link href={`/shop?c=${c.id}`} className="group flex w-20 flex-col items-center gap-3 text-center">
                <span className="relative block h-16 w-16 overflow-hidden rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.15)] ring-1 ring-transparent ring-offset-4 ring-offset-paper transition duration-500 group-hover:ring-gilt md:h-[72px] md:w-[72px]" style={{ background: `radial-gradient(circle at 30% 25%, rgb(255 255 255 / 0.35), transparent 45%), ${c.hex}` }}>
                  <span className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgb(255_255_255/0.07)_0_2px,transparent_2px_6px)]" aria-hidden />
                </span>
                <span className="text-[14px] leading-tight">{c.name}</span>
                <span className="caps -mt-2 text-[9px] text-mute">{c.count}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Gift sets: tie, pocket square and box */}
      <section className="panel-dark mt-28 py-24">
        <div className="wrap">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="caps text-gilt">Бэлэглэх</p>
              <h2 className="display mt-3 text-[38px] text-ivory md:text-[52px]">Зангиа, алчуурын сэт</h2>
            </div>
            <Link href="/shop?k=set" className="caps link-gold pb-1 text-[11px] text-gilt-2">
              Бүгдийг үзэх →
            </Link>
          </Reveal>
          <Scroller label="Зангиа, алчуурын сэт" className="scroller mt-10 select-none">
            {sets.map((p) => (
              <ProductCard key={p.id} p={p} dark />
            ))}
          </Scroller>
        </div>
      </section>

      {/* Bespoke */}
      <section className="relative isolate overflow-hidden bg-night text-ivory">
        {single && <Image src={single.src} alt="" width={single.w} height={single.h} sizes="100vw" className="absolute inset-0 -z-10 h-full w-full object-cover object-[70%_50%] opacity-90" />}
        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/85 to-night/20" aria-hidden />
        <div className="wrap py-24 md:py-32">
          <Reveal className="max-w-xl">
            <p className="caps text-gilt">Тусгай захиалга</p>
            <h2 className="display mt-4 text-[40px] md:text-[58px]">Байгууллагын өнгө, логог торгонд</h2>
            <p className="mt-6 text-[16.5px] leading-relaxed text-ivory/75">Хүссэн өнгө, хээ, лого, материалаар дүрэмт хувцасны зангиа, алчуур, гарын бэлэг урлана. Загварын 2–3 хувилбар гарган батлуулдаг.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/bespoke" className="btn btn-gold">
                Дэлгэрэнгүй
              </Link>
              <a href={`tel:${business.phone.tel}`} className="btn btn-line">
                {business.phone.display}
              </a>
            </div>
          </Reveal>
        </div>
        <div className="overflow-hidden border-t border-gilt/20 py-5" aria-label="Захиалагч байгууллагууд">
          <div className="marquee">
            {[0, 1].map((k) => (
              <span key={k} className="flex shrink-0" aria-hidden={k === 1}>
                {clients.map((c) => (
                  <span key={c.id} className="flex items-center gap-10 px-10 font-display text-[19px] text-ivory/60 italic md:text-[22px]">
                    {c.client}
                    <span className="diamond text-gilt" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborations */}
      <section className="wrap pt-28">
        <Reveal className="flex flex-col items-center text-center">
          <p className="caps text-gold">Хамтын бүтээл</p>
          <h2 className="display mt-4 text-[38px] md:text-[52px]">Эрхэм бэлгийн багц</h2>
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {collabTiles.map((c, i) => {
            const img = cover((p) => p.collab === c.id);
            return (
              <Reveal as="li" key={c.id} delay={i * 100}>
                <Link href={`/shop?x=${c.id}`} className="group block">
                  <span className="frame block aspect-square">{img && <Image src={img.thumb.src} alt="" width={img.thumb.w} height={img.thumb.h} sizes="(min-width: 768px) 25vw, 50vw" className="absolute inset-0 h-full w-full object-cover" />}</span>
                  <span className="display mt-4 block text-[19px] leading-tight transition-colors group-hover:text-oxblood md:text-[21px]">{c.name}</span>
                  <span className="caps mt-1 block text-[9.5px] text-mute">{c.count} багц</span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* Journal */}
      <section className="wrap pt-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="caps text-gold">Сэтгүүл</p>
            <h2 className="display mt-3 text-[38px] md:text-[52px]">Зангианы ёс</h2>
          </div>
          <Link href="/journal" className="caps link-gold pb-1 text-[11px] text-ink">
            Бүх нийтлэл →
          </Link>
        </Reveal>
        <ul className="mt-10 grid gap-10 md:grid-cols-3">
          {articles.map((a, i) => (
            <Reveal as="li" key={a.id} delay={i * 120}>
              <Link href={`/journal/${a.slug}`} className="group block">
                <span className="frame block aspect-[4/3]">{a.cover && <Image src={a.cover.thumb.src} alt="" width={a.cover.thumb.w} height={a.cover.thumb.h} sizes="(min-width: 768px) 33vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />}</span>
                <span className="caps mt-5 block text-[9.5px] text-mute">{a.date.replaceAll("-", ".")}</span>
                <span className="display mt-2 block text-[22px] leading-snug transition-colors group-hover:text-oxblood">{a.title}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
