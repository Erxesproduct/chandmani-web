import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChatIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { business } from "@/content/business";
import { banners, lede, posts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Тусгай захиалга",
  description: "Байгууллагын дүрэмт хувцасны зангиа, алчуур, гарын бэлгийг хүссэн өнгө, хээ, лого, материалаар. МИАТ, EZNIS, Гаалийн ерөнхий газар болон бусад.",
  alternates: { canonical: "/bespoke" },
};

/** From the shop's About page and its custom-order posts. */
const STEPS = [
  ["Хүсэлт", "Өнгө, хээ, лого, материал, тоо ширхэгээ имэйл эсвэл утсаар илгээнэ."],
  ["Хувилбар", "Байгууллагын өнгө төрхийг тусгасан 2–3 загварын хувилбар гарган батлуулна."],
  ["Урлал", "Батлагдсан загвараар торго болон сонгосон материалаар гар аргаар урлана."],
  ["Хүлээлгэн өгөх", "Захиалагчдаа хүлээлгэн өгнө. 14 хоногийн дотор үнэгүй засвар хийнэ."],
] as const;

export default function BespokePage() {
  const work = posts.filter((p) => p.custom);
  const hero = banners.find((b) => b.src.includes("41282")) ?? banners[0];
  return (
    <>
      <section className="panel-dark relative isolate overflow-hidden">
        {hero && <Image src={hero.src} alt="" width={hero.w} height={hero.h} priority sizes="100vw" className="kenburns absolute inset-0 -z-10 h-full w-full object-cover object-[75%_50%] opacity-95" />}
        <span className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/85 to-night/20" aria-hidden />
        <div className="wrap py-24 md:py-36">
          <p className="caps rise text-gilt">Тусгай захиалга · Custom</p>
          <h1 className="display rise mt-5 max-w-3xl text-[46px] text-ivory md:text-[80px]" style={{ "--d": "150ms" } as React.CSSProperties}>
            Танай байгууллагын <em className="sheen">зангиа</em>
          </h1>
          <p className="rise mt-7 max-w-lg text-[17px] leading-relaxed text-ivory/75" style={{ "--d": "300ms" } as React.CSSProperties}>
            Хүссэн өнгө, хээ, логог тусган хүссэн материалаар хийлгэх үйлчилгээ: дүрэмт хувцасны зангиа, алчуур, энгэрийн тэмдэг, ойн гарын бэлэг.
          </p>
          <div className="rise mt-10 flex flex-wrap gap-3" style={{ "--d": "450ms" } as React.CSSProperties}>
            <a href={`mailto:${business.email}?subject=${encodeURIComponent("Тусгай захиалга")}`} className="btn btn-gold">
              <MailIcon size={17} /> Имэйл илгээх
            </a>
            <a href={`tel:${business.phone.tel}`} className="btn btn-line text-ivory">
              <PhoneIcon size={17} /> {business.phone.display}
            </a>
          </div>
        </div>
      </section>

      <section className="wrap pt-24">
        <Reveal className="flex flex-col items-center text-center">
          <p className="caps text-gold">Хэрхэн бүтдэг вэ</p>
          <h2 className="display mt-4 text-[38px] md:text-[52px]">Дөрвөн алхам</h2>
        </Reveal>
        <ol className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, d], i) => (
            <Reveal as="li" key={t} delay={i * 120} className="bg-paper p-7 md:p-9">
              <span className="display sheen text-[54px] leading-none italic">{["I", "II", "III", "IV"][i]}</span>
              <p className="display mt-5 text-[24px]">{t}</p>
              <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">{d}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="wrap pt-28">
        <Reveal className="flex flex-col items-center text-center">
          <p className="caps text-gold">Хийсэн ажил</p>
          <h2 className="display mt-4 text-[38px] md:text-[52px]">Бидэнд итгэсэн байгууллагууд</h2>
        </Reveal>
        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
          {work.map((w, i) => (
            <Reveal as="li" key={w.id} delay={(i % 4) * 100}>
              <Link href={`/journal/${w.slug}`} className="group block">
                <span className="frame block aspect-square">{w.cover && <Image src={w.cover.thumb.src} alt="" width={w.cover.thumb.w} height={w.cover.thumb.h} sizes="(min-width: 768px) 25vw, 50vw" className="absolute inset-0 h-full w-full object-cover" />}</span>
                <span className="caps mt-4 block text-[10px] text-gold">{w.client}</span>
                <span className="mt-1.5 line-clamp-2 block text-[15px] leading-snug text-ink-2">{lede(w)}</span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="wrap pt-28">
        <div className="panel-dark relative px-6 py-16 text-center md:px-16 md:py-20">
          <span className="pointer-events-none absolute inset-3 border border-gilt/25" aria-hidden />
          <p className="caps relative text-gilt">Холбогдох</p>
          <h2 className="display relative mt-4 text-[34px] md:text-[48px]">Загвараа хамтдаа бүтээе</h2>
          <p className="relative mx-auto mt-4 max-w-lg text-[16px] text-ivory/70">{business.rules.custom}</p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            <a href={`mailto:${business.email}`} className="btn btn-gold">
              <MailIcon size={17} /> {business.email}
            </a>
            <a href={business.messenger} target="_blank" rel="noreferrer" className="btn btn-line">
              <ChatIcon size={17} /> Facebook чат
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
