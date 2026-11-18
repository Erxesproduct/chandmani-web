import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { CartLink } from "./cart-link";
import { SearchIcon } from "./icons";
import { Scroller } from "./scroller";

const ticker = ["Гар аргаар урласан торгон зангиа", `${formatPrice(business.freeFrom)}-өөс дээш хүргэлт үнэгүй`, business.rules.giftBox, "Байгууллагын тусгай захиалга", `Утас ${business.phone.display}`];

export const NAV = [
  ["/shop?k=tie", "Зангиа"],
  ["/shop?k=set", "Сэт"],
  ["/shop?k=bow", "Эрвээхэй"],
  ["/shop?k=pocket", "Алчуур"],
  ["/shop?k=gift", "Бэлэг"],
  ["/shop?w=1", "Эмэгтэй"],
] as const;
export const NAV_RIGHT = [
  ["/bespoke", "Тусгай захиалга"],
  ["/journal", "Сэтгүүл"],
] as const;

const navLink = "caps link-gold py-1 text-[11px] text-ink transition-colors hover:text-gold";

export function Header() {
  return (
    <header className="sticky top-0 z-40">
      <div className="overflow-hidden bg-night py-2 text-gilt-2" aria-label="Мэдээлэл">
        <div className="marquee">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0" aria-hidden={k === 1}>
              {ticker.map((t) => (
                <span key={t} className="caps flex items-center gap-8 px-8 text-[10.5px]">
                  {t}
                  <span className="diamond text-gilt" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="border-b border-line bg-paper/90 backdrop-blur-xl">
        <div className="wrap grid h-[68px] grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-[84px]">
          <nav className="hidden items-center gap-6 xl:flex" aria-label="Үндсэн цэс">
            {NAV.map(([href, label]) => (
              <Link key={href} href={href} className={navLink}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="xl:hidden">
            <Link href="/shop" className="-ml-2.5 grid h-11 w-11 place-items-center md:hidden" aria-label="Хайх">
              <SearchIcon size={21} />
            </Link>
            <form action="/shop" role="search" className="relative hidden md:block">
              <SearchIcon size={16} className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-mute" />
              <input name="q" type="search" placeholder="Хайх" aria-label="Хайх" className="h-10 w-44 border-b border-line bg-transparent pr-2 pl-7 text-[14px] outline-none placeholder:text-mute focus:border-gold" />
            </form>
          </div>

          <Link href="/" aria-label={`${business.name}: нүүр`} className="flex flex-col items-center gap-1.5">
            <Image src="/brand/mark-gold.png" alt="" width={150} height={278} priority className="hidden h-6 w-auto md:block" />
            <Image src="/brand/word-ink.png" alt="CHANDMANI" width={1596} height={240} priority className="h-[15px] w-auto md:h-[17px]" />
          </Link>

          <div className="flex items-center justify-end gap-5">
            <nav className="hidden items-center gap-6 xl:flex" aria-label="Тусгай захиалга, сэтгүүл">
              {NAV_RIGHT.map(([href, label]) => (
                <Link key={href} href={href} className={navLink}>
                  {label}
                </Link>
              ))}
            </nav>
            <form action="/shop" role="search" className="relative hidden xl:block">
              <SearchIcon size={16} className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-mute" />
              <input name="q" type="search" placeholder="Хайх" aria-label="Хайх" className="h-10 w-32 border-b border-line bg-transparent pr-2 pl-7 text-[14px] outline-none transition-[width] placeholder:text-mute focus:w-48 focus:border-gold" />
            </form>
            <CartLink />
          </div>
        </div>
        <div className="wrap xl:hidden">
          <Scroller as="nav" label="Үндсэн цэс" small className="flex gap-6 overflow-x-auto pb-3 select-none [scrollbar-width:none] md:justify-center">
            {[...NAV, ...NAV_RIGHT].map(([href, label]) => (
              <Link key={href} href={href} className={`${navLink} shrink-0`}>
                {label}
              </Link>
            ))}
          </Scroller>
        </div>
      </div>
    </header>
  );
}
