import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { business } from "@/content/business";
import { about, faq, posts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Бидний тухай, хүргэлт, төлбөр",
  description: `Chandmani: ${business.founded} оноос хойш. Хүргэлт ${formatPrice(business.cityFee)}, ${formatPrice(business.freeFrom)}-өөс дээш үнэгүй, 24–48 цагт. QPay. Солилт 72 цагт. Түгээмэл асуулт.`,
  alternates: { canonical: "/info" },
};

/** Zochil's FAQ answers point at chandmani.mn/posts/<id>; those posts live under /journal now. */
const postLink = (text: string) => text.replace(/https?:\/\/(?:www\.)?chandmani\.mn\/posts\/(\d+)/g, (m, id) => posts.find((p) => p.id === Number(id))?.slug ?? m);
/** The FAQ «Захиалга, худалдан авалт» says cash and card work on the site too: online it is QPay only, so it is left out
 * (see docs/erxes/MANUAL-STEPS.md, open questions). */
const shownFaq = faq.filter((f) => !/Бэлэн мөнгө/.test(f.a));

function H2({ id, n, children }: { id: string; n: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="flex scroll-mt-44 items-baseline gap-4 border-b border-line pb-4">
      <span className="display text-[16px] text-gold italic">{n}</span>
      <span className="display text-[32px] md:text-[42px]">{children}</span>
    </h2>
  );
}

export default function InfoPage() {
  return (
    <div className="wrap pt-12 md:pt-16">
      <div className="flex flex-col items-center text-center">
        <p className="caps text-gold">Chandmani</p>
        <h1 className="display mt-4 text-[46px] md:text-[72px]">Мэдээлэл</h1>
        <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Хэсгүүд">
          {[
            ["#about", "Бидний тухай"],
            ["#delivery", "Хүргэлт"],
            ["#payment", "Төлбөр"],
            ["#exchange", "Солилт"],
            ["#faq", "Асуулт"],
            ["#contact", "Холбоо барих"],
          ].map(([h, t]) => (
            <a key={h} href={h} className="chip">
              {t}
            </a>
          ))}
        </nav>
      </div>

      <section className="mt-16 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[16/10] overflow-hidden bg-night">
          <Image src="/brand/atelier.webp" alt="Chandmani зангианы шүүгээ" width={1916} height={730} priority sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div>
          <H2 id="about" n="I">
            Бидний тухай
          </H2>
          <div className="prose-silk mt-4 text-[16.5px]">
            <p>Chandmani нь {business.founded} онд үүсгэн байгуулагдсан, зангиа, алчуур, аксессуар үйлдвэрлэн худалдаалдаг Монгол брэнд.</p>
            {about.map((b, i) => (
              <p key={i}>{b.x}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto mt-20 max-w-3xl space-y-20">
        <section>
          <H2 id="delivery" n="II">
            Хүргэлт
          </H2>
          <table className="mt-6 w-full text-left text-[15.5px]">
            <tbody className="divide-y divide-line">
              {business.delivery.map((d) => (
                <tr key={d.id}>
                  <th scope="row" className="py-4 pr-4 align-top font-semibold">
                    {d.name}
                    <span className="block text-[14px] font-normal text-ink-2">{d.note}</span>
                  </th>
                  <td className="display py-4 text-right align-top text-[18px] whitespace-nowrap text-gold">{d.id === "city" ? formatPrice(business.cityFee) : "Утсаар"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="prose-silk">
            <ul>
              <li>Улаанбаатарт {formatPrice(business.freeFrom)}-өөс дээш захиалгад хүргэлт үнэгүй.</li>
              <li>{business.rules.delivery}</li>
              <li>{business.rules.international}</li>
            </ul>
          </div>
        </section>

        <section>
          <H2 id="payment" n="III">
            Төлбөр, и-баримт
          </H2>
          <div className="prose-silk mt-2">
            <p>
              <b className="font-semibold text-ink">QPay</b>: аль ч банкны аппаар QR уншуулж төлнө. {business.rules.payment}
            </p>
            <p>{business.rules.ebarimt}</p>
          </div>
        </section>

        <section>
          <H2 id="exchange" n="IV">
            Солилт, засвар
          </H2>
          <div className="prose-silk mt-2">
            <ul>
              <li>{business.rules.exchange}</li>
              <li>{business.rules.custom}</li>
            </ul>
          </div>
        </section>

        <section>
          <H2 id="faq" n="V">
            Түгээмэл асуулт
          </H2>
          <div className="mt-4 divide-y divide-line border-b border-line">
            {shownFaq.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="display flex cursor-pointer list-none items-center justify-between gap-4 text-[20px] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="diamond text-gold transition-transform duration-300 group-open:rotate-[225deg]" aria-hidden />
                </summary>
                <div className="prose-silk">
                  {postLink(f.a)
                    .split(/\n+/)
                    .map((line, i) => {
                      const slug = posts.find((p) => p.slug === line.trim())?.slug;
                      return slug ? (
                        <p key={i}>
                          <Link href={`/journal/${slug}`} className="text-gold underline underline-offset-4">
                            Зангиа арчлах заавар
                          </Link>
                        </p>
                      ) : (
                        <p key={i}>{line.replace(/^\s*•\s*/, "· ")}</p>
                      );
                    })}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section>
          <H2 id="contact" n="VI">
            Холбоо барих
          </H2>
          <ul className="mt-6 grid gap-4 text-[16px] sm:grid-cols-2">
            {(
              [
                [PhoneIcon, business.phone.display, `tel:${business.phone.tel}`],
                [MailIcon, business.email, `mailto:${business.email}`],
                [FacebookIcon, "facebook.com/chandmanibrand", business.facebook],
                [InstagramIcon, "@chandmani.mongolia", business.instagram],
                [PinIcon, business.address, null],
              ] as const
            ).map(([Icon, t, href]) => (
              <li key={t} className="flex items-center gap-3 border border-line bg-white px-5 py-4">
                <Icon size={20} className="shrink-0 text-gold" />
                {href ? (
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="link-gold break-all">
                    {t}
                  </a>
                ) : (
                  <span>{t}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
