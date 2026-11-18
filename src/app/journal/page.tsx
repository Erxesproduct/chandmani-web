import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { lede, posts } from "@/lib/catalog";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Сэтгүүл", description: "Зангианы түүх, хээ, уях, арчлах, хадгалах, бэлэглэх ёс.", alternates: { canonical: "/journal" } };

export default function JournalPage() {
  const articles = posts.filter((p) => !p.custom);
  const [lead, ...rest] = articles;
  return (
    <div className="wrap pt-12 md:pt-16">
      <div className="flex flex-col items-center text-center">
        <p className="caps text-gold">Сэтгүүл</p>
        <h1 className="display mt-4 text-[46px] md:text-[72px]">Зангианы ёс</h1>
        <div className="rule mt-6 w-48">
          <span className="diamond" />
        </div>
      </div>

      {lead && (
        <Link href={`/journal/${lead.slug}`} className="group mt-14 grid items-center gap-8 md:grid-cols-[1.2fr_1fr] md:gap-14">
          <span className="frame block aspect-[4/3]">{lead.cover && <Image src={lead.cover.src} alt="" width={lead.cover.w} height={lead.cover.h} priority sizes="(min-width: 768px) 55vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />}</span>
          <span>
            <span className="caps block text-[10px] text-mute">{formatDate(lead.date)}</span>
            <span className="display mt-3 block text-[34px] leading-tight transition-colors group-hover:text-oxblood md:text-[46px]">{lead.title}</span>
            <span className="mt-4 line-clamp-3 block text-[16px] text-ink-2">{lede(lead)}</span>
            <span className="caps mt-6 inline-block text-[11px] text-gold">Унших →</span>
          </span>
        </Link>
      )}

      <ul className="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a, i) => (
          <Reveal as="li" key={a.id} delay={(i % 3) * 100}>
            <Link href={`/journal/${a.slug}`} className="group block">
              <span className="frame block aspect-[4/3]">{a.cover && <Image src={a.cover.thumb.src} alt="" width={a.cover.thumb.w} height={a.cover.thumb.h} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />}</span>
              <span className="caps mt-5 block text-[9.5px] text-mute">{formatDate(a.date)}</span>
              <span className="display mt-2 block text-[22px] leading-snug transition-colors group-hover:text-oxblood">{a.title}</span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
