import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { kinds } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { Sparkles } from "./sparkles";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon } from "./icons";

export function Footer() {
  return (
    <footer className="panel-dark relative mt-28 overflow-hidden">
      <Sparkles count={18} seed={99} className="h-80" />
      <div className="wrap relative pt-20 pb-10">
        <div className="flex flex-col items-center text-center">
          <Image src="/brand/logo-gold.png" alt="CHANDMANI" width={1596} height={534} className="h-16 w-auto md:h-20" />
          <p className="display mt-6 max-w-xl text-[22px] text-ivory/85 italic md:text-[26px]">Эрхэм хүний хувцаслалтын нарийн ширийн зүйл.</p>
          <div className="rule mt-8 w-full max-w-md">
            <span className="diamond" />
          </div>
        </div>

        <div className="mt-14 grid gap-10 text-[15px] sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="caps text-gilt">Цуглуулга</p>
            <ul className="mt-4 space-y-2 text-ivory/75">
              {kinds.slice(0, 7).map((k) => (
                <li key={k.id}>
                  <Link href={`/shop?k=${k.id}`} className="link-gold hover:text-ivory">
                    {k.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="caps text-gilt">Chandmani</p>
            <ul className="mt-4 space-y-2 text-ivory/75">
              <li>
                <Link href="/bespoke" className="link-gold hover:text-ivory">
                  Тусгай захиалга
                </Link>
              </li>
              <li>
                <Link href="/journal" className="link-gold hover:text-ivory">
                  Сэтгүүл
                </Link>
              </li>
              <li>
                <Link href="/info#about" className="link-gold hover:text-ivory">
                  Бидний тухай
                </Link>
              </li>
              <li>
                <Link href="/info#faq" className="link-gold hover:text-ivory">
                  Түгээмэл асуулт
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="caps text-gilt">Үйлчилгээ</p>
            <ul className="mt-4 space-y-2 text-ivory/75">
              <li>
                <Link href="/info#delivery" className="link-gold hover:text-ivory">
                  Хүргэлт: {formatPrice(business.cityFee)}, {formatPrice(business.freeFrom)}-өөс дээш үнэгүй
                </Link>
              </li>
              <li>
                <Link href="/info#payment" className="link-gold hover:text-ivory">
                  Төлбөр: QPay
                </Link>
              </li>
              <li>
                <Link href="/info#exchange" className="link-gold hover:text-ivory">
                  Солилт, засвар
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="caps text-gilt">Холбоо барих</p>
            <ul className="mt-4 space-y-2.5 text-ivory/75">
              <li>
                <a href={`tel:${business.phone.tel}`} className="inline-flex items-center gap-2.5 hover:text-ivory">
                  <PhoneIcon size={17} className="text-gilt" /> {business.phone.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${business.email}`} className="inline-flex items-center gap-2.5 break-all hover:text-ivory">
                  <MailIcon size={17} className="shrink-0 text-gilt" /> {business.email}
                </a>
              </li>
              <li className="flex gap-3 pt-1">
                <a href={business.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-gilt/40 text-gilt-2 transition hover:border-gilt hover:bg-gilt hover:text-night">
                  <FacebookIcon size={18} />
                </a>
                <a href={business.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-gilt/40 text-gilt-2 transition hover:border-gilt hover:bg-gilt hover:text-night">
                  <InstagramIcon size={18} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="hair mt-14" />
        <p className="caps mt-6 flex flex-col justify-between gap-2 text-[10px] text-ivory/45 sm:flex-row">
          <span>© {business.founded}–{new Date().getFullYear()} Chandmani · {business.address}</span>
          <span>Mongolian neckties &amp; accessories</span>
        </p>
      </div>
    </footer>
  );
}
